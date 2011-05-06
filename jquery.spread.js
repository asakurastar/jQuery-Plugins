/*
 * jQuery Plugin - Spread
 * 
 * @version     1.3
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="spread">
 *   <ul>
 *     <li>Conteudo</li>
 *     <li>Outro conteudo</li>
 *     <li>Mais conteudo</li>
 *   </ul>
 * </div>
 *
 * Forma de uso:
 * 
 * $('.spread').spread({
 *   start: 0, //Define o item inicial aberto
 *   opened: 200, //Define a largura (em pixels) do item aberto
 *   closed: 50, //Define a largura (em pixels) dos itens fechado
 *   dir: 'h' //Define a direção de deslocamento (h = Horizontal ou v = Vertical)
 * });
 * 
 */
(function($) {
    $.fn.extend({
        spread: function(settings) {
            var config = {
                start: 0,
                opened: 200,
                closed: 50,
                dir: 'h'
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var $me = $(this);
                var $parent = $me.find('ul');
                var $items = $parent.find('li');
                var version = parseFloat($.fn.jquery);
                var direction = {
                    h: {
                        opened: {
                            width: config.opened
                        },
                        closed: {
                            width: config.closed
                        }
                    },
                    v: {
                        opened: {
                            height: config.opened
                        },
                        closed: {
                            height: config.closed
                        }
                    }
                };

                var methods = {
                    init: function() {
                        $items.css('overflow', 'hidden');

                        $items.css(direction[config.dir].closed);

                        if (config.dir == 'h') {
                            $items.css('float', 'left');
                        }

                        $items.eq(config.start).css(direction[config.dir].opened);

                        methods.start();
                    },

                    start: function() {

                        $items.hoverIntent(function() {

                            //Compatibilidade
                            if (version <= 1.4) {
                                $items.animate(direction[config.dir].closed, {
                                    duration: 500,
                                    queue: false
                                });

                                $(this).animate(direction[config.dir].opened, {
                                    duration: 500,
                                    queue: false
                                });
                            }
                            else {
                                $(this).animate(direction[config.dir].opened, {
                                    duration: 500,
                                    queue: false
                                });

                                $items.animate(direction[config.dir].closed, {
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