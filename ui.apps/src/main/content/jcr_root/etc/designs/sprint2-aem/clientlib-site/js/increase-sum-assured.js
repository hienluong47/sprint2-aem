;(function ($, window, undefined) {
    'use strict';
    var pluginName = 'increase-sum-assured',
        lengthField = 2;

    function IncreaseSumAssured(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        this.init();
    };

    IncreaseSumAssured.prototype = {
        init : function () {
            var that = this;
            that.initDOM();
            that.getPolicyDetail();
        },

        initDOM : function () {

        },

        getPolicyDetail : function () {
            var that = this;
          $.ajax({
              url : 'http://localhost:3000/policies/12654354',
              method : 'GET',
              type : 'json',
              success : function (response) {
                  $('#existing-sum-basic').append(response.sumAssured);
                  $('[data-id=policy]').append('P12654354');
                  let sumAssuredErrorLabelId = '#sum-basic-error';
                  let sumAssuredInputId = '#input-sum-basic';
                  that.checkSumAssured(sumAssuredErrorLabelId, sumAssuredInputId, response.sumAssured, response.maxSA); 
                  that.addField(response);
              }
          })
        },

        addField : function (data) {
            var that = this,
                sumAssuredRaiders = [];
            data.ridersAttached === 0 && $('[data-id=add-block]').hide();
            $('[data-id=add-block]').click(function (e) {
                sumAssuredRaiders = [];
                var removeBlock = 'remove-block-'+lengthField;
                var templateClone =
                    "<div class='"+ removeBlock +"'>"+
                        "<div class='col-sm-6 margin-top-xxl'>"+
                            "<select class='primary-select select-large full-width' data-parsley-required='true' id='add-raider-select-"+ lengthField +"' data-parsley-error-message='Please select choose.' data-id='select-raider'>"+
                                "<option value='' disabled='' data-option-placeholder=''>Select one</option>"+
                            "</select>"+
                        "</div>"+
                        "<div class='col-sm-6 margin-top-xxl'>"+
                            "<div class='input-group-custom'>"+
                                "<span class='bt3 padding-right-xxs input-group-addon-custom' style='color:#a19f9f'><i>SGD</i></span>"+
                                "<input class='sgd-input'  type='text' id='add-raider-select-"+ lengthField +"-amount' name='cash-value' placeholder='93.00'>"+
                                "<a class='btn-add-field pull-right' id='block-"+ lengthField +"' href='#' title='Add Field' data-id='remove-block'><span>-</span></a>"+
                            "</div>"+
                            "<div class='margin-top-xs margin-left-xxs' style='color:#a19f9f'>Existing Sum Assured: SGD <span id='add-raider-select-"+ lengthField +"-sum'></span>.00</div>"+
                            "<div>"+
                                "<label class='label-error hidden' id='add-raider-select-"+ lengthField +"-error'>"+
									"Amount must be more than Current Sum Assured and less than <span id='maximum-product-limit'>"+ data.maxSA +"</span>.00"+
                                "</label>"+
                            "</div>"+
                        "</div>"+
                    "</div>";
                $('[data-id=add-raider]').append(templateClone);
                data.ridersAttached.length > 0 && $.each(data.ridersAttached, function(idx, item){
                    let htmlStr = "<option value='"+ idx +"'>"+ item.productCode +"</option>";
                    $('#add-raider-select-'+ lengthField).append(htmlStr);
                    sumAssuredRaiders.push(item.sumAssured);
            	});
                let sumAssuredErrorLabelId = '#add-raider-select-'+ lengthField +'-error';
                let sumAssuredInputId = '#add-raider-select-'+ lengthField +'-amount';
                let amount = sumAssuredRaiders[$('#add-raider-select-'+ lengthField).val()];
                that.checkSumAssured(sumAssuredErrorLabelId, sumAssuredInputId, amount, data.maxSA);
				$('#add-raider-select-'+ lengthField +'-sum').html(sumAssuredRaiders[$('#add-raider-select-'+ lengthField).val()]);
                lengthField++;
            });

            $('body').on('change','[data-id=select-raider]', function(e){
                let selectPartId = '#'+$(this).attr('id');
                let sumAssuredRaiderId = '#'+$(this).attr('id')+'-sum';
				let sumAssuredErrorLabelId = '#'+$(this).attr('id')+'-error';
                let sumAssuredInputId = '#'+$(this).attr('id')+'-amount';
                let amount = sumAssuredRaiders[$(selectPartId).val()];
                console.log('bbb ',  $(sumAssuredInputId).val());
                if(amount < $(sumAssuredInputId).val()){
                    $(sumAssuredErrorLabelId).addClass('hidden');
                    $(sumAssuredInputId).removeClass('field-error');
                }
				$(sumAssuredRaiderId).html(amount);
                that.checkSumAssured(sumAssuredErrorLabelId, sumAssuredInputId, amount, data.maxSA);
            });

            $('body').on('click', '[data-id=remove-block]' ,function (e) {
                var blockId = '.remove-'+$(this).attr('id');
                $(blockId).remove();
                //console.log('remove ', $('form label.hidden').length);
                lengthField--;
                let blockErrors = $('form label.hidden').length;
                //console.log('length remove ', lengthField);
                blockErrors === lengthField-1 && $('#btn-next').attr('disabled',false);
            });
        },

        checkSumAssured : function(errorLabelId, amountInputId, amount, maxSumAssured){
			//console.log('length ' , lengthField);
			//console.log('check function '+errorLabelId+' '+amountInputId+' '+amount);
            $('body').on('change', amountInputId, function(){
				//console.log('length changeinput', lengthField);
                if($(this).val() <= amount || $(this).val() > maxSumAssured){
					$(errorLabelId).removeClass('hidden');
					$(amountInputId).addClass('field-error');
                    $('#btn-next').attr('disabled',true);
                } else {
					$(errorLabelId).addClass('hidden');
                    $(amountInputId).removeClass('field-error');
                    let blockErrors = $('form label.hidden').length;
                    //console.log('check ',blockErrors);

                	blockErrors === lengthField-1 && $('#btn-next').attr('disabled',false);
                }
            });
        },

        destroy : function () {
            $.removeData(this.element[0], pluginName);
        }
    };

    $.fn[pluginName] = function (options, params) {
        return this.each(function () {
            var instance = $.data(this, pluginName);
            if(!instance){
                $.data(this, pluginName, new IncreaseSumAssured(this, options));
            } else {
                if(instance[options]){
                    instance[options](params);
                }
            }
        });
    };

    $.fn[pluginName].defaults = {};

    $(function () {
        $('[data-' + pluginName + ']')[pluginName]();
    });

}(jQuery, window));