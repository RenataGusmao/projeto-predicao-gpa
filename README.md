# EduPredict AI

Aplicacao web estatica para demonstracao de um projeto de Data Science voltado a predicao de desempenho academico de estudantes.

O sistema estima o GPA final do semestre a partir de variaveis academicas, comportamentais e relacionadas ao uso de IA generativa.

## Objetivo

O objetivo do projeto e apresentar uma aplicacao pratica de Machine Learning para apoiar a analise de desempenho academico, permitindo que o usuario simule diferentes perfis de estudante e visualize uma predicao de GPA.

## Base de dados

O projeto utiliza uma base com 50.000 registros de estudantes. As variaveis usadas no formulario sao as mesmas consideradas na modelagem:

- area principal do curso;
- ano de estudo;
- GPA anterior;
- horas semanais de uso de IA generativa;
- principal forma de uso da IA;
- habilidade em engenharia de prompts;
- diversidade de ferramentas utilizadas;
- assinatura paga de ferramenta de IA;
- horas de estudo tradicional;
- dependencia percebida de IA;
- politica institucional sobre IA;
- ansiedade durante provas;
- retencao de habilidades;
- risco de burnout.

A variavel alvo do modelo e `Post_Semester_GPA`, que representa o GPA final do semestre.

## Modelo treinado

Foi treinado um modelo de regressao com Random Forest para prever o GPA final do semestre.

Para permitir a publicacao como site estatico no Vercel, sem backend e sem API, foi treinada uma versao compacta do Random Forest e exportada para JavaScript no arquivo `model.js`. Assim, a predicao acontece diretamente no navegador, mas ainda utilizando um modelo treinado a partir da base de dados.

Metricas da versao exportada:

- Registros utilizados: 50.000
- Variaveis apos codificacao: 26
- Algoritmo: Random Forest Regressor
- Arvores: 30
- Profundidade maxima: 10
- MAE: 0.1228
- RMSE: 0.1573
- R2: 0.8974

## Como a predicao funciona no site

1. O usuario preenche o formulario com os dados do estudante.
2. O JavaScript transforma as entradas categoricas no mesmo formato usado no treinamento.
3. O arquivo `model.js` executa as arvores do Random Forest exportado.
4. O sistema exibe o GPA previsto e uma interpretacao simples do resultado.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Random Forest Regressor
- Vercel

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

Como o projeto e estatico, basta abrir o arquivo `index.html` no navegador.

Tambem e possivel usar a extensao Live Server no VS Code.

## Como publicar no Vercel

1. Suba este repositorio para o GitHub.
2. Acesse o Vercel.
3. Clique em `Add New Project`.
4. Importe o repositorio.
5. Mantenha as configuracoes padrao para site estatico.
6. Clique em `Deploy`.

Nao e necessario configurar backend, API, banco de dados, comando de build ou variaveis de ambiente.

## Observacao

O arquivo original `.joblib` do modelo completo nao foi incluido no repositorio porque e muito grande para o GitHub. Em vez disso, o projeto inclui uma versao compacta e exportada do modelo treinado, adequada para execucao diretamente no navegador.
