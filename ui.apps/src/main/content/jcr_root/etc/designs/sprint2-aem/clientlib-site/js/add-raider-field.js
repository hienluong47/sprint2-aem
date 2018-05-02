;(function ($, windon, undefined) {
    'use strict';
    var pluginName = 'add-raider';
    var events = {
        click : 'click.' + pluginName
    };
    var createPopup = function(popupObj) {
        var button = popupObj.confirm ? '<button class="btn btn-default ' + popupObj.confirm.class + ' margin-left-xxs" type="button" data-toggle="modal" data-dismiss="modal" data-id="' + popupObj.confirm.id + '">' + popupObj.confirm.title + '</button>' : '',
            popup = $('body').find('[data-id=common-popup]');
        popup.html('<div class="modal-dialog partial-screen-modal-dialog"><div class="modal-content overflow-auto"><div class="modal-header bg-t2"><button class="modal-header-btn pull-left" data-dismiss="modal"><svg class="icon-xs hide-on-fallback" role="img" title="closewhite-glyph"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ path +'icons/icons.svg#closewhite-glyph"></use><image class="icon-fallback" alt="closewhite-glyph" src="'+ path +'closewhite-glyph.png" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""></image></svg>  </button><h6 class="w text-center">' + popupObj.title + '</h6></div><div class="modal-container padding-top-xxl content-centering"><p class="content-centering bt2">' + popupObj.description + '</p><div class="margin-bottom-l margin-top-xxl"><button style="margin-left:240px;" class="btn btn-default ' + popupObj.decline.class + '" type="button" data-dismiss="modal" data-id="' + popupObj.decline.id + '">' + popupObj.decline.title + '</button>' + button + '</div></div></div></div>');
        popup.off('hidden.bs.modal').on('hidden.bs.modal', popupObj.decline.func);
        popupObj.confirm && $('body').off(events.click, '[data-id=' + popupObj.confirm.id + ']').on(events.click, '[data-id=' + popupObj.confirm.id + ']', popupObj.confirm.func);
        popup.modal('show');
    };
    function AddRaider(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    };

    AddRaider.prototype = {
        init : function () {
            var that = this;
            that.initDOM();
            that.getPolicyDetail();
            that.btnAddField
                .off(events.click)
                .on(events.click,function (e) {
                    e.preventDefault();
                    that.elem.parent().append(that.cloneTemplate.clone());
                });
            that.elem.parent()
                .off(events.click, that.classRemoveField)
                .on(events.click, that.classRemoveField, function (e) {
                    e.preventDefault();
                    var $self = $(this);
                    $self.parent().remove();
                })

        },

        initDOM : function () {
            var opts = this.options;
            this.elem = this.element;
            this.btnAddField = $('.'+opts.classAddField, this.elem);
            this.classRemoveField = '.'+opts.classRemoveField;
            this.cloneTemplate = this.elem.clone();
            $('label', this.cloneTemplate).hide();
            $('.'+opts.classAddField, this.cloneTemplate)
                .removeClass(opts.classAddField)
                .addClass(opts.classRemoveField)
                .html('<span>-</span>');
        },

        getPolicyDetail : function () {
            var that = this;
            $.ajax({
                url : 'http://localhost:3000/policies/12654354',
                method : 'GET',
                type : 'json',
                success : function (response) {

                }
            })
        },

        destroy : function () {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function (options, params) {
        return this.each(function () {
            var instance = $.data(this, pluginName);
            if(!instance){
                $.data(this, pluginName, new AddRaider(this, options));
            } else {
                if(instance[options]){
                    instance[options](params);
                }
            }
        });
    };

    $.fn[pluginName].defaults = {
        classAddField : 'btn-add-field',
        classRemoveField : 'btn-remove-field'
    };

    $(function () {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));
