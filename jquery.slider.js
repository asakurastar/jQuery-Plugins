/*
 * Em desenvolvimento
 */
(function($) {
    $.fn.extend({
        slider: function(settings) {
            var config = {
                items: 5,
                left: '.left',
                right: '.right',
				duration: 'slow',
                onChange: function() {}
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
                    }
                };

                methods.init();
            });
        }
    });
})(jQuery);