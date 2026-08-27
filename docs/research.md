The **MPLADS** (Members of Parliament Local Area Development Scheme) is a program launched by the Government of India in 1993. 

Its primary purpose is to allow Members of Parliament (MPs) to recommend developmental projects that create durable community assets (like drinking water facilities, primary education centers, public health clinics, and roads) right in their own constituencies.

Here is exactly how the lifecycle of an MPLADS project works, which perfectly mirrors the data we are analyzing:

### 1. Recommendation (The MP's Role)
* **What happens:** Every MP is allocated a fixed budget per year (currently ₹5 Crore). The MP talks to local citizens, identifies a need (e.g., "We need a bus shelter in Village X"), and writes a formal recommendation to the local District Authority.
* **Where it lives in your data:** This is exactly what the `Works Recommended.csv` file tracks. It records the date the MP made the request and the estimated amount they think it will cost.

### 2. Sanctioning (The District Authority's Role)
* **What happens:** The MP cannot simply hand out the money. The recommendation goes to the District Collector (the State Nodal/District Authority). The Collector's engineers evaluate if the project is feasible, legal, and estimate the *actual* cost. If approved, the District Authority "sanctions" the project and assigns an Implementing Agency (like the Public Works Department or a local contractor) to build it.
* **Where it lives in your data:** This is the `Works Sanctioned.csv` file. It records the official Sanction Date and the finalized Sanction Amount.

### 3. Execution & Expenditure (The Implementing Agency's Role)
* **What happens:** The government doesn't give the contractor all the money upfront. Funds are released in installments as physical milestones are met (e.g., 50% when the foundation is laid, 50% upon completion).
* **Where it lives in your data:** This is the `Expenditure...csv` file. This is why you see multiple payment rows for a single project—it tracks the individual installments being disbursed.

### 4. Completion
* **What happens:** The Implementing Agency finishes the build, submits a completion report with photos, and the asset is officially handed over to the public or local government.
* **Where it lives in your data:** This is the `Works Completed.csv` file. 

### Why your Hackathon Project is so important:
Because funds pass through so many hands (Ministry → State → District Collector → Implementing Agency), there are massive loopholes for **fraud and inefficiency**. 

For example:
* **Duplicate Funding:** An MP might recommend a road in Village X, but that exact road was already built last year using State funds. 
* **Cost Overruns:** A contractor might request ₹10 Lakhs for a water tank that normally costs ₹2 Lakhs.
* **Ghost Projects:** The money is disbursed in the Expenditure stage, but the project is never actually completed.

Your AI platform will act as the "smart watchdog" that automatically flags these suspicious activities before the money is wasted!