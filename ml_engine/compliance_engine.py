import pandas as pd
import numpy as np
import os

def run_compliance_checks(master_csv_path, output_csv_path):
    print(f"Loading data from {master_csv_path}...")
    df = pd.read_csv(master_csv_path, low_memory=False)
    
    # Ensure money columns are numeric
    rec_col = 'RECOMMENDED AMOUNT   ( ₹ )'
    sanc_col = 'Sanction Amount ( ₹ )'
    exp_col = 'Fund Disbursed Amount ( ₹ )'
    
    for col in [rec_col, sanc_col, exp_col]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Ensure clean status column
    if 'Work Status' in df.columns:
        df['Work Status'] = df['Work Status'].astype(str).str.strip()
        
    violations = []
    
    print(f"Auditing {len(df)} records for financial compliance...")
    
    # Logic Gate 1: Expenditure > Sanction Amount
    mask1 = df[exp_col] > df[sanc_col]
    gate1 = df[mask1].copy()
    for _, row in gate1.iterrows():
        violations.append({
            'Project_ID': row.get('Project_ID', 'N/A'),
            'State': row.get('State', 'N/A'),
            'Constituency': row.get('Constituency', 'N/A'),
            'Violation_Type': 'GATE 1: Overspending / Fund Leakage',
            'Detail': f"Disbursed (₹{row.get(exp_col)}) exceeds Sanctioned (₹{row.get(sanc_col)})",
            'Amount_In_Question': (row.get(exp_col) or 0) - (row.get(sanc_col) or 0)
        })
        
    # Logic Gate 2: Sanction Amount > Recommended Amount
    mask2 = df[sanc_col] > df[rec_col]
    gate2 = df[mask2].copy()
    for _, row in gate2.iterrows():
        violations.append({
            'Project_ID': row.get('Project_ID', 'N/A'),
            'State': row.get('State', 'N/A'),
            'Constituency': row.get('Constituency', 'N/A'),
            'Violation_Type': 'GATE 2: Unauthorized Cost Escalation',
            'Detail': f"Sanctioned (₹{row.get(sanc_col)}) exceeds Recommended (₹{row.get(rec_col)})",
            'Amount_In_Question': (row.get(sanc_col) or 0) - (row.get(rec_col) or 0)
        })
        
    # Logic Gate 3: Completed but 0 Disbursed Amount
    # Using 'Work Completed' string based on our data exploration
    mask3 = (df['Work Status'] == 'Work Completed') & ((df[exp_col].isna()) | (df[exp_col] <= 0))
    gate3 = df[mask3].copy()
    for _, row in gate3.iterrows():
        violations.append({
            'Project_ID': row.get('Project_ID', 'N/A'),
            'State': row.get('State', 'N/A'),
            'Constituency': row.get('Constituency', 'N/A'),
            'Violation_Type': 'GATE 3: Ghost Project (0 Expenditure)',
            'Detail': f"Marked as 'Work Completed' but total disbursed is ₹{row.get(exp_col, 0)}",
            'Amount_In_Question': row.get(sanc_col, 0) # The amount that was sanctioned but magically never spent
        })
        
    violation_df = pd.DataFrame(violations)
    
    if not violation_df.empty:
        # Sort by the sheer magnitude of the shady amounts
        violation_df = violation_df.sort_values('Amount_In_Question', ascending=False)
        
    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    violation_df.to_csv(output_csv_path, index=False)
    
    print(f"Compliance audit complete! Found {len(violation_df)} hard rule violations.")
    print(f"Saved results to {output_csv_path}")
    
if __name__ == "__main__":
    master_path = '../notebooks/master_mplads_data.csv'
    output_path = '../data/compliance_violations.csv'
    
    if os.path.exists(master_path):
        run_compliance_checks(master_path, output_path)
    else:
        print("Data not found. Please run Module 1 first.")
