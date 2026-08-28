import pandas as pd
import numpy as np
import os

master_path = 'notebooks/master_mplads_data.csv'
print("Reading CSVs...")
df_master = pd.read_csv(master_path, low_memory=False)

# Load the anomaly sets
df_cost = pd.read_csv('data/cost_anomalies.csv', low_memory=False)
df_dup = pd.read_csv('data/flagged_duplicates.csv', low_memory=False)
df_delay = pd.read_csv('data/delayed_projects.csv', low_memory=False)
df_comp = pd.read_csv('data/compliance_violations.csv', low_memory=False)

# Create O(1) lookup sets for Project IDs
cost_ids = set(df_cost['Project_ID'].dropna())
dup_ids = set(df_dup['Project_1_ID'].dropna()).union(set(df_dup['Project_2_ID'].dropna()))
delay_ids = set(df_delay['Project_ID'].dropna())
comp_ids = set(df_comp['Project_ID'].dropna())

def calc_score(pid):
    score = 5 # Base risk score for all projects
    if pid in dup_ids:
        score += 40
    if pid in cost_ids:
        score += 30
    if pid in delay_ids:
        score += 20
    if pid in comp_ids:
        score += 10
    return min(score, 100)

print("Calculating real ensemble risk scores...")
df_master['riskScore'] = df_master['Project_ID'].apply(calc_score)

def get_risk_level(score):
    if score >= 85: return 'CRITICAL'
    elif score >= 70: return 'HIGH'
    elif score >= 40: return 'MODERATE'
    else: return 'LOW'

df_master['riskLevel'] = df_master['riskScore'].apply(get_risk_level)

print(f"Stats:\nCRITICAL: {len(df_master[df_master['riskLevel']=='CRITICAL'])}\nHIGH: {len(df_master[df_master['riskLevel']=='HIGH'])}\nMODERATE: {len(df_master[df_master['riskLevel']=='MODERATE'])}\nLOW: {len(df_master[df_master['riskLevel']=='LOW'])}")

print("Saving updated CSV...")
df_master.to_csv(master_path, index=False)
print("Done! Real risk scores injected into backend dataset.")
