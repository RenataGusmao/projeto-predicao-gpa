# EduPredict AI

Aplicação web para demonstração de um projeto de Data Science voltado à predição de desempenho acadêmico de estudantes.

O projeto inclui frontend, backend, scripts de treinamento, dados utilizados e arquivos de configuração necessários para execução e reprodução da solução.

## Visão geral

O sistema estima o GPA final do semestre a partir de variáveis acadêmicas, comportamentais e relacionadas ao uso de IA generativa.

A versão publicada na Vercel executa o modelo diretamente no navegador usando o arquivo `model.js`, que contém uma versão compacta do Random Forest exportada para JavaScript. O backend também está incluído no repositório para documentação, treinamento e execução local da API.

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

## O que o repositório contempla

* Frontend: arquivos `index.html`, `style.css`, `script.js`, `model.js` e pasta `assets/`.
* Backend: API FastAPI em `backend/main.py`.
* Scripts de treinamento: `backend/train_model.py` e `backend/export_static_model.py`.
* Dados utilizados: `backend/data/ai_student_impact_dataset.csv`.
* Configurações: `backend/requirements.txt`, `backend/runtime.txt`, `.gitignore` e `model-metrics.json`.

## Base de dados

O projeto utiliza uma base com 50.000 registros de estudantes. As variáveis usadas no formulário são as mesmas consideradas na modelagem:

* área principal do curso;
* ano de estudo;
* GPA anterior;
* horas semanais de uso de IA generativa;
* principal forma de uso da IA;
* habilidade em engenharia de prompts;
* diversidade de ferramentas utilizadas;
* assinatura paga de ferramenta de IA;
* horas de estudo tradicional;
* dependência percebida de IA;
* política institucional sobre IA;
* ansiedade durante provas;
* retenção de habilidades;
* risco de burnout.

A variável-alvo do modelo é `Post_Semester_GPA`, que representa o GPA final do semestre.

## Modelo treinado

Foi treinado um modelo de regressão com Random Forest para prever o GPA final do semestre.

Para permitir a publicação como site estático na Vercel, sem depender de backend em produção, foi treinada uma versão compacta do Random Forest e exportada para JavaScript no arquivo `model.js`.

### Métricas da versão exportada

* Registros utilizados: 50.000
* Variáveis após codificação: 26
* Algoritmo: Random Forest Regressor
* Árvores: 30
* Profundidade máxima: 10
* MAE: 0.1228
* RMSE: 0.1573
* R²: 0.8974

## Como executar o frontend

Como o frontend é estático, basta abrir o arquivo `index.html` no navegador.

Também é possível usar a extensão Live Server no VS Code.

## Como treinar o modelo completo

```bash
cd backend
pip install -r requirements.txt
python train_model.py
```

Esse processo gera os arquivos `.joblib` dentro de `backend/models/`. Eles não são enviados ao GitHub porque são grandes.

## Como executar a API local

```bash
cd backend
pip install -r requirements.txt
python train_model.py
uvicorn main:app --reload
```

Endpoints:

* `GET /`
* `GET /health`
* `POST /predict`

## Como atualizar o modelo usado no frontend

```bash
cd backend
pip install -r requirements.txt
python export_static_model.py
```

Esse comando atualiza os arquivos `model.js` e `model-metrics.json` na raiz do projeto.

## Como publicar na Vercel

1. Importe este repositório na Vercel.
2. Use as configurações padrão para site estático.
3. Não é necessário configurar backend, banco de dados, comando de build ou variáveis de ambiente.

## Observação

O arquivo original `.joblib` do modelo completo não foi incluído no repositório porque é muito grande para o GitHub. Em vez disso, o projeto inclui uma versão compacta e exportada do modelo treinado, adequada para execução diretamente no navegador.
