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

                        config.onStart();
						
                        methods.updateProgresso();
                    },

                    updateProgresso: function() {
                        $(me).find('.progresso').animate({ 'width': '100%' }, {
                            duration: config.delay * config.fim,
							
                            step: function(now, fx) {
                                config.onUpdate(now.toFixed(2));
                            },
							
                            complete: function() {
                                config.onComplete();
                            }
                        });
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);