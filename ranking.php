<?php
require_once __DIR__ . '/php/conexao.php';

$sql = 'SELECT nome_jogador, nickname, pontuacao, xp, data_partida
        FROM partidas
        ORDER BY pontuacao DESC, data_partida ASC
        LIMIT 10';
$partidas = $pdo->query($sql)->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Night Guard - Ranking</title>
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
    <main class="ranking">
        <h1>RANKING TOP 10</h1>
        <p>Os guardas que sobreviveram ao turno.</p>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Jogador</th>
                    <th>Codinome</th>
                    <th>Pontos</th>
                    <th>XP</th>
                    <th>Data da partida</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!$partidas): ?>
                    <tr>
                        <td colspan="6">Nenhuma partida registrada ainda.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($partidas as $indice => $partida): ?>
                        <tr>
                            <td><?= $indice + 1 ?></td>
                            <td><?= htmlspecialchars($partida['nome_jogador'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= htmlspecialchars($partida['nickname'], ENT_QUOTES, 'UTF-8') ?></td>
                            <td><?= number_format((int) $partida['pontuacao'], 0, ',', '.') ?></td>
                            <td><?= number_format((int) $partida['xp'], 0, ',', '.') ?></td>
                            <td><?= date('d/m/Y H:i', strtotime($partida['data_partida'])) ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        <a href="index.php">VOLTAR AO MENU</a>
    </main>
</body>
</html>
