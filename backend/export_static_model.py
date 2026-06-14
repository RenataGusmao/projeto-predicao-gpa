import json
from pathlib import Path

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DATA_PATH = BASE_DIR / "data" / "ai_student_impact_dataset.csv"
MODEL_JS_PATH = PROJECT_DIR / "model.js"
METRICS_PATH = PROJECT_DIR / "model-metrics.json"
TARGET_COLUMN = "Post_Semester_GPA"


def round_list(values, precision=6):
    return [round(float(value), precision) for value in values]


def export_tree(estimator):
    tree = estimator.tree_
    return {
        "childrenLeft": tree.children_left.tolist(),
        "childrenRight": tree.children_right.tolist(),
        "feature": tree.feature.tolist(),
        "threshold": round_list(tree.threshold),
        "value": round_list(tree.value.reshape(-1)),
    }


def export_static_model() -> None:
    df = pd.read_csv(DATA_PATH)

    if "Student_ID" in df.columns:
        df = df.drop(columns=["Student_ID"])

    y = df[TARGET_COLUMN]
    X = df.drop(columns=[TARGET_COLUMN])
    X_encoded = pd.get_dummies(X, drop_first=True)

    X_train, X_test, y_train, y_test = train_test_split(
        X_encoded,
        y,
        test_size=0.20,
        random_state=42,
    )

    model = RandomForestRegressor(
        n_estimators=30,
        max_depth=10,
        min_samples_leaf=8,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    metrics = {
        "records": int(len(df)),
        "features": int(X_encoded.shape[1]),
        "estimators": int(len(model.estimators_)),
        "max_depth": 10,
        "min_samples_leaf": 8,
        "mae": round(float(mean_absolute_error(y_test, predictions)), 4),
        "rmse": round(float(mean_squared_error(y_test, predictions) ** 0.5), 4),
        "r2": round(float(r2_score(y_test, predictions)), 4),
    }

    payload = {
        "columns": list(X_encoded.columns),
        "trees": [export_tree(estimator) for estimator in model.estimators_],
        "metrics": metrics,
    }

    MODEL_JS_PATH.write_text(
        "window.EDUPREDICT_MODEL = "
        + json.dumps(payload, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    print(json.dumps(metrics, indent=2))
    print(f"Modelo exportado para: {MODEL_JS_PATH}")
    print(f"Métricas exportadas para: {METRICS_PATH}")


if __name__ == "__main__":
    export_static_model()
