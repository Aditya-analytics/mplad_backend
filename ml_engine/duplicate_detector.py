import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

def detect_duplicates(master_csv_path, output_csv_path, similarity_threshold=0.85):
    """
    Detects potential duplicate projects using TF-IDF and Cosine Similarity on Work descriptions.
    To avoid memory explosion, it computes pairwise similarity within each Constituency.
    """
    print(f"Loading data from {master_csv_path}...")
    df = pd.read_csv(master_csv_path)
    
    # Ensure columns exist
    if 'Work description' not in df.columns or 'Constituency' not in df.columns:
        raise ValueError("Missing required columns: 'Work description' or 'Constituency'")
        
    # Drop rows without descriptions
    valid_df = df.dropna(subset=['Work description']).copy()
    print(f"Found {len(valid_df)} valid projects with descriptions.")
    
    # Text preprocessing function
    def preprocess_text(text):
        if not isinstance(text, str):
            return ""
        import re
        # Remove numbers and special characters
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        return text.lower().strip()
        
    valid_df['cleaned_desc'] = valid_df['Work description'].apply(preprocess_text)
    # Remove extremely short descriptions
    valid_df = valid_df[valid_df['cleaned_desc'].str.len() > 10]
    
    duplicates = []
    
    # Group by State to compare at the state level (User Rule Engine Request)
    grouped = valid_df.groupby('State')
    print(f"Analyzing {len(grouped)} states...")
    
    vectorizer = TfidfVectorizer(stop_words='english')
    
    for state, group in grouped:
        if len(group) < 2:
            continue
            
        # Reset index to map back easily
        group = group.reset_index(drop=True)
        
        try:
            tfidf_matrix = vectorizer.fit_transform(group['cleaned_desc'])
            # Compute cosine similarity
            sim_matrix = cosine_similarity(tfidf_matrix)
            
            # Find pairs with similarity > threshold
            # Upper triangle only to avoid duplicate pairs and self-matches
            for i in range(len(group)):
                for j in range(i + 1, len(group)):
                    sim_score = sim_matrix[i, j]
                    if sim_score >= similarity_threshold:
                        # Rule Engine: Categorize the duplicate severity and location proximity
                        c1 = group.iloc[i]['Constituency']
                        c2 = group.iloc[j]['Constituency']
                        
                        if sim_score >= 0.99:
                            if c1 == c2:
                                rule_flag = "CRITICAL: Same Constituency Duplicate"
                            else:
                                rule_flag = "HIGH: Cross-Constituency Duplicate"
                        elif sim_score >= 0.90:
                            rule_flag = "High Probability Duplicate"
                        else:
                            rule_flag = "Similar Description"

                        duplicates.append({
                            'State': state,
                            'Constituency_1': group.iloc[i]['Constituency'],
                            'Constituency_2': group.iloc[j]['Constituency'],
                            'Project_1_ID': group.iloc[i]['Project_ID'],
                            'Project_2_ID': group.iloc[j]['Project_ID'],
                            'Similarity_Score': round(sim_score, 4),
                            'Rule_Flag': rule_flag,
                            'Project_1_Desc': group.iloc[i]['Work description'],
                            'Project_2_Desc': group.iloc[j]['Work description'],
                            'Project_1_Amount': group.iloc[i]['RECOMMENDED AMOUNT   ( ₹ )'],
                            'Project_2_Amount': group.iloc[j]['RECOMMENDED AMOUNT   ( ₹ )']
                        })
        except Exception as e:
            print(f"Error processing state {state}: {e}")

            
    dup_df = pd.DataFrame(duplicates)
    
    # Sort by similarity score descending
    if not dup_df.empty:
        dup_df = dup_df.sort_values('Similarity_Score', ascending=False)
    
    dup_df.to_csv(output_csv_path, index=False)
    print(f"Detection complete! Found {len(dup_df)} potential duplicate pairs.")
    print(f"Saved results to {output_csv_path}")
    
    return dup_df

if __name__ == "__main__":
    master_path = '../notebooks/master_mplads_data.csv'
    output_path = '../data/flagged_duplicates.csv'
    
    # Ensure data directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    if os.path.exists(master_path):
        detect_duplicates(master_path, output_path)
    else:
        print(f"File not found: {master_path}. Please run preprocessing first.")
