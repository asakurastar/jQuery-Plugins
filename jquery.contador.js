/*
 * Em desenvolvimento
 */
(function($) {
	$.fn.extend({
		fiveContador: function(settings) {
			var config = {
				inicio: 0,
				fim: 60,
				cor: '#000088',
				delay: 1000,
				onStart: function() {},
				onUpdate: function() {},
				onComplete: function() {}
			};

			if (settings) {
				$.extend(config, settings);
			}

			var me = $(this);

			return this.each(function() {
				var methods = {
					timer: undefined,

					progresso: '<div style="width: 0px; height: ' + $(me).height() + 'px; background-color: ' + config.cor + ';" class="progresso"></div>',

					init: function() {
						$(me).html(methods.progresso);

						if (typeof(methods.timer) == "undefined") {
							config.onStart();
							
							methods.timer = setInterval(methods.updateProgresso, config.delay);
						}
					},

					updateProgresso: function() {
						percentual = parseInt((100 * config.inicio) / config.fim);

						if (config.inicio < config.fim + 1) {
							$(me).find('.progresso').css('width', percentual + '%');
							config.inicio++;

							value = percentual;
							config.onUpdate(value);
						}
						else {
							if (typeof(methods.timer) != "undefined") {
								clearInterval(methods.timer);
								config.onComplete();
							}
						}
					}
				};

				methods.init();
			});
		}
	});
})(jQuery);