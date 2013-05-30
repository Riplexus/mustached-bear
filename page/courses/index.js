window.MS = window.MS || {};
window.MS.page = window.MS.page || {};

(function() {

    MS.page.courses = {

        /**
         *
         *
         * @param header
         * @param view
         */
        init: function(header, view) {

            header.find('.coursesSem').on('touchend', 'span', function() {
                var sem = $(this).html();
                view.removeClass('list'+view.attr('data-list'));
                view.attr('data-list', sem);
                view.addClass('list'+view.attr('data-list'), sem);
            });


            view.on('touchend', 'li', function() {
                if (MS.isMove) { return; }

                var self = $(this);
                if (self.hasClass('on')) {
                    self.removeClass('on').addClass('off');
                } else {
                    self.removeClass('off').addClass('on');
                }
            });
        },
        enter: function(header, view) {
            console.log('enter courses');
        },
        leave: function() {
            console.log('leave courses');
        }
    };

})();