# Night Guard

Jogo de terror e sobrevivência para navegador, desenvolvido em PHP, MySQL, HTML, CSS e JavaScript. Inspirado nas mecânicas clássicas de vigilância noturna: monitorar câmeras, administrar energia e impedir que os animatrônicos alcancem o escritório.

## Requisitos
- PHP 7.4+ com extensão PDO MySQL
- MySQL ou MariaDB
- Apache (por exemplo, XAMPP)
- Navegador moderno

## Como executar
1. Copie a pasta para o diretório público do Apache (por exemplo, `htdocs/night-guard`).
2. Inicie Apache e MySQL.
3. Importe `database/banco.sql` pelo phpMyAdmin ou cliente MySQL. O script cria `jogoweb_db` e a tabela `partidas`.
4. Se você já tinha importado a versão anterior do banco, remova a coluna antiga com `ALTER TABLE partidas DROP COLUMN nome_jogador;` (faça backup antes, se houver dados importantes). Em seguida, confira as credenciais em `php/conexao.php`. A configuração inicial usa `localhost`, usuário `root` e senha vazia (padrão comum em instalações locais do XAMPP).
5. Acesse `http://localhost/night-guard/`.

Ajuste host, usuário, senha e banco em `php/conexao.php` conforme seu ambiente. Não publique credenciais reais.

## Como jogar
- Informe somente um nickname (3 a 20 caracteres).
- Use **ACENDER/APAGAR LUZ** para verificar cada corredor.
- Use **FECHAR/ABRIR PORTA** para bloquear a passagem de um animatrônico.
- Abra o monitor e alterne entre as cinco câmeras.
- Gerencie a bateria: portas, luzes e câmeras aumentam o consumo.
- Sobreviva até as 06 AM. Se um animatrônico entrar ou a energia acabar, ocorre o jumpscare e a partida termina.
- A pontuação e o XP são enviados ao PHP e registrados no MySQL. O ranking exibe os dez melhores resultados.

## Mecânicas
| Recurso | Funcionamento |
| --- | --- |
| Portas | Uma porta fechada bloqueia o animatrônico do respectivo lado |
| Luzes | Revelam se há animatrônico no corredor |
| Câmeras | Mostram palco, corredores e salas intermediárias |
| Energia | Diminui continuamente; sistemas ativos aumentam o consumo |
| Animatrônicos | Movem-se independentemente e ficam mais agressivos conforme a noite avança |
| Vitória | Alcançar 06 AM |
| Derrota | Invasão do escritório ou bateria zerada |

## Estrutura
- `index.php`: menu e entrada do nickname
- `jogo.php`: tela do jogo
- `ranking.php`: ranking TOP 10
- `php/conexao.php`: conexão PDO
- `php/salvar_partida.php`: validação, cálculo de XP e persistência
- `database/banco.sql`: criação do banco e tabela
- `js/jogo.js`: estado, animatrônicos, controles e pontuação
- `css/estilo.css`: interface e responsividade
- `assets/images/`: cenários, personagens e efeitos

## PHP e atividade acadêmica
O processamento acontece em `php/salvar_partida.php`: o servidor valida o nickname e a pontuação, calcula XP e grava o resultado com consulta preparada PDO.

Funções PHP da lista da atividade:
- `strlen()`: valida o tamanho do nickname.
- `str_replace()` e `strtoupper()`: padronizam espaços e letras.
- `rand()`: gera bônus aleatório de XP.
- `round()`: arredonda o XP.
- `date()`: registra data e hora.
- `htmlspecialchars()`: escapa texto antes de exibi-lo em HTML.
- `number_format()`: formata pontuação e XP no ranking.

O enunciado original prevê nome e codinome/nickname. Por decisão do projeto, o jogador é identificado somente pelo nickname; a coluna de nome foi removida da tabela e das telas.

A pontuação é calculada no JavaScript com base no tempo sobrevivido, energia restante e bônus de vitória. O PHP valida o valor recebido e calcula XP com bônus aleatório de 5 a 15; vencer concede mais 20 XP. A pontuação enviada pelo navegador não é uma prova antifraude de resultado.

## Observação sobre áudio
Os arquivos `assets/images/sounds/jumpscare.mp3` e `assets/images/sounds/ambiente.mp3` estão vazios na versão recebida. O jogo possui a tela visual de jumpscare, mas esses arquivos precisam ser substituídos por áudios válidos para reproduzir efeitos sonoros.

## Checklist de entrega
- [x] Interface HTML/CSS e mecânicas em JavaScript
- [x] Processamento de partida em PHP
- [x] Uso de pelo menos três funções PHP da lista
- [x] Persistência MySQL e ranking TOP 10
- [x] Identificação somente por nickname (adaptação do projeto)
- [ ] Testar importação do banco e fluxo completo no ambiente local
- [ ] Gravar vídeo narrado de 2 a 5 minutos demonstrando jogo, MySQL e funções PHP
- [ ] Preparar demonstração presencial

Projeto acadêmico da disciplina Desenvolvimento Web II — FATEC Mogi Mirim. Inspirado em jogos de vigilância e sobrevivência noturna; não é uma reprodução oficial de Five Nights at Freddy's.
