/*
 * jQuery Plugin - Slider
 * 
 * @version     2.2
 * @description 
 * 
 * Estrutura HTML de Exemplo:
 *
 * <div class="left"></div>
 * <div class="slider">
 *   <ul>
 *     <li>Conte�do</li>
 *     <li>Outro conte�do</li>
 *   </ul>
 * </div>
 * <div class="right"></div>
 *
 * Forma de uso:
 * 
 * $('.slider').slider({
 *  items: 5, //Quantidade de itens por bloco
 *  start: 0, //Imagem inicial
 *  left: '.left', //Navega��o para esquerda
 *  right: '.right', //Navega��o para direita
 *  duration: 'slow', //Delay da transi��o de blocos
 *  onChange: function() {}, //Callback que ser� disparado a cada mudan�a de bloco
 *  onClick: function( [object] ) {} //Callback que ser� disparado ao clicar em um item. O argumento opcional retorna o item em objeto jQuery
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
                var max = Math.ceil(items.size() / config.items)-1;
               
                var methods = {

                    init: function() {
                        methods.normalize();

                        $(config.left).click(methods.moveLeft);
                        $(config.right).click(methods.moveRight);
                        
                        methods.start();
                        methods.bindClick();
                    },

                    normalize: function() {
                        me.css("width", items.outerWidth(true) * config.items);
                        me.css("overflow", "hidden");
                        parent.css("width", items.outerWidth(true) * items.size());
                        items.css("float", "left");
                    },

                    moveLeft: function() {
                        if (step > 0) {
                            me.animate({
                                'scrollLeft' : (--step * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                    },

                    moveRight: function() {
                        if (step < max) {
                            me.animate({
                                'scrollLeft' : (++step * (items.outerWidth(true) * config.items))
                            }, config.duration, config.onChange);
                        }
                    },
                    
                    findStep: function(index) {
                        var item = Math.floor(index / config.items)-1;
                        return item;
                    },
                    
                    start: function() {
                        step = methods.findStep(config.start);
                        me.scrollLeft(++step * (items.outerWidth(true) * config.items));
                    },
                   
                    bindClick: function() {
                        items.click(function() { config.onClick($(this)); });
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);