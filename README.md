## 🧭 Especificação Completa da Linguagem (Sintaxe e Comandos)
Abaixo está a explicação detalhada de como cada um dos comandos e símbolos da **VARKZ** funciona nos bastidores, acompanhada de exemplos práticos de uso.
### 1. O Motor Principal e Símbolos Especiais
Estes são os comandos que controlam o fluxo, condições e atalhos rápidos do seu código.
 * ? [condição] ? \\n : [comando] \\n ! [comando] **(Condicional Flexível):** Avalia se uma comparação é verdadeira. Se for, executa o que está depois de :. Se for falsa, executa o que está depois de !. Funciona tanto em uma linha só quanto quebrado em várias linhas.
   * *Exemplo:*
     ```varkz
     ? x == 10 ?
     : show "É dez!"
     ! show "Não é dez!"
     
     ```
 * ~[min]:[max]~ > [variável] **(Randomizador):** Sorteia um número inteiro entre o valor mínimo e máximo e o injeta diretamente na variável escolhida.
   * *Exemplo:* ~1:100~ > numero_sorteado
 * ++ [variável] **(Incremento Rápido):** Pega o valor atual da variável, soma 1 e salva o resultado nela mesma.
   * *Exemplo:* ++ contador
 * -- [variável] **(Decremento Rápido):** Pega o valor atual da variável, subtrai 1 e salva o resultado nela mesma.
   * *Exemplo:* -- vidas
 * >> [variável] **(Entrada Rápida):** Abre uma caixa de texto (prompt) no navegador para o usuário digitar um valor, salvando-o na variável informada.
   * *Exemplo:* >> nome_usuario
 * , **(Separador de Comandos):** Permite que você execute múltiplos comandos na mesmíssima linha, processando-os da esquerda para a direita.
   * *Exemplo:* ++ x , show x , -- x
### 📝 2. Manipulação de Texto (Strings)
Comandos focados em transformar e analisar textos guardados em variáveis.
 * upper [variável]: Transforma todo o texto da variável em letras MAIÚSCULAS.
   * *Exemplo:* upper nome
 * lower [variável]: Transforma todo o texto da variável em letras minúsculas.
   * *Exemplo:* lower email
 * len [variável] > [alvo]: Conta quantos caracteres (letras, espaços e símbolos) o texto possui e guarda esse número na variável alvo.
   * *Exemplo:* len senha > tamanho
 * trim [variável]: Remove todos os espaços em branco inúteis do início e do fim do texto.
   * *Exemplo:* trim entrada_texto
 * rev [variável]: Inverte o texto completamente.
   * *Exemplo:* Se texto for "varkz", rev texto transforma em "zkrav".
 * replace [variável] [procurar] [substituir]: Procura por uma palavra específica dentro da variável e a troca por outra nova.
   * *Exemplo:* replace frase "JavaScript" "VARKZ"
 * concat [alvo] [texto1] [texto2] ...: Junta vários textos ou variáveis em uma única frase e salva na variável alvo.
   * *Exemplo:* concat saudacao "Olá, " nome_usuario "!"
 * split [variável] [separador] [array_alvo]: Corta um texto baseado em um separador (como um espaço ou traço) e gera uma lista de elementos.
   * *Exemplo:* split tags "," lista_de_tags
### 🧮 3. Matemática Avançada
Além das contas diretas de +, -, * e /, estes comandos trazem funções matemáticas complexas do JavaScript para o motor da VARKZ.
 * round [variável]: Arredonda um número com casas decimais para o inteiro mais próximo.
   * *Exemplo:* round preco
 * floor [variável]: Arredonda o número para baixo (remove as casas decimais).
   * *Exemplo:* floor media
 * ceil [variável]: Arredonda o número para cima.
   * *Exemplo:* ceil divisao
 * abs [variável]: Transforma números negativos em positivos (módulo).
   * *Exemplo:* abs saldo_negativo
 * pow [variável] [expoente]: Eleva o valor da variável à potência do expoente informado.
   * *Exemplo:* Se base é 2, pow base 3 resulta em 8 (2^3).
 * sqrt [variável]: Calcula a raiz quadrada do número contido na variável.
   * *Exemplo:* sqrt valor_area
 * min [alvo] [A] [B]: Compara dois valores (ou variáveis) e salva o menor deles na variável alvo.
   * *Exemplo:* min menor_preco valorA valorB
 * max [alvo] [A] [B]: Compara dois valores (ou variáveis) e salva o maior deles na variável alvo.
   * *Exemplo:* max maior_pontuacao pontuacao1 pontuacao2
### 🗂️ 4. Biblioteca de Arrays (Listas)
Como o interpretador salva tudo como texto, os Arrays na VARKZ são simulados por dados separados por vírgulas de forma automatizada.
 * arr.new [nome]: Cria uma lista nova e vazia.
   * *Exemplo:* arr.new inventario
 * arr.push [nome] [valor]: Adiciona um novo elemento no final da lista.
   * *Exemplo:* arr.push inventario "espada"
 * arr.get [nome] [índice] [alvo]: Pega o item de uma posição específica da lista (começando do 0) e joga em uma variável.
   * *Exemplo:* arr.get inventario 0 item_equipado
 * arr.size [nome] [alvo]: Conta quantos itens existem dentro da lista.
   * *Exemplo:* arr.size inventario total_itens
 * arr.pop [nome]: Remove o último elemento da lista.
   * *Exemplo:* arr.pop inventario
### 🌐 5. Interação com a Web e DOM HTML
Esses comandos permitem que o seu script manipule visualmente a página do seu navegador em tempo real.
 * web.redirect [url]: Redireciona o navegador do usuário para o site informado.
   * *Exemplo:* web.redirect "https://github.com"
 * web.alert [texto]: Dispara aquela janela de alerta nativa do navegador com uma mensagem.
   * *Exemplo:* web.alert "Operação concluída!"
 * dom.title [texto]: Altera o título da aba do navegador.
   * *Exemplo:* dom.title "Dashboard VARKZ"
 * dom.color [cor]: Altera a cor de fundo (background-color) da página (aceita nomes em inglês como red ou códigos hexadecimais como #000).
   * *Exemplo:* dom.color #121212
 * dom.write [html]: Injeta qualquer tag ou texto HTML diretamente no corpo do site, permitindo criar layouts dinâmicos pelo código.
   * *Exemplo:* dom.write "<p class='texto'>Texto dinâmico aqui</p>"
 * storage.set [chave] [variável]: Salva um dado permanentemente no navegador do usuário (LocalStorage), assim os dados não somem ao atualizar a página.
   * *Exemplo:* storage.set "usuario_logado" nome
 * storage.get [chave] [variável]: Recupera o dado que foi salvo anteriormente no navegador.
   * *Exemplo:* storage.get "usuario_logado" nome_salvo
### ⚙️ 6. Sistema e Conversões
Comandos utilitários para controle interno e checagem de tipos.
 * time(ms): Retorna o timestamp atual em milissegundos (ótimo para calcular intervalos de tempo).
   * *Exemplo:* time(ms) > tempo_inicio
 * sleep [ms]: Faz o script pausar/esperar pelo tempo informado em milissegundos antes de ir para a próxima linha.
   * *Exemplo:* sleep 2000 *(pausa por 2 segundos)*
 * env.lang [variável]: Detecta o idioma do sistema do usuário e salva na variável.
   * *Exemplo:* env.lang idioma_sistema
 * env.platform [variável]: Detecta informações do navegador/sistema operacional do usuário.
   * *Exemplo:* env.platform sistema_operacional
 * to.num [variável]: Garante e força que o valor da variável seja tratado puramente como um número.
   * *Exemplo:* to.num idade
 * to.str [variável]: Força o valor da variável a ser tratado como texto puro.
   * *Exemplo:* to.str codigo_id
 * is.nan [variável] [alvo]: Verifica se o conteúdo da variável NÃO é um número válido, retornando true ou false.
   * *Exemplo:* is.nan entrada_usuario resultado_checagem
 * vzk.version: Exibe a versão oficial do motor de desenvolvimento da linguagem no painel de output.
   * *Exemplo:* vzk.version
