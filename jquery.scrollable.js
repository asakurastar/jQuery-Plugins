/*
 * jQuery Plugin - Scrollable
 * 
 * @version     1.1
 * @description 
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="move">
 *   <ul>
 *     <li>Conteudo</li>
 *     <li>Outro Conteudo</li>
 *     <li>Mais Conteudo</li>
 *   </ul>
 * </div>
 *
 * <div>
 *   <div class="roll"></div>
 * </div> 
 *
 * Forma de uso:
 * 
 * $('.move').scrollable({
 *   items: 5, //Quantidade de itens a serem exibidos
 *   scroll: '.roll', //Elemento que ao ser arrastado, desloca os itens simulando uma barra de rolagem
 * });
 *
 * Regras:
 * As LI precisam possuir tamanho definido (Width e Height)
 *
 */

(function($) {
    $.fn.extend({
        scrollable: function(settings) {
            var config = {
                items: 5,
                scroll: '.roll'
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var $me = $(this);
                var $parent = $me.find('ul');
                var $items = $parent.find('li');
                var $scroll = $(config.scroll);
                var total;

                var methods = {

                    init: function() {
                        methods.normalize();
                        methods.start();
                    },

                    start: function() {
                        methods.doBind();
                    },

                    normalize: function() {
                        $me.css({
                            'overflow': 'hidden',
                            'position': 'relative',
                            'width': config.items * $items.eq(0).outerWidth(true)
                        });

                        $parent.css({
                            'width': $items.eq(0).outerWidth(true) * $items.size(),
                            'float': 'left'
                        });

                        $items.css('float', 'left');

                        $scroll.parent().css('width', $me.outerWidth(true));

                        total = ($parent.outerWidth(true) - $me.outerWidth(true)) / ($me.outerWidth(true) - $scroll.outerWidth(true));
                    },

                    doBind: function() {
                        $scroll.bind('mousedown.moveit', function(e) {
                            $(this).data('move', {
                                'start': $(this).parent().offset().left,
                                'end': $(this).parent().offset().left + $(this).parent().outerWidth(true) - $(this).outerWidth(true),
                                'X': e.pageX - $(this).offset().left,
                                'scroll': true
                            });

                            return false;
                        });

                        $(document).bind('mousemove.moveit', function(e) {
                            if ($scroll.data('move') && $scroll.data('move').scroll == true) {
                                var posicao = e.pageX - $scroll.data('move').X;

                                if (posicao < 0) {
                                    posicao = 0;
                                }
                                else if (posicao > $scroll.data('move').end - $scroll.data('move').start) {
                                    posicao = $scroll.data('move').end - $scroll.data('move').start;
                                }

                                $scroll.css('position', 'absolute');
                                $scroll.css('left', posicao);

                                $me.scrollLeft(posicao * total);
                            }

                            return false;
                        });

                        $(document).bind('mouseup.moveit', function() {
                            $scroll.data('move', {
                                scroll: false
                            });

                            return false;
                        });

                        $scroll.parent().bind('click.moveit', function(e) {
                            var posicao = e.pageX - parseInt($scroll.outerWidth(true) / 2);

                            if (posicao < 0) {
                                posicao = 0;
                            }

                            else if (posicao > $scroll.parent().outerWidth(true) - $scroll.outerWidth(true)) {
                                posicao = $scroll.parent().outerWidth(true) - $scroll.outerWidth(true);
                            }

                            $scroll.css('position', 'absolute');
                            $scroll.css('left', posicao);

                            $me.scrollLeft(posicao * total);

                        });
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);