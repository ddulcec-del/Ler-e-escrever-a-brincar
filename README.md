# Ler e Escrever a Brincar

Plataforma educativa interativa de intervenção psicopedagógica na leitura, escrita,
linguagem oral e compreensão para alunos do 1.º Ciclo — Agrupamento de Escolas de
Paço de Arcos.

**Site:** https://ddulcec-del.github.io/Ler-e-escrever-a-brincar/

## Funcionalidades

**Para os alunos** (página pública, sem palavra-passe)
- Cada aluno escolhe o seu perfil, criado pela professora, e joga em nome dele
- "O meu percurso" com as atividades escolhidas pela professora no plano
- Percurso mensal (janeiro a junho), jogos e desafios, histórias interativas e biblioteca de recursos
- Pontos, medalhas e glossário pessoal; leitura em voz alta (PT-PT)
- Barra de acessibilidade: tipo de letra (incl. OpenDyslexic), tamanho, espaçamento, modo escuro

**Área da Professora** (com login)
- **Alunos**: criar, editar e apagar; para cada aluno:
  - *Ficha*, *Avaliação inicial*, *Plano* (competências, nível e atividades que o aluno vê),
    *Sumários* das aulas (com as atividades feitas na plataforma nesse dia) e
    *Progresso e relatório* (histórico, comparação com a avaliação inicial, relatório para imprimir)
  - Repor o progresso (apaga resultados, pontos e medalhas)
- **Exercícios**: criar, editar, duplicar, ocultar, apagar e pré-visualizar

Os dados ficam numa base de dados [Supabase](https://supabase.com), iguais em
qualquer dispositivo. No navegador só ficam as preferências de acessibilidade e
o aluno escolhido nesse dispositivo.

## Configurar o Supabase (uma vez)

1. Criar uma conta e um projeto novo em [supabase.com](https://supabase.com).
2. **SQL Editor** → *New query* → colar o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) → *Run*.
   Cria as tabelas e as regras de acesso.
3. **Authentication → Users → Add user → Create new user**: criar a conta da professora.
   - E-mail: `<utilizador>@example.com` — por exemplo `dulce@example.com` para entrar
     com o utilizador `dulce` (também se pode entrar escrevendo o e-mail completo).
   - Escolher a palavra-passe e marcar **Auto Confirm User**.
4. **Project Settings → API**: copiar o *Project URL* e a chave pública
   (*publishable* ou *anon*) para:
   - `.env.local` (copiar de [`.env.example`](.env.example)), para desenvolvimento;
   - **GitHub → Settings → Secrets and variables → Actions**: criar os secrets
     `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_KEY`, para o site publicado.
5. Abrir o site → **Área da Professora** → entrar → **Exercícios** →
   **Importar exercícios originais** (49 exercícios). Depois, criar os alunos.

## Estrutura

```
src/
  app/                    entrada Next.js (layout, página e estilos globais)
  App.tsx                 navegação e dados da página pública
  components/             vistas (módulos mensais, histórias, progresso…)
  components/teacher/     Área da Professora (alunos, plano, sumários, relatório, exercícios)
  data/                   conteúdos pedagógicos (histórias, recursos, módulos)
  data/seedActivities.ts  exercícios originais, usados só para "Importar"
  lib/                    ligação ao Supabase e todas as leituras/escritas (db.ts)
  types/pedagogical.ts    tipos partilhados
supabase/schema.sql       tabelas e regras de acesso
docs/                     especificação original do projeto
```

## Desenvolvimento

O site é feito com [Next.js](https://nextjs.org) (exportação estática) e
requer [Node.js](https://nodejs.org) 20.9 ou superior.

```bash
npm install
cp .env.example .env.local   # e preencher
npm run dev      # http://localhost:3000
npm run lint     # verificação de tipos
npm run build    # gera o site pronto na pasta out/
npm run preview  # serve a pasta out/ em http://localhost:3000
```

## Publicação

Cada alteração enviada para o ramo `main` é publicada automaticamente no
GitHub Pages pelo workflow `.github/workflows/deploy.yml` (o GitHub instala,
verifica e constrói o site sozinho), usando os secrets do Supabase.
