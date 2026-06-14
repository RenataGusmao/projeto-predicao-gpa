# EduPredict AI

Aplicacao web estatica para demonstracao de um projeto de Data Science voltado a predicao de desempenho academico de estudantes.

O sistema permite simular o GPA final do semestre a partir de variaveis academicas, comportamentais e relacionadas ao uso de IA generativa.

## Objetivo

O objetivo do projeto e apresentar, de forma visual e interativa, como dados de estudantes podem apoiar a estimativa de desempenho academico e auxiliar a tomada de decisao em contextos educacionais.

## Base do projeto

O projeto foi desenvolvido a partir de uma base com 50.000 registros de estudantes, contendo informacoes como:

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
- risco de burnout;
- GPA final do semestre.

Essas variaveis sao as mesmas usadas no formulario do site, mantendo alinhamento com os dados trabalhados no notebook/modelo original.

## Modelo de predicao

Na etapa de Data Science, foi treinado um modelo de regressao para prever a coluna `Post_Semester_GPA` a partir das demais variaveis da base.

Durante o desenvolvimento, tambem foi criada uma API com FastAPI para consumir um modelo treinado. No entanto, para simplificar a publicacao do projeto no Vercel e evitar dependencia de backend, a versao final publicada neste repositorio usa uma estimativa estatica implementada diretamente em JavaScript.

Importante: a versao estatica do site nao carrega o arquivo `.joblib` do modelo treinado. Ela usa os mesmos campos do modelo original, mas calcula a predicao no navegador com uma regra interpretavel baseada nos fatores do dataset.

## Como a estimativa funciona no site

O calculo parte do GPA anterior do estudante e aplica ajustes conforme os fatores informados no formulario, como:

- mais horas de estudo tradicional tendem a aumentar a estimativa;
- maior retencao de habilidades contribui positivamente;
- uso equilibrado de IA pode contribuir positivamente;
- dependencia excessiva de IA reduz a estimativa;
- ansiedade alta em provas reduz a estimativa;
- risco alto de burnout reduz a estimativa;
- habilidade avancada em prompts pode melhorar o resultado.

O resultado final e limitado ao intervalo de 0 a 4, seguindo a escala de GPA usada no projeto.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Vercel para publicacao

## Estrutura do projeto

```txt
.
├── assets/
│   └── hero-academic-ai.png
├── index.html
├── style.css
├── script.js
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

## Observacao academica

Este repositorio representa a versao de apresentacao web do projeto. A proposta principal e demonstrar a aplicacao dos conceitos de Data Science em uma interface acessivel, com os mesmos tipos de variaveis usados na modelagem original.
