/*
 * jQuery Plugin - TipMe
 * 
 * @version     1.0
 * 
 * <div class="tips">
 *   <span rel="descrição">Lorem</span> ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. 
 *	 Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. <span rel="descrição">Donec quam felis</span>, ultricies nec, pellentesque eu, 
 *	 pretium quis, sem. Nulla consequat massa <span rel="descrição">quis</span> enim. Donec pede justo, fringilla vel, aliquet nec, <span rel="descrição">vulputate</span> eget, arcu. 
 *	 In enim justo, rhoncus ut, <span rel="descrição">imperdiet</span> a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. 
 *	 <span rel="descrição">Integer</span> tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. 
 *	 Aenean leo ligula, porttitor eu, <span rel="descrição">consequat</span>
 * </div>
 *
 * Forma de uso:
 * 
 * $('.tips').tipme();
 *
 * Todos os elementos com atributo rel="algum valor" possuirão tooltip, e, o texto do tooltip se refere ao conteúdo deste rel
 * É necessário incluir o arquivo jquery.tipme.css juntamente com este
 */
(function($) {
    $.fn.extend({
        tipme: function(settings) {
            return this.each(function() {
                var $me = $(this).find('[rel]');
                var limit;

                var template = '<div class="tipCont">';
                template += '  <div class="arrowDown"></div>';
                template += '  <span class="tip radius shadow"></span>';
                template += '</div>';

                var $template = $(template);

                var methods = {
                    init: function() {
                        methods.addTip();

                        limit = $('body').outerHeight(true);
                        methods.setPosition();

                        $(window).resize(function() {
                            limit = $('body').outerHeight(true);
                            methods.setPosition();
                        });

                    },

                    setPosition: function() {
                        $me.each(function() {
                            var $tip = $(this).next();
                            var width = $(this).outerWidth(true);
                            var height = $tip.find('.tip').outerHeight(true);
                            var left = $(this).offset().left;
                            var top = $(this).offset().top + $(this).outerHeight(true);

                            $tip.css({
                                'display': 'none',
                                'position': 'absolute',
                                'left': left,
                                'top': top,
                                'z-index': 1
                            });
                        });
                    },

                    addTip: function() {
                        $me.each(function() {
                            $(this).css('position', 'relative');
                            text = $(this).attr('rel');
                            $clone = $template.clone();
                            $clone.insertAfter($(this));
                            $clone.find('.tip').append(text);

                            var $tip = $(this).next();

                            $(this).bind('mouseover.tipme', function() {
                                $tip.fadeIn();
                                return false;
                            });

                            $(this).bind('mouseout.tipme', function() {
                                $tip.fadeOut();
                                return false;
                            });
                        });
                    }
                };
                methods.init();
            });
        }
    });
})(jQuery);