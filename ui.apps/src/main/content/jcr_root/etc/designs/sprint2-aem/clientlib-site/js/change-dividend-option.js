;(function ($, window, undefined) {
    'use strict';
    var pluginName = 'change-dividend-option';

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

    function ChangeDividendOption(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    };
    
    ChangeDividendOption.prototype = {
        init: function () {
          this.initDOM();
            console.log(this.devidendOption +' '+ this.paymentFrequency + ' ' + this.paymentMethod);

        },

        initDOM: function () {
            this.getPolicy();
        },

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
                    that.devidendOption = response.dividendOption;
                    that.paymentFrequency = response.paymentFrequency;
                    that.paymentMethod = response.paymentMethod;
                console.log('response ',that.devidendOption + that.paymentFrequency + that.paymentMethod);
                that.passDataToHtml(response.dividendOption, that.paymentFrequency, that.paymentMethod);
                }
            })
        },
		passDataToHtml: function (dividendOption, paymentFrequency, paymentMethod) {
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
