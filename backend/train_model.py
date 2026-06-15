from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "ai_student_impact_dataset.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "random_forest_model.joblib"
COLUMNS_PATH = MODEL_DIR / "model_columns.joblib"
TARGET_COLUMN = "Post_Semester_GPA"


def load_dataset() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Arquivo CSV não encontrado em {DATA_PATH}. "
            "Coloque a base em backend/data/ai_student_impact_dataset.csv."
        )

    df = pd.read_csv(DATA_PATH)

    if "Student_ID" in df.columns:
        df = df.drop(columns=["Student_ID"])

    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"A coluna alvo {TARGET_COLUMN} não existe no CSV.")

    return df


def train() -> None:
    df = load_dataset()

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
        n_estimators=100,
        random_state=42,
    )
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(list(X_encoded.columns), COLUMNS_PATH)

    print("Modelo RandomForestRegressor treinado e salvo com sucesso.")
    print(f"Registros usados: {len(df)}")
    print(f"Variáveis explicativas após encoding: {X_encoded.shape[1]}")
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2: {r2:.4f}")
    print(f"Modelo: {MODEL_PATH}")
    print(f"Colunas: {COLUMNS_PATH}")


if __name__ == "__main__":
    train()
