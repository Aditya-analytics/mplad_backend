import os
import sys
from pathlib import Path

# Make sure the project root is importable when this script is run directly.
# Without this, Python only sees the ml_engine folder and cannot import the package.
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import pandas as pd

# ------------------------------------------------------------
# ML model verification script
# ------------------------------------------------------------
# This script checks whether the ML logic is working correctly or if
# something is broken in the data flow, model execution, or output generation.
# It performs a lightweight smoke test on each model module.
# ------------------------------------------------------------

DATA_FILE = ROOT_DIR / 'notebooks' / 'master_mplads_data.csv'
OUTPUT_DIR = ROOT_DIR / 'checking_outputs'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def print_header(title):
    """Display a header before each ML test block."""
    # This helps separate different model checks in the terminal output.
    print('\n' + '=' * 80)
    print(title)
    print('=' * 80)


def check_file_exists(file_path, label):
    """Ensure the dataset exists before trying to run an ML model."""
    # The whole pipeline depends on the input file, so fail early if it is missing.
    if file_path.exists():
        print(f"[PASS] {label} found: {file_path}")
        return True
    print(f"[FAIL] {label} missing: {file_path}")
    return False


def validate_output_csv(output_path, expected_columns=None, min_rows=0):
    """Check that the generated CSV exists and has the expected structure."""
    # The model may run without crashing but still produce an invalid output file.
    # This validation ensures the final CSV is readable and usable.
    if not output_path.exists():
        print(f"[FAIL] Output file was not created: {output_path}")
        return False

    try:
        df = pd.read_csv(output_path)
    except Exception as exc:
        print(f"[FAIL] Could not read generated CSV: {output_path} -> {exc}")
        return False

    if expected_columns:
        missing = [col for col in expected_columns if col not in df.columns]
        if missing:
            print(f"[FAIL] Missing columns in output: {missing}")
            return False

    if len(df) < min_rows:
        print(f"[FAIL] Output has too few rows: expected at least {min_rows}, got {len(df)}")
        return False

    print(f"[PASS] Output validated: {output_path} | rows={len(df)}")
    return True


def smoke_test_anomaly_detector():
    """Run a quick anomaly-detection check and validate the CSV output."""
    # This test confirms that the cost anomaly model can load, process data,
    # and save results without raising runtime errors.
    print_header('Checking Cost Anomaly Model')

    try:
        import ml_engine.anomaly_detector as anomaly_detector
    except Exception as exc:
        print(f"[FAIL] Could not import anomaly detector: {exc}")
        return False

    input_file = DATA_FILE
    output_file = OUTPUT_DIR / 'cost_anomaly_check.csv'

    if not check_file_exists(input_file, 'Dataset'):
        return False

    try:
        result = anomaly_detector.detect_cost_anomalies(str(input_file), str(output_file), contamination=0.01)
        print(f"[PASS] Model executed without crashing. Returned rows: {len(result)}")
    except Exception as exc:
        print(f"[FAIL] Model execution failed: {exc}")
        return False

    expected_cols = ['Project_ID', 'Constituency', 'State', 'Work category', 'RECOMMENDED AMOUNT   ( ₹ )']
    return validate_output_csv(output_file, expected_columns=expected_cols, min_rows=0)


def smoke_test_compliance_engine():
    """Run the rule-based compliance validation and verify output generation."""
    # This module does not use a trained model, but it still needs to run correctly
    # because it flags policy violations and creates the compliance dataset.
    print_header('Checking Compliance Logic')

    try:
        import ml_engine.compliance_engine as compliance_engine
    except Exception as exc:
        print(f"[FAIL] Could not import compliance engine: {exc}")
        return False

    input_file = DATA_FILE
    output_file = OUTPUT_DIR / 'compliance_check.csv'

    if not check_file_exists(input_file, 'Dataset'):
        return False

    try:
        compliance_engine.run_compliance_checks(str(input_file), str(output_file))
        print('[PASS] Compliance checks executed without crash.')
    except Exception as exc:
        print(f"[FAIL] Compliance logic error: {exc}")
        return False

    expected_cols = ['Project_ID', 'Violation_Type', 'Amount_In_Question']
    return validate_output_csv(output_file, expected_columns=expected_cols, min_rows=0)


def smoke_test_delay_predictor():
    """Run a quick health check on the delay-prediction model."""
    # The delay predictor trains a RandomForest model, so this test confirms the
    # training pipeline, prediction step, and output export all work together.
    print_header('Checking Delay Prediction Model')

    try:
        import ml_engine.delay_predictor as delay_predictor
    except Exception as exc:
        print(f"[FAIL] Could not import delay predictor: {exc}")
        return False

    input_file = DATA_FILE
    output_file = OUTPUT_DIR / 'delay_check.csv'

    if not check_file_exists(input_file, 'Dataset'):
        return False

    try:
        delay_predictor.predict_delays(str(input_file), str(output_file))
        print('[PASS] Delay prediction model executed without crash.')
    except Exception as exc:
        print(f"[FAIL] Delay model failed: {exc}")
        return False

    expected_cols = ['Project_ID', 'State', 'Constituency', 'Work category', 'Sanction Date']
    return validate_output_csv(output_file, expected_columns=expected_cols, min_rows=0)


def smoke_test_duplicate_detector():
    """Verify that the duplicate-detection pipeline executes and writes results."""
    # This check validates text similarity logic and confirms that the function can
    # compare project descriptions across datasets without failing.
    print_header('Checking Duplicate Detection Model')

    try:
        import ml_engine.duplicate_detector as duplicate_detector
    except Exception as exc:
        print(f"[FAIL] Could not import duplicate detector: {exc}")
        return False

    input_file = DATA_FILE
    output_file = OUTPUT_DIR / 'duplicate_check.csv'

    if not check_file_exists(input_file, 'Dataset'):
        return False

    try:
        result = duplicate_detector.detect_duplicates(str(input_file), str(output_file), similarity_threshold=0.85)
        print(f"[PASS] Duplicate detector executed without crash. Returned pairs: {len(result)}")
    except Exception as exc:
        print(f"[FAIL] Duplicate detector failed: {exc}")
        return False

    expected_cols = ['State', 'Project_1_ID', 'Project_2_ID', 'Similarity_Score']
    return validate_output_csv(output_file, expected_columns=expected_cols, min_rows=0)


def main():
    """Run all smoke tests and print a final status summary."""
    # This is the main entry point for the ML verification script.
    # It runs each model check one by one and reports the final health result.
    print_header('ML MODEL HEALTH CHECK')
    print('Starting ML verification for all project modules...')

    # Store the pass/fail status of each module for the final summary.
    results = []
    results.append(smoke_test_anomaly_detector())
    results.append(smoke_test_compliance_engine())
    results.append(smoke_test_delay_predictor())
    results.append(smoke_test_duplicate_detector())

    passed = sum(1 for item in results if item)
    total = len(results)

    print('\n' + '=' * 80)
    print(f'ML CHECK SUMMARY: {passed}/{total} checks passed')
    print('=' * 80)

    if passed == total:
        print('[SUCCESS] All ML model checks passed. The pipeline appears to be working correctly.')
        return 0

    print('[WARNING] One or more ML checks failed. Review the error messages above and fix the issue.')
    return 1


if __name__ == '__main__':
    # Run the verification script directly
    sys.exit(main())
