var OverlayHandler = {
    selector: null,
    construct: function() {
        if (this.selector == null) {
            this.selector = $('#overlay');
        }
    },
    show: function(loading) {
        var loading = loading || false;
        this.construct();
        this.selector.addClass('active');
        if (loading) {
            this.selector.addClass('loading');
        }
    },
    hide: function() {
        this.construct();
        this.selector.removeClass('active loading');
    },
    showLoading: function() {
        this.construct();
        this.selector.addClass('loading');
    },
    hideLoading: function() {
        this.construct();
        this.selector.removeClass('loading');
    },
    getSelector: function() {
        this.construct();
        return this.selector;
    }
};

var PopupHandler = {
    debug: false,
    defaults: {
        id: 'popupHandler',
        appendTo: 'body',
        extraClass: '',
        autoPop: true,
    },
    options: {},
    appendTo: null,
    popup: null,
    create: function(content, newOptions) {
        PopupHandler.prepareData(newOptions);
        if (PopupHandler.appendTo.length == 0) return PopupHandler.log('Could not append the given selector.');
        
        PopupHandler.closeExisting(function() {
            PopupHandler.popup = $('<div id="'+ PopupHandler.options.id +'" class="popupHandler '+ PopupHandler.options.extraClass +'" style="display: none;"><div class="popupContent"></div><a class="closeBtn"><i class="fa"></i></a></div>');
            PopupHandler.addContent(content);
            PopupHandler.appendTo.append(PopupHandler.popup);

            if (PopupHandler.options.autoPop) {
                PopupHandler.show();
            }

            $('> .closeBtn', PopupHandler.popup).on('click', $.proxy(PopupHandler.hide, PopupHandler));
            OverlayHandler.getSelector().on('click', $.proxy(PopupHandler.hide, PopupHandler));

            //On Escape key triggered
            $(document).on('keyup', function(e) {
                 if (e.keyCode == 27) {
                    $(this).unbind('keyup');
                    PopupHandler.hide();
                }
            });
        });

        return PopupHandler;
    },
    addContent: function(html) {
        if (typeof html == 'string') {
            $('.popupContent', PopupHandler.popup).html(html);
        }
    },
    show: function() {
        if (!PopupHandler.popExists()) return false;
        PopupHandler.callbacks.beforeShow();

        OverlayHandler.hideLoading();

        PopupHandler.overlay('show');

        PopupHandler.popup.fadeIn(400, function() {
            PopupHandler.callbacks.afterShow();
        });
        PopupHandler.popup.addClass('opened');
    },
    hide: function() {
        if (!PopupHandler.popExists()) return false;

        PopupHandler.callbacks.beforeHide();
        
        PopupHandler.overlay('hide');

        PopupHandler.popup.fadeIn(400, function() {
            PopupHandler.popup.remove();
            PopupHandler.callbacks.afterHide();
        });
        PopupHandler.popup.removeClass('opened');
    },
    //Alias
    close: function() { 
        PopupHandler.hide();
    },
    overlay: function(action) {
        var action = action || 'show';
        if (typeof OverlayHandler == 'undefined') return false;

        if (action == 'show') {
            OverlayHandler.show();
        } else {
            OverlayHandler.hide();
        }
    },
    prepareData: function(newOptions) {
        PopupHandler.options = PopupHandler.defaults;
        if (typeof newOptions == 'object') {
            PopupHandler.options = $.extend({}, PopupHandler.defaults, newOptions || {});
        }

        PopupHandler.appendTo = PopupHandler.options.appendTo;
        if (typeof PopupHandler.appendTo == 'string') {
            PopupHandler.appendTo = $(PopupHandler.options.appendTo);
        }
    },
    getPopup: function() {
        if (PopupHandler.popExists()) {
            return PopupHandler.popup;
        }

        return false;
    },
    popExists: function() {
        if (typeof PopupHandler.popup != 'undefined' && PopupHandler.popup.length > 0) {
            return true;
        }
        return false;
    },
    callbacks: {
        beforeShow: function() {
            if (typeof PopupHandler.options.beforeShow == 'function') {
                PopupHandler.options.beforeShow();
            }
        },
        afterShow: function() {
            if (typeof PopupHandler.options.afterShow == 'function') {
                PopupHandler.options.afterShow();
            }
        },
        beforeHide: function() {
            if (typeof PopupHandler.options.beforeHide == 'function') {
                PopupHandler.options.beforeHide();
            }
        },
        afterHide: function() {
            if (typeof PopupHandler.options.afterHide == 'function') {
                PopupHandler.options.afterHide();
            }
        },
    },
    closeExisting: function(callback) {
        if ($('.popupHandler').length > 0) {
            $('.popupHandler').fadeOut(500, function() {
                $(this).remove();
                callback();
            });
            return true;
        }

        callback();
    },
    log: function(log, returnValue) {
        var returnValue = returnValue || false;
        if (PopupHandler.debug) {
            console.log(log);
        }

        return returnValue;
    }
};
