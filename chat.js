// Chat AI Logic
function toggleChat() {
    const container = document.getElementById('chatContainer');
    const button = document.getElementById('chatButton');
    container.classList.toggle('active');
    button.classList.toggle('active');
}

function openChat() {
    const container = document.getElementById('chatContainer');
    const button = document.getElementById('chatButton');
    container.classList.add('active');
    button.classList.add('active');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendQuickMessage(message) {
    const input = document.getElementById('chatInput');
    input.value = message;
    sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Disable send button
    const sendButton = document.getElementById('sendButton');
    sendButton.disabled = true;
    
    // Show loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message';
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar">👨‍🍳</div>
        <div class="message-content">
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    document.getElementById('chatMessages').appendChild(loadingDiv);
    scrollToBottom();
    
    try {
        // Prepare recipes context for AI
        const recipesContext = recipesDatabase.map(recipe => ({
            title: recipe.title,
            category: recipe.category,
            time: recipe.time,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            tips: recipe.tips
        }));

        // Call Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: `Você é o Chef Virtual, um assistente culinário amigável e experiente do blog ChefStyle. 
                
Você tem acesso ao seguinte banco de receitas do blog:
${JSON.stringify(recipesContext, null, 2)}

Suas responsabilidades:
- Ajudar os usuários com dúvidas culinárias
- Sugerir receitas baseadas nos ingredientes que eles têm em casa
- Explicar técnicas de cozinha de forma clara e didática
- Adaptar receitas para restrições alimentares (vegano, sem glúten, sem lactose, etc.)
- Dar dicas de substituições de ingredientes
- Ajustar porções de receitas proporcionalmente
- Oferecer conselhos sobre armazenamento e conservação de alimentos
- Explicar termos culinários
- Sugerir harmonizações e acompanhamentos

Características da sua personalidade:
- Sempre simpático e encorajador
- Use emojis ocasionalmente para deixar a conversa mais leve
- Mantenha um tom descontraído mas profissional
- Seja paciente com iniciantes na cozinha
- Celebre as conquistas culinárias dos usuários
- Use linguagem clara e acessível, evitando jargões desnecessários

Se uma receita específica do blog for mencionada, use os detalhes exatos do banco de dados. 

Quando sugerir substituições ou adaptações:
- Explique o porquê da substituição
- Mencione se haverá alguma mudança no resultado final
- Ofereça alternativas quando possível

Para questões sobre ingredientes disponíveis:
- Pergunte detalhes se necessário (quantidades, restrições)
- Sugira 2-3 opções de receitas
- Indique qual receita do blog é mais adequada

Sempre termine suas respostas de forma que incentive o usuário a cozinhar e experimentar!`,
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();
        
        // Remove loading
        document.getElementById('loading-message').remove();
        
        // Add AI response
        if (data.content && data.content[0] && data.content[0].text) {
            const aiMessage = data.content[0].text;
            addMessage(aiMessage, 'ai');
        } else {
            addMessage('Desculpe, tive um problema ao processar sua mensagem. Pode tentar reformular?', 'ai');
        }
        
    } catch (error) {
        // Remove loading
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) loadingMsg.remove();
        
        // Add error message
        addMessage('Ops! Parece que estou tendo dificuldades técnicas no momento. 😅 Tente novamente em alguns instantes!', 'ai');
        console.error('Error:', error);
    } finally {
        sendButton.disabled = false;
    }
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatar = sender === 'user' ? '👤' : '👨‍🍳';
    
    // Convert markdown-style formatting to HTML
    const formattedText = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formattedText}</div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}