/** a JS file that shall be included */
var url = new URL(window.top.location.href); //or window.location.href
var policyId = url.searchParams.get("policyId");
console.log(policyId);

//Check policy option to show corresponding coupon
window.onload = loadPolicyInfo();

function loadPolicyInfo() {
    if (policyId == undefined) {
        alert("Please define policyId in using URL.");
        alert("Example: http://localhost:4502/content/sprint2-aem/select-coupon-option.html?policyId=xxxxxxx");
    } else {
		$.ajax({
            type: 'GET',    
            url:'http://127.0.0.1:8081/policy/' + policyId
        }).then(function(response) {
    
            //var policy = response[0];
    
            //Set coupon name to textbox
            $("#coupon_type").val(response.productName + " " + response.policyNumber);
            $("#coupon_id").val(response.policyNumber);

            //Set values for coupon option
            if (response.couponOption == "cash"){
                $("#coupon").text("Cash Payout");
                $("#accumulations").show();
                setRadioChecked('option', 'cash');
                //$("#cash").checked = true;
            } else if (response.couponOption == "deposit") {
                $("#coupon").text("Coupon Accumulations (Coupon Deposit Account)");
                $("#cash-payout").show();
                setRadioChecked('option', 'deposit');
                //$("#deposit").checked = true;
            } else {
                alert("Coupon Option is not existed!");
            }
    
        });
    }
}

function myFunction(e) {

    e.preventDefault();
    
    var valid = validateForm();

    if (valid && policyId != undefined) {
        // get value of selected 'coupon option' radio button
		var radioVal = getRadioVal( $('#coupon-form'), 'option' );

        $.ajax({
        type: "POST",
            url: 'http://localhost:8081/api-post/'+policyId,
            data: { "couponOption": radioVal },
            success: function (data, textStatus, jqXHR) {
                window.location.href = getRedirectPath();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("Selected Radio: " +radioVal);
                alert("Something went wrong when update info. Reload to do it again!");
                location.reload();
				//window.location.href = getRedirectPath();
            }
        });
        //window.location.href = getRedirectPath();
    } else {
        alert("No coupon option is inputted.");
        $("#errordiv").val("No coupon option is inputted.");
    }
}

// Function for validating Coupon form
var validateForm = function () {
    var valid = false;
    if (($("#coupon_type").val().length > 0)) {
        valid = true;
    }
    return valid;
}

//Function to redirect to next page after 
var getRedirectPath = function () {
    //return "/content/sprint2-aem/login/request-pos.html";
    return "http://localhost:4502/content/sprint2-aem/en.html";
}

function setRadioChecked(radioName, radioValue) {
	var $radios = $('input:radio[name='+radioName+']');
    if($radios.is(':checked') === false) {
        $radios.filter('[value='+radioValue+']').prop('checked', true);
    }
}

//Get selected radio button
function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    //var radios = form.elements[name];
    var radios = document.getElementsByName(name);

    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}



