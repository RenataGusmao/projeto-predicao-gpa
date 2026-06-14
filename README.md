# EduPredict AI

Aplicação web estática para demonstração de um projeto de Data Science voltado à predição de desempenho acadêmico de estudantes.

O sistema estima o GPA final do semestre a partir de variáveis acadêmicas, comportamentais e relacionadas ao uso de IA generativa.

## Objetivo

O objetivo do projeto é apresentar uma aplicação prática de Machine Learning para apoiar a análise de desempenho acadêmico, permitindo que o usuário simule diferentes perfis de estudantes e visualize uma predição de GPA.

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

Para permitir a publicação como site estático na Vercel, sem backend e sem API, foi treinada uma versão compacta do Random Forest e exportada para JavaScript no arquivo `model.js`. Assim, a predição acontece diretamente no navegador, mas ainda utilizando um modelo treinado a partir da base de dados.

### Métricas da versão exportada

* Registros utilizados: 50.000
* Variáveis após codificação: 26
* Algoritmo: Random Forest Regressor
* Árvores: 30
* Profundidade máxima: 10
* MAE: 0.1228
* RMSE: 0.1573
* R²: 0.8974

## Como a predição funciona no site

1. O usuário preenche o formulário com os dados do estudante.
2. O JavaScript transforma as entradas categóricas no mesmo formato utilizado durante o treinamento.
3. O arquivo `model.js` executa as árvores do Random Forest exportado.
4. O sistema exibe o GPA previsto e uma interpretação simples do resultado.

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Random Forest Regressor
* Vercel

## Estrutura do projeto

```txt
.
├── assets/
│   └── hero-academic-ai.png
├── index.html
├── style.css
├── script.js
├── model.js
├── model-metrics.json
└── README.md
```

## Como executar localmente

Como o projeto é estático, basta abrir o arquivo `index.html` no navegador.

Também é possível utilizar a extensão Live Server no VS Code.

## Como publicar na Vercel

1. Faça o upload deste repositório para o GitHub.
2. Acesse a Vercel.
3. Clique em `Add New Project`.
4. Importe o repositório.
5. Mantenha as configurações padrão para site estático.
6. Clique em `Deploy`.

Não é necessário configurar backend, API, banco de dados, comando de build ou variáveis de ambiente.

## Observação

O arquivo original `.joblib` do modelo completo não foi incluído no repositório porque é muito grande para o GitHub. Em vez disso, o projeto inclui uma versão compacta e exportada do modelo treinado, adequada para execução diretamente no navegador.
