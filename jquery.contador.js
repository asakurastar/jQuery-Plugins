/*
 * jQuery Plugin - Contador
 * 
 * @version     2.0
 * @description 
 * 
 * Estrutura HTML de Exemplo:
 *
 * O elemento principal precisa ter dimensão definida
 *
 * <style type="text/css">
 * .barra { width: 500px; height: 20px; }  
 * </style>
 *
 * <div class="barra"></div>
 *
 * Forma de uso:
 * 
 * $('.barra').fiveContador({
 *    inicio: 0, //Contador inicial
 *    fim: 60, //Tempo em segundos até encerrar o contador
 *    cor: '#000088', //Cor da barra de progresso
 *    delay: 1000, //Delay em milisegundos da atualização do contador
 *    onStart: function() {}, //Função callback a ser disparada antes do contador ser iniciado
 *    onUpdate: function([value]) {}, //Função callback a ser disparada a cada progresso do contador. O argumento opcional value retorna o percentual do progrsso
 *    onComplete: function() {}, //Função callback a ser disparada após o término do contador
 * });
 * 
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

            var me = this;

            return this.each(function() {
                var methods = {

                    progresso: '<div style="width: 0px; height: ' + $(me).height() + 'px; background-color: ' + config.cor + ';" class="progresso"></div>',

                    init: function() {
                        $(me).html(methods.progresso);

                        config.onStart();
						
                        methods.updateProgresso();
                    },

                    updateProgresso: function() {
                        $(me).find('.progresso').animate({ 'width': '100%' }, {
                            duration: config.delay * config.fim,
							
                            easing: 'linear', 
							
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