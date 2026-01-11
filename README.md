# ChefStyle - Blog de Culinária com IA

Blog moderno de culinária com assistente de IA integrado, hospedado no GitHub Pages.

## 🚀 Como Publicar no GitHub Pages

### Passo 1: Criar o Repositório

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Configure o repositório:
   - **Repository name**: `chefstyle` (ou o nome que preferir)
   - **Description**: "Blog de culinária com assistente de IA"
   - Marque como **Public**
   - ✅ Marque "Add a README file"
4. Clique em **"Create repository"**

### Passo 2: Fazer Upload dos Arquivos

**Opção A: Via Interface Web (Mais Fácil)**

1. No seu repositório, clique em **"Add file"** → **"Upload files"**
2. Arraste todos os arquivos do blog para a área de upload:
   - `index.html`
   - `posts.html`
   - `recipe.html`
   - `styles.css`
   - `main.js`
   - `chat.js`
   - `recipes-data.js`
3. Na caixa de commit (embaixo), escreva: "Initial commit - ChefStyle blog"
4. Clique em **"Commit changes"**

**Opção B: Via Git (Para Usuários Avançados)**

```bash
# Clone o repositório
git clone https://github.com/SEU-USUARIO/chefstyle.git
cd chefstyle

# Copie todos os arquivos do blog para esta pasta

# Faça o commit
git add .
git commit -m "Initial commit - ChefStyle blog"
git push origin main
```

### Passo 3: Ativar GitHub Pages

1. No seu repositório, vá em **Settings** (Configurações)
2. No menu lateral esquerdo, clique em **Pages**
3. Em **"Source"**, selecione:
   - Branch: **main**
   - Folder: **/ (root)**
4. Clique em **"Save"**
5. Aguarde alguns minutos (geralmente 1-3 minutos)
6. Seu site estará disponível em: `https://SEU-USUARIO.github.io/chefstyle/`

### Passo 4: Personalizar o Domínio (Opcional)

Se você quiser usar um domínio personalizado (como `chefstyle.com`):

1. Compre um domínio (Registro.br, GoDaddy, Namecheap, etc.)
2. No GitHub Pages Settings, adicione seu domínio customizado
3. Configure os DNS do seu domínio apontando para o GitHub:
   - Tipo: `A`
   - Nome: `@`
   - Valor: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Tipo: `CNAME`
   - Nome: `www`
   - Valor: `SEU-USUARIO.github.io`

## 📝 Adicionar Suas Receitas do Blogger

Depois de fazer a exportação do Blogger (arquivo XML), envie para mim e eu:

1. Extraio todas as receitas
2. Converto para o formato correto
3. Atualizo o arquivo `recipes-data.js`
4. Te envio o arquivo atualizado

Você só precisará substituir o arquivo no GitHub!

## 🤖 Configuração do Chat IA

O Chat IA já está configurado e funcional! Ele usa a API da Anthropic (Claude).

**Características:**
- Responde perguntas sobre receitas
- Sugere substituições de ingredientes
- Adapta receitas para restrições alimentares
- Ajuda com técnicas culinárias
- Conhece todas as receitas do blog

## 📁 Estrutura dos Arquivos

```
chefstyle/
├── index.html          # Página principal
├── posts.html          # Lista todas as receitas
├── recipe.html         # Página individual de receita
├── styles.css          # Todos os estilos
├── main.js            # JavaScript principal
├── chat.js            # Lógica do chat IA
├── recipes-data.js    # Banco de dados de receitas
└── README.md          # Este arquivo
```

## 🎨 Personalização

### Mudar Cores

Edite as variáveis CSS no arquivo `styles.css` (linhas 9-15):

```css
:root {
    --primary: #1a1a1a;      /* Cor principal (preto)
    --accent: #d4541e;        /* Cor de destaque (laranja)
    --secondary: #f4f1ea;     /* Cor secundária (bege)
    --cream: #faf8f3;         /* Fundo (creme)
    --dark-green: #2d5f4d;    /* Verde escuro
    --light-gray: #e8e4dc;    /* Cinza claro
}
```

### Adicionar Logo

1. Crie uma imagem do logo (PNG ou SVG)
2. Faça upload no GitHub
3. Substitua no `index.html` a linha 28:
   ```html
   <div class="logo">
       <img src="logo.png" alt="ChefStyle">
   </div>
   ```

### Adicionar Novas Receitas

Edite o arquivo `recipes-data.js` e adicione novas receitas seguindo o formato:

```javascript
{
    id: 7,  // Próximo número sequencial
    title: "Nome da Receita",
    category: "Categoria",
    emoji: "🍕",
    excerpt: "Descrição curta...",
    time: "30 min",
    servings: "4 porções",
    ingredients: [
        "Ingrediente 1",
        "Ingrediente 2"
    ],
    instructions: [
        "Passo 1",
        "Passo 2"
    ],
    tips: "Dica especial da receita"
}
```

## 📊 Analytics (Opcional)

Para acompanhar visitantes, adicione Google Analytics:

1. Crie uma conta no [Google Analytics](https://analytics.google.com)
2. Obtenha seu código de rastreamento
3. Adicione antes do `</head>` em todos os arquivos HTML

## 🔧 Atualizações Futuras

Para atualizar o blog:

1. Edite os arquivos localmente
2. Faça upload novamente no GitHub
3. As mudanças aparecem automaticamente em alguns minutos

Ou use Git:
```bash
git add .
git commit -m "Descrição da atualização"
git push origin main
```

## 💡 Dicas

- O site é 100% gratuito no GitHub Pages
- Sem limite de tráfego
- SSL (HTTPS) grátis e automático
- Atualizações em tempo real
- Backup automático via Git

## 🆘 Problemas Comuns

**Site não aparece após ativar Pages:**
- Aguarde 5-10 minutos
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique se o nome do arquivo é `index.html` (com 'i' minúsculo)

**Chat IA não funciona:**
- A API da Anthropic já está configurada
- Funciona diretamente no navegador
- Sem necessidade de configuração adicional

**Receitas não aparecem:**
- Verifique se o arquivo `recipes-data.js` está no repositório
- Abra o Console do navegador (F12) para ver erros

## 📧 Suporte

Se tiver dúvidas durante a publicação, me envie uma mensagem descrevendo o problema!

---

**Próximos Passos:**
1. ✅ Criar repositório no GitHub
2. ✅ Fazer upload dos arquivos
3. ✅ Ativar GitHub Pages
4. ✅ Testar o site
5. ⏳ Exportar conteúdo do Blogger
6. ⏳ Migrar receitas antigas
7. ⏳ Divulgar o novo blog!

Bom trabalho! 🎉👨‍🍳