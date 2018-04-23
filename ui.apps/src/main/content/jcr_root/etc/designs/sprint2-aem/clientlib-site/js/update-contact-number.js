$(document).ready(function() {
    console.log('update');
                $('#btnSubmit').on('click', function() {
                    var countryCode = $('#countryCode').val();
                    var areaCode = $('#areaCode').val();
                    var mobileNumber = $('#mobileNumber').val();
                    $.ajax({
                        type: 'GET',
                        url: 'http://localhost:3000/pos061',
                        dataType: 'json',
                        data: {countryCode:countryCode, areaCode:areaCode, mobileNumber:mobileNumber},
                        success: function(data) {
                            if(data.statusCode == 200) {
                                $('#phoneId').text(data.data.id);
                                $('#phoneCountryCode').text(data.data.countryCode);
                                $('#phoneAreaCode').text(data.data.areaCode);
                                $('#phoneMobileNumber').text(data.data.mobileNumber);
                                $('#contentRes').slideDown();
                                alert('Update Successfully: {' +
                                    'ID : ' + data.data.id +
                                    ' Country Code : ' + data.data.countryCode +
                                    ' Area Code : ' + data.data.areaCode +
                                    ' Mobile Number : ' + data.data.mobileNumber);
                                window.location.href = "/content/sprint2-aem/pos-service-requests.html";
                            } else {
                                $('#contentRes').slideUp();
                                alert("Not found...");
                            }
                        } 
                    });
                });
            });
