// Javascript code

var map;
$(document).ready(function() {
	$("#submit").click(function() {
		// get map
		map = new Array();
		for (i = 1; i < gridN + 1; i++) {
			var key = i.toString();
			var value = $("#map input#" + i).val();
			if (value == "")
				map[key] = key;
			else
				map[key] = value;
		}
		
		// map the original to target
		for (i = 0; i < gridN; i++)
			for (j = 0; j < gridN; j++) {
				var key = $("#original input#o" + i + j).val();
				
				if (key != "")
					$("#target input#t" + i + j).val(map[key]);
			}
	});
});
