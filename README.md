# 💻 Portifólio Profissional | Gustavo Nunes

<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Status-Em_Evolu%C3%A7%C3%A3o-success?style=for-the-badge" alt="Status">
</div>

<br>

Este repositório contém o código-fonte do meu portefólio profissional, desenvolvido com foco numa arquitetura de código limpa, escalabilidade e numa estética **Premium Dark**. O objetivo deste projeto é documentar a minha trajetória como **Desenvolvedor de Sistemas**, apresentando os meus projetos, competências e certificações.

---

## ✨ Destaques e Funcionalidades

- 🎨 **Design "Premium Dark" & Glassmorphism:** Interface moderna baseada em tons de Preto, Azul Escuro e Verde, com transparências dinâmicas.
- 📱 **Totalmente Responsivo (Mobile-First):** Adapta-se perfeitamente a qualquer tamanho de ecrã (desde pequenos telemóveis a monitores ultrawide).
- 🚀 **Animações de Alto Desempenho:** Utilização da API `IntersectionObserver` em JavaScript puro para revelar elementos ao fazer *scroll* sem prejudicar o desempenho do browser.
- ♿ **Acessibilidade:** Respeito por propriedades como `prefers-reduced-motion` e navegação otimizada por teclado.
- 📚 **Arquitetura Escalável de Certificados:** Sistema de grelhas CSS (`CSS Grid`) que permite adicionar novos certificados do SENAI, SESI e SEBRAE de forma automática e alinhada, sem necessidade de refatorar o layout.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído **sem frameworks pesadas**, demonstrando domínio sobre as tecnologias base da web:

- **HTML5:** Semântica e SEO.
- **CSS3:** Variáveis nativas (Custom Properties), Flexbox, CSS Grid, animações e media queries.
- **JavaScript (Vanilla):** Manipulação de DOM e observadores de interação.

---

## 📂 Estrutura de Ficheiros

```text
/
├── index.html                # Página principal (Hero, Sobre, Habilidades, Projetos)
├── styles.css                # Arquivo global de estilos e variáveis do tema
├── script.js                 # Lógica do menu mobile e animações de scroll
├── páginas/                  # Páginas internas
│   ├── cursos.html           # Dashboard principal de Cursos e Instituições
│   ├── senai.html            # Grelha de certificados do SENAI
│   ├── sesi.html             # Grelha de certificados do SESI
│   ├── sebrae.html           # Grelha de certificados do SEBRAE
│   └── fundacaoBradesco.html # Certificados da Fundação Bradesco
├── images/                   # Logótipos, fotografias e capturas de ecrã dos projetos
└── certificados/             # Pastas segmentadas com os ficheiros PDF originais
