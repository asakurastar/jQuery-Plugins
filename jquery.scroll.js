/*!
 * jQuery Plugin - Scroll
 * 
 * @version     1.2
 * @description Plugin utilizado para criar barras de rolagem horizontal e/ou vertical. Inclui o plugin de Brandon Aaron para controle de mousewheel
 * @example http://jsfiddle.net/cuceta/mbLA9/
 * 
 * Estrutura HTML de Exemplo:
 *
 * <!-- Principal -->
 * <div class="scroll">
 *     <p>Conteudo...</li>
 * </div>
 *
 * <!-- Barra de rolagem vertical -->
 * <div class="scrollTop"></div>
 *
 * <!-- Barra de rolagem horizontal -->
 * <div class="scrollLeft"></div>
 *
 * Forma de uso:
 * 
 * $('.scroll').scroll({
 *   top : '.scrollTop', //Elemento que representa a barra de rolagem vertical
 *   left : '.scrollLeft //Elemento que representa a barra de rolagem horizontal
 * });
 *
 * Regras:
 * - Se as dimensões do conteúdo forem inferiores às do tamanho de seu elemento pai, não existirão barras de rolagem.
 * - O mousewheel permite controlar apenas a barra de rolagem vertical.
 *
 * Versão:
 * 1.0 Plugin liberado
 * 1.1 As setas do teclado permitem deslocar as barras de rolagem
 * 1.2 Correções para ajustes de controle de rolagem
 */

/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.3-pre
 * 
 * Requires: 1.2.2+
 */
(function(d){function b(a){var c=[].slice.call(arguments,1),b=0,a=d.event.fix(a||window.event);a.type="mousewheel";a.wheelDelta&&(b=a.wheelDelta/120);a.detail&&(b=-a.detail/3);c.unshift(a,b);return d.event.handle.apply(this,c)}var c=["DOMMouseScroll","mousewheel"];d.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=c.length;a;)this.addEventListener(c[--a],b,!1);else this.onmousewheel=b},teardown:function(){if(this.removeEventListener)for(var a=c.length;a;)this.removeEventListener(c[--a], b,!1);else this.onmousewheel=null}};d.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery); 

(function($) {
    $.fn.extend({
        scroll: function(settings) {
            var config = {
                top: '.scrollTop',
                left: '.scrollLeft'
            };

            if (settings) {
                $.extend(config, settings);
            }

            return this.each(function() {
                var me = this;
                var $me = $(me);
                var step = {
                    X: 1,
                    Y: 1
                };
                var size = {};

                var methods = {
                    start: function() {
                        methods.normalize();
                        methods.bind();
                    },
                    normalize: function() {
                        size.Y = $me.height() - (me.scrollHeight - $me.height());
                        size.X = $me.width() - (me.scrollWidth - $me.width());

                        if (size.Y < 0) {
                            size.Y = 18;
                            step.Y = (me.scrollHeight - $me.height()) / ($me.height() - size.Y)
                        }

                        if (size.X < 0) {
                            size.X = 18;
                            step.X = (me.scrollWidth - $me.width()) / ($me.width() - size.X)
                        }

                        if (methods.needVertical()) {
                            $(config.top).css('height', size.Y);
                        }
                        else {
                            $(config.top).css('display', 'none');
                        }
                        if (methods.needHorizontal()) {
                            $(config.left).css('width', size.X);
                        }
                        else {
                            $(config.left).css('display', 'none');
                        }

                        if (methods.needVertical() || methods.needHorizontal()) {
                            if (typeof $me.attr('tabindex') === 'undefined' || $me.attr('tabindex') === false) {
                                $me.attr('tabindex', 9999);
                            }
                        }
                    },

                    bind: function() {
                        if (methods.needVertical()) {
                            $(config.top).bind('mousedown.scroll', function(e) {
                                $(this).data('scroll', {
                                    start: 0,
                                    Y: e.pageY - $(this).position().top
                                });

                                return false;
                            });
                        }

                        if (methods.needHorizontal()) {
                            $(config.left).bind('mousedown.scroll', function(e) {
                                $(this).data('scroll', {
                                    start: 0,
                                    X: e.pageX - $(this).position().left
                                });

                                return false;
                            });
                        }

                        $(document).bind('mousemove.scroll', function(e) {
                            if (methods.needVertical()) {
                                if ($(config.top).data('scroll')) {
                                    var position = e.pageY - $(config.top).data('scroll').Y;

                                    if (position <= $(config.top).data('scroll').start) {
                                        position = $(config.top).data('scroll').start;
                                    }
                                    if (position >= (($me.height() - $(config.top).height()) + $(config.top).data('scroll').start)) {
                                        position = ($me.height() - $(config.top).height()) + $(config.top).data('scroll').start;
                                    }

                                    $(config.top).css({
                                        position: 'absolute',
                                        left: $(config.top).position().left,
                                        top: position
                                    });

                                    $me.scrollTop(position * step.Y);
                                }
                            }

                            if (methods.needHorizontal()) {
                                if ($(config.left).data('scroll')) {
                                    var position = e.pageX - $(config.left).data('scroll').X;

                                    if (position <= $(config.left).data('scroll').start) {
                                        position = $(config.left).data('scroll').start;
                                    }
                                    if (position >= (($me.width() - $(config.left).width()) + $(config.left).data('scroll').start)) {
                                        position = ($me.width() - $(config.left).width()) + $(config.left).data('scroll').start;
                                    }

                                    $(config.left).css({
                                        position: 'absolute',
                                        top: $(config.left).position().top,
                                        left: position
                                    });

                                    $me.scrollLeft(position * step.X);
                                }
                            }
                            return false;
                        });

                        if (methods.needVertical()) {
                            $me.bind('mousewheel.scroll', function(event, delta) {
                                $(this).scrollTop($(this).scrollTop() - delta * 10);

                                $(config.top).css({
                                    position: 'absolute',
                                    top: $(this).scrollTop() / step.Y
                                });

                                return false;
                            });
                        }

                        $me.bind('keydown.scroll', function(e) {
                            $(config.top).css('position', 'absolute');
                            $(config.left).css('position', 'absolute');

                            switch (e.which) {
                            case 37:
                                {
                                    if (methods.needHorizontal()) {
                                        $(this).scrollLeft($(this).scrollLeft() - 10);
                                        $(config.left).css('left', $(this).scrollLeft() / step.X);
                                    }
                                    break;
                                }
                            case 38:
                                {
                                    if (methods.needVertical()) {
                                        $(this).scrollTop($(this).scrollTop() - 10);
                                        $(config.top).css('top', $(this).scrollTop() / step.Y);
                                    }
                                    break;
                                }
                            case 39:
                                {
                                    if (methods.needHorizontal()) {
                                        $(this).scrollLeft($(this).scrollLeft() + 10);
                                        $(config.left).css('left', $(this).scrollLeft() / step.X);
                                    }
                                    break;
                                }
                            case 40:
                                {
                                    if (methods.needVertical()) {
                                        $(this).scrollTop($(this).scrollTop() + 10);
                                        $(config.top).css('top', $(this).scrollTop() / step.Y);
                                    }
                                    break;
                                }
                            }
                            return false;
                        });

                        $(document).bind('mouseup.scroll', function() {
                            if (methods.needVertical()) {
                                $(config.top).removeData('scroll');
                            }
                            if (methods.needHorizontal()) {
                                $(config.left).removeData('scroll');
                            }
                        });
                    },

                    needVertical: function() {
                        return ($me.height() < me.scrollHeight);
                    },

                    needHorizontal: function() {
                        return ($me.width() < me.scrollWidth);
                    },

                    init: function() {
                        methods.start();
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);