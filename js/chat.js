const apiKey = ""; 

const modelo = "gemini-2.5-flash"; 


const chatMensagens = document.querySelector(".chat-mensagens");
const inputChat = document.querySelector(".chat-input input");
const botaoEnviar = document.querySelector(".chat-input button");


botaoEnviar.addEventListener("click", enviarMensagem);

inputChat.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
});

async function enviarMensagem() {
    const mensagem = inputChat.value.trim();
    if (!mensagem) return;

    adicionarMensagemUsuario(mensagem);
    inputChat.value = "";

    const msgPensando = adicionarMensagemBot("Pensando...");

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Você é a IA do MyColor, especialista em design, paletas de cores, UI e UX.
Responda de forma clara, objetiva, organizada, útil e até 200 caracteres.
Pergunta: ${mensagem}`
                        }]
                    }]
                })
            }
        );

        if (response.status === 429) {
            removerMensagem(msgPensando);
            adicionarMensagemBot("⚠️ Limite de requisições excedido (429).\nAguarde alguns segundos e tente novamente.");
            return;
        }

        const dados = await response.json();
        removerMensagem(msgPensando);

        const textoIA = dados.candidates?.[0]?.content?.parts?.[0]?.text 
                        || "Não foi possível gerar uma resposta.";

        adicionarMensagemBot(textoIA);

    } catch (erro) {
        removerMensagem(msgPensando);
        adicionarMensagemBot("❌ Erro ao conectar com a IA. Verifique sua chave e conexão.");
        console.error("Erro:", erro);
    }
}

function adicionarMensagemUsuario(texto) {
    const msg = criarMensagem(texto, "msg-user");
    chatMensagens.appendChild(msg);
    rolarParaBaixo();
}

function adicionarMensagemBot(texto) {
    const msg = criarMensagem(texto, "msg-bot");
    chatMensagens.appendChild(msg);
    rolarParaBaixo();
    return msg; 
}

function criarMensagem(texto, classe) {
    const msg = document.createElement("div");
    msg.classList.add("msg", classe);
    msg.textContent = texto;
    return msg;
}

function removerMensagem(elemento) {
    if (elemento && elemento.parentNode) {
        elemento.remove();
    }
}

function rolarParaBaixo() {
    chatMensagens.scrollTop = chatMensagens.scrollHeight;
}

window.addEventListener("load", () => {
    adicionarMensagemBot("Olá! 👋 Sou o assistente do MyColor.\nComo posso te ajudar hoje com cores, paletas ou design?");
});