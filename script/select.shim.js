window.MS = window.MS || {};
window.MS.shim = window.MS.shim || {};

(function() {

    MS.shim.select = {

        /**
         * The native select menu is not visible to the user. The current
         * value is shown behind that element in a separate container.
         * This function have to be called, to keep them synchronised.
         *
         * @param {Object} $lists
         * @param {number|String} desiredValue
         */
        showSelectItem: function showSelectItem($lists, desiredValue) {
            var target, $list;

            $lists.each(function(key, list) {
                $list = $(list);
                target = $list.find('option[value='+desiredValue+']');

                if (target.length === 0) {
                    target = $list.find('option').first();
                }

                if (target.length !== 0) {
                    target.attr('selected', true);
                    $list.parent().find('.selectContent').html(target.text());
                } else {
                    $list.parent().find('.selectContent').html('');
                }
            })
        },

    };

})();