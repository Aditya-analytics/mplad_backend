import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import os

def predict_delays(master_csv_path, output_csv_path):
    print(f"Loading data from {master_csv_path}...")
    df = pd.read_csv(master_csv_path, low_memory=False)
    
    # Parse dates
    df['Sanction Date'] = pd.to_datetime(df['Sanction Date'], errors='coerce')
    df['Completion Date'] = pd.to_datetime(df['Completion Date'], errors='coerce')
    
    # Clean money and categorical columns
    amount_col = 'RECOMMENDED AMOUNT   ( ₹ )'
    df[amount_col] = pd.to_numeric(df[amount_col], errors='coerce')
    
    df['Work category'] = df['Work category'].fillna('Unknown')
    df['State'] = df['State'].fillna('Unknown')
    
    # Find the "Current Date" mathematically to calculate elapsed time for ongoing projects
    # We use the absolute maximum date found anywhere in the date columns to represent "Today"
    all_dates = pd.concat([df['Sanction Date'], df['Completion Date']]).dropna()
    current_date = all_dates.max()
    print(f"Simulated 'Current Date' for execution logic: {current_date.date()}")
    
    # Filter dataset for valid entries
    valid_df = df.dropna(subset=['Sanction Date', amount_col]).copy()
    
    # Phase 1: Training Data (Completed Projects)
    completed = valid_df.dropna(subset=['Completion Date']).copy()
    
    # Calculate actual time taken in days
    completed['Actual_Days'] = (completed['Completion Date'] - completed['Sanction Date']).dt.days
    
    # Remove negative days (data entry errors) and extreme outliers for clean training
    completed = completed[(completed['Actual_Days'] > 0) & (completed['Actual_Days'] < 3650)]
    
    print(f"Training ML Model on {len(completed)} historically completed projects...")
    
    # Features (X) and Target (y)
    features = ['Work category', 'State', amount_col]
    X_train = completed[features]
    y_train = completed['Actual_Days']
    
    # Build Pipeline: One-hot encode categories, then Random Forest
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['Work category', 'State'])
        ], remainder='passthrough'
    )
    
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
    ])
    
    # Train
    model.fit(X_train, y_train)
    print("Training complete.")
    
    # Phase 2: Prediction on Ongoing Projects
    # Ongoing projects lack a completion date
    ongoing = valid_df[valid_df['Completion Date'].isna()].copy()
    print(f"Auditing {len(ongoing)} ongoing projects...")
    
    X_ongoing = ongoing[features]
    ongoing['Predicted_Days'] = model.predict(X_ongoing)
    
    # Calculate how many days have passed since sanction
    ongoing['Elapsed_Days'] = (current_date - ongoing['Sanction Date']).dt.days
    
    # Logic Engine: Flag if Elapsed > Predicted + 20%
    # And ensure they aren't marked as 'Sanction' (meaning work hasn't started) if we only want active ones
    # But for broad inefficiency tracking, we will flag all severely delayed sanctioned works
    delayed_projects = ongoing[ongoing['Elapsed_Days'] > (ongoing['Predicted_Days'] * 1.20)].copy()
    
    delayed_projects['Days_Overdue'] = delayed_projects['Elapsed_Days'] - delayed_projects['Predicted_Days']
    delayed_projects['Delay_Severity_%'] = (delayed_projects['Elapsed_Days'] / delayed_projects['Predicted_Days']) * 100
    
    # Select important columns to output
    out_cols = [
        'Project_ID', 'State', 'Constituency', 'Work category', amount_col, 
        'Sanction Date', 'Elapsed_Days', 'Predicted_Days', 'Days_Overdue', 'Delay_Severity_%'
    ]
    
    out_df = delayed_projects[out_cols].sort_values('Days_Overdue', ascending=False)
    
    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    out_df.to_csv(output_csv_path, index=False)
    
    print(f"Delay audit complete! Found {len(out_df)} projects heavily delayed beyond AI expectations.")
    print(f"Saved results to {output_csv_path}")

if __name__ == "__main__":
    master_path = '../notebooks/master_mplads_data.csv'
    output_path = '../data/delayed_projects.csv'
    
    if os.path.exists(master_path):
        predict_delays(master_path, output_path)
    else:
        print("Data not found. Please run Module 1 first.")
