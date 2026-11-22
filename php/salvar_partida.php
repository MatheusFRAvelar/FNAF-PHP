<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/conexao.php';

function responder($sucesso, $mensagem, $dados = []) {
    echo json_encode(array_merge(['sucesso' => $sucesso, 'mensagem' => $mensagem], $dados), JSON_UNESCAPED_UNICODE);
    exit;
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) responder(false, 'Dados da partida inválidos.');

$nickname = trim($entrada['nickname'] ?? '');
$pontuacao = filter_var($entrada['pontuacao'] ?? null, FILTER_VALIDATE_INT);
$vitoria = ($entrada['vitoria'] ?? false) === true;

if (strlen($nickname) < 3 || strlen($nickname) > 20) responder(false, 'O nickname deve ter entre 3 e 20 caracteres.');
if ($pontuacao === false || $pontuacao < 0 || $pontuacao > 100000) responder(false, 'Pontuação fora do limite permitido.');

$nickname = strtoupper(str_replace(' ', '_', $nickname));
$bonus = rand(5, 15);
$xp = (int) round(($pontuacao / 100) + $bonus);
if ($vitoria) $xp += 20;
$dataPartida = date('Y-m-d H:i:s');

try {
    $sql = 'INSERT INTO partidas (nickname, pontuacao, xp, data_partida)
            VALUES (:nickname, :pontuacao, :xp, :data_partida)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':nickname' => $nickname, ':pontuacao' => $pontuacao, ':xp' => $xp, ':data_partida' => $dataPartida]);
    responder(true, 'Partida salva com sucesso!', ['xp' => $xp, 'bonus' => $bonus, 'data' => $dataPartida]);
} catch (PDOException $e) {
    http_response_code(500);
    responder(false, 'Não foi possível salvar a partida no banco de dados.');
}
