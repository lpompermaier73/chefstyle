// Configuração da API Backend
const API_ENDPOINT = 'https://chefstyle-backend.vercel.app/api/chat';

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
        // Prepare recipes context (enviar apenas as primeiras 50 receitas)
        const recipesContext = recipesDatabase.slice(0, 50).map(recipe => ({
            title: recipe.title,
            category: recipe.category,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            excerpt: recipe.excerpt
        }));

        // Call Backend API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                recipes: recipesContext
            })
        });

        // Remove loading
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) loadingMsg.remove();

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Add AI response
        if (data.success && data.message) {
            addMessage(data.message, 'ai');
        } else {
            addMessage('Desculpe, tive um problema ao processar sua mensagem. Pode tentar reformular? 😅', 'ai');
        }
        
    } catch (error) {
        // Remove loading
        const loadingMsg = document.getElementById('loading-message');
        if (loadingMsg) loadingMsg.remove();
        
        // Add error message
        console.error('Chat error:', error);
        addMessage('Ops! Parece que estou tendo dificuldades técnicas no momento. 😅 Tente novamente em alguns instantes!', 'ai');
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
