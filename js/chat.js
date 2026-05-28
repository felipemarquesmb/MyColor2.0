/*
const apiKey = "";

const chatMensagens =
document.querySelector(".chat-mensagens");

const inputChat =
document.querySelector(".chat-input input");

const botaoEnviar =
document.querySelector(".chat-input button");
*/
/* BOTÃO *//*
botaoEnviar.addEventListener(
"click",
enviarMensagem
);*/

/* ENTER *//*
inputChat.addEventListener(
"keypress",
function(e){

    if(e.key === "Enter"){
        enviarMensagem();
    }
});
*/
/* ENVIAR *//*
async function enviarMensagem(){

    const mensagem =
    inputChat.value.trim();

    if(!mensagem) return;

    adicionarMensagemUsuario(mensagem);

    inputChat.value = "";

    adicionarMensagemBot("Pensando...");

    try{

        const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
{
    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body: JSON.stringify({

        contents:[
            {
                parts:[
                    {
                        text:
`Você é a IA do MyColor.
Ajude usuários com:
- paletas
- design
- UI
- UX
- cores
- HEX

Responda curto.

Pergunta:
${mensagem}`
                    }
                ]
            }
        ]
    })
}
);

        const dados =
        await response.json();

        removerPensando();

        const textoIA =
        dados.candidates?.[0]
        ?.content?.parts?.[0]?.text
        || "Erro na IA.";

        adicionarMensagemBot(textoIA);

    }catch(erro){

        removerPensando();

        adicionarMensagemBot(
        "Erro ao conectar."
        );

        console.log(erro);
    }
}*/

/* MSG USER *//*
function adicionarMensagemUsuario(texto){

    const msg =
    document.createElement("div");

    msg.classList.add("msg-user");

    msg.innerText = texto;

    chatMensagens.appendChild(msg);

    chatMensagens.scrollTop =
    chatMensagens.scrollHeight;
}
*/
/* MSG BOT *//*
function adicionarMensagemBot(texto){

    const msg =
    document.createElement("div");

    msg.classList.add("msg-bot");

    msg.innerText = texto;

    chatMensagens.appendChild(msg);

    chatMensagens.scrollTop =
    chatMensagens.scrollHeight;
}
*/
/* REMOVE PENSANDO *//*
function removerPensando(){

    const mensagens =
    document.querySelectorAll(".msg-bot");

    const ultima =
    mensagens[mensagens.length - 1];

    if(
    ultima &&
    ultima.innerText === "Pensando..."
    ){
        ultima.remove();
    }
}*/

const apiKey = ""; 

const modelo = "gemini-2.5-flash"; // Recomendado

// ==================== ELEMENTOS DO DOM ====================
const chatMensagens = document.querySelector(".chat-mensagens");
const inputChat = document.querySelector(".chat-input input");
const botaoEnviar = document.querySelector(".chat-input button");

// ==================== EVENTOS ====================
botaoEnviar.addEventListener("click", enviarMensagem);

inputChat.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
});

// ==================== FUNÇÃO PRINCIPAL ====================
async function enviarMensagem() {
    const mensagem = inputChat.value.trim();
    if (!mensagem) return;

    // Adiciona mensagem do usuário
    adicionarMensagemUsuario(mensagem);
    inputChat.value = "";

    // Mostra "Pensando..."
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
Responda de forma clara, objetiva, útil e até 150 caracteres.
Pergunta: ${mensagem}`
                        }]
                    }]
                })
            }
        );

        // Tratamento específico para erro 429 (Rate Limit)
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

// ==================== FUNÇÕES AUXILIARES ====================
function adicionarMensagemUsuario(texto) {
    const msg = criarMensagem(texto, "msg-user");
    chatMensagens.appendChild(msg);
    rolarParaBaixo();
}

function adicionarMensagemBot(texto) {
    const msg = criarMensagem(texto, "msg-bot");
    chatMensagens.appendChild(msg);
    rolarParaBaixo();
    return msg; // retorna para poder remover depois (pensando...)
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

// ==================== MENSAGEM INICIAL ====================
window.addEventListener("load", () => {
    adicionarMensagemBot("Olá! 👋 Sou o assistente do MyColor.\nComo posso te ajudar hoje com cores, paletas ou design?");
});