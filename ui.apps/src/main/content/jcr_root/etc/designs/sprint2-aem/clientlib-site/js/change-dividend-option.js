;(function ($, window, undefined) {
    'use strict';
    console.log('here');
    var pluginName = 'change-dividend-option',
        path = '/etc/designs/sprint2-aem/clientlib-common/';

    var events = {
        click: 'click.' + pluginName,
    };

    var serializeObject = function(serializeArray, exceptionArray) {
        var newObj = {},
            exceptionObj = {},
            checkException = false;

        exceptionArray && $.each(exceptionArray, function(index, value) {
            exceptionObj[value] = [];
        });

        $.each(serializeArray, function(index) {
            var indexExceptionArray = $.inArray(serializeArray[index].name, exceptionArray);
            if (indexExceptionArray !== -1) {
                exceptionObj[exceptionArray[indexExceptionArray]].push(serializeArray[index].value);
                checkException = true;
            } else {
                if (serializeArray[index].value) {
                    newObj[serializeArray[index].name] = serializeArray[index].value;
                }
            }
        });
        return checkException ? $.extend({}, newObj, exceptionObj) : newObj;
    };

    var createPopup = function(popupObj) {
        var button = popupObj.confirm ? '<button class="btn btn-default ' + popupObj.confirm.class + ' margin-left-xxs" type="button" data-toggle="modal" data-dismiss="modal" data-id="' + popupObj.confirm.id + '">' + popupObj.confirm.title + '</button>' : '',
            popup = $('body').find('[data-id=common-popup]');
        popup.html('<div class="modal-dialog partial-screen-modal-dialog"><div class="modal-content overflow-auto"><div class="modal-header bg-t2"><button class="modal-header-btn pull-left" data-dismiss="modal"><svg class="icon-xs hide-on-fallback" role="img" title="closewhite-glyph"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+ path +'icons/icons.svg#closewhite-glyph"></use><image class="icon-fallback" alt="closewhite-glyph" src="'+ path +'closewhite-glyph.png" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href=""></image></svg>  </button><h6 class="w text-center">' + popupObj.title + '</h6></div><div class="modal-container padding-top-xxl content-centering"><p class="content-centering bt2">' + popupObj.description + '</p><div class="margin-bottom-l margin-top-xxl"><button style="margin-left:240px;" class="btn btn-default ' + popupObj.decline.class + '" type="button" data-dismiss="modal" data-id="' + popupObj.decline.id + '">' + popupObj.decline.title + '</button>' + button + '</div></div></div></div>');
        popup.off('hidden.bs.modal').on('hidden.bs.modal', popupObj.decline.func);
        popupObj.confirm && $('body').off(events.click, '[data-id=' + popupObj.confirm.id + ']').on(events.click, '[data-id=' + popupObj.confirm.id + ']', popupObj.confirm.func);
        popup.modal('show');
    };

    function ChangeDividendOption(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    };
    
    ChangeDividendOption.prototype = {
        init: function () {
          this.initDOM();
          this.getPolicy();
        },

        initDOM: function () {},

        getPolicy: function () {
            var that = this,
                params = serializeObject(that.element.serializeArray());
            console.log('policy-number: ', document.getElementById('policy-number').value);
            $.ajax({
                url: "http://localhost:3000/policies/"+document.getElementById('policy-number').value,
                type: "GET",
                data: JSON.stringify(params),
                dataType: "json",
                success: function (response) {
                    that.passDataToHtml(response.dividendOption);
                    that.checkPremiumDeductions(response.paymentFrequency, response.paymentMethod);
                }
            })
        },
		passDataToHtml: function (dividendOption) {
            console.log('aaa ', dividendOption);
            switch(dividendOption){
                case 'Premium Deduction': $('.premium-deductions').addClass('hidden'); break;
                case 'Paid-up Addition': $('.paid-up-addition').addClass('hidden'); break;
                case 'Dividend Accumulations': $('.dividend-accumulations').addClass('hidden'); break;
                case 'Cash Payout': $('.cash-payout').addClass('hidden'); break;
            };
            $('[data-id=existing-dividend-option]').append(dividendOption);
            $('[data-id=policy]').append('P'+document.getElementById('policy-number').value);
        },

        checkPremiumDeductions: function (paymentFrequency, paymentMethod) {
            $("form input[name='dividend-option']").change(function () {
                console.log('option: ', $(this).val());
                if($(this).val() === 'PDs'){
                    console.log('paymentFrequency: '+paymentFrequency+' and paymentMethod: '+paymentMethod);
                    if(paymentFrequency === 'Annual' && paymentMethod === 'GIRO'){
                        createPopup({
                            title: 'Please Note',
                            description: 'To elect for Premium Deductions option, your payment method must not be via GIRO. Please submit a request to terminate GIRO',
                            decline: {
                                id: 'ok',
                                title: 'OK',
                                class: 'btn-secondary',
                                func: function () {
									$("input[type='radio']").prop('checked', false);
                                }
                            }
                        });
                    };
                    if(paymentFrequency !== 'Annual' && paymentMethod === 'GIRO'){
                        createPopup({
                            title: 'Please Note',
                            description: 'To elect for Premium Deductions option, your payment mode must be on annual mode and payment method must not be via GIRO. Please submit a request to change payment mode and terminate GIRO',
                            decline: {
                                id: 'ok',
                                title: 'OK',
                                class: 'btn-secondary',
                                func: function () {
									$("input[type='radio']").prop('checked', false);
                                }
                            }
                        });
                    };
                    if(paymentFrequency !== 'Annual' && paymentMethod !== 'GIRO'){
                        createPopup({
                            title: 'Please Note',
                            description: 'To elect for Premium Deductions option, your payment mode must be on annual mode. Please submit a request to change payment mode',
                            decline: {
                                id: 'ok',
                                title: 'OK',
                                class: 'btn-secondary',
                                func: function () {
									$("input[type='radio']").prop('checked', false);
                                }
                            }
                        });
                    };
                };
            });
        },

        destroy: function () {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function (options, params) {
        return this.each(function () {
            var instance = $.data(this, pluginName);
            if(!instance) {
                $.data(this, pluginName, new ChangeDividendOption(this, options));
            } else {
                if(instance[options]){
                    instance[options](params);
                }
            }
        });
    };

    $.fn[pluginName].defaults = {

    }

    $(function () {
        $('[data-' + pluginName + ']')[pluginName]();
    })
}(jQuery, window));
