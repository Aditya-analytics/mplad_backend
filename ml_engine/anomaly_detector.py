import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import os

def detect_cost_anomalies(master_csv_path, output_csv_path, contamination=0.01):
    """
    Detects cost anomalies using Isolation Forest on RECOMMENDED AMOUNT, grouped by Work category.
    """
    print(f"Loading data from {master_csv_path}...")
    df = pd.read_csv(master_csv_path, low_memory=False)
    
    amount_col = 'RECOMMENDED AMOUNT   ( ₹ )'
    cat_col = 'Work category'
    
    if amount_col not in df.columns or cat_col not in df.columns:
        raise ValueError(f"Missing required columns: '{amount_col}' or '{cat_col}'")
        
    # Drop rows without amounts or categories
    valid_df = df.dropna(subset=[amount_col, cat_col]).copy()
    
    # Ensure amount is numeric
    valid_df[amount_col] = pd.to_numeric(valid_df[amount_col], errors='coerce')
    valid_df = valid_df.dropna(subset=[amount_col])
    
    print(f"Found {len(valid_df)} valid projects with cost data.")
    
    anomalies = []
    
    # Group by Work Category to find anomalies within the same type of work
    grouped = valid_df.groupby(cat_col)
    print(f"Analyzing {len(grouped)} work categories...")
    
    for category, group in grouped:
        # We need a minimum number of samples to train the Isolation Forest reasonably
        if len(group) < 10:
            continue
            
        group = group.reset_index(drop=True)
        amounts = group[[amount_col]].values
        
        try:
            # Train Isolation Forest
            # contamination is the expected proportion of outliers (e.g. 1%)
            model = IsolationForest(contamination=contamination, random_state=42)
            preds = model.fit_predict(amounts)
            scores = model.decision_function(amounts)
            
            # Calculate category statistics to provide context
            cat_mean = amounts.mean()
            cat_median = np.median(amounts)
            cat_std = amounts.std()
            
            # Identify outliers (-1 means outlier)
            outlier_indices = np.where(preds == -1)[0]
            
            for idx in outlier_indices:
                project = group.iloc[idx]
                anomalies.append({
                    'Project_ID': project['Project_ID'],
                    'Constituency': project.get('Constituency', 'Unknown'),
                    'State': project.get('State', 'Unknown'),
                    'Work category': category,
                    'Work description': project.get('Work description', 'Unknown'),
                    'RECOMMENDED AMOUNT   ( ₹ )': project[amount_col],
                    'Category_Mean_Cost': round(cat_mean, 2),
                    'Category_Median_Cost': round(cat_median, 2),
                    'Anomaly_Score': round(scores[idx], 4)
                })
                
        except Exception as e:
            print(f"Error processing category '{category}': {e}")
            
    anomaly_df = pd.DataFrame(anomalies)
    
    if not anomaly_df.empty:
        # Sort by most severe anomalies first (lower score = more anomalous)
        anomaly_df = anomaly_df.sort_values('Anomaly_Score', ascending=True)
        
    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    anomaly_df.to_csv(output_csv_path, index=False)
    
    print(f"Anomaly detection complete! Found {len(anomaly_df)} highly suspicious cost outliers.")
    print(f"Saved results to {output_csv_path}")
    
    return anomaly_df

if __name__ == "__main__":
    master_path = '../notebooks/master_mplads_data.csv'
    output_path = '../data/cost_anomalies.csv'
    
    if os.path.exists(master_path):
        detect_cost_anomalies(master_path, output_path, contamination=0.01)
    else:
        print(f"File not found: {master_path}. Please run preprocessing first.")
