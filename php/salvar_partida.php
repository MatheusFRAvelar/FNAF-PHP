<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/conexao.php';

function responder($sucesso, $mensagem, $dados = [])
{
    $resposta = array_merge(
        ['sucesso' => $sucesso, 'mensagem' => $mensagem],
        $dados
    );

    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

class Jogador
{
    public string $nome;
    public string $nickname;

    public function __construct(array $dados)
    {
        $this->nome = trim($dados['nome'] ?? '');
        $nickname = trim($dados['nickname'] ?? '');
        $this->nickname = strtoupper(str_replace(' ', '_', $nickname));
    }

    public function valido(): bool
    {
        $nomeValido = strlen($this->nome) >= 2 && strlen($this->nome) <= 60;
        $nicknameValido = strlen($this->nickname) >= 3
            && strlen($this->nickname) <= 20;

        return $nomeValido && $nicknameValido;
    }
}

class Pontuacao
{
    public int $valor;
    public bool $vitoria;
    public int $xp;

    public function __construct($valor, $vitoria)
    {
        $this->valor = (int) $valor;
        $this->vitoria = (bool) $vitoria;

        $bonusVitoria = $this->vitoria ? 20 : 0;
        $this->xp = (int) round($this->valor / 100) + rand(5, 15) + $bonusVitoria;
    }
}

class RepositorioPartidas
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function salvar(Jogador $jogador, Pontuacao $pontuacao): void
    {
        $sql = 'INSERT INTO partidas
                    (nome_jogador, nickname, pontuacao, xp, data_partida)
                VALUES
                    (:nome, :nickname, :pontos, :xp, :data)';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $jogador->nome,
            ':nickname' => $jogador->nickname,
            ':pontos' => $pontuacao->valor,
            ':xp' => $pontuacao->xp,
            ':data' => date('Y-m-d H:i:s'),
        ]);
    }
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(false, 'Dados da partida inválidos.');
}

$jogador = new Jogador($entrada);
$valor = filter_var($entrada['pontuacao'] ?? null, FILTER_VALIDATE_INT);

if (!$jogador->valido()) {
    responder(false, 'Informe nome (2 a 60) e nickname (3 a 20 caracteres).');
}

if ($valor === false || $valor < 0 || $valor > 100000) {
    responder(false, 'Pontuação fora do limite permitido.');
}

$vitoria = ($entrada['vitoria'] ?? false) === true;
$pontuacao = new Pontuacao($valor, $vitoria);

try {
    $repositorio = new RepositorioPartidas($pdo);
    $repositorio->salvar($jogador, $pontuacao);

    responder(true, 'Partida salva com sucesso!', ['xp' => $pontuacao->xp]);
} catch (PDOException $e) {
    http_response_code(500);
    responder(false, 'Não foi possível salvar a partida no banco de dados.');
}
