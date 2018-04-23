;(function ($, window, undefined) {
    'use strict';

    var pluginName = 'coupon-option',
        pos_sr_url = '/content/sprint2-aem/pos-service-requests.html',
        path = '/etc/designs/sprint2-aem/clientlib-common/';

    var events = {
        click: 'click.' + pluginName,
    };

    var createPopup = function(popupObj) {
        var button = popupObj.confirm ? '<button class="btn btn-default ' + popupObj.confirm.class + ' margin-left-xxs" type="button" data-toggle="modal" data-dismiss="modal" data-id="' + popupObj.confirm.id + '">' + popupObj.confirm.title + '</button>' : '',
            popup = $('body').find('[data-id=common-popup]');
        popup.html('<div class="modal-dialog partial-screen-modal-dialog"><div class="modal-content overflow-auto"><div class="modal-header bg-t2"><button class="modal-header-btn pull-left" data-dismiss="modal"><svg class="icon-xs hide-on-fallback" role="img" title="closewhite-glyph"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ path +'icons/icons.svg#closewhite-glyph"></use><image class="icon-fallback" alt="closewhite-glyph" src="'+ path +'closewhite-glyph.png" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""></image></svg>  </button><h6 class="w text-center">' + popupObj.title + '</h6></div><div class="modal-container padding-top-xxl content-centering"><p class="content-centering bt2">' + popupObj.description + '</p><div class="margin-bottom-l margin-top-xxl"><button style="margin-left:240px;" class="btn btn-default ' + popupObj.decline.class + '" type="button" data-dismiss="modal" data-id="' + popupObj.decline.id + '">' + popupObj.decline.title + '</button>' + button + '</div></div></div></div>');
        popup.off('hidden.bs.modal').on('hidden.bs.modal', popupObj.decline.func);
        popupObj.confirm && $('body').off(events.click, '[data-id=' + popupObj.confirm.id + ']').on(events.click, '[data-id=' + popupObj.confirm.id + ']', popupObj.confirm.func);
        popup.modal('show');
    };

    function CouponOption(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    };

    CouponOption.prototype = {
        init: function () {
            var that = this;
            that.initDOM();
            that.getPolicy();
            that.element.submit(function (e) {
                e.preventDefault();
                createPopup({
                    title: '',
                    description: 'Update successfully',
                    decline: {
                        id: 'ok',
                        title: 'OK',
                        class: 'btn-secondary',
                        func: function () {
                           window.location.href = pos_sr_url;
                        }
                    }
                });
            });

        },

        initDOM: function () {

        },

        getPolicy: function () {
            var that = this;
            console.log('policy-number: ', document.getElementById('policy-number').value);
            $.ajax({
                url: "http://localhost:3000/policies/"+document.getElementById('policy-number').value,
                type: "GET",
                dataType: "json",
                success: function (response) {
                console.log('coupon option ', response.couponOption);
                    that.passDataToHtml(response.couponOption);
                }
            })
        },
        passDataToHtml: function (couponOption) {
            console.log('aaa ', couponOption);
            switch(couponOption){
                case 'cash': {
                    $('[data-id=existing-coupon-option]').append('Cash Payout');
                    $('.cash-payout').addClass('hidden'); 
                    break;
                }
                case 'accumulated': {
                    $('[data-id=existing-coupon-option]').append('Coupon Accumulations (Coupon Deposit Account)');
                    $('.coupon-accumulations').addClass('hidden');
                    break;
                }
            };
            $('[data-id=policy]').append('P'+document.getElementById('policy-number').value);
        },

        destroy: function () {
            $.removeData(this.element[0], pluginName);
        }

    };

    $.fn[pluginName] = function (options, params) {
        return this.each(function () {
            var instance = $.data(this, pluginName);
            if(!instance) {
                $.data(this, pluginName, new CouponOption(this, options));
            } else {
                if(instance[options]){
                    instance[options](params);
                }
            }
        })
    }

    $.fn[pluginName].defaults = {};

    $(function () {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));

