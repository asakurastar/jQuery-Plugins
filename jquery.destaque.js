/*
 * jQuery Plugin - Destaque
 *
 * Utilizado para criar um efeito de destaque
 * 
 * @version     1.0
 * 
 * Estrutura HTML
 *
 * <ol class="destaque">
 *	  <!-- Botão Anterior -->
 *    <li><a class="previous" href="javascript:void(0);"></a></li>
 *	
 *	  <!-- Botão Próximo -->
 *    <li><a class="next" href="javascript:void(0);"></a></li>
 *
 *    <li>Conteudo</li>
 *    <li>Outro conteudo</li>
 *    <li>Mais conteudo</li>
 * </ol>
 *
 * <!-- Botões -->
 * <div class="contMarcador"></div>
 *
 * Forma de uso:
 * 
 * $('.destaque').destaque({
 *   start : 0, //Define o item inicial a ser exibido (Nota: Contagem de 0..N)
 *   btn: '.contMarcador', //Define o elemento que receberá os botões 
 *   next: '.next', //Define o elemento que será o botão "Anterior"
 *   prev: '.previous', //Define o elemento que será o botão "Próximo"
 *   curr: '.ativo', //Define uma classe para o elemento ativo
 *   show: 0, //Define um valor em milisegundos para os elementos se deslocarem automaticamente. Caso o valor seja 0, então será desconsiderado
 * });
 *
 */

(function($) {
    $.fn.extend({
        destaque: function(settings) {
            var config = {
                start: 0,
                btn: '.contMarcador',
                next: '.next',
                prev: '.previous',
                curr: '.ativo',
                show: 0
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var $me = $(this);
                var $items = $me.find('li:not(:has(' + config.next + ', ' + config.prev + '))');
                var $next = $(config.next);
                var $prev = $(config.prev);
                var $btn = $(config.btn);
                var item = config.start;
                var max = $items.size();

                var width = $items.eq(0).outerWidth(true);

                var methods = {
                    init: function() {
                        methods.normalize();
                        methods.bindClick();
                        methods.buildButtons();
                        methods.bindBtnClick();
                        methods.setActive();
                        methods.start();
                    },

                    normalize: function() {
                        $me.css('position', 'relative');

                        $items.css({
                            'position': 'absolute',
                            'top': 0,
                            'left': 0
                        });

                        $next.css('z-index', 1);
                        $prev.css('z-index', 1);
                    },

                    bindClick: function() {
                        $next.bind('click.destaque', methods.moveNext);
                        $prev.bind('click.destaque', methods.movePrev);
                    },

                    bindBtnClick: function() {
                        $btn.find('li').bind('click.destaque', function() {
                            methods.moveTo($(this).index());
                        });
                    },

                    buildButtons: function() {
                        var nav = '<ol>';
                        for (i = 0; i < max; i++) {
                            nav += '<li><a class="marcador" href="javascript:void(0);"></a></li>';
                        }
                        nav += '</ol>';

                        $btn.append(nav);
                    },

                    moveNext: function() {
                        if (item < max - 1) {
                            item++;

                            $items.eq(item).fadeIn('slow');
                            $items.eq(item - 1).fadeOut('slow');

                            methods.setActive();
                        }
                    },

                    movePrev: function() {
                        if (item != 0) {
                            item--;

                            $items.eq(item).fadeIn('slow')
                            $items.eq(item + 1).fadeOut('slow');

                            methods.setActive();
                        }
                    },

                    moveTo: function(index, duration) {
                        
                        if (duration) { duration = parseInt(duration / 2); }
                        else { duration = 'slow'; }
                        
                        $items.eq(index).fadeIn(duration)
                        $items.eq(item).fadeOut(duration);

                        item = index;
                        methods.setActive();
                    },

                    moveAuto: function() {
                        if (config.show > 0) {
                            setInterval(function() {
                                index = item+1;
                                
                                if (index >= max) {
                                    index = 0;
                                }
                                
                                methods.moveTo(index);
                                
                            }, config.show)
                        }
                    },

                    setActive: function() {
                        var clss = config.curr.replace('.', '');
                        $btn.find('li > a').removeClass(clss).eq(item).addClass(clss);
                    },

                    start: function() {
                        $items.hide();
                        $items.eq(item).show();

                        methods.moveAuto();
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);