/*
 * jQuery Plugin - Paginação
 * 
 *
 * @version     1.5
 * @description Plugin utilizado para criar um sistema de paginação dinâmico
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="paginacao">
 *   <ul>
 *     <li>Conteúdo.........</li>
 *     <li>Outro conteúdo...</li>
 *   </ul>
 * </div>
 *
 * <div class="paginas"></div>
 *
 * OBS 1: Utilizar sempre a hierarquia UL > LI
 * OBS 2: A DIV de classe "paginas" é opcional, sua declaração é obrigatória apenas quando deseja-se exibir a numeração de páginas, conforme explicado mais abaixo.
 * OBS 3: As classes "paginacao" e "paginas" possuem estes nomes apenas para fins de exemplos.
 *
 * Formas de uso:
 *
 * $('.paginacao').fivePaginacao(); //Declaração padrão, será utilizado as propriedades descritas abaixo
 *
 * $('.paginacao').fivePaginacao({
 *   quantidade : 5, //Quantidade de informações/registros por página. Padrão: 5
 *   inicio : 1, //Página a ser exibida inicialmente. Padrão: 1 
 *   exibir : true, //Exibe ou não inicialmente a numeração de páginas. Padrão: true
 *   paginas : '.paginas', //Elemento a receber a numeração de páginas. Padrão: classe .paginas
 *   onLoad : fnction([index]) { ... } //Uma função callback que será executada ao carregar o plugin. O argumento opcional index retorna a página inicial
 *   beforeShow : function([index]) { ... } //Uma função callback que será executada antes da mudança de uma página. O argumento opcional index retorna o número da página atual
 *   afterShow : function(index) { ... } //Uma função callback que será executada após a mudança de uma página. O argumento opcional index retorna o número da nova página
 * }); 
 *
 * Propriedades Públicas
 * 
 * objeto.items; //Retorna uma coleção de objetos que representam um item. Ex: objeto.items.eq(0).html(); //Retorna o conteúdo do primeiro item
 * 
 * Métodos Auxiliares:
 *
 * objeto.exibirPagina(inteiro); //Muda para a página passada como argumento
 * objeto.exibirPaginacao(); //Exibe a numeração de páginas (Ao clicar em uma numeração, a página será alterada)
 * objeto.paginaAtual(); //Retorna o número da página atual
 * objeto.onLoad(callback([index])); //Executa uma função callback ao carregar o plugin. O argumento opcional index da callback retorna a página inicial
 * objeto.beforeShow(callback([index])); //Executa uma função callback que será executada antes da mudança de uma página. O argumento opcional index da callback retorna o número da página
 * atual
 *
 * objeto.afterShow(callback([index])); //Executa uma função callback que será executada após a mudança de uma página. O argumento opcional index da callback retorna o número da nova 
 * página
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