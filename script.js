// CONFIGURAÇÕES
const API_KEY = "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"; // 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
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo"; // pode trocar por "gpt-4" se tiver acesso

// Seletores
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Função para adicionar mensagens no chat
function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Enviar mensagem do usuário
async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Exibe a mensagem do usuário
  addMessage(userMessage, "user");
  userInput.value = "";

  // Exibe mensagem de carregando
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "bot");
  loadingMsg.innerText = "Digitando...";
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Faz a requisição para a OpenAI
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    // Remove "digitando..."
    loadingMsg.remove();

    if (data.choices && data.choices.length > 0) {
      const botMessage = data.choices[0].message.content;
      addMessage(botMessage, "bot");
    } else {
      addMessage("⚠️ Erro: não recebi resposta da IA.", "bot");
    }

  } catch (error) {
    loadingMsg.remove();
    addMessage("❌ Erro de conexão com a API.", "bot");
    console.error(error);
  }
}

// Eventos
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

