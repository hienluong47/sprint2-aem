//Load pos request list
let pos_dropdown = $('#pos-dropdown');

//pos_dropdown.append('<option selected="selected">Select a Service Request</option>');

pos_dropdown.prop('selectedIndex', 0);

const pos_url = 'http://localhost:3000/pos';

// Populate dropdown with list of POS SR

$.ajax({
	type: 'GET',    
    url:'http://localhost:3000/pos',
    success: function(response){
    	$.each(response, function(i, item){
            pos_dropdown.append($('<option></option>').attr('value', item.POSCode).text(item.POSCode + ": " + item.POSName));
    	});
        $(document).ready(function() {
    		pos_dropdown.select2({
                placeholder: "Select",
                allowClear: true
            });
		});
    }
});	

//Load servicing policiy list
let sp_dropdown = $('#sp-dropdown');

//sp_dropdown.empty();

//sp_dropdown.append('<option selected="selected">Select a Policy</option>');

sp_dropdown.prop('selectedIndex', 0);

const sp_url = 'http://localhost:3000/agents/A01';

// Populate dropdown with list of servicing policies

$.ajax({
	type: 'GET',    
    url:'http://localhost:3000/agents/A01',    
    success: function(response){
    	$.each(response.portfolio, function(i, item){
            let htmlStr = "<option value='"+ item.policyNumber +"'>"+ item.policyNumber +"</option>";
			sp_dropdown.append(htmlStr);
    	});
        $(document).ready(function() {
            sp_dropdown.select2({
                placeholder: "Select",
                allowClear: true
            });
		});
    }
});	

// Submite button
$("button").click(function() {
    console.log('pos submit');
    let pos_sr		= pos_dropdown.val().toLowerCase();
    let policyId	= sp_dropdown.val();

    if ((pos_sr == null || pos_sr == undefined) || (policyId == null || policyId == undefined)) {
        alert("Error. Please don't leave either lists empty.");
    }else {
		window.top.location.href = '/content/sprint2-aem/pos-service-requests/' + pos_sr + '.html?policyId=' + policyId;
    }
})

