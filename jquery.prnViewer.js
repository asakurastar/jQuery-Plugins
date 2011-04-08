/*
 * jQuery Plugin - Prn Viewer
 * 
 * @version     2.0
 * @description 
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="imagens"></div>
 *
 * Forma de uso:
 * 
 * $('.imagens').prnViewer({
 * 		feeds : 'http://modafocalabs.com/moors/extension', //Feeds
 * 		time : 5000, //Tempo de transição entre as imagens
 * });
 * 
 */
 
(function($) {
	$.fn.extend({
		prnViewer: function(settings) {

			var config = {
				feeds: 'http://modafocalabs.com/moors/extension', //Url de Feeds
				time: 5000 //Tempo entre cada imagem
			};

			if (settings) {
				$.extend(config, settings);
			}

			//Retorno default de qualquer plugin jQuery
			return this.each(function() {
				var me = this; //Guarda a referência do objeto
				var total = 0; //Quantidade de imagens carregadas pelo Feed
				var atual; //Imagem selecionada a ser exibida

				/**
				 * Objeto de métodos do Plugin
				 */
				var methods = {

					/**
					 * Método para gerar um valor aleatório 
					 */
					rand: function(n) {
						return parseInt(Math.random() * (n - 1));
					},

					/**
					 * Método para selecionar uma imagem aleatória
					 */
					choose: function() {
						$(me).find('a').each(function() {
							$(this).hide();
						});

						return $(me).find('a').eq(methods.rand(total));
					},

					/**
					 * Método para exibir uma imagem selecionada
					 */
					toggleImage: function() {
						$(atual).fadeOut('slow', function() {
							atual = methods.choose();
							$(atual).fadeIn();
						});
					},
				  
					/**
					 * Método inicial
					 */
					init: function() {
						$.getScript(config.feeds, function() {
							if (typeof(tumblrs) != 'undefined') {
								feed = tumblrs[methods.rand(tumblrs.length)];
								$.getScript('http://' + feed + '.tumblr.com/api/read/json', function() {
									if (typeof(tumblr_api_read) != 'undefined') {
										for (i = 0; i < tumblr_api_read.posts.length; i++) {
											if (tumblr_api_read.posts[i]['photo-url-500']) {
												html = $("<a style='display: none; position: absolute; top: 0px; left: 0px;' href='" + tumblr_api_read.posts[i]['url'] + "' target='_blank'><img src='" + tumblr_api_read.posts[i]['photo-url-500'] + "' height='400' alt='" + tumblr_api_read.posts[i]['height'] + "' title='' \/><\/a>");
												$(me).append(html);
											}
										}

										total = $(me).find('a').size();
										atual = methods.choose();
										methods.toggleImage();

										if (typeof(timer) == 'undefined') { timer = setInterval(methods.toggleImage, config.time); }
									}
									else {
										//TODO: Tratar erro
									}
								});
							}
							else {
								//TODO: Tratar erro
							}
						});
					} 
				};
				
				methods.init();	
			});
		}
	});
})(jQuery);