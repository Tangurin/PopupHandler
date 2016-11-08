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
        var self = PopupHandler;
        this.prepareData(newOptions);
        this.closeExisting();
        if (this.appendTo.length == 0) return this.log('Could not append the given selector.');

        this.popup = $('<div id="'+ this.options.id +'" class="popupHandler '+ this.options.extraClass +'" style="display: none;"><div class="popupContent"></div><a class="closeBtn"><i class="fa"></i></a></div>');
        this.addContent(content);
        this.appendTo.append(this.popup);

        if (this.options.autoPop) {
            this.show();
        }

        $('> .closeBtn', this.popup).on('click', $.proxy(self.hide, self));
        OverlayHandler.getSelector().on('click', $.proxy(self.hide, self));

        //On Escape key triggered
        $(document).on('keyup', function(e) {
             if (e.keyCode == 27) {
                $(this).unbind('keyup');
                self.hide();
            }
        });

        return self;
    },
    addContent: function(html) {
        if (typeof html == 'string') {
            $('.popupContent', this.popup).html(html);
        }
    },
    show: function() {
        var self = PopupHandler;
        if (!this.popExists()) return false;
        self.callbacks.beforeShow();

        OverlayHandler.hideLoading();

        self.overlay('show');

        this.popup.fadeIn(400, function() {
            self.callbacks.afterShow();
        });
        this.popup.addClass('opened');
    },
    hide: function() {
        var self = PopupHandler;
        if (!this.popExists()) return false;

        self.callbacks.beforeHide();
        
        self.overlay('hide');

        this.popup.fadeIn(400, function() {
            self.popup.remove();
            self.callbacks.afterHide();
        });
        this.popup.removeClass('opened');
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
        this.options = this.defaults;
        if (typeof newOptions == 'object') {
            this.options = $.extend({}, this.defaults, newOptions || {});
        }

        this.appendTo = this.options.appendTo;
        if (typeof this.appendTo == 'string') {
            this.appendTo = $(this.options.appendTo);
        }
    },
    getPop: function() {
        if (this.popExists()) {
            return this.popup;
        }

        return false;
    },
    popExists: function() {
        if (typeof this.popup != 'undefined' && this.popup.length > 0) {
            return true;
        }
        return false;
    },
    callbacks: {
        beforeShow: function() {
            var self = PopupHandler;
            if (typeof self.options.beforeShow == 'function') {
                self.options.beforeShow();
            }
        },
        afterShow: function() {
            var self = PopupHandler;
            if (typeof self.options.afterShow == 'function') {
                self.options.afterShow();
            }
        },
        beforeHide: function() {
            var self = PopupHandler;
            if (typeof self.options.beforeHide == 'function') {
                self.options.beforeHide();
            }
        },
        afterHide: function() {
            var self = PopupHandler;
            if (typeof self.options.afterHide == 'function') {
                self.options.afterHide();
            }
        },
    },
    closeExisting: function() {
        if ($('.popupHandler').length > 0) {
            $('.popupHandler').fadeOut(500, function() {
                $(this).remove();
            });
        }
    },
    log: function(log, returnValue) {
        var returnValue = returnValue || false;
        if (this.debug) {
            console.log(log);
        }

        return returnValue;
    }
};
