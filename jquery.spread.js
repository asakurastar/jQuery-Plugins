/*
 * jQuery Plugin - Spread
 * 
 * @version     1.1
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="spread">
 *   <ul>
 *     <li>Conteúdo</li>
 *     <li>Outro conteúdo</li>
 *     <li>Mais conteúdo</li>
 *   </ul>
 * </div>
 *
 * Forma de uso:
 * 
 * $('.spread').spread({
 *   start: 0, //Define o item inicial aberto
 *   opened: 200, //Define a largura (em pixels) do item aberto
 *   closed: 50, //Define a largura (em pixels) dos itens fechado
 * });
 * 
 */
(function($) {
    $.fn.extend({
        spread: function(settings) {
            var config = {
                start: 0,
                opened: 200,
                closed: 50
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var $me = $(this);
                var $parent = $me.find('ul');
                var $items = $parent.find('li');
                var version = parseFloat($.fn.jquery);

                var methods = {
                    init: function() {
                        $items.css({
                            'width': config.closed,
                            'overflow': 'hidden',
                            'float': 'left'
                        });

                        $items.eq(config.start).css('width', config.opened);

                        methods.start();
                    },

                    start: function() {

                        $items.hoverIntent(function() {

                            //Compatibilidade
                            if (version <= 1.4) {
                                $items.animate({
                                    width: config.closed
                                }, {
                                    duration: 500,
                                    queue: false
                                });

                                $(this).animate({
                                    width: config.opened
                                }, {
                                    duration: 500,
                                    queue: false
                                });
                            }
                            else {
                                $(this).animate({
                                    width: config.opened
                                }, {
                                    duration: 500,
                                    queue: false
                                });

                                $items.animate({
                                    width: config.closed
                                }, {
                                    duration: 500,
                                    queue: false
                                });

                            }
                        }, function() {});
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);