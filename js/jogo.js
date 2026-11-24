let energia = 100;
let hora = 0;
let segundos = 0;
let jogoEncerrado = false;
let cameraAberta = false;
let portaEsquerdaFechada = false;
let portaDireitaFechada = false;
let luzEsquerdaLigada = false;
let luzDireitaLigada = false;
let partidaSalva = false;

// Trilha sonora: o ambiente acompanha a noite; jumpscare e menu entram no encerramento.
const audioAmbiente = document.getElementById("audioAmbiente");
const audioJumpscare = document.getElementById("audioJumpscare");
const audioMenu = document.getElementById("audioMenu");

if (audioAmbiente) audioAmbiente.volume = 0.15;
if (audioJumpscare) audioJumpscare.volume = 0.90;
if (audioMenu) audioMenu.volume = 0.20;

let audioIniciado = false;
function iniciarAudioAmbiente() {
    if (audioIniciado || jogoEncerrado || !audioAmbiente) return;
    audioIniciado = true;
    audioAmbiente.play().catch(() => {
        // O navegador pode bloquear a reprodução; uma próxima interação tentará novamente.
        audioIniciado = false;
    });
}

// Navegadores exigem uma interação do jogador antes de liberar áudio com autoplay.
document.addEventListener("pointerdown", iniciarAudioAmbiente, { once: true });
document.addEventListener("keydown", iniciarAudioAmbiente, { once: true });

function pararAudio(audio) {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

function tocarAudio(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// Dois animatrônicos com movimentação independente.
// Cada um passa pelo palco, por uma sala intermediária e segue para um corredor.
const animatronicos = [
    { id: "urso", nome: "Freddy", posicao: 1, sala: 1, lado: null, imagem: "assets/images/urso.png" },
    { id: "coelho", nome: "Bonnie", posicao: 1, sala: 1, lado: null, imagem: "assets/images/coelho.png" }
];

const cameras = {
    1: { nome: "PALCO PRINCIPAL", imagem: "assets/images/palco.jpg" },
    2: { nome: "CORREDOR ESQUERDO", imagem: "assets/images/corredor_esquerdo.jpg" },
    3: { nome: "CORREDOR DIREITO", imagem: "assets/images/corredor_direito.jpg" },
    4: { nome: "SALA DE SEGURANÇA", imagem: "assets/images/escritorio.jpg" },
    5: { nome: "ÁREA DE FESTA", imagem: "assets/images/palco.jpg" }
};

function animatronicosNaCamera(numero) {
    return animatronicos.filter(a => {
        if (numero === 1) return a.posicao === 1;
        if (numero === 4 || numero === 5) return a.posicao === 2 && a.sala === numero;
        if (numero === 2) return a.posicao >= 3 && a.lado === "esquerda";
        if (numero === 3) return a.posicao >= 3 && a.lado === "direita";
        return false;
    });
}

function criarImagemAnimatronico(animatronico, classeExtra = "") {
    const personagem = document.createElement("img");
    personagem.src = animatronico.imagem;
    personagem.alt = animatronico.nome;
    personagem.title = animatronico.nome;
    personagem.className = classeExtra;
    return personagem;
}

function atualizarCamera() {
    const numero = Number(document.getElementById("nomeCamera").dataset.camera || 1);
    document.getElementById("fotoCamera").src = cameras[numero].imagem;
    const container = document.getElementById("imagemCamera");
    container.querySelectorAll(".personagem-camera").forEach(el => el.remove());

    animatronicosNaCamera(numero).forEach((animatronico, indice) => {
        const personagem = criarImagemAnimatronico(animatronico, "personagem-camera");
        personagem.style.cssText += `;position:absolute;width:150px;height:205px;object-fit:contain;bottom:10px;left:${30 + indice * 38}%;transform:translateX(-50%);z-index:5`;
        container.appendChild(personagem);
    });
}

function mudarCamera(numero) {
    if (jogoEncerrado || !cameras[numero]) return;
    document.getElementById("nomeCamera").textContent = `CAM 0${numero} - ${cameras[numero].nome}`;
    document.getElementById("nomeCamera").dataset.camera = numero;
    document.getElementById("estatica").classList.add("ativa");
    setTimeout(() => {
        document.getElementById("estatica").classList.remove("ativa");
        if (cameraAberta) atualizarCamera();
    }, 400);
}

// A seleção de câmera é feita pelos cinco botões do monitor.
document.getElementById("camera").addEventListener("click", function () {
    if (jogoEncerrado || energia <= 0) return;
    cameraAberta = !cameraAberta;
    document.getElementById("painelCamera").classList.toggle("escondido", !cameraAberta);
    if (cameraAberta) atualizarCamera();
});

document.getElementById("fecharCamera").addEventListener("click", function () {
    cameraAberta = false;
    document.getElementById("painelCamera").classList.add("escondido");
});

document.getElementById("portaEsquerda").addEventListener("click", function () {
    if (jogoEncerrado || energia <= 0) return;
    portaEsquerdaFechada = !portaEsquerdaFechada;
    this.textContent = portaEsquerdaFechada ? "ABRIR PORTA" : "FECHAR PORTA";
});

document.getElementById("portaDireita").addEventListener("click", function () {
    if (jogoEncerrado || energia <= 0) return;
    portaDireitaFechada = !portaDireitaFechada;
    this.textContent = portaDireitaFechada ? "ABRIR PORTA" : "FECHAR PORTA";
});

document.getElementById("luzEsquerda").addEventListener("click", function () {
    if (jogoEncerrado || energia <= 0) return;
    luzEsquerdaLigada = !luzEsquerdaLigada;
    document.getElementById("corredorEsquerdo").classList.toggle("iluminado", luzEsquerdaLigada);
    this.textContent = luzEsquerdaLigada ? "APAGAR LUZ" : "ACENDER LUZ";
    atualizarVisao();
});

document.getElementById("luzDireita").addEventListener("click", function () {
    if (jogoEncerrado || energia <= 0) return;
    luzDireitaLigada = !luzDireitaLigada;
    document.getElementById("corredorDireito").classList.toggle("iluminado", luzDireitaLigada);
    this.textContent = luzDireitaLigada ? "APAGAR LUZ" : "ACENDER LUZ";
    atualizarVisao();
});

function atualizarVisao() {
    const visaoEsquerda = document.getElementById("visaoEsquerda");
    const visaoDireita = document.getElementById("visaoDireita");
    visaoEsquerda.replaceChildren();
    visaoDireita.replaceChildren();

    if (!luzEsquerdaLigada) {
        visaoEsquerda.textContent = "Escuridão...";
    } else {
        const naEsquerda = animatronicos.filter(a => a.posicao >= 3 && a.lado === "esquerda");
        if (naEsquerda.length) naEsquerda.forEach(a => visaoEsquerda.appendChild(criarImagemAnimatronico(a)));
        else visaoEsquerda.textContent = "Corredor vazio...";
    }

    if (!luzDireitaLigada) {
        visaoDireita.textContent = "Escuridão...";
    } else {
        const naDireita = animatronicos.filter(a => a.posicao >= 3 && a.lado === "direita");
        if (naDireita.length) naDireita.forEach(a => visaoDireita.appendChild(criarImagemAnimatronico(a)));
        else visaoDireita.textContent = "Corredor vazio...";
    }
}

// A cada hora, os animatrônicos ficam mais agressivos.
// Cada um tem seu próprio intervalo e pequenas pausas aleatórias.
function intervaloMovimento() {
    const reducaoPorHora = hora * 1300;
    const base = Math.max(3200, 10500 - reducaoPorHora);
    return base + Math.random() * 4500;
}

function agendarMovimento(animatronico) {
    if (jogoEncerrado) return;
    const atraso = intervaloMovimento();
    setTimeout(() => {
        if (jogoEncerrado) return;
        moverAnimatronico(animatronico);
        atualizarVisao();
        if (cameraAberta) atualizarCamera();
        agendarMovimento(animatronico);
    }, atraso);
}

function moverAnimatronico(animatronico) {
    if (jogoEncerrado) return;

    // Chance variável de ficar parado. Diminui conforme a noite avança.
    const chanceParado = Math.max(0.08, 0.38 - (hora * 0.045));
    if (Math.random() < chanceParado) return;

    if (animatronico.posicao === 1) {
        // O inimigo escolhe aleatoriamente uma das salas.
        animatronico.sala = Math.random() < 0.5 ? 4 : 5;
        animatronico.posicao = 2;
    } else if (animatronico.posicao === 2) {
        // Escolhe um corredor diferente a cada aproximação.
        animatronico.lado = Math.random() < 0.5 ? "esquerda" : "direita";
        animatronico.posicao = 3;
    } else if (animatronico.posicao >= 3) {
        const portaFechada = animatronico.lado === "esquerda"
            ? portaEsquerdaFechada
            : portaDireitaFechada;

        if (portaFechada) {
            // Porta correta bloqueia o inimigo, que retorna a uma sala aleatória.
            animatronico.posicao = 1;
            animatronico.sala = 1;
            animatronico.lado = null;
        } else {
            perderJogo(`${animatronico.nome} entrou pela porta ${animatronico.lado}!`, animatronico);
        }
    }
}

function atualizarMovimentacao() {
    if (jogoEncerrado || energia <= 0) return;
    animatronicos.forEach(moverAnimatronico);
    atualizarVisao();
    if (cameraAberta) atualizarCamera();
}

function consumirEnergia() {
    if (jogoEncerrado) return;

    // Cada ciclo ocorre a cada 3 segundos. Equipamentos ligados aumentam
    // o consumo: manter tudo ativo deve esgotar a bateria antes do fim da noite.
    let consumo = 0.5; // consumo básico do escritório
    if (portaEsquerdaFechada) consumo += 1.5;
    if (portaDireitaFechada) consumo += 1.5;
    if (luzEsquerdaLigada) consumo += 0.9;
    if (luzDireitaLigada) consumo += 0.9;
    if (cameraAberta) consumo += 1.0;

    energia = Math.max(0, energia - consumo);
    document.getElementById("energia").textContent = Math.ceil(energia) + "%";
    document.getElementById("barraEnergia").style.width = energia + "%";

    // Aviso para o jogador perceber que precisa economizar energia.
    const status = document.getElementById("status");
    if (energia <= 25 && energia > 0) {
        status.textContent = "BATERIA FRACA! Desligue os equipamentos que não estiver usando.";
        status.classList.add("alerta-energia");
    } else if (energia > 25) {
        status.textContent = "Tudo parece tranquilo...";
        status.classList.remove("alerta-energia");
    }

    if (energia <= 0) desligarSistemas();
}

function desligarSistemas() {
    portaEsquerdaFechada = false;
    portaDireitaFechada = false;
    luzEsquerdaLigada = false;
    luzDireitaLigada = false;
    cameraAberta = false;
    document.getElementById("painelCamera").classList.add("escondido");
    document.getElementById("corredorEsquerdo").classList.remove("iluminado");
    document.getElementById("corredorDireito").classList.remove("iluminado");
    document.getElementById("status").textContent = "";
    atualizarVisao();
    ["luzEsquerda", "luzDireita", "portaEsquerda", "portaDireita", "camera"].forEach(id => {
        document.getElementById(id).disabled = true;
    });
    setTimeout(() => perderJogo("Você ficou sem energia!"), 2500);
}

function atualizarRelogio() {
    if (jogoEncerrado) return;
    hora++;
    if (hora >= 6) {
        vencerJogo();
        return;
    }
    document.getElementById("relogio").textContent = hora + " AM";
}

function salvarPartida(pontuacao, vitoria) {
    if (partidaSalva) return;
    partidaSalva = true;
    fetch("php/salvar_partida.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nome: window.DADOS_JOGADOR.nome,
            nickname: window.DADOS_JOGADOR.nickname,
            pontuacao: pontuacao,
            vitoria: vitoria
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("statusSalvamento").textContent =
            data.sucesso ? `Partida salva! Você recebeu ${data.xp} XP (bônus: ${data.bonus}).` : data.mensagem;
    })
    .catch(() => {
        document.getElementById("statusSalvamento").textContent =
            "Não foi possível salvar. Verifique se o MySQL e o Apache estão ativos.";
    });
}

function mostrarResultado(vitoria, mensagem, pontuacao) {
    pararAudio(audioAmbiente);
    pararAudio(audioJumpscare);
    tocarAudio(audioMenu);
    document.getElementById("tituloResultado").textContent = vitoria ? "06 AM — VOCÊ SOBREVIVEU!" : "FIM DE JOGO";
    document.getElementById("mensagemResultado").textContent = mensagem;
    document.getElementById("pontuacaoFinal").textContent = pontuacao.toLocaleString("pt-BR");
    document.getElementById("resultado").classList.remove("escondido");
}

function finalizarPartida(vitoria, mensagem, atacante = null) {
    if (jogoEncerrado) return;
    jogoEncerrado = true;

    const pontuacao = Math.max(0, Math.round(segundos * 10 + energia + (vitoria ? 500 : 0)));
    document.getElementById("resultado").classList.add("escondido");
    pararAudio(audioAmbiente);
    pararAudio(audioMenu);
    salvarPartida(pontuacao, vitoria);

    if (!vitoria) {
        tocarAudio(audioJumpscare);
        // O jumpscare fica sozinho na tela; o resultado só aparece depois da animação.
        const jumpscare = document.getElementById("jumpscare");
        const imagemSusto = document.getElementById("imagemJumpscare");
        imagemSusto.src = atacante ? atacante.imagem : "assets/images/urso.png";
        imagemSusto.alt = atacante ? atacante.nome : "Animatrônico";
        jumpscare.classList.remove("escondido");
        setTimeout(() => {
            jumpscare.classList.add("escondido");
            mostrarResultado(false, mensagem, pontuacao);
        }, 1800);
    } else {
        mostrarResultado(true, mensagem, pontuacao);
    }
}

function vencerJogo() {
    finalizarPartida(true, "Você chegou às 06 AM e completou o turno!");
}

function perderJogo(mensagem, atacante = null) {
    finalizarPartida(false, mensagem, atacante);
}

atualizarVisao();
document.getElementById("nomeCamera").dataset.camera = "1";

setInterval(() => {
    if (!jogoEncerrado) segundos++;
}, 1000);
setInterval(atualizarRelogio, 20000);
setInterval(consumirEnergia, 3000);
animatronicos.forEach(agendarMovimento);
