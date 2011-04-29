/*
 * jQuery Plugin - Slider
 * 
 * @version     3.4
 * @description 
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="left"></div>
 * <div class="slider">
 *   <ul>
 *     <li>Conteúdo</li>
 *     <li>Outro conteúdo</li>
 *   </ul>
 * </div>
 * <div class="right"></div>
 *
 * Forma de uso:
 * 
 * $('.slider').slider({
 *   items: 5, //Quantidade de itens por bloco
 *   start: 0, //Item inicial
 *   left: '.left', //Navegação para esquerda
 *   right: '.right', //Navegação para direita
 *   duration: 'slow', //Delay da transição de blocos
 *   mouseMove: true, //Permite ou não o deslocamento de blocos através de drag-drop pelo mouse
 *   onStart: function( [object] ) {}, //Callback que será disparada após o plugin ser inicializado. O argumento opcional retorna o item inicial em objeto jQuery
 *   onChange: function() {}, //Callback que será disparada a cada mudança de bloco
 *   onClick: function( [object] ) {} //Callback que será disparado ao clicar em um item. O argumento opcional retorna o item em objeto jQuery
 * });
 * 
 */
(function($) {
    $.fn.extend({
        slider: function(settings) {
            var config = {
                items: 5,
                start: 0,
                left: '.left',
                right: '.right',
                duration: 'slow',
                mouseMove: true,
                onStart: function() {},
                onChange: function() {},
                onClick: function() {}
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var me = $(this);
                var parent = me.find('ul');
                var items = parent.find('li');
                var step = 0;
                var max = Math.ceil(items.size() / config.items) - 1;
                var ct = 1;
                var item;

                var methods = {

                    init: function() {
                        methods.normalize();

                        $(config.left).click(methods.moveLeft);
                        $(config.right).click(methods.moveRight);

                        methods.bindClick();

                        if (config.mouseMove) {
                            methods.moveable();
                        }

                        methods.start();
                    },

                    normalize: function() {
                        me.css("width", items.outerWidth(true) * config.items);
                        me.css("overflow", "hidden");
                        parent.css("width", items.outerWidth(true) * items.size());
                        items.css("float", "left");
                    },

                    moveable: function() {
                        parent.mousedown(function(e) {
                            var inicio = e.pageX;

                            parent.mousemove(function(e) {
                                var posicao = e.pageX;

                                if (posicao < inicio) {
                                    methods.moveRight();
                                    $(this).unbind('mousemove');
                                }
                                else if (posicao > inicio) {
                                    methods.moveLeft();
                                    $(this).unbind('mousemove');
                                }
                            });

                        }).mouseup(function() {
                            $(this).unbind('mousemove');
                        });
                    },

                    moveLeft: function() {
                        if (step > 0) {
                            me.animate({
                                'scrollLeft': (--step * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                    },

                    moveRight: function() {
                        if (step < max) {
                            me.animate({
                                'scrollLeft': (++step * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                        else {
                            if (max > 0) {
                                ct++;
                                var clone = items.clone();
                                parent.css("width", items.outerWidth(true) * (items.size() * ct));
                                parent.append(clone);
                                max = Math.ceil((items.size() * ct) / config.items) - 1;

                                me.animate({
                                    'scrollLeft': (++step * (items.outerWidth(true) * config.items))
                                }, config.duration, config.onChange);
                            }
                        }
                    },

                    findStep: function(index) {
                        var find = Math.floor(index / config.items) - 1;
                        return find;
                    },

                    start: function() {
                        item = config.start;

                        step = methods.findStep(config.start);
                        me.scrollLeft(++step * (items.outerWidth(true) * config.items));

                        config.onStart(items.eq(config.start));
                    },

                    bindClick: function() {
                        parent.unbind('mousemove');

                        items.live('click', function() {
                            item = $(this).index();
                            config.onClick($(this));
                        });
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);