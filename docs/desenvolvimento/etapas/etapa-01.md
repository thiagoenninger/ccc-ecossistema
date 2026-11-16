# Etapa 01 — Monorepo e toolchain

**Fase:** 1 — Fundação tecnológica · **Data:** 16/11/2026 · **Estado:** Documentada (testada no ambiente do Claude; **aguardando implementação e validação local**)
**Próxima etapa:** E02 — Fundação visual (tokens). **Não será iniciada sem sua aprovação.**

## 1. Objetivo

Entregar um repositório reproduzível com npm Workspaces, TypeScript 6.0.3, Vite 8, Vitest 5 + Testing Library, ESLint 10, Prettier e um aplicativo esqueleto (`@ccc/espaco-expositivo`), além do registro formal das decisões aprovadas, do `CLAUDE.md` e dos documentos de acompanhamento.

## 2. Pré-requisitos

| Item | Valor |
| --- | --- |
| Sistema | Windows 11, Visual Studio Code, PowerShell |
| Node.js | 24.21.0 (aceitos: `^22.22.2 \|\| ^24.15.0 \|\| >=26`) |
| npm | 11.19.0 (mínimo 10.9) |
| Git | 2.55.0.windows.5 |
| Acesso à internet | Necessário para `npm ci` (registro npm) |
| Documentos oficiais do DS | Os seis arquivos devem ser copiados para `docs/design-system/` (ver `docs/design-system/README.md`) |

## 3. Contexto técnico

**Por que esta etapa:** todas as etapas seguintes dependem de uma base reproduzível, tipada e testável. **Relação com a arquitetura:** estabelece a regra de dependências `apps → packages` e o modelo de pacotes internos como código-fonte (ADR-001).

**Decisões desta etapa** (ver `docs/decisoes/`): ADR-001 (monorepo e pacotes-fonte), ADR-002 (TypeScript 6.0.x, validado), e o registro formal de ADR-003 a ADR-011.

**Alternativas consideradas:** TypeScript 7.0.2 (rejeitado: `typescript-eslint` 8.72.2 exige TypeScript < 6.1); pacotes internos compilados (rejeitado: ordem de build); Nx/Turborepo (vetado); `eslint-plugin-jsx-a11y` (não adotado: suporta ESLint até 9, o projeto usa 10; pendência N-25).

## 4. Conceitos relevantes

- **npm Workspaces:** o `package.json` da raiz lista `apps/*` e `packages/*`; um único `npm install` na raiz instala tudo e cria *links simbólicos* em `node_modules/@ccc/` para cada workspace.
- **Pacote interno como código-fonte:** o pacote exporta `src/index.ts`; o Vite do app transpila. Evita `dist` e ordem de build (comprovado em experimento, §9.5).
- **`tsconfig.base.json`:** configuração estrita compartilhada; cada workspace estende e apenas inclui seus arquivos.
- **Lint tipado:** `recommendedTypeChecked` usa o compilador TypeScript para regras como `no-floating-promises` (`projectService`).
- **`save-exact` + lockfile + `npm ci`:** versões fixas e instalação idêntica em qualquer máquina.
- **Fim de linha:** `.gitattributes` com `eol=lf` impede que o Git do Windows converta arquivos para CRLF e quebre o `prettier --check`.

## 5. Ambiente e dependências

Todas as versões são **exatas**. O `package-lock.json` (3.792 linhas) é gerado pelo npm e **entregue no pacote .zip**; não está reproduzido aqui por ser arquivo gerado.

**Dependências da raiz (`devDependencies`, ferramentas compartilhadas):**

| Pacote | Versão |
| --- | --- |
| typescript | 6.0.3 |
| eslint | 10.15.0 |
| @eslint/js | 10.0.1 |
| typescript-eslint | 8.72.2 |
| eslint-plugin-react-hooks | 7.1.1 |
| globals | 17.14.0 |
| prettier | 3.10.1 |
| vitest | 5.1.0 |
| jsdom | 31.0.1 |
| @testing-library/dom | 10.4.2 |
| @testing-library/react | 16.3.3 |
| @testing-library/jest-dom | 7.0.1 |
| @testing-library/user-event | 14.6.12 |
| @types/node | 24.19.2 |

**Dependências do workspace `@ccc/espaco-expositivo`:**

| Tipo | Pacote | Versão |
| --- | --- | --- |
| dependencies | react, react-dom | 19.3.1 |
| devDependencies | vite | 8.3.8 |
| devDependencies | @vitejs/plugin-react | 6.3.0 |
| devDependencies | @types/react, @types/react-dom | 19.3.0 |

Justificativas: React/Vite/TypeScript/Vitest/Testing Library/ESLint/Prettier são a stack aprovada; `eslint-plugin-react-hooks` aplica as regras de Hooks; `globals` fornece os identificadores globais por ambiente; `@eslint/js` traz o conjunto recomendado; `@testing-library/dom` é *peer dependency* do `@testing-library/react`; `jsdom` é o ambiente DOM dos testes; `@types/node` suporta Vitest/Vite. Variáveis de ambiente: nenhuma.

## 5.1. Estrutura de arquivos esperada após a etapa

```text
ccc-ecossistema/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── CLAUDE.md
├── README.md
├── eslint.config.js
├── package-lock.json
├── package.json
├── tsconfig.base.json
├── apps/
│   └── espaco-expositivo/
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.module.css
│           ├── App.test.tsx
│           ├── App.tsx
│           ├── main.tsx
│           ├── vite-env.d.ts
│           ├── styles/global.css
│           └── test/setup.ts
└── docs/
    ├── arquitetura/            visao-geral.md · estrutura-monorepo.md
    ├── decisoes/               README.md · ADR-001 … ADR-011
    ├── design-system/          README.md  (+ os 6 documentos oficiais, que você copia)
    └── desenvolvimento/
        ├── planejamento-inicial.md · roadmap.md · progresso.md · pendencias.md
        └── etapas/             etapa-01.md · assets/e01-1920x1080.png · assets/e01-1280x800.png
```

| Categoria | Arquivos |
| --- | --- |
| **Novos** | Todos os listados acima (repositório novo). |
| **Modificados** | Nenhum código anterior. Se o seu repositório já tiver `README.md` ou `.gitignore`, o conteúdo entregue os substituirá: revise com `git diff`. |
| **Removidos** | Nenhum. |
| **Inalterados** | Os seis documentos oficiais em `docs/design-system/` (você os copia). |

## 6. Ordem de implementação (PowerShell)

> Execute tudo na **raiz do repositório** (pasta `ccc-ecossistema`), salvo indicação contrária.

### 6.1 Verificar o ambiente

```powershell
node -v      # esperado: v24.21.0 (ou outra versão aceita)
npm -v       # esperado: 11.19.0 (mínimo 10.9)
git --version
```

Se o PowerShell bloquear o npm com a mensagem *"a execução de scripts foi desabilitada neste sistema"* (`npm.ps1`), execute uma vez: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, ou use `npm.cmd` no lugar de `npm`.

### 6.2 Fim de linha no Git (recomendado)

```powershell
git config core.autocrlf false
```

(O `.gitattributes` entregue já garante LF; o ajuste evita avisos.)

### 6.3 Caminho A (recomendado): extrair o pacote entregue

1. Crie a pasta do repositório (se ainda não existir) e entre nela:

```powershell
mkdir ccc-ecossistema
cd ccc-ecossistema
git init -b main          # somente se ainda não for um repositório
```

2. Copie `ccc-etapa-01.zip` para a pasta e extraia na raiz (o conteúdo do zip já é a raiz do repositório):

```powershell
Expand-Archive -Path .\ccc-etapa-01.zip -DestinationPath . -Force
Remove-Item .\ccc-etapa-01.zip
```

3. Crie a branch da etapa, instale e verifique:

```powershell
git switch -c feat/etapa-01-monorepo-toolchain
npm ci
npm run check
```

4. Copie os seis documentos oficiais para `docs/design-system/` (nomes na tabela de `docs/design-system/README.md`).

### 6.4 Caminho B: criar manualmente

Crie os arquivos da seção 7 com **exatamente** o conteúdo indicado (mesmos caminhos) e depois instale as dependências, **na raiz**:

```powershell
npm install --save-exact --save-dev typescript@6.0.3 eslint@10.15.0 @eslint/js@10.0.1 typescript-eslint@8.72.2 eslint-plugin-react-hooks@7.1.1 globals@17.14.0 prettier@3.10.1 vitest@5.1.0 jsdom@31.0.1 @testing-library/dom@10.4.2 @testing-library/react@16.3.3 @testing-library/jest-dom@7.0.1 @testing-library/user-event@14.6.12 @types/node@24.19.2
npm install --save-exact --save-prod --workspace @ccc/espaco-expositivo react@19.3.1 react-dom@19.3.1
npm install --save-exact --save-dev --workspace @ccc/espaco-expositivo vite@8.3.8 @vitejs/plugin-react@6.3.0 @types/react@19.3.0 @types/react-dom@19.3.0
```

O `package-lock.json` gerado pode diferir em versões transitivas se o registro mudar; para reprodução exata use o do pacote .zip. Depois: `npm run format` (caso o Prettier acuse diferenças) e `npm run check`.

### 6.5 Executar

```powershell
npm run dev:expo
```

Abra `http://localhost:5173/`. Para outra porta: `npm run dev -w @ccc/espaco-expositivo -- --port 5174`. Para ver o build: `npm run build:expo` e depois `npm run preview -w @ccc/espaco-expositivo -- --port 4173`.

## 7. Implementação completa — conteúdo integral dos arquivos

Os arquivos de documentação em `docs/` (ADRs, roadmap, progresso, pendências, planejamento e arquitetura) são entregues **integralmente** no pacote `ccc-etapa-01.zip` e como arquivos individuais; seu conteúdo não é duplicado nesta seção por extensão. O `package-lock.json` também é entregue no pacote.

### 7.1. `package.json`

**Operação:** Criar arquivo. **Finalidade:** Raiz do monorepo: workspaces, `engines` e scripts agregadores.

```json
{
  "name": "ccc-ecossistema",
  "version": "0.1.0",
  "private": true,
  "description": "Ecossistema digital do Centro Cultural de Cubatão",
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "engines": {
    "node": "^22.22.2 || ^24.15.0 || >=26.0.0",
    "npm": ">=10.9.0"
  },
  "scripts": {
    "dev:expo": "npm run dev --workspace @ccc/espaco-expositivo",
    "build:expo": "npm run build --workspace @ccc/espaco-expositivo",
    "preview:expo": "npm run preview --workspace @ccc/espaco-expositivo",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "check": "npm run typecheck && npm run lint && npm run format:check && npm run test && npm run build"
  },
  "devDependencies": {
    "@eslint/js": "10.0.1",
    "@testing-library/dom": "10.4.2",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.12",
    "@types/node": "24.19.2",
    "eslint": "10.15.0",
    "eslint-plugin-react-hooks": "7.1.1",
    "globals": "17.14.0",
    "jsdom": "31.0.1",
    "prettier": "3.10.1",
    "typescript": "6.0.3",
    "typescript-eslint": "8.72.2",
    "vitest": "5.1.0"
  }
}
```

### 7.2. `.npmrc`

**Operação:** Criar arquivo. **Finalidade:** Instalação reprodutível: versões exatas, `engine-strict`.

```text
engine-strict=true
save-exact=true
fund=false
```

### 7.3. `.nvmrc`

**Operação:** Criar arquivo. **Finalidade:** Versão de referência do Node (major 24).

```text
24
```

### 7.4. `.gitignore`

**Operação:** Criar arquivo. **Finalidade:** Arquivos que não devem ser versionados (inclui segredos).

```text
# Dependências
node_modules/

# Builds e relatórios
dist/
coverage/
*.tsbuildinfo

# Ambiente e segredos (nunca versionar)
.env
.env.*
!.env.example
*.pem
serviceAccount*.json
firebase-debug.log

# Editor e sistema
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.DS_Store
Thumbs.db
```

### 7.5. `.gitattributes`

**Operação:** Criar arquivo. **Finalidade:** Força fim de linha LF (evita conflito com Prettier no Windows).

```text
# Força LF em todos os arquivos de texto (Prettier usa endOfLine=lf).
* text=auto eol=lf
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.woff2 binary
*.pdf binary
*.mp4 binary
*.mp3 binary
```

### 7.6. `.editorconfig`

**Operação:** Criar arquivo. **Finalidade:** Padroniza editor (UTF-8, LF, 2 espaços).

```text
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### 7.7. `.prettierrc.json`

**Operação:** Criar arquivo. **Finalidade:** Regras do Prettier.

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### 7.8. `.prettierignore`

**Operação:** Criar arquivo. **Finalidade:** Arquivos ignorados pelo Prettier (documentos oficiais e documentos de etapa).

```text
node_modules
dist
coverage
package-lock.json
docs/design-system
docs/desenvolvimento/etapas
```

### 7.9. `tsconfig.base.json`

**Operação:** Criar arquivo. **Finalidade:** Configuração TypeScript estrita compartilhada.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

### 7.10. `eslint.config.js`

**Operação:** Criar arquivo. **Finalidade:** ESLint 10 (flat config) com regras tipadas, react-hooks e globais por ambiente.

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/coverage/**', '**/node_modules/**', 'docs/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['apps/**/src/**/*.{ts,tsx}', 'packages/**/src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['eslint.config.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
```

### 7.11. `.vscode/extensions.json`

**Operação:** Criar arquivo. **Finalidade:** Extensões recomendadas.

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig"
  ]
}
```

### 7.12. `.vscode/settings.json`

**Operação:** Criar arquivo. **Finalidade:** Prettier ao salvar, LF e TypeScript do projeto.

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "files.eol": "\n",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### 7.13. `apps/espaco-expositivo/package.json`

**Operação:** Criar arquivo. **Finalidade:** Workspace `@ccc/espaco-expositivo`: scripts e dependências de execução.

```json
{
  "name": "@ccc/espaco-expositivo",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "@vitejs/plugin-react": "6.3.0",
    "vite": "8.3.8"
  },
  "dependencies": {
    "react": "19.3.1",
    "react-dom": "19.3.1"
  }
}
```

### 7.14. `apps/espaco-expositivo/index.html`

**Operação:** Criar arquivo. **Finalidade:** Documento HTML (lang pt-BR) e ponto de entrada do Vite.

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Espaço Expositivo — Centro Cultural de Cubatão</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 7.15. `apps/espaco-expositivo/vite.config.ts`

**Operação:** Criar arquivo. **Finalidade:** Vite + plugin React + configuração do Vitest (jsdom).

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Configuração única de build (Vite) e testes (Vitest) do aplicativo.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
```

### 7.16. `apps/espaco-expositivo/tsconfig.json`

**Operação:** Criar arquivo. **Finalidade:** TypeScript do app, estende a base.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
```

### 7.17. `apps/espaco-expositivo/src/vite-env.d.ts`

**Operação:** Criar arquivo. **Finalidade:** Tipos do Vite (inclui CSS Modules).

```ts
/// <reference types="vite/client" />
```

### 7.18. `apps/espaco-expositivo/src/test/setup.ts`

**Operação:** Criar arquivo. **Finalidade:** jest-dom e limpeza automática do Testing Library.

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

### 7.19. `apps/espaco-expositivo/src/styles/global.css`

**Operação:** Criar arquivo. **Finalidade:** Reset mínimo; usa cores de sistema (sem identidade visual antes da E02).

```css
/*
 * Estilos globais mínimos do esqueleto técnico (E01).
 * Tokens, temas e fontes do Design System entram na E02.
 * Cores de sistema são usadas de propósito: nenhum valor visual do DS é improvisado aqui.
 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
}

body {
  color-scheme: dark light;
  background: Canvas;
  color: CanvasText;
  font-family: system-ui, sans-serif;
}
```

### 7.20. `apps/espaco-expositivo/src/App.module.css`

**Operação:** Criar arquivo. **Finalidade:** CSS Module do componente `App`.

```css
.root {
  display: grid;
  min-height: 100%;
  place-content: center;
  gap: 1rem;
  padding: 3.75rem;
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.title {
  margin: 0;
  font-size: 3rem;
  font-weight: 500;
}

.note {
  margin: 0;
  max-width: 62ch;
  opacity: 0.8;
}
```

### 7.21. `apps/espaco-expositivo/src/App.tsx`

**Operação:** Criar arquivo. **Finalidade:** Tela provisória do esqueleto.

```tsx
import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.root}>
      <p className={styles.eyebrow}>Centro Cultural de Cubatão</p>
      <h1 className={styles.title}>Espaço Expositivo</h1>
      <p className={styles.note}>
        Esqueleto técnico da Etapa E01. Tela provisória, sem identidade visual: o Design System
        Galeria Contemporânea v2.0 será aplicado a partir da Etapa E02.
      </p>
    </main>
  );
}
```

### 7.22. `apps/espaco-expositivo/src/main.tsx`

**Operação:** Criar arquivo. **Finalidade:** Montagem do React em `#root`.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento #root não encontrado em index.html.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### 7.23. `apps/espaco-expositivo/src/App.test.tsx`

**Operação:** Criar arquivo. **Finalidade:** Testes de componente do esqueleto.

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App (esqueleto E01)', () => {
  it('exibe o título principal da aplicação', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Espaço Expositivo' }),
    ).toBeInTheDocument();
  });

  it('expõe a região principal para tecnologias assistivas', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('informa que a identidade visual é provisória', () => {
    render(<App />);

    expect(screen.getByText(/Esqueleto técnico da Etapa E01/)).toBeInTheDocument();
  });
});
```

### 7.24. `README.md`

**Operação:** Criar arquivo. **Finalidade:** Instruções de uso do repositório.

````md
# Ecossistema Digital — Centro Cultural de Cubatão

Monorepo (npm Workspaces) das aplicações museográficas, do módulo de mídias automatizadas, da biblioteca digital e do Dashboard Administrativo do Centro Cultural de Cubatão/SP.

Design System oficial: **Galeria Contemporânea v2.0** (documentos em `docs/design-system/`).

> Estado: **E01 — Monorepo e toolchain**. Apenas o esqueleto técnico do Espaço Expositivo existe. Ver [progresso](docs/desenvolvimento/progresso.md).

## Requisitos

- Node.js `^22.22.2 || ^24.15.0 || >=26` (referência do projeto: **24.21.0**; ver `.nvmrc`)
- npm 10.9 ou superior (referência: **11.19.0**)
- Git 2.40 ou superior (referência: 2.55.0.windows.5)

## Primeiros passos (PowerShell, na raiz do repositório)

```powershell
npm ci
npm run check
npm run dev:expo
```

Abra o endereço exibido (normalmente `http://localhost:5173/`).

## Comandos

| Comando                           | Função                                           |
| --------------------------------- | ------------------------------------------------ |
| `npm ci`                          | Instala exatamente o `package-lock.json`         |
| `npm run dev:expo`                | Servidor de desenvolvimento do Espaço Expositivo |
| `npm run build` / `build:expo`    | Build de produção (executa typecheck antes)      |
| `npm run preview:expo`            | Serve o build gerado                             |
| `npm test`                        | Testes (Vitest) em todos os workspaces           |
| `npm run typecheck`               | Verificação de tipos em todos os workspaces      |
| `npm run lint` / `lint:fix`       | ESLint com regras tipadas                        |
| `npm run format` / `format:check` | Prettier                                         |
| `npm run check`                   | typecheck + lint + format:check + testes + build |

Argumentos extras ao Vite: `npm run dev -w @ccc/espaco-expositivo -- --port 5174`.

## Estrutura

```text
apps/espaco-expositivo/   Primeira aplicação (MVP)
packages/                 Pacotes compartilhados (criados sob demanda)
docs/                     Design System, arquitetura, decisões (ADRs) e desenvolvimento
CLAUDE.md                 Instruções permanentes para o Claude Code
```

## Documentação

- [Visão geral](docs/arquitetura/visao-geral.md) · [Estrutura do monorepo](docs/arquitetura/estrutura-monorepo.md)
- [Decisões (ADRs)](docs/decisoes/README.md)
- [Roadmap](docs/desenvolvimento/roadmap.md) · [Progresso](docs/desenvolvimento/progresso.md) · [Pendências](docs/desenvolvimento/pendencias.md)
````

### 7.25. `CLAUDE.md`

**Operação:** Criar arquivo. **Finalidade:** Instruções permanentes para sessões do Claude Code.

````md
# CLAUDE.md — Ecossistema Digital do Centro Cultural de Cubatão

Instruções permanentes para sessões do Claude Code neste repositório. Não substitui a documentação: aponta para ela.
Responda em **português brasileiro**; identificadores de código em **inglês**.

## 1. Papel e modelo de trabalho

Atue como Arquiteto de Software, Tech Lead, Desenvolvedor Sênior, especialista em testes e mentor técnico.

Fluxo por etapa: consultar o roadmap → verificar o estado atual do repositório → desenvolver e testar no ambiente do Claude → corrigir → entregar documento técnico completo (`docs/desenvolvimento/etapas/etapa-NN.md`) e os arquivos → **aguardar a implementação e a validação local do desenvolvedor** → **aguardar aprovação explícita antes de avançar**.

O desenvolvedor implementa no VS Code (Windows 11, PowerShell), valida localmente e faz commits, tags e pushes. **Nunca** executar commit, push, tag nem alterar o remoto sem autorização explícita. Não presumir que o repositório local é idêntico ao entregue anteriormente: verificar ou pedir a versão atual.

## 2. Objetivo e aplicações

Ecossistema digital do Centro Cultural de Cubatão/SP: Espaço Expositivo (**primeira entrega, MVP**), Linha do Tempo, Futuro & Perspectivas, Biblioteca Digital, Mídias Automatizadas (módulo único, horizontal e vertical; inclui a Sala Afonso Schmidt, TV vertical passiva, sem toque) e Dashboard Administrativo. Mantido inicialmente por uma pessoa: simplicidade, reutilização, segurança e manutenção vêm primeiro.

Regras funcionais permanentes: todos os tablets da Linha do Tempo executam a mesma app completa (5 capítulos), de forma independente; o Espaço Expositivo é orientado por dados (nova exposição sem alterar código); publicação e sincronização são estados distintos; métricas são anônimas.

## 3. Stack aprovada

React 19 · TypeScript **6.0.x** (não 7, ver ADR-002) · Vite 8 · npm Workspaces · CSS Modules + CSS Variables · Vitest 5 + React Testing Library · ESLint 10 + Prettier · Git/GitHub. Quando necessário: React Router (não no MVP), Zustand, Firebase (Firestore, Auth, Storage, Functions), IndexedDB/Cache Storage, Recharts.

**Proibido:** Tailwind, pnpm, Yarn, TanStack Query (sem aprovação), bibliotecas de UI genéricas que descaracterizem o Design System. Não adicionar dependências sem justificar. Versões exatas (`save-exact`); lockfile versionado; instalação com `npm ci`.

Ambiente de referência: Node 24.21.0, npm 11.19.0 (`engines`: Node `^22.22.2 || ^24.15.0 || >=26`).

## 4. Estrutura do monorepo

```text
apps/espaco-expositivo/   # E01 (esqueleto) → MVP
packages/                 # criados sob demanda: design-tokens (E02), types e data-access (E03), ui (E04+)
docs/design-system/       # 6 documentos oficiais (somente leitura)
docs/arquitetura/  docs/decisoes/ (ADRs)  docs/desenvolvimento/ (roadmap, progresso, pendências, etapas)
```

Dependências: `apps → ui → design-tokens/types`; `apps → data-access → types`. Sem ciclos. Pacotes internos exportam **código-fonte** (`"exports": { ".": "./src/index.ts" }`), sem build por pacote (ADR-001). Cada app tem build, testes e distribuição independentes.

## 5. Comandos (raiz do repositório)

| Comando                           | Função                                         |
| --------------------------------- | ---------------------------------------------- |
| `npm ci`                          | Instala exatamente o `package-lock.json`       |
| `npm run dev:expo`                | Desenvolvimento do Espaço Expositivo           |
| `npm run build` / `build:expo`    | Build (inclui typecheck)                       |
| `npm test`                        | Testes (Vitest) em todos os workspaces         |
| `npm run typecheck`               | `tsc --noEmit` em todos os workspaces          |
| `npm run lint` / `lint:fix`       | ESLint (regras tipadas)                        |
| `npm run format` / `format:check` | Prettier                                       |
| `npm run check`                   | typecheck + lint + format:check + test + build |

Argumentos extras ao Vite: `npm run dev -w @ccc/espaco-expositivo -- --port 5174`.

## 6. Design System oficial: Galeria Contemporânea v2.0 (Proposta C)

Referências em `docs/design-system/`: PDF definitivo, Handoff Técnico, `design-tokens.json`, Migração v1→v2, Decisões Vigentes, Validação e Homologação. Consultar **o conteúdo visual do PDF**, não só o texto. Não redesenhar telas aprovadas; não reativar padrões descontinuados (ver Migração §7).

Respeitar: tema Galeria (escuro) padrão nas apps museográficas, Papel como variante, Dashboard com ambos (menu lateral **nunca petróleo**); fontes locais Source Serif 4, IBM Plex Sans, IBM Plex Sans Condensed (sem CDN); acervo com raio 0; poucos cards, poucas bordas, sombras mínimas; mosaicos por **templates predefinidos 1–9** (sem algoritmo dinâmico), margem 60 px e intervalo 10 px em 1920×1080; animar somente `transform`/`opacity`, FLIP, `decode()` antes de animar, **último toque vence**; movimento reduzido = fusão de 120–200 ms; alvos de toque ≥ 64 px no público.

Sem valores visuais fixos nos componentes: usar CSS Variables derivadas dos tokens. WCAG 2.2 AA é objetivo; **nunca declarar conformidade** antes da validação.

### Decisões já aprovadas (não rediscutir sem novo ADR)

- Coordenadas dos templates prevalecem sobre a regra percentual e sobre o mínimo de 230 px (ADR-003).
- Gradiente de legenda: metodologia do Handoff (platô 68 %, +10 px, fade 56 px); JSON oficial não é editado; parâmetros em tokens complementares (ADR-004).
- Inatividade: 120 s totais, aviso aos 100 s por 20 s, qualquer interação cancela (ADR-005; exceções de mídia/leitura na E07).
- MVP sem React Router (ADR-006); contratos compatíveis com offline (ADR-007); fontes via `@fontsource` (ADR-008); imagens de demonstração procedurais + fotos licenciadas (ADR-009); TV fora do MVP (ADR-010); Git: `main` + `feat/etapa-NN-*`, Conventional Commits (ADR-011).

### Conflitos entre documentos

Nunca resolver em silêncio: apresentar o conflito, os documentos, o impacto e uma recomendação; registrar a decisão aprovada (ADR). Hierarquia: instruções do projeto e decisões aprovadas → Decisões Vigentes → PDF (aparência) → Handoff (comportamento/especificação) → JSON (valores) → Validação (aceite) → Migração → Plano Técnico.

## 6.1 Offline e dados

Offline-first é obrigatório. Separar: atualização de **código**, de **conteúdo**, de **configuração do equipamento** e envio de **eventos**. Nunca ativar uma versão de conteúdo incompleta; preservar a última versão válida. A persistência do Firestore não basta. No MVP, dados ficam em arquivos locais **fora dos componentes**, atrás de repositório assíncrono e `resolveAssetUrl` (ADR-007). Apps públicos nunca recebem privilégios administrativos. Sem credenciais, chaves ou segredos no repositório.

## 7. Padrões de código

TypeScript estrito (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`); sem `any`; componentes pequenos; um CSS Module por componente quando necessário; lógica de dados separada da apresentação; tratamento de erros; sem overengineering, duplicação ou estado global indiscriminado. Testes validam **comportamento** (seleção, retorno com contexto, inatividade, busca), não detalhes internos nem pixels.

## 8. Testes e honestidade de resultados

Antes de entregar, quando aplicável: typecheck, lint, testes, build, execução da aplicação, validação visual com captura de tela comparada ao PDF. **Nunca declarar um teste executado se não foi.** Diferenciar: aprovado, reprovado, não executado, pendente de validação em equipamento real. Conteúdo de demonstração sempre rotulado; nunca inventar conteúdo histórico, autoria ou créditos.

## 9. Documentação obrigatória de cada etapa

`docs/desenvolvimento/etapas/etapa-NN.md` com: objetivo, pré-requisitos, contexto técnico, dependências, árvore de arquivos (novos/modificados/removidos), comandos **PowerShell**, **conteúdo integral** de cada arquivo (sem reticências nem placeholders), ordem de implementação, testes e **resultados reais**, problemas conhecidos, validação visual, checklist, critérios de aceite, sugestão de commit. Atualizar `roadmap.md`, `progresso.md`, `pendencias.md` e os ADRs afetados.

## 10. Onde está o quê

| Assunto                        | Arquivo                                                  |
| ------------------------------ | -------------------------------------------------------- |
| Planejamento e análise         | `docs/desenvolvimento/planejamento-inicial.md`           |
| Roadmap, progresso, pendências | `docs/desenvolvimento/{roadmap,progresso,pendencias}.md` |
| Decisões                       | `docs/decisoes/`                                         |
| Visão geral e estrutura        | `docs/arquitetura/`                                      |
| Design System                  | `docs/design-system/`                                    |
| Etapas entregues               | `docs/desenvolvimento/etapas/`                           |

Não avançar para uma nova etapa sem aprovação explícita do desenvolvedor.
````


## 8. Explicações técnicas

- **`package.json` (raiz):** `"type": "module"` permite `eslint.config.js` em ESM. Scripts agregadores usam `--workspaces --if-present`, que ignora workspaces sem o script (importante quando houver pacotes só de tipos). `check` encadeia `typecheck → lint → format:check → test → build`.
- **`build` do app:** executa `tsc --noEmit && vite build`; o Vite não verifica tipos, por isso o `tsc` vem antes.
- **`tsconfig.base.json`:** além de `strict`, ativa `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` e `isolatedModules`, que reduzem erros silenciosos em arrays, opcionais e importações de tipo.
- **`eslint.config.js`:** `projectService` descobre o `tsconfig` mais próximo de cada arquivo (cada workspace tem o seu). O próprio `eslint.config.js` é lintado sem regras tipadas (`disableTypeChecked`). `no-explicit-any` é erro, conforme as instruções do projeto.
- **`vite.config.ts`:** importa `defineConfig` de `vitest/config` para configurar build e testes no mesmo arquivo. `globals` do Vitest ficam desativados (importações explícitas); a limpeza do Testing Library é feita em `setup.ts`.
- **`global.css`:** usa `Canvas`/`CanvasText` (cores de sistema) de propósito, para não improvisar valores visuais antes dos tokens da E02. Escala e espaçamentos do esqueleto são provisórios.
- **`vite-env.d.ts`:** habilita a tipagem de importações de CSS Modules.

## 9. Testes executados e resultados reais

**Ambiente do Claude:** Linux; Node **24.21.0** e npm **11.19.0** (mesmas versões do seu ambiente) e, em separado, Node 22.23.4/npm 10.9.9. **Nada foi executado em Windows/PowerShell.**

### 9.1 Instalação limpa e verificações (Node 24.21.0, a partir de cópia dos arquivos entregues, sem `node_modules`)

| Comando | Resultado |
| --- | --- |
| `npm ci` | Aprovado — `added 227 packages, and audited 229 packages in 4s` |
| `npm run typecheck` | Aprovado (saída 0) |
| `npm run lint` | Aprovado (saída 0, sem avisos) |
| `npm run format:check` | Aprovado — `All matched files use Prettier code style!` |
| `npm run test` | Aprovado — 1 arquivo, 3 testes |
| `npm run build` | Aprovado — `✓ built in 170ms` |
| `npm run check` | Aprovado (saída 0) |

Saída do teste:

```text
> ccc-ecossistema@0.1.0 test
> npm run test --workspaces --if-present


> @ccc/espaco-expositivo@0.1.0 test
> vitest run


 RUN  v5.1.0 /tmp/final/apps/espaco-expositivo


 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:47:08
   Duration  919ms (environment 60%, setup 14%, transform 13%, tests 11%, import 1%)
```

Saída do build:

```text
dist/index.html                   0.43 kB │ gzip:  0.30 kB
dist/assets/index-CGhSHPFm.css    0.60 kB │ gzip:  0.36 kB
dist/assets/index-_EcWVja8.js   220.08 kB │ gzip: 68.90 kB
✓ 17 modules transformed. ✓ built in 170ms
```

### 9.2 Node 22.23.4 / npm 10.9.9

`npm ci` e `npm run check` aprovados (saída 0; 3/3 testes; build aprovado). O `package-lock.json` gerado pelo npm 11 foi aceito pelo npm 10.

### 9.3 Provas negativas (as verificações reprovam código incorreto)

- ESLint reprovou um arquivo temporário (já removido) com `any`, função `async` sem `await` e Promise sem tratamento: `no-explicit-any`, `require-await`, `no-floating-promises` (3 erros).
- `tsc` reprovou `const x: number = "a"`: `TS2322`.

### 9.4 Execução da aplicação

- `npm run dev:expo`: servidor Vite iniciou; `GET /` e `GET /src/main.tsx` responderam HTTP 200. **Não testei recarga a quente (HMR) em navegador.**
- `npm run preview` (build de produção): HTTP 200; DOM renderizado confirmado em Chrome headless: `lang="pt-BR"`, `<main>`, `<h1>Espaço Expositivo</h1>`, título da página correto, classes do CSS Module aplicadas.

### 9.5 Experimento ADR-001 (descartável, não entregue)

Em cópia temporária, criei `packages/demo-lib` com `"exports": { ".": "./src/index.ts" }`, importado pelo app (`@ccc/demo-lib`). Resultado: `npm install` criou o link em `node_modules/@ccc`, `typecheck` aprovado, `lint` aprovado, testes aprovados (app: 2 arquivos/4 testes; pacote: 1 arquivo/1 teste), build aprovado. **Conclusão:** pacotes internos como código-fonte funcionam com esta toolchain.

### 9.6 Segurança de dependências

`npm audit --omit=dev`: **0 vulnerabilidades**. `npm audit` completo: 7 avisos moderados no `minimatch` dentro do `typescript-eslint` (apenas desenvolvimento). Não apliquei `npm audit fix --force` porque rebaixaria o `typescript-eslint` (registrado como K-01).

### 9.7 Não executado / pendente

| Item | Situação |
| --- | --- |
| Instalação e `npm run check` em Windows 11/PowerShell | **Pendente de validação local** |
| HMR e uso interativo do servidor de desenvolvimento | Não executado |
| Testes de acessibilidade automatizados (axe) | Não executado (E09) |
| Comparação visual com o Design System | Não aplicável (a E01 não implementa identidade visual) |

## 10. Validação visual

A E01 não aplica o Design System. As capturas abaixo (Chrome headless, build de produção) servem apenas para confirmar a renderização do esqueleto: título, linha de apoio, rótulo e CSS Module. Arquivos: `docs/desenvolvimento/etapas/assets/e01-1920x1080.png` (1920×1080) e `e01-1280x800.png` (1280×800). Sem fontes nem tokens do DS; a tela é provisória.

## 11. Problemas comuns

| Sintoma | Causa provável | Diagnóstico e solução |
| --- | --- | --- |
| `npm : o arquivo ...npm.ps1 não pode ser carregado` | Política de execução do PowerShell | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` ou usar `npm.cmd` |
| `npm error code EBADENGINE` | Node fora da faixa aceita | `node -v`; instalar Node 24.x (ou 22.22.2+) |
| `format:check` acusa muitos arquivos | CRLF no Windows | `git config core.autocrlf false`; restaurar arquivos (`git rm --cached -r . ; git add .`) ou `npm run format` |
| `npm ci` falha por lockfile ausente/diferente | Caminho B sem o lockfile do pacote | Usar o `package-lock.json` do .zip, ou `npm install` e versionar o novo |
| Porta 5173 ocupada | Outro processo | `npm run dev -w @ccc/espaco-expositivo -- --port 5174` |
| `npm run preview:expo -- --port 4173` ignora a porta | Scripts da raiz não repassam argumentos (K-02) | Usar `npm run preview -w @ccc/espaco-expositivo -- --port 4173` |
| ESLint lento na primeira execução | Lint tipado cria o projeto TypeScript | Normal; execuções seguintes são mais rápidas |
| Avisos de `npm audit` | `minimatch` em dependência de desenvolvimento (K-01) | Ignorar por ora; não usar `--force` |

## 12. Problemas conhecidos

K-01 (avisos de auditoria só de desenvolvimento), K-02 (argumentos nos scripts da raiz), K-03 (nada validado em Windows pelo Claude), N-25 (sem lint de acessibilidade JSX para ESLint 10). Ver `docs/desenvolvimento/pendencias.md`.

## 13. Checklist de implementação local

- [ ] Node 24.21.0 / npm 11.19.0 confirmados
- [ ] Arquivos do pacote extraídos na raiz do repositório
- [ ] Seis documentos oficiais copiados para `docs/design-system/`
- [ ] `npm ci` concluído sem erro
- [ ] `npm run typecheck` aprovado
- [ ] `npm run lint` aprovado
- [ ] `npm run format:check` aprovado
- [ ] `npm test` aprovado (3 testes)
- [ ] `npm run build` aprovado
- [ ] `npm run dev:expo` abre a tela provisória em `http://localhost:5173/`
- [ ] `git status` não lista `node_modules`, `dist` ou `.env`
- [ ] Revisados ADRs e `CLAUDE.md`

## 14. Critérios de aceite

1. `npm ci && npm run check` passam no **seu** ambiente (Windows 11, PowerShell, Node 24.21.0).
2. O app exibe o esqueleto em `npm run dev:expo`.
3. A estrutura e a documentação estão conforme a seção 5.1.
4. Decisões D-01…D-09, C-01, C-03 e C-04 estão registradas em ADRs.
5. Você confirma que o `CLAUDE.md` e os documentos de acompanhamento refletem o combinado.

## 15. Versionamento (sugestão — você executa)

```powershell
git switch -c feat/etapa-01-monorepo-toolchain
git add .
git status
git commit -m "chore: monorepo npm workspaces e toolchain (E01)" -m "Esqueleto do Espaco Expositivo, TypeScript 6.0.3, Vite 8, Vitest 5, ESLint 10, Prettier. Registra ADR-001 a ADR-011, CLAUDE.md, roadmap, progresso e pendencias."
```

**Versionar:** todos os arquivos do pacote, inclusive `package-lock.json`. **Não versionar:** `node_modules/`, `dist/`, `.env*`. Após a validação, mescle em `main` conforme o ADR-011. Marco de versão: nenhum nesta etapa (o primeiro marco é M0, na E02).

## 16. Próxima etapa

**Concluído:** base reproduzível, esqueleto do app, decisões registradas, CLAUDE.md e acompanhamento. **Pendente:** identidade visual, tokens, fontes (E02); contratos e dados (E03). **Como prepara a E02:** a E02 cria `packages/design-tokens`, o primeiro uso real do modelo de pacotes-fonte e do `@fontsource`. **Decisões futuras:** C-05/C-06 (E04), regras de inatividade (E07), offline (E13). Para a E02 preciso que os seis documentos oficiais estejam em `docs/design-system/` (ou que você os anexe) e, para a E03, de informação sobre as fotos licenciadas (D-06).

**Aguardo sua validação e aprovação da E01. Não avançarei para a E02 sem ela.**
