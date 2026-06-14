# Backend - EduPredict AI

Este diretório contém a API, a base de dados e os scripts de treinamento do modelo de predição de GPA.

## Conteúdo

```txt
backend/
|-- data/
|   `-- ai_student_impact_dataset.csv
|-- models/
|   `-- .gitkeep
|-- main.py
|-- train_model.py
|-- export_static_model.py
|-- requirements.txt
|-- runtime.txt
`-- README.md
```

## Treinar o modelo completo

```bash
pip install -r requirements.txt
python train_model.py
```

Esse comando gera os arquivos em `backend/models/`:

* `random_forest_model.joblib`
* `model_columns.joblib`

Esses arquivos não são versionados porque o modelo completo é grande demais para o GitHub.

## Executar a API localmente

Depois de treinar o modelo:

```bash
uvicorn main:app --reload
```

Rotas principais:

* `GET /`
* `GET /health`
* `POST /predict`

## Exportar o modelo para o frontend

A versão publicada na Vercel usa o modelo exportado para JavaScript:

```bash
python export_static_model.py
```

Esse script gera/atualiza os arquivos da raiz do projeto:

* `model.js`
* `model-metrics.json`
