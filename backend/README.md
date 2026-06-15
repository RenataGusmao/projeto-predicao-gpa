# Backend - EduPredict AI

Este diretório contém a API, a base de dados e o script de treinamento do modelo de predição de GPA.

## Conteúdo

```txt
backend/
|-- data/
|   `-- ai_student_impact_dataset.csv
|-- models/
|   `-- .gitkeep
|-- main.py
|-- train_model.py
|-- requirements.txt
|-- runtime.txt
`-- README.md
```

## Treinar o modelo

```bash
pip install -r requirements.txt
python train_model.py
```

Esse comando gera os arquivos em `backend/models/`:

* `random_forest_model.joblib`
* `model_columns.joblib`

Esses arquivos não são versionados porque o modelo é grande demais para o GitHub.

## Executar a API localmente

Depois de treinar o modelo:

```bash
cd ..
uvicorn backend.main:app --reload
```

Rotas principais:

* `GET /`
* `GET /api`
* `GET /health`
* `POST /predict`
