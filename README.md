# Night Guard

Jogo web de sobrevivência noturna inspirado em jogos de vigilância. Desenvolvido em PHP, MySQL, HTML, CSS e JavaScript para a atividade de Desenvolvimento Web II.

## Requisitos

- PHP 7.4+ com PDO MySQL
- MySQL/MariaDB e Apache (XAMPP/LAMPP)
- Navegador moderno

## Instalação

1. Copie a pasta para `htdocs/FNAF-PHP`.
2. Inicie Apache e MySQL e importe `database/banco.sql` no phpMyAdmin.
3. Confira host, usuário e senha em `php/conexao.php`.
4. Abra `http://localhost/FNAF-PHP/`.

O SQL cria `jogoweb_db` e `partidas` com nome do jogador, nickname, pontuação, XP e data/hora. Em instalações com tabela antiga, faça backup e recrie a tabela para adotar o novo esquema.

## Jogo

Informe nome e codinome (nickname), monitore câmeras e corredores, administre portas, luzes e bateria. Sobreviva até 06 AM. Pontuação, XP e data são persistidos no banco; `ranking.php` apresenta o TOP 10.

## Classes e funções PHP

`php/salvar_partida.php` contém `Jogador` (validação e padronização), `Pontuacao` (XP e bônus de vitória) e `RepositorioPartidas` (persistência PDO). São usadas funções exigidas no enunciado, incluindo `strlen`, `str_replace`, `strtoupper`, `round`, `rand` e `date`. O ranking usa `htmlspecialchars` e `number_format`.

## Áudio

Arquivos em `assets/images/sounds/`: `menu.mp3` na tela inicial e no resultado; `ambiente.mp3` em loop durante a noite; `jumpscare.mp3` somente no ataque. A reprodução começa após interação do usuário devido às regras de autoplay dos navegadores. Volumes são configurados em `js/jogo.js` e `index.php`.

## Fontes e demonstração

- `index.php`, `jogo.php`, `ranking.php`: interface e páginas
- `php/`: conexão e processamento da partida
- `database/banco.sql`: estrutura do banco
- `js/jogo.js`, `css/estilo.css`: mecânica e apresentação
- `assets/images/`: imagens e áudios

A entrega acadêmica também pede vídeo narrado de 2 a 5 minutos demonstrando jogabilidade, persistência no MySQL e funções PHP. A apresentação em sala pode ser solicitada pelo docente.
