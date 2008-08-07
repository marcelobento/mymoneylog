﻿/**
 * myMoneyLog translation messages
 * save as UTF-8 file format
 */
mlog.translation = {
centschar: ',',
thousandchar: '.',
'all': 'tudo',
'account': 'conta',
'accumulated': 'acumulado',
'add': 'adicionar',
'apply': 'aplicar',
'average': 'média',
'balance': 'saldo',
'category': 'categoria',
'category by month': 'categoria por mês',
'could not store the data': 'não foi possível gravar os dados',
'chart': 'gráfico',
'credit': 'crédito',
'credits by category': 'créditos por categoria',
'data editor': 'editor dados',
'data exported to file:': 'dados exportados para o arquivo:',
'datasample': '2000-01-01\t0,00\tvalor inicial\t\tconta\n2000-01-01\t0,00\tvalor inicial\t\tinvestimento\n2000-01-01\t0,00\tvalor inicial\t\tbolso\n2000-01-01\t0,00\tvalor inicial\t\tcartao credito\n2000-01-01\t0,00\tvalor inicial\talimentacao\n2000-01-01\t0,00\tvalor inicial\tbanco\n2000-01-01\t0,00\tvalor inicial\tcarro\n2000-01-01\t0,00\tvalor inicial\teducacao\n2000-01-01\t0,00\tvalor inicial\tcreditos\n2000-01-01\t0,00\tvalor inicial\tlazer e turismo\n2000-01-01\t0,00\tvalor inicial\tmercado\n2000-01-01\t0,00\tvalor inicial\tmoradia\n2000-01-01\t0,00\tvalor inicial\toutros\n2000-01-01\t0,00\tvalor inicial\tsaude e beleza\n2000-01-01\t0,00\tvalor inicial\ttransporte\n2000-01-01\t0,00\tvalor inicial\tvestuario\n2000-01-01\t0,00\tvalor inicial\timposto e taxa',
'date': 'data',
'debit': 'débito',
'description': 'descrição',
'due to': 'devido para',
'entries': 'lançamentos',
'per page': 'por página',
'entry': 'entrada',
'expenses by category': 'gastos por categoria',
'export': 'exportar',
'filter': 'filtrar',
'from': 'a partir de',
'from account': 'da conta',
'future entries': 'lançamentos futuros',
'help text': '<h1>Como usar</h1><h3>Contas e Categorias</h3>A medida que são inseridas ou removidas, elas entrarão automaticamente no sumário.<h3>Lançamento</h3><ul><li><span>Data: o formato da data é: ano-mês-dia, ano com 4 digitos, mês e dia com 2 digitos<br/>Exemplo (04 de janeiro de 2008): 2008-01-04</span></li><li><span>Valor: inclua o sinal negativo (-) para débitos, exemplo: -100,00</span></li><li><span>Descrição: utilize caracteres sem acentuação e evite caracteres especiais</span></li><li><span>Categoria e Conta: possuem suporte à auto-completar, digite a primeira letra e uma lista de opções aparecerá, ou pressione uma tecla de seta para mostrar a lista completa, <b>pressione a tecla ESC para esconder a lista</b>, se necessário</span></li><li><span>Múltiplas categorias: para adicionar mais de uma categoria, separe cada uma com "; " (ponto e vírgula + espaço).</span></li></ul><h3>Excluir e Editar</h3>Para excluir um lançamento, pressione o ícone <img src="images/delete.png"></img> do lançamento desejado.<br/>Note que o lançamento excluído será exibido nos campos de entrada de dados, se desejar desfazer a exclusão ou editar, apenas adicione o lançamento novamente.<h3>Lançamentos recorrentes</h3>Ao inserir um lançamento recorrente, digite todos os dados normalmente, somente especifíque no valor a quantidade de vezes que ocorrerá, exemplo:<br/>Prestação 600,00 de aluguel anual (12 vezes) com vencimento a partir do dia 2008-01-05<br/><code>data: 2008-01-05<br/>valor: -600*12<br/>descrição: aluguel<br/>categoria: moradia<br/>conta: conta corrente<br/></code><br/>Note o sinal asterisco <b>*</b> simbolizando vezes.<br/><br/>Outro exemplo seria a compra de um presente com o valor de 550,00 dividido em 10 vezes, no campo valor digite: -550/10<br/><code>data: 2008-01-10<br/>valor: -550/10<br/>descrição: meu presente<br/>categoria: presente<br/>conta: cartao credito<br/></code><br/>Serão realizados 10 lançamentos de -55,00 em todos os dias 10.<br/>Note que ocorrerá arredondamento do valor se necessário.<h3>Lançamentos reconciliáveis</h3>Para inserir um lançamento reconciliável digite um ponto de interrogação ao final data. Enquanto o lançamento não seja aceito pelo icone <img src="images/accept.png"></img> seu valor não será contabilizado e sua data, se vencida, será sempre a corrente.<code>data: 2008-01-01?</code><h3>Transferências</h3>Para realizar transferência de uma conta para a outra, deixe o campo categoria em branco (pressione a tecla ESC para esconder a lista, se necessário), ao selecionar a origem "da conta" surgirá um novo campo "para conta", digite a conta de origem e a de destino, ao adicionar, dois lançamentos ocorrerão automaticamente (débito e crédito).<h3>Editor de dados</h3>Utilize o editor de dados se preferir editar a fonte de dados em texto, algumas vezes é mais prático.<br/>Cada campo de dado é separado por um caractere de tabulação, por fim apenas pressione aplicar para salvar suas alterações, um arquivo de backup com a extensão "old" será criado com os dados anteriores.<h3>Pesquisa e Filtro</h3>Os lançamentos podem ser filtrados facilmente digitando no campo filtrar.<br/>Para realizar filtragens específicas, utilize a opção "expressão regular". <p>Exemplos:<br/>Filtrar lançamentos em "lazer" no mês de janeiro de 2008:</p><code>2008-01.+lazer</code>Filtrar lazer e presentes:<code>2008-01.+(lazer|presente)</code><h3>Exportação de dados</h3>Javascript não é uma boa solução para trabalhar com grande quantidade de dados, por isso é aconselhável trabalhar com no máximo +/-5000 lançamentos ou um ano. Para isto você pode, ao final/começo do ano (ou outro período), exportar os dados, copiar o diretório do myMoneylog para outro local e sobreescrever o arquivo "data.html" com o novo arquivo exportado. Deste modo você pode manter o histórico de cada período em diretórios diferentes.<h3>Habilitar gravação de dados</h3>Para habilitar o armazenamento dos dados nos navegadores Opera (Linux/Windows) ou Safari (Windows), é necessário possuir o suporte a java instalado no sistema e executar um script para habilitar seu uso pelo myMoneyLog.<br/>Para fazê-lo, dentro do diretório do myMoneyLog, abra o diretório "applets" e execute o script "config.bat" no Windows, ou "config.sh" sob Linux. Você precisará executar este script sempre que alterar o local de instalação.<br/><br/><br/>',
'help': 'ajuda',
'initial value': 'valor inicial',
'line (debit)': 'linha (débito)',
'line (credit)': 'linha (crédito)',
'line (total)': 'linha (total)',
'months': 'meses',
'no data': 'nenhum dado',
'of': 'de',
'option': 'opção',
'options': 'opções',
'overview': 'geral',
'overview chart': 'gráfico geral',
'page': 'página',
'regex': 'regex',
'regular expression': 'expressão regular',
'show last': 'mostrar últimos',
'show': 'mostrar',
'summary': 'saldos',
'text data source': 'texto fonte de dados',
'this total': 'este total',
'to account': 'para conta',
'total': 'total',
'until': 'até',
'value': 'valor'
};

/**
 * calendar-pt.js included from jscalendar
 */
// ** I18N

// Calendar pt_BR language
// Author: Adalberto Machado, <betosm@terra.com.br>
// Encoding: any
// Distributed under the same terms as the calendar itself.

// For translators: please use UTF-8 if possible. We strongly believe that
// Unicode is the answer to a real internationalized world. Also please
// include your contact information in the header, as can be seen above.

// full day names
Calendar._DN = new Array
("Domingo",
 "Segunda",
 "Terca",
 "Quarta",
 "Quinta",
 "Sexta",
 "Sabado",
 "Domingo");

// Please note that the following array of short day names (and the same goes
// for short month names, _SMN) isn't absolutely necessary. We give it here
// for exemplification on how one can customize the short day names, but if
// they are simply the first N letters of the full name you can simply say:
//
// Calendar._SDN_len = N; // short day name length
// Calendar._SMN_len = N; // short month name length
//
// If N = 3 then this is not needed either since we assume a value of 3 if not
// present, to be compatible with translation files that were written before
// this feature.

// short day names
Calendar._SDN = new Array
("Dom",
 "Seg",
 "Ter",
 "Qua",
 "Qui",
 "Sex",
 "Sab",
 "Dom");

// First day of the week. "0" means display Sunday first, "1" means display
// Monday first, etc.
Calendar._FD = 0;

// full month names
Calendar._MN = new Array
("Janeiro",
 "Fevereiro",
 "Marco",
 "Abril",
 "Maio",
 "Junho",
 "Julho",
 "Agosto",
 "Setembro",
 "Outubro",
 "Novembro",
 "Dezembro");

// short month names
Calendar._SMN = new Array
("Jan",
 "Fev",
 "Mar",
 "Abr",
 "Mai",
 "Jun",
 "Jul",
 "Ago",
 "Set",
 "Out",
 "Nov",
 "Dez");

// tooltips
Calendar._TT = {};
Calendar._TT["INFO"] = "Sobre o calendario";

Calendar._TT["ABOUT"] =
"DHTML Date/Time Selector\n" +
"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n" + // don't translate this this ;-)
"Ultima versao visite: http://www.dynarch.com/projects/calendar/\n" +
"Distribuido sobre GNU LGPL. Veja http://gnu.org/licenses/lgpl.html para detalhes." +
"\n\n" +
"Selecao de data:\n" +
"- Use os botoes \xab, \xbb para selecionar o ano\n" +
"- Use os botoes " + String.fromCharCode(0x2039) + ", " + String.fromCharCode(0x203a) + " para selecionar o mes\n" +
"- Segure o botao do mouse em qualquer um desses botoes para selecao rapida.";
Calendar._TT["ABOUT_TIME"] = "\n\n" +
"Selecao de hora:\n" +
"- Clique em qualquer parte da hora para incrementar\n" +
"- ou Shift-click para decrementar\n" +
"- ou clique e segure para selecao rapida.";

Calendar._TT["PREV_YEAR"] = "Ant. ano (segure para menu)";
Calendar._TT["PREV_MONTH"] = "Ant. mes (segure para menu)";
Calendar._TT["GO_TODAY"] = "Hoje";
Calendar._TT["NEXT_MONTH"] = "Prox. mes (segure para menu)";
Calendar._TT["NEXT_YEAR"] = "Prox. ano (segure para menu)";
Calendar._TT["SEL_DATE"] = "Selecione a data";
Calendar._TT["DRAG_TO_MOVE"] = "Arraste para mover";
Calendar._TT["PART_TODAY"] = " (hoje)";

// the following is to inform that "%s" is to be the first day of week
// %s will be replaced with the day name.
Calendar._TT["DAY_FIRST"] = "Mostre %s primeiro";

// This may be locale-dependent. It specifies the week-end days, as an array
// of comma-separated numbers. The numbers are from 0 to 6: 0 means Sunday, 1
// means Monday, etc.
Calendar._TT["WEEKEND"] = "0,6";

Calendar._TT["CLOSE"] = "Fechar";
Calendar._TT["TODAY"] = "Hoje";
Calendar._TT["TIME_PART"] = "(Shift-)Click ou arraste para mudar valor";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "%d/%m/%Y";
Calendar._TT["TT_DATE_FORMAT"] = "%a, %e %b";

Calendar._TT["WK"] = "sm";
Calendar._TT["TIME"] = "Hora:";
