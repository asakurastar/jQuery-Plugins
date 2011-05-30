/*
 * jQuery Plugin - Dragme
 *
 * Utilizado para criar Drag & Drop em elementos HTML
 * 
 * @version     1.0
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
 *   drop : '.drop', //Define os itens que permitem Drop (Podem ser os mesmos itens que realizam drag)
 *   onDragMove : function([MouseEvent]) {}, //Função callback que dispara quando um objeto está sendo arrastado (drag). O argumento opcional, retorna um Mouse Event
 *   onDropTouch : function([object]) {}, //Função callback que dispara quando um objeto que está sendo arrastado (drag) encosta em um objeto que permite drop. O argumento
 *   opcional retorna um objeto jQuery do objeto drop
 *   onDropRelease : function([object]) {}, //Função callback que dispara quando um objeto que está sendo arrastado (drag) é solto em cima de um objeto que permite drop. O argumento
 *   opcional retorna um objeto jQuery do objeto drop
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
                onDropRelease: function() {}
            };

            if (settings) {
                $.extend(config, settings);
            }

            var drag = undefined;
            var target = undefined;

            return this.each(function() {
                var $me = $(this);

                $me.bind('mousedown.dragdrop', function(e) {
                    $(this).removeData('drag');
                    $(this).css('z-index', 1);

                    $(this).data('drag', {
                        'X': e.pageX - $(this).offset().left,
                        'Y': e.pageY - $(this).offset().top
                    });

                    return false;
                });

                $(document).bind('mouseup.dragdrop', function() {
                    $me.each(function() {
                        $(this).removeData('drag');
                        $(this).css('z-index', 0);
                    });

                    drag = undefined;

                    if (target) {
                        config.onDropRelease(target);
                        target = undefined;
                    }

                    return false;
                });

                $(document).bind('mousemove.dragdrop', function(e) {
                    $me.each(function() {

                        if ($(this).data('drag')) {
                            drag = $(this);

                            $(this).css({
                                'position': 'absolute',
                                'left': e.pageX - $(this).data('drag').X,
                                'top': e.pageY - $(this).data('drag').Y
                            });

                            config.onDragMove(e);
                            target = undefined;

                            $(config.drop).each(function() {

                                if ((drag.offset().left > $(this).offset().left) && (drag.offset().left < ($(this).offset().left + $(this).width())) && (drag.offset().top > $(this).offset().top) && (drag.offset().top < ($(this).offset().top + $(this).height()))) {
                                    target = $(this);

                                    config.onDropTouch(target);
                                }
                            });

                            return false;
                        }
                    });
                });

            });
        }
    });
})(jQuery);