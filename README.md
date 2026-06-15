# EduPredict AI

Aplicação web para demonstração de um projeto de Data Science voltado à predição de desempenho acadêmico de estudantes.

O projeto contém frontend, backend, dados utilizados, scripts de treinamento e arquivos de configuração necessários para execução local.

## Visão geral

O sistema estima o GPA final do semestre a partir de variáveis acadêmicas, comportamentais e relacionadas ao uso de IA generativa.

Nesta versão, o frontend envia os dados do formulário para o backend FastAPI. O backend carrega o modelo Random Forest treinado e retorna o GPA previsto.

## Estrutura do repositório

```txt
.
|-- assets/
|   `-- hero-academic-ai.png
|-- backend/
|   |-- data/
|   |   `-- ai_student_impact_dataset.csv
|   |-- models/
|   |   `-- .gitkeep
|   |-- main.py
|   |-- train_model.py
|   |-- export_static_model.py
|   |-- requirements.txt
|   |-- runtime.txt
|   `-- README.md
|-- index.html
|-- style.css
|-- script.js
|-- model.js
|-- model-metrics.json
|-- .gitignore
`-- README.md
```

## O que cada parte faz

* Frontend: `index.html`, `style.css`, `script.js` e `assets/`.
* Backend: API FastAPI em `backend/main.py`.
* Treinamento do modelo completo: `backend/train_model.py`.
* Dados utilizados: `backend/data/ai_student_impact_dataset.csv`.
* Modelos treinados locais: `backend/models/random_forest_model.joblib` e `backend/models/model_columns.joblib`.

Os arquivos `.joblib` não são enviados ao GitHub porque são grandes, mas podem ser gerados localmente com o script de treinamento.

## Como rodar para demonstração

Entre na pasta do projeto:

```bash
cd "C:\Users\Lenovo\Downloads\Gerenciador de Tarefas\projeto-predicao-gpa"
```

Instale as dependências:

```bash
cd backend
pip install -r requirements.txt
```

Se os arquivos `.joblib` ainda não existirem em `backend/models/`, treine o modelo:

```bash
python train_model.py
```

Volte para a raiz do projeto e inicie o backend:

```bash
cd ..
uvicorn backend.main:app --reload
```

Abra no navegador:

```txt
http://127.0.0.1:8000/
```

A documentação interativa da API fica em:

```txt
http://127.0.0.1:8000/docs
```

## Fluxo da aplicação

```txt
Usuário preenche o formulário no frontend
        |
        v
script.js envia os dados para POST /predict
        |
        v
backend/main.py recebe os dados
        |
        v
FastAPI aplica o mesmo pré-processamento do treinamento
        |
        v
RandomForestRegressor gera a previsão
        |
        v
Frontend mostra GPA previsto e explicações
```

## Endpoints principais

* `GET /`: abre o frontend.
* `GET /api`: mensagem de status da API.
* `GET /health`: mostra se o modelo foi carregado.
* `POST /predict`: recebe os dados do estudante e retorna o GPA previsto.

## Modelo treinado

O modelo usado no backend é um Random Forest Regressor treinado com a base `ai_student_impact_dataset.csv`.

A variável-alvo do treinamento é:

```txt
Post_Semester_GPA
```

As demais variáveis da base são usadas como entradas do modelo.

## Observação

O arquivo `model.js` permanece no repositório como versão exportada do modelo para execução estática, mas a demonstração principal com backend usa o endpoint `POST /predict` do FastAPI.
