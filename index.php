<?php
$erro = trim($_GET['erro'] ?? '');
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#080808"><title>Night Guard - Terror Noturno</title>
<link rel="stylesheet" href="css/estilo.css">
</head>
<body><main class="menu">
<h1>NIGHT GUARD</h1><p>O turno começa à meia-noite...</p>
<?php if ($erro !== ''): ?><p class="erro" role="alert"><?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
<form action="jogo.php" method="GET">
<label for="nome">Nome do jogador</label>
<input id="nome" type="text" name="nome" placeholder="Seu nome" minlength="2" maxlength="60" autocomplete="name" required>
<label for="nickname">Codinome (nickname)</label>
<input id="nickname" type="text" name="nickname" placeholder="Digite seu nickname" minlength="3" maxlength="20" autocomplete="nickname" required>
<button type="submit">INICIAR NOITE</button>
</form><a href="ranking.php">VER RANKING TOP 10</a>
<audio id="audioMenu" src="assets/images/sounds/menu.mp3" loop preload="auto"></audio>
<script>const menuAudio=document.getElementById("audioMenu");menuAudio.volume=.2;document.addEventListener("pointerdown",()=>menuAudio.play().catch(()=>{}),{once:true});document.addEventListener("keydown",()=>menuAudio.play().catch(()=>{}),{once:true});</script>
</main></body></html>
