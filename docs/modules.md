# MPLADS AI-Monitoring Platform: Module-by-Module Implementation

This document breaks down the SIH26102 solution into feasible, step-by-step modules with exact, practical approaches tailored to the actual datasets available.

---

## Module 1: Data Ingestion & Preprocessing
**Objective:** Standardize and link the fragmented data across different stages of a project's lifecycle.
**Data Sources:** `Works Recommended.csv`, `Works Sanctioned.csv`, `Expenditure...csv`, `Works Completed.csv`.

**Exact Approach:**
1. **Data Loading:** Use Python (`pandas`) to ingest the CSV files.
2. **Text Normalization:** Lowercase, strip whitespace, and remove stop words from `Work description` and `Work category` to prepare for NLP.
3. **Temporal Parsing:** Convert `Recommended date`, `Sanction Date`, and `Completion Date` into standardized datetime objects.
4. **Relational Mapping:** Create a unified schema. Since there isn't a strict primary key across all files, use deterministic fuzzy matching on `Constituency` + `Work description` + `Sanction Amount` to track a single project from Recommendation → Sanction → Expenditure → Completion.

---

## Module 2: NLP-Based Duplicate Work Detection (Fraud Prevention)
**Objective:** Automatically flag if an MP or implementing agency requests funds for a project that has already been sanctioned or completed.

**Exact Approach:**
1. **Grouping:** Partition the dataset by `State` and `Constituency` (duplicates are highly unlikely across different states).
2. **Vectorization:** Convert the `Work description` column into numerical vectors using **TF-IDF (Term Frequency-Inverse Document Frequency)** or **Sentence-BERT** embeddings.
3. **Similarity Scoring:** Calculate the **Cosine Similarity** between all new proposals and historical projects in the same geographic partition.
4. **Alerting:** If the similarity score exceeds a threshold (e.g., > `0.85`), the system flags the project as a "Potential Duplicate" and halts the sanction process pending manual review.

---

## Module 3: Anomaly Detection in Cost Estimates (Fund Leakage)
**Objective:** Identify inflated cost estimates where the requested/sanctioned amount is statistically unjustified compared to historical norms.

**Exact Approach:**
1. **Feature Engineering:** Extract the `Sanction Amount` and group by `Work category` (e.g., "Construction of buildings") and `State` to account for regional price variations.
2. **ML Model:** Train an **Isolation Forest** or use statistical **Z-Score** outlier detection on the cost distributions.
3. **Execution:** When a new project is recommended (e.g., a bus shelter for ₹15 Lakhs), the model compares it to the median historical cost for bus shelters in that state (e.g., ₹3 Lakhs).
4. **Alerting:** If the data point falls outside the 95th percentile of the distribution (an anomaly), it is flagged for "Cost Overrun Risk" requiring justification from the District Authority.

---

## Module 4: Delay Prediction & Execution Inefficiencies
**Objective:** Predict which projects are likely to stall and highlight chronic inefficiencies in fund utilization.

**Exact Approach:**
1. **Target Variable:** Calculate the historical `Time_to_Complete` = (`Completion Date` - `Sanction Date`).
2. **Features:** `Work category`, `State`, `Sanction Amount`, and seasonal data (e.g., projects started during monsoons face delays).
3. **ML Model:** Train a **Random Forest Regressor** or **XGBoost** model on completed projects to predict expected completion times.
4. **Real-time Monitoring:** For ongoing projects in `Works Sanctioned.csv`, continuously compare the *Time Elapsed* against the *Predicted Time*.
5. **Alerting:** If a project in "Physical Inspection" or "Work partially Completed" status exceeds the predicted completion time by >20%, it is flagged as a "High-Risk Delayed Project."

---

## Module 5: Rules-Based Financial Compliance Engine
**Objective:** Ensure strict adherence to MPLADS financial guidelines without requiring complex AI.

**Exact Approach:**
1. **Logic Gate 1:** `Expenditure` > `Sanction Amount` = Flag (Fund leakage/Overspending).
2. **Logic Gate 2:** `Sanction Amount` > `Recommended Amount` = Flag (Unauthorized cost escalation).
3. **Logic Gate 3:** Projects marked as "Completed" but with 0 `Fund Disbursed Amount` = Flag (Data discrepancy or ghost project).
4. **Execution:** Run these checks daily via a simple Python rules engine (e.g., using `pydantic` validators or SQL constraints).

---

## Module 6: Backend API & Interactive Dashboard (The Output)
**Objective:** Serve the insights securely to MPs, District Collectors, and MoSPI officials.

**Exact Approach:**
1. **Backend:** Build a **FastAPI** (Python) server. It exposes endpoints like `GET /api/v1/anomalies/cost` and `GET /api/v1/projects/duplicates`.
2. **Database:** Store the cleaned data and ML results in **PostgreSQL** (relational data) or **MongoDB** (JSON documents).
3. **Frontend:** Develop a **React.js** dashboard using **TailwindCSS** for styling.
4. **Visualizations:** Integrate **Chart.js** or **Recharts** to display:
   - A heatmap of delayed projects across India.
   - A list view of "High Priority Alerts" for the logged-in District Collector to manually audit flagged duplicates or cost anomalies.
