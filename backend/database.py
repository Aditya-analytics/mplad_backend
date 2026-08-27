import pandas as pd
import numpy as np
import os
import math

class Database:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        self.master_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'notebooks', 'master_mplads_data.csv')
        
        print("Loading in-memory databases...")
        
        # Load datasets (replacing NaN with None for JSON serialization)
        self.df_master = self._load_csv(self.master_path)
        self.df_duplicates = self._load_csv(os.path.join(self.data_dir, 'flagged_duplicates.csv'))
        self.df_anomalies = self._load_csv(os.path.join(self.data_dir, 'cost_anomalies.csv'))
        self.df_delays = self._load_csv(os.path.join(self.data_dir, 'delayed_projects.csv'))
        self.df_compliance = self._load_csv(os.path.join(self.data_dir, 'compliance_violations.csv'))
        
        print("Databases loaded successfully!")

    def _load_csv(self, path):
        if not os.path.exists(path):
            print(f"Warning: {path} not found.")
            return pd.DataFrame()
        df = pd.read_csv(path, low_memory=False)
        df = df.replace({np.nan: None})
        return df

    def get_paginated(self, df: pd.DataFrame, page: int = 1, limit: int = 50, filters: dict = None):
        """
        Helper function to filter and paginate a pandas DataFrame.
        """
        if df.empty:
            return {"data": [], "total": 0, "page": page, "limit": limit, "total_pages": 0}
            
        filtered_df = df.copy()
        
        # Apply strict equality filters if provided
        if filters:
            for key, value in filters.items():
                if key in filtered_df.columns and value is not None:
                    # Case insensitive string match or exact numeric match
                    if isinstance(value, str):
                        filtered_df = filtered_df[filtered_df[key].astype(str).str.contains(value, case=False, na=False)]
                    else:
                        filtered_df = filtered_df[filtered_df[key] == value]
                        
        total = len(filtered_df)
        total_pages = math.ceil(total / limit)
        
        # Paginate
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_df = filtered_df.iloc[start_idx:end_idx]
        
        # Convert to list of dicts
        data = paginated_df.to_dict(orient='records')
        
        return {
            "data": data,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }

# Singleton instance
db = Database()
