;(function ($, window, undefined) {
    'use strict';
    var pluginName = 'increase-sum-assured',
        pos_sr_url = '/content/sprint2-aem/pos-service-requests.html',
        lengthField = 2,
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

    function IncreaseSumAssured(element, options) {
        this.element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
        console.log('options ', this.element.siblings('[data-id=select-btn]'));
        this.init();
    };

    IncreaseSumAssured.prototype = {
        init : function () {
            var that = this;
            that.initDOM();
            that.getPolicyDetail();
            // that.myFirstHandlebars();
            that.element.submit(function (e) {
               e.preventDefault();
               createPopup({
                   title: '',
                   description: 'Submit successfully',
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

        initDOM : function () {

        },

        myFirstHandlebars : function() {
			let templateExample = 
                "<div class='entry'>"+
                    "<h3>{{ title }}</h3>"+
                    "<div>"+
                        "{{ body }}"+
                    "</div>"+
                "</div>";
            let context = { title: "My new post", body : "This is my first post!"};
            let htmlCompile = window.Handlebars.compile(templateExample)(context);
            $('#handlebars-example').html(htmlCompile);
        },

        getPolicyDetail : function () {
            var that = this;
          $.ajax({
              url : 'http://localhost:3000/policies/'+document.getElementById('policy-number').value,
              method : 'GET',
              type : 'json',
              success : function (response) {
                  $('#existing-sum-basic').append(response.sumAssured);
                  $('[data-id=policy]').append('P'+document.getElementById('policy-number').value);
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