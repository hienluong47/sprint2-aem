;(function ($, window, undefined) {
    'use strict';

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

    var pluginName = 'login-handle';

    function LoginHandle(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    }

    LoginHandle.prototype = {
        init : function () {
            var that = this;
            that.messageError = that.element.find('#login-error');

            that.element.submit(function(e){
               e.preventDefault();
               that.loginRequest();
            });
        },

        loginRequest : function () {
            var that = this,
                       params = serializeObject(that.element.serializeArray());
            $.ajax({
                url: that.element.attr('action'),
                type: 'GET',
                success: function (response) {
                    that.messageError.text('');
                    if(response.statusCode === 200) {
                        var params = {
                            statusCode: response.statusCode,
                            jSessionId: response.data.jSessionId,
                            sessionInfo: response.data.sessionInfo,
                            token: response.data.token
                        };

                        response.data.uamResponse && localStorage.setItem('userPermission', response.data.uamResponse);
                        that.loginResponse(params);
                    } else {
                        that.messageError.text(response.message);
                    }
                },
                error: function (error) {
                    that.messageError.text(error.message);
                    throw error;
                }
            })
        },

        loginResponse: function (params) {
            var that = this;

            $.ajax({
                url: that.element.data('url-aem'),
                type: that.element.data('method'),
                data: JSON.stringify(params),
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    response.url && window.location.replace(response.url);
                },
                error: function (error) {
                    that.messageError = error;
                }
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
                $.data(this, pluginName, new LoginHandle(this, options));
            } else if(instance[options]){
                instance[options](params);
            }
        })
    }

    $.fn[pluginName].defaults = {};

    $(function () {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));