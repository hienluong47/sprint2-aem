"use strict";

use(function () {

	var data = {};

	data.redirectTarget = granite.resource.properties.redirectTarget;

	if(data.redirectTarget && data.redirectTarget.indexOf('/')==0) {
		data.redirectTarget += '.html';
	}

    return data;

});
