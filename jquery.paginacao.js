/*
 * jQuery Plugin - Pagina��o
 * 
 *
 * @version     1.5
 * @description Plugin utilizado para criar um sistema de pagina��o din�mico
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="paginacao">
 *   <ul>
 *     <li>Conte�do.........</li>
 *     <li>Outro conte�do...</li>
 *   </ul>
 * </div>
 *
 * <div class="paginas"></div>
 *
 * OBS 1: Utilizar sempre a hierarquia UL > LI
 * OBS 2: A DIV de classe "paginas" � opcional, sua declara��o � obrigat�ria apenas quando deseja-se exibir a numera��o de p�ginas, conforme explicado mais abaixo.
 * OBS 3: As classes "paginacao" e "paginas" possuem estes nomes apenas para fins de exemplos.
 *
 * Formas de uso:
 *
 * $('.paginacao').fivePaginacao(); //Declara��o padr�o, ser� utilizado as propriedades descritas abaixo
 *
 * $('.paginacao').fivePaginacao({
 *   quantidade : 5, //Quantidade de informa��es/registros por p�gina. Padr�o: 5
 *   inicio : 1, //P�gina a ser exibida inicialmente. Padr�o: 1 
 *   exibir : true, //Exibe ou n�o inicialmente a numera��o de p�ginas. Padr�o: true
 *   paginas : '.paginas', //Elemento a receber a numera��o de p�ginas. Padr�o: classe .paginas
 *   onLoad : fnction([index]) { ... } //Uma fun��o callback que ser� executada ao carregar o plugin. O argumento opcional index retorna a p�gina inicial
 *   beforeShow : function([index]) { ... } //Uma fun��o callback que ser� executada antes da mudan�a de uma p�gina. O argumento opcional index retorna o n�mero da p�gina atual
 *   afterShow : function(index) { ... } //Uma fun��o callback que ser� executada ap�s a mudan�a de uma p�gina. O argumento opcional index retorna o n�mero da nova p�gina
 * }); 
 *
 * Propriedades P�blicas
 * 
 * objeto.items; //Retorna uma cole��o de objetos que representam um item. Ex: objeto.items.eq(0).html(); //Retorna o conte�do do primeiro item
 * 
 * M�todos Auxiliares:
 *
 * objeto.exibirPagina(inteiro); //Muda para a p�gina passada como argumento
 * objeto.exibirPaginacao(); //Exibe a numera��o de p�ginas (Ao clicar em uma numera��o, a p�gina ser� alterada)
 * objeto.paginaAtual(); //Retorna o n�mero da p�gina atual
 * objeto.onLoad(callback([index])); //Executa uma fun��o callback ao carregar o plugin. O argumento opcional index da callback retorna a p�gina inicial
 * objeto.beforeShow(callback([index])); //Executa uma fun��o callback que ser� executada antes da mudan�a de uma p�gina. O argumento opcional index da callback retorna o n�mero da p�gina
 * atual
 *
 * objeto.afterShow(callback([index])); //Executa uma fun��o callback que ser� executada ap�s a mudan�a de uma p�gina. O argumento opcional index da callback retorna o n�mero da nova 
 * p�gina
 */

(function($){
	$.fn.extend({
		fivePaginacao : function(settings) {
			var config = { 
				quantidade : 5, 
				inicio : 1, 
				exibir : true, 
				paginas : '.paginas',
				onLoad : function() {},
				beforeShow : function() {},
				afterShow : function() {}
			};

			var objeto = this;

			if (settings) { $.extend(config, settings); }

			var paginacao = {
				atual : config.inicio,

				init : function() { 
					objeto.css("overflow", "hidden");

					var index = this.atual;
					var intervalo = parseInt((config.quantidade * config.inicio) - config.quantidade);

					objeto.find('ul > li').each(function() { $(this).css("display", "none"); });
					objeto.find('ul > li').slice(intervalo, intervalo + config.quantidade).css("display", "block");

					if (config.exibir) { this.exibirPaginacao(); }

					config.onLoad(index);
				},

				exibirPagina : function(pagina) {
					this.atual = pagina;

					var index = pagina;
					var intervalo = parseInt((config.quantidade * pagina) - config.quantidade);

					config.beforeShow(this.atual);

					objeto.find('ul').fadeOut("slow", function() {
						objeto.find('ul > li').each(function() { $(this).css("display", "none"); });
						objeto.find('ul > li').slice(intervalo, intervalo + config.quantidade).css("display", "block");
					});
					
					objeto.find('ul').fadeIn("slow", function() { config.afterShow(index) });
				},

				exibirPaginacao : function() {
					var quantidade = Math.ceil(objeto.find('ul > li').size() / config.quantidade);
					var outer = '<ul>';

					for (i = 0; i < quantidade; i++) { outer += '<li><p>'+(i+1)+'<\/p><\/li>'; }
					outer += '<\/ul>';
					$(config.paginas).html(outer);

					this.bindClick();
				},

				paginaAtual : function() { return this.atual; },

				items : objeto.find('ul > li'), 

				bindClick : function() {
					$(config.paginas).find('ul > li').each(function(index) { 
						$(this).click(function() { paginacao.exibirPagina((index+1)); }); 
					});
				},

				onLoad : function(callback) { config.onLoad = callback; paginacao.init(); return this; },
				beforeShow : function(callback) { config.beforeShow = callback; return this; },
				afterShow : function(callback) { config.afterShow = callback; return this; }
			};

			paginacao.init();
			
			return paginacao;
		}
	});
})(jQuery);