from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
MODEL_PATH = BASE_DIR / "models" / "random_forest_model.joblib"
COLUMNS_PATH = BASE_DIR / "models" / "model_columns.joblib"

app = FastAPI(
    title="EduPredict AI API",
    description="API de predição de GPA final usando RandomForestRegressor.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
model_columns = []


class StudentData(BaseModel):
    Major_Category: Literal["Arts", "Business", "Humanities", "Medical", "STEM"]
    Year_of_Study: Literal["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]
    Pre_Semester_GPA: float = Field(ge=0, le=4)
    Weekly_GenAI_Hours: float = Field(ge=0, le=40)
    Primary_Use_Case: Literal[
        "Copywriting/Drafting",
        "Debugging/Troubleshooting",
        "Direct_Answer_Generation",
        "Ideation",
        "Summarizing_Reading",
    ]
    Prompt_Engineering_Skill: Literal["Beginner", "Intermediate", "Advanced"]
    Tool_Diversity: int = Field(ge=0, le=10)
    Paid_Subscription: bool
    Traditional_Study_Hours: float = Field(ge=0, le=40)
    Perceived_AI_Dependency: int = Field(ge=1, le=10)
    Institutional_Policy: Literal[
        "Actively_Encouraged",
        "Allowed_With_Citation",
        "Strict_Ban",
    ]
    Anxiety_Level_During_Exams: int = Field(ge=1, le=10)
    Skill_Retention_Score: float = Field(ge=0, le=100)
    Burnout_Risk_Level: Literal["Low", "Medium", "High"]


@app.on_event("startup")
def load_model() -> None:
    global model, model_columns

    if MODEL_PATH.exists() and COLUMNS_PATH.exists():
        model = joblib.load(MODEL_PATH)
        model_columns = joblib.load(COLUMNS_PATH)


@app.get("/api")
def api_info() -> dict:
    return {"message": "API de Predição de GPA em funcionamento"}


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH),
        "columns_path": str(COLUMNS_PATH),
    }


@app.post("/predict")
def predict(data: StudentData) -> dict:
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Modelo não carregado. Execute python train_model.py antes de iniciar a API.",
        )

    input_df = pd.DataFrame([data.model_dump()])
    input_encoded = pd.get_dummies(input_df)
    input_encoded = input_encoded.reindex(columns=model_columns, fill_value=0)

    prediction = float(model.predict(input_encoded)[0])
    prediction = max(0.0, min(4.0, prediction))

    return {"predicted_gpa": round(prediction, 2)}


app.mount("/", StaticFiles(directory=PROJECT_DIR, html=True), name="frontend")
