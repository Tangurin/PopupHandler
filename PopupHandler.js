(function () {
    'use strict';
    /*===========================
    PopupHandler
    ===========================*/
    var PopupHandler = {
        element: null,
        defaultOptions: {
            id: 'popupHandler',
            appendTo: 'body',
            extraClass: '',
            show: true,
            destroyOnClose: true,
            overlay: true,
            callbacks: {
                beforeVisible: null,
                afterVisible: null,
                beforeHidden: null,
                afterHidden: null,
            }
        },
        options: {},
        debug: false,
        create: function(content, customOptions) {
            var customOptions = customOptions || {};
            //Destroy existing popup before creating a new one
            PopupHandler.destroy(function() {
                var options = $.extend({}, PopupHandler.defaultOptions, customOptions);
                options.appendTo = PopupHandler.validateAppendTo(options.appendTo);
                //Set options
                PopupHandler.options = options;

                var html = '';
                html += '<div id="'+ options.id +'" class="popupHandler '+ options.extraClass +'" style="display: none;">';
                    html += '<div class="popupContent"></div>';
                    html += '<a class="closeBtn"><i class="fa"></i></a>';
                html += '</div>';

                //Store the empty popup holder element
                PopupHandler.element = $(html);

                //Add content to the popup
                PopupHandler.addContent(content);

                //Append the popup to the DOM
                options.appendTo.append(PopupHandler.element);

                //If the popup will be visible as default
                if (options.show) {
                    PopupHandler.show();
                }

                //If Overlay is closing
                OverlayHandler.onClose(function() {
                    PopupHandler.closeTriggered();
                });

                //If popup close button is triggered
                $('> .closeBtn', PopupHandler.element).on('click', PopupHandler.closeTriggered);
            });

            return PopupHandler;
        },
        destroy: function(callback) {
            if (PopupHandler.popupExists() === false) {
                if (typeof callback == 'function') {
                    callback();
                }
                return false;
            }
            PopupHandler.element.remove();
            PopupHandler.element = null;
            PopupHandler.options = PopupHandler.defaultOptions;
            if (typeof callback == 'function') {
                callback();
            }
        },
        show: function() {
            if (PopupHandler.popupExists() === false) {
                return false;
            }
            var options = PopupHandler.options;
            var element = PopupHandler.element;

            PopupHandler.runCallback('beforeVisible');

            if (options.overlay) {
                OverlayHandler.show();
            }

            //Hide loader if there is one activated
            OverlayHandler.hideLoader();

            element.fadeIn(400, function() {
                PopupHandler.runCallback('afterVisible');
            }).addClass('opened');
        },
        hide: function(callback) {
            var element = PopupHandler.element;
            if (PopupHandler.popupExists() === false) {
                if (typeof callback == 'function') {
                    callback(element);
                }
                return false;
            }

            PopupHandler.runCallback('beforeHidden');

            OverlayHandler.hide();

            element.fadeOut(400, function() {
                PopupHandler.runCallback('afterHidden');
                if (typeof callback == 'function') {
                    callback(element);
                }
            });
        },
        closeTriggered: function() {
            if (PopupHandler.options.destroyOnClose) {
                PopupHandler.hide(function() {
                    PopupHandler.destroy();
                });
                return true;
            }
            PopupHandler.hide();
        },
        addContent: function(content) {
            if (typeof content == 'string') {
                $('.popupContent', PopupHandler.element).html(content);
            }
        },
        runCallback: function(method) {
            var callbacks = PopupHandler.options.callbacks;
            if (typeof callbacks != 'undefined' && typeof callbacks[method] == 'function') {
                callbacks[method](PopupHandler.element);
            }
        },
        popupExists: function() {
            var element = PopupHandler.element;
            if (element != null && element.length > 0) {
                return true;
            }
            return false;
        },
        getElement: function() {
            return PopupHandler.element;
        },
        validateAppendTo: function(value) {
            if (value instanceof jQuery) {
                return value;
            }

            var $object = false;
            if (typeof value == 'string') {
                $object = $(value);
                if ($object.length > 0) {
                    return $object;
                }
            }
            return $(body);
        },
        log: function(log, returnValue) {
            var returnValue = returnValue || false;
            if (PopupHandler.debug) {
                console.log(log);
            }

            return returnValue;
        }
    }

    window.PopupHandler = PopupHandler;
})();

/*===========================
PopupHandler AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.PopupHandler;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.PopupHandler;
    });
}
