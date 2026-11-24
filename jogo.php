<?php
$nome = trim($_GET['nome'] ?? '');
$nickname = trim($_GET['nickname'] ?? '');

if (strlen($nome) < 2 || strlen($nome) > 60 || strlen($nickname) < 3 || strlen($nickname) > 20) {
    header('Location: index.php?erro=' . urlencode('O nickname deve ter entre 3 e 20 caracteres.'));
    exit;
}

// Padroniza o nickname; a saída HTML é escapada no próprio template.
$nicknamePadronizado = strtoupper(str_replace(' ', '_', $nickname));
$nicknameSeguro = htmlspecialchars($nicknamePadronizado, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Night Guard - Escritório</title>
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
<div class="game">
    <header>
        <span>GUARDA: @<?= $nicknameSeguro ?></span>
        <span id="relogio">12 AM</span>
        <span>NOITE 1</span>
    </header>

    <main class="escritorio">
        <div class="corredor esquerdo" id="corredorEsquerdo">
            <h2>CORREDOR ESQUERDO</h2>
            <div id="visaoEsquerda" class="visao"><span>...</span></div>
            <button id="luzEsquerda">ACENDER LUZ</button>
            <button id="portaEsquerda">FECHAR PORTA</button>
        </div>

        <div class="centro">
            <h1>ESCRITÓRIO</h1>
            <div class="mesa">
                <div class="ventilador">◉</div>
                <p>Turno de segurança</p>
                <span id="status">Tudo parece tranquilo...</span>
            </div>
        </div>

        <div class="corredor direito" id="corredorDireito">
            <h2>CORREDOR DIREITO</h2>
            <div id="visaoDireita" class="visao"><span>...</span></div>
            <button id="luzDireita">ACENDER LUZ</button>
            <button id="portaDireita">FECHAR PORTA</button>
        </div>
    </main>

    <section class="painel">
        <div class="energia">
            ENERGIA: <span id="energia">100%</span>
            <div class="barra"><div id="barraEnergia"></div></div>
        </div>
        <button id="camera">ABRIR CÂMERAS</button>
        <div id="painelCamera" class="camera escondido">
            <h2>MONITOR DE SEGURANÇA</h2>
            <div id="imagemCamera">
                <img id="fotoCamera" src="assets/images/palco.jpg" alt="Imagem da câmera">
                <div id="estatica"></div>
                <div id="nomeCamera">CAM 01 - PALCO PRINCIPAL</div>
            </div>
            <div class="botoesCamera">
                <button type="button" onclick="mudarCamera(1)">CAM 01</button>
                <button type="button" onclick="mudarCamera(2)">CAM 02</button>
                <button type="button" onclick="mudarCamera(3)">CAM 03</button>
                <button type="button" onclick="mudarCamera(4)">CAM 04</button>
                <button type="button" onclick="mudarCamera(5)">CAM 05</button>
            </div>
            <button id="fecharCamera">FECHAR MONITOR</button>
        </div>
    </section>

    <div id="jumpscare" class="escondido">
        <img id="imagemJumpscare" src="assets/images/urso.png" alt="Animatrônico">
        <h1>GAME OVER</h1>
    </div>

    <!-- Áudios do jogo: substitua os arquivos vazios pelos MP3 correspondentes. -->
    <audio id="audioAmbiente" src="assets/images/sounds/ambiente.mp3" loop preload="auto"></audio>
    <audio id="audioJumpscare" src="assets/images/sounds/jumpscare.mp3" preload="auto"></audio>
    <audio id="audioMenu" src="assets/images/sounds/menu.mp3" loop preload="auto"></audio>

    <section id="resultado" class="resultado escondido">
        <h1 id="tituloResultado">FIM DA NOITE</h1>
        <p id="mensagemResultado"></p>
        <p>Pontuação: <strong id="pontuacaoFinal">0</strong></p>
        <p id="statusSalvamento">Salvando resultado...</p>
        <a href="ranking.php">VER RANKING</a>
        <a href="index.php">VOLTAR AO MENU</a>
    </section>
</div>

<script>
window.DADOS_JOGADOR = {
    nome: <?= json_encode($nome, JSON_UNESCAPED_UNICODE) ?>,
    nickname: <?= json_encode($nicknamePadronizado, JSON_UNESCAPED_UNICODE) ?>
};
</script>
<script src="js/jogo.js"></script>
</body>
</html>
