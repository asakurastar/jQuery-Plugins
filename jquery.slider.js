/*
 * jQuery Plugin - Slider
 * 
 * @version     3.8
 * @description Plugin utilizado para realizar animação "Slider". Permitindo criar diversos tipos de efeitos (Ex: Galeria de imagens)
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
 *   dir: 'h', //Define a direção do deslocamento (h = Horizontal (Default). Qualquer outro valor será considerado Vertical)
 *   duration: 'slow', //Delay da transição de blocos
 *   mouseMove: false, //Permite ou não o deslocamento de blocos através de drag-drop pelo mouse
 *   keyMove: false, //Permite ou não trocar de imagem pelo teclado (Não funciona no Google Chrome)
 *   onStart: function( [object] ) {}, //Callback que será disparada após o plugin ser inicializado. O argumento opcional retorna o item inicial em objeto jQuery
 *   onChange: function() {}, //Callback que será disparada a cada mudança de bloco
 *   onClick: function( [object] ) {}, //Callback que será disparada ao clicar em um item. O argumento opcional retorna o item em objeto jQuery
 *   slidePlay: '.play' //Define um elemento que, ao ser clicado irá iniciar / encerrar uma exibição em slideshow. A duração da transição é de 5 segundos
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
                dir: 'h',
                duration: 'slow',
                mouseMove: false,
                keyMove: false,
                onStart: function() {},
                onChange: function() {},
                onClick: function() {},
                slidePlay: '.play',
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var me = $(this);
                var parent = me.find('ul');
                var items = parent.find('li');
                var step = {
                    x: 0,
                    y: 0
                };
                var max = Math.ceil(items.size() / config.items) - 1;
                var ct = 1;
                var item;
                var show;

                var methods = {

                    init: function() {
                        methods.normalize();

                        if (config.dir == 'h') {
                            $(config.left).click(methods.moveLeft);
                            $(config.right).click(methods.moveRight);
                        }
                        else {
                            $(config.left).click(methods.moveUp);
                            $(config.right).click(methods.moveDown);
                        }

                        $(config.slidePlay).click(methods.slideShow);

                        methods.bindClick();

                        if (config.mouseMove) {
                            methods.moveable();
                        }

                        if (config.keyMove) {
                            methods.moveByKey();
                        }

                        methods.start();
                    },

                    normalize: function() {
                        me.css("overflow", "hidden");

                        if (config.dir == 'h') {
                            me.css("width", items.outerWidth(true) * config.items);
                            parent.css("width", items.outerWidth(true) * items.size());
                        }
                        else {
                            me.css("height", items.outerHeight(true) * config.items);
                            parent.css("height", items.outerHeight(true) * items.size());
                        }

                        items.css("float", "left");
                    },


                    slideShow: function() {
                        if (typeof(show) == 'undefined') {
                            show = setInterval(function() {

                                if (item % config.items == (config.items - 1)) {
                                    if (config.dir == 'h') {
                                        methods.moveRight();
                                    }
                                    else {
                                        methods.moveDown();
                                    }
                                }

                                items.eq(++item).trigger('click');
                            }, 5000);
                        }
                        else {
                            clearInterval(show);
                            show = undefined;
                        }
                    },

                    moveable: function() {
                        parent.mousedown(function(e) {
                            var inicio = (config.dir == 'h' ? e.pageX : e.pageY);

                            parent.mousemove(function(e) {
                                var posicao = (config.dir == 'h' ? e.pageX : e.pageY);

                                if (posicao < inicio) {
                                    if (config.dir == 'h') {
                                        methods.moveRight();
                                    }
                                    else {
                                        methods.moveDown();
                                    }

                                    $(this).unbind('mousemove');
                                }
                                else if (posicao > inicio) {
                                    if (config.dir == 'h') {
                                        methods.moveLeft();
                                    }
                                    else {
                                        methods.moveUp();
                                    }

                                    $(this).unbind('mousemove');
                                }
                            });

                        }).mouseup(function() {
                            $(this).unbind('mousemove');
                        });
                    },

                    moveByKey: function() {

                        me.bind('focusin', function() {
                            me.bind('keydown', function(e) {

                                switch (e.which) {
                                case 37:
                                    if (item % config.items == (config.items - 1)) {
                                        methods.moveLeft();
                                    }
									
                                    items.eq(--item).trigger('click');
                                    break;
                                case 39:
                                    if (item % config.items == (config.items - 1)) {
                                        methods.moveRight();
                                    }

                                    items.eq(++item).trigger('click');
                                    break;
                                }

                                e.preventDefault();
                            });

                        }).bind('focusout', function() {
                            me.unbind('keydown');
                        });
                    },

                    moveUp: function() {
                        if (step.y > 0) {
                            me.animate({
                                'scrollTop': (--step.y * (items.outerHeight(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                    },

                    moveLeft: function() {
                        if (step.x > 0) {
                            me.animate({
                                'scrollLeft': (--step.x * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                    },

                    moveRight: function() {
                        if (step.x < max) {
                            me.animate({
                                'scrollLeft': (++step.x * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                        else {
                            if (max > 0) {
                                ct++;
                                var clone = items.clone();
                                parent.css("width", items.outerWidth(true) * (items.size() * ct));
                                parent.append(clone);
                                max = Math.ceil((items.size() * ct) / config.items) - 1;
                                items = parent.find('li');

                                me.animate({
                                    'scrollLeft': (++step.x * (items.outerWidth(true) * config.items))
                                }, config.duration, config.onChange);
                            }
                        }
                    },

                    moveDown: function() {
                        if (step.y < max) {
                            me.animate({
                                'scrollTop': (++step.y * (items.outerHeight(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                        else {
                            if (max > 0) {
                                ct++;
                                var clone = items.clone();
                                parent.css("height", items.outerHeight(true) * (items.size() * ct));
                                parent.append(clone);
                                max = Math.ceil((items.size() * ct) / config.items) - 1;
                                items = parent.find('li');

                                me.animate({
                                    'scrollTop': (++step.y * (items.outerHeight(true) * config.items))
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

                        step.x = methods.findStep(config.start);
                        me.scrollLeft(++step.x * (items.outerWidth(true) * config.items));

                        config.onStart(items.eq(config.start));
						
                        parent.bind('mousedown', function(e) {
                            if (e.preventDefault) {
                                e.preventDefault();
                            }
                        });
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