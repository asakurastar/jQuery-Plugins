/*
 * jQuery Plugin - Dragme
 *
 * Utilizado para criar Drag & Drop em elementos HTML
 * 
 * @version     1.2
 * 
 * Exemplos de estrutura HTML
 *
 * <!-- Blocos que realizam Drag -->
 * <div class="drag"></div>
 
 * <!-- Blocos que realizam Drop -->
 * <div class="drop"></div>
 *
 * <!-- Blocos que realizam Drag & Drop -->
 * <div class="drag drop"></div>
 *
 *
 * Forma de uso:
 * 
 * $('.drag').dragme({
 *   drop : '.drop', //Define os itens que permitem Drop
 *   onDragMove : function([MouseEvent]) {}, //Função callback que dispara quando um objeto está sendo arrastado (drag). O argumento opcional, retorna um Objeto Mouse Event
 *   onDropTouch : function([object]) {}, //Função callback que dispara quando um objeto que está sendo arrastado (drag) encosta em um objeto que permite drop. O argumento
 *   opcional retorna um objeto jQuery do objeto drop
 *   onDragRelease : function([MouseEvent]) {}, //Função callback que dispara quando um objeto que está sendo arrastado (drag) é solto, porém, não em cima de um objeto que permite drop.
 *   O argumento opcional retorna um objeto Mouse Event
 *   onDropRelease : function([object]) {}, //Função callback que dispara quando um objeto que está sendo arrastado (drag) é solto em cima de um objeto que permite drop. O argumento
 *   opcional retorna um objeto jQuery do objeto drop
 *   returnNoDrop : true //Indica se o elemento que permite drag deve retornar para sua posição de origem caso não tenha sido solto em cima de um objeto que permite drop.
 * });
 *
 */

(function($) {
    $.fn.extend({
        dragme: function(settings) {
            var config = {
                drop: '.drop',
                onDragMove: function() {},
                onDropTouch: function() {},
				onDragRelease: function() {},
                onDropRelease: function() {},
                returnNoDrop: true
            };

            if (settings) {
                $.extend(config, settings);
            }

            var drag = undefined;
            var target = undefined;

            return this.each(function() {
                var $me = $(this);

                $me.bind('mousedown.dragdrop', function(e) {
                    drag = $(this);
                    drag.data('drag', {
                        'X': e.pageX - drag.position().left,
                        'Y': e.pageY - drag.position().top
                    });

                    return false;
                });

                $(document).bind('mouseup.dragdrop', function(e) {
                    if (drag) {
                        if (target) {
                            config.onDropRelease(target);
                            target = undefined;
                        }
                        else {
							config.onDragRelease(e);
							
                            if (config.returnNoDrop) {
                                drag.fadeOut('fast', function() {
                                    $(this).css('position', 'static');
                                    $(this).fadeIn('fast');
                                });
                            }
                        }

                        drag.removeData('drag');
                        drag = undefined;

                        return false;
                    }
                });

                $(document).bind('mousemove.dragdrop', function(e) {
                    if (drag) {
                        drag.css({
                            'position': 'absolute',
                            'left': e.pageX - drag.data('drag').X,
                            'top': e.pageY - drag.data('drag').Y
                        });

                        target = undefined;

                        $(config.drop).each(function() {

                            if ((drag.offset().left > $(this).offset().left) && (drag.offset().left < ($(this).offset().left + $(this).width())) && (drag.offset().top > $(this).offset().top) && (drag.offset().top < ($(this).offset().top + $(this).height()))) {
                                target = $(this);
                                config.onDropTouch(target);
                            } else {
                                config.onDragMove(e);
                            }
                        });

                        return false;
                    }
                });
            });
        }
    });
})(jQuery);