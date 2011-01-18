// Javascript code

$(document).ready(function() {
	var pFgrid = new Fgrid($("div#puzzle"), "p");
	var rFgrid = new Fgrid($("div#replace"), "r");
	
	pFgrid.RegisterEditable();
	rFgrid.Register();
	
	$("#submit").click(function() {
		// get map
		var map = new Array();
		map[0] = "";
		for (var key = 1; key < GridN + 1; key++) {
			var value = $("div#map input#" + key).val();
			if (IsValidValue(value))
				map[key] = value;
			else
				map[key] = "";
		}
		
		// map the original to target
		for (var i = 0; i < GridN; i++)
		for (var j = 0; j < GridN; j++) {
			var key = pFgrid.value(i, j);		// key must be in 0 - 9
			rFgrid.value(i, j, map[key]);
		}
	});
});
