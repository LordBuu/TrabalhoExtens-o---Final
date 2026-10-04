# NeuroEdu — Apoio Pedagógico Baseado em Evidências para Professores do Ensino Médio

O **NeuroEdu** é uma plataforma web moderna, responsiva e inclusiva desenvolvida para auxiliar professores do Ensino Médio (alunos com idade aproximada entre 13 e 17 anos) na elaboração, adaptação e implementação de estratégias pedagógicas fundamentadas em evidências científicas para estudantes neurodivergentes (TDAH, TEA, Dislexia, Discalculia, Funções Executivas, TDL e Desenho Universal para a Aprendizagem).

---

## 1. Como Instalar

Certifique-se de possuir o **Node.js (versão 18+)** ou **Bun** instalado em seu ambiente.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/neuroedu.git
cd neuroedu

# Instale as dependências
npm install
```

---

## 2. Como Configurar o Firebase

A aplicação utiliza **Firebase Authentication** e **Firebase Firestore** com suporte a regras de segurança baseadas em atributos (ABAC).

1. Crie um projeto no console do Firebase: [https://console.firebase.google.com](https://console.firebase.google.com).
2. Ative os serviços:
   - **Authentication**: ative o provedor Google e E-mail/Senha.
   - **Cloud Firestore**: crie o banco de dados no modo produção.
3. Copie as credenciais da Web App gerada e cole no arquivo `firebase-applet-config.json` na raiz do projeto:

```json
{
  "projectId": "seu-projeto-firebase",
  "appId": "1:000000000000:web:000000000000",
  "apiKey": "AIzaSy...",
  "authDomain": "seu-projeto-firebase.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "seu-projeto-firebase.appspot.com",
  "messagingSenderId": "000000000000"
}
```

4. Implante as regras de segurança descritas em `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

---

## 3. Como Configurar a GEMINI_API_KEY

O NeuroEdu utiliza o SDK oficial `@google/genai` com o modelo de alta performance e raciocínio **Gemini 3.8 Flash**. Por razões estritas de segurança, a chave da API do Gemini é acessada **exclusivamente no servidor** e nunca exposta ao frontend.

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY="AIzaSySuaChaveDoGoogleGemini..."
PORT=3000
```

---

## 4. Como Executar Localmente

### Modo Desenvolvimento:
Inicia o Vite dev server integrado com o middleware de API:
```bash
npm run dev
```
Acesse a aplicação no navegador em `http://localhost:3000`.

### Verificação de Tipos e Lint:
```bash
npm run lint
```

---

## 5. Como Fazer Deploy

### Build de Produção:
```bash
npm run build
```

### Inicialização do Servidor Full-Stack:
```bash
npm run start
```
O servidor Express servirá os arquivos estáticos compilados em `/dist` e disponibilizará a rota segura de processamento RAG `/api/gemini/analyze`.

---

## 6. Estrutura do Projeto

```
├── .env.example                 # Exemplo de variáveis de ambiente
├── firebase-blueprint.json      # Esquema intermediário de coleções Firestore
├── firestore.rules              # Regras de segurança fortificadas (Zero-Trust)
├── security_spec.md             # Especificação de segurança e casos de teste
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configurações do TypeScript
├── vite.config.ts               # Configuração do Vite com plugin de API
├── server.ts                    # Servidor Express de produção
├── server/
│   ├── gemini.ts                # Serviço de integração RAG e chamada ao Gemini 3.8
│   ├── apiRouter.ts             # Rotas REST da aplicação Express
│   └── vitePlugin.ts            # Middleware de desenvolvimento do Vite
└── src/
    ├── types/                   # Tipos TypeScript centralizados
    ├── firebase/
    │   └── config.ts            # Inicialização do Firebase e tratamento de erros
    ├── services/
    │   ├── authContext.tsx      # Contexto de autenticação e perfis
    │   ├── scientificData.ts    # Seed com fontes peer-reviewed reais e estratégias
    │   ├── scientificSourceService.ts # Serviço de persistência no Firestore
    │   ├── ragService.ts        # Mecanismo de recuperação e enriquecimento de contexto
    │   ├── historyService.ts    # Histórico de consultas do professor
    │   └── favoriteService.ts   # Gestão de favoritos (artigos, estratégias, respostas)
    ├── components/
    │   ├── Navbar.tsx           # Barra de navegação e cabeçalho responsivo
    │   ├── Sidebar.tsx          # Menu lateral do painel docente
    │   ├── EvidenceBadge.tsx    # Badges padronizados de níveis de evidência
    │   ├── SourceDetailModal.tsx # Modal de visualização de artigos e DOI
    │   ├── AuthModal.tsx        # Modal de login, cadastro e acesso demonstrativo
    │   └── PrivacyModal.tsx     # Diretrizes éticas e de privacidade do aluno (LGPD)
    ├── views/
    │   ├── HomePage.tsx         # Apresentação, fluxo e exemplos interativos
    │   ├── DashboardView.tsx    # Painel principal do professor
    │   ├── AssistantView.tsx    # Interface principal de consulta RAG com IA
    │   ├── ScientificLibraryView.tsx # Repositório científico com busca e filtros
    │   ├── StrategiesView.tsx   # Catálogo prático de acomodações DUA
    │   ├── HistoryView.tsx      # Histórico de consultas salvas
    │   ├── FavoritesView.tsx    # Coleção de itens favoritados
    │   ├── ProfileView.tsx      # Configurações do docente
    │   └── AdminPanelView.tsx   # Curadoria de fontes para administradores
    ├── App.tsx                  # Ponto de entrada React com roteamento interno
    └── main.tsx                 # Renderização DOM
```

---

## 7. Arquitetura da Aplicação

O NeuroEdu opera sob o princípio de **Factualidade Controlada**:

1. **Camada de Dados (Firestore / Base Científica):** Armazena artigos revisados por pares e estratégias educacionais validadas com classificação de evidência metodológica.
2. **Camada de Recuperação (RAG Retrieval):** Ao receber a dúvida do professor, o sistema processa a linguagem natural, extrai tokens pedagógicos e recupera os estudos mais relevantes da biblioteca.
3. **Camada de Geração Segura (Server-Side Gemini):** A pergunta e os trechos recuperados são enviados a uma rota isolada no servidor (`/api/gemini/analyze`), que invoca o modelo `gemini-3.8-flash` com um system prompt rigoroso que impede alucinações e veda terminantemente diagnósticos clínicos.
4. **Camada de Apresentação (React & Tailwind CSS):** A resposta é exibida de forma modular em seções claras (Resumo, Estratégias, Como aplicar, O que observar, Cuidados e Evidências com DOI).

---

## 8. Como Adicionar Novas Fontes Científicas

Fontes podem ser adicionadas de duas maneiras:

1. **Via Painel Administrativo:** Usuários com a role `admin` (e o e-mail administrador configurado) podem acessar a aba **Admin** e preencher o formulário completo (Título, Autores, Ano, Periódico, DOI, Nível de Evidência e Resumo).
2. **Via Código / Seed:** No arquivo `src/services/scientificData.ts`, novas entradas podem ser adicionadas à constante `INITIAL_SCIENTIFIC_SOURCES`.

---

## 9. Como Funciona o RAG (Retrieval-Augmented Generation)

Para evitar respostas genéricas ou alucinações de citações:
- O professor digita sua dúvida em linguagem natural.
- A função `retrieveRelevantSources()` ranqueia os artigos da biblioteca por compatibilidade temática, termos e público-alvo.
- Os estudos resgatados compõem o bloco `[FONTES CIENTÍFICAS RECUPERADAS]` injetado no prompt.
- O modelo Gemini recebe a instrução estrita de utilizar **apenas** as fontes fornecidas. Se a base não contiver evidência direta, a IA sinaliza `hasSufficientEvidence: false` e fornece apenas orientações prudentes de senso pedagógico geral.

---

## 10. Cuidados de Segurança e Privacidade

- **Proteção dos Estudantes (LGPD Escolar):** A plataforma instrui os professores a nunca incluírem nomes, CPFs, laudos médicos ou dados de identificação dos alunos. As consultas são pedagógicas e anônimas.
- **Não Diagnóstico:** A IA é estritamente proibida pelo prompt do sistema de sugerir medicamentos ou afirmar que um estudante tem determinada condição clínica.
- **Chaves de API Ocultas:** A chave `GEMINI_API_KEY` reside exclusivamente nas variáveis de ambiente do servidor, sem jamais transitar pelo bundle JavaScript do cliente.
- **Regras Firestore Fortificadas:** Leituras de históricos e favoritos exigem estritamente `request.auth.uid == resource.data.userId`.
