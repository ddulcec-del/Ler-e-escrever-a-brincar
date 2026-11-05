# Ler e Escrever a Brincar

Plataforma educativa interativa de intervenção psicopedagógica na leitura, escrita,
linguagem oral e compreensão para alunos do 1.º Ciclo — Agrupamento de Escolas de
Paço de Arcos.

**Site:** https://ddulcec-del.github.io/Ler-e-escrever-a-brincar/

## Funcionalidades

- Percurso mensal (janeiro a junho) com atividades por competência e 3 níveis de dificuldade
- Jogos e desafios, histórias interativas e biblioteca de recursos
- Leitura em voz alta (síntese de voz do navegador, PT-PT)
- Barra de acessibilidade: tipo de letra (incl. OpenDyslexic), tamanho, espaçamento, modo escuro
- Área da professora: perfis de alunos, avaliação inicial, plano individual, registo de sessões e relatórios

Todos os dados ficam guardados **apenas no navegador deste dispositivo** (`localStorage`).
Não há servidor nem contas — nada é enviado para a internet.

## Estrutura

```
src/
  App.tsx                 navegação, estado global e persistência
  components/             vistas (módulos mensais, histórias, progresso, área da professora…)
  data/                   conteúdos pedagógicos (atividades, histórias, recursos)
  types/pedagogical.ts    tipos partilhados
  utils/speech.ts         leitura em voz alta
docs/                     especificação original do projeto
```

## Desenvolvimento

Requer [Node.js](https://nodejs.org) 20 ou superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # verificação de tipos
npm run build    # gera o site pronto na pasta dist/
```

## Publicação

Cada alteração enviada para o ramo `main` é publicada automaticamente no
GitHub Pages pelo workflow `.github/workflows/deploy.yml` (o GitHub instala,
verifica e constrói o site sozinho). Não é preciso enviar ficheiros construídos.
