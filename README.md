===========================================================================
🚀 VARKZ ENGINE — MANUAL DE DOCUMENTAÇÃO E EXPANSÃO
===========================================================================

A VARKZ Engine (v3.0.0 Stable) é um interpretador de scripts procedural de
alto desempenho baseado em JavaScript. Projetado para funcionar de forma 
desacoplada e altamente extensível, o motor permite a criação rápida de 
interfaces, execução de IA de jogos e renderização gráfica em tempo real.

---------------------------------------------------------------------------
📊 ESTATÍSTICAS GERAIS DO ECOSSISTEMA
---------------------------------------------------------------------------

Atualmente, somando todas as bibliotecas padrão, auxiliares e sintaxes 
especiais injetadas no ecossistema, o motor conta com:
* Comandos Totais Ativos: 365 Comandos
* Arquivos do Core: varkz.js (Interpretador) & index.html (IDE/Ambiente Visual)

---------------------------------------------------------------------------
🛠️ COMO ADICIONAR NOVOS COMANDOS (FLUXO DE TRABALHO)
---------------------------------------------------------------------------

O motor foi projetado com uma arquitetura modular que separa a Lógica de 
Execução da Camada Visual/Autocomplete. Quando você decidir criar mais 
100, 200 ou 500 comandos, basta seguir estes dois passos rápidos:

1. Injetar a Lógica no 'varkz.js'
Abra o seu varkz.js, vá até o objeto 'comandosCustomizados' no topo do script 
e insira sua nova função recebendo o array de 'tokens':

comandosCustomizados: {
    // Exemplo de nova inclusão
    "vzk.minhabiblioteca.comando": (tokens) => {
        // tokens[0] = o nome do comando ("vzk.minhabiblioteca.comando")
        // tokens[1] = o primeiro parâmetro passado pelo script .vzk
        return `[LOG]: Sucesso! Parâmetro recebido: ${tokens[1]}`;
    },
}

2. Habilitar no Autocomplete do 'index.html'
Para que a sua IDE e o Coloridor de Código flutuante reconheçam o novo comando 
digitado pelo usuário, abra o index.html e adicione a string exata dentro 
do array global:

const listaComandosRaw = [
    // ... comandos antigos ...
    "vzk.minhabiblioteca.comando"
];

---------------------------------------------------------------------------
🗺️ MAPA DE HISTÓRICO DE CARGA DO SISTEMA
---------------------------------------------------------------------------

* Carga Inicial 01 (Core) -> 100 Comandos
  Foco: Variáveis locais, strings básicas, operações e fluxo estrutural do núcleo.

* Carga Avançada 02 (Game) -> 100 Comandos
  Foco: game.*, gfx.*, buffers de renderização, áudio e colisões.

* Carga Avançada 03 (AI/Math) -> 100 Comandos
  Foco: vzk.ai.*, math.adv.*, pathfinding vetorial, lógica fuzzy e matrizes.

* Carga Utilitários 04 (Util) -> 25 Comandos
  Foco: vzk.util.*, shorthands e sintaxes curtas integradas (ex: ?a=a?).

* Carga Segurança 05 (Secure) -> 40 Comandos
  Foco: vzk.color.*, vzk.secure.* (Prevenção contra XSS e injeções).

===========================================================================
🔌 [ÁREA AJUSTÁVEL] NOVAS BIBLIOTECAS E CUSTOMIZAÇÕES CUSTOMIZADAS
===========================================================================

Utilize este espaço para documentar as próximas coleções de comandos que 
você ou sua equipe criarem para o motor. Siga a padronização para manter 
o projeto legível.

📁 Nova Biblioteca: [ Insira o Prefixo Aqui ]
* Status: [ Aguardando Implementação ]
* Quantidade de Instruções Planejadas: 0 / Desejado: 100
* Anotações Técnicas: Espaço reservado para comandos de conexão assíncrona, 
  Fetch API, sockets ou manipulação avançada de banco de dados local.

[EXEMPLO DE SINTAXE PARA HOMOLOGAÇÃO]:
# Use este bloco para testar trechos de código de novos comandos
# prefixo.comando "parametro_1" "parametro_2"

📋 TABELA DE REGISTRO RÁPIDO DE NOVAS FUNÇÕES
Adicione aqui os nomes de novos comandos criados na unha para manter o 
controle antes de jogar nas listas de código principais:

[ ] nome.do.novo.comando.1 — Descrição curta do que ele faz e retorna.
[ ] nome.do.novo.comando.2 — Descrição curta do que ele faz e retorna.
[ ] nome.do.novo.comando.3 — Descrição curta do que ele faz e retorna.
[ ] nome.do.novo.comando.4 — Descrição curta do que ele faz e retorna.

---------------------------------------------------------------------------
Manual de Versionamento da Engine — Desenvolvido para VARKZ Studio Corp.
===========================================================================
