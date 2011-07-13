/*!
 * jQuery Plugin - Scroll
 * 
 * @version     1.3
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
 * $(window).load(function() { //PRECISA ser dentro de $(window).load(callback);
 *   $('.scroll').scroll({
 *     top : '.scrollTop', //Elemento que representa a barra de rolagem vertical
 *     left : '.scrollLeft //Elemento que representa a barra de rolagem horizontal
 *   });
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
 * 1.3 Correções para cálculo de scrollHeight
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
  $(window).load(function(){
	  (function(d) {
		function b(a) {
			var c = [].slice.call(arguments, 1),
				b = 0,
				a = d.event.fix(a || window.event);
			a.type = "mousewheel";
			a.wheelDelta && (b = a.wheelDelta / 120);
			a.detail && (b = -a.detail / 3);
			c.unshift(a, b);
			return d.event.handle.apply(this, c)
		}
		var c = ["DOMMouseScroll", "mousewheel"];
		d.event.special.mousewheel = {
			setup: function() {
				if (this.addEventListener) for (var a = c.length; a;) this.addEventListener(c[--a], b, !1);
				else this.onmousewheel = b
			},
			teardown: function() {
				if (this.removeEventListener) for (var a = c.length; a;) this.removeEventListener(c[--a], b, !1);
				else this.onmousewheel = null
			}
		};
		d.fn.extend({
			mousewheel: function(a) {
				return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
			},
			unmousewheel: function(a) {
				return this.unbind("mousewheel", a)
			}
		})
	})(jQuery);

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

					var methods = {
						start: function() {
							if ($me.height() < me.scrollHeight && $me.width() < me.scrollWidth) {
								methods.normalize();
								methods.bind();
							}
						},
						normalize: function() {
							var size = {};

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

							$(config.top).css('height', size.Y);
							$(config.left).css('width', size.X);

						},

						bind: function() {
							$(config.top).bind('mousedown.scroll', function(e) {
								$(this).data('scroll', {
									start: 0,
									Y: e.pageY - $(this).position().top
								});

								curr = 1;

								return false;
							});

							$(config.left).bind('mousedown.scroll', function(e) {
								$(this).data('scroll', {
									start: 0,
									X: e.pageX - $(this).position().left
								});

								curr = 0;

								return false;
							});

							$(document).bind('mousemove.scroll', function(e) {
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
								return false;
							});

							$me.bind('mousewheel.scroll', function(event, delta) {
								$(this).scrollTop($(this).scrollTop() - delta * 10);

								$(config.top).css({
									position: 'absolute',
									top: $(this).scrollTop() / step.Y
								});

								return false;
							});

							$(document).bind('mouseup.scroll', function() {
								$(config.top).removeData('scroll');
								$(config.left).removeData('scroll');

								curr = undefined;
							});
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
});