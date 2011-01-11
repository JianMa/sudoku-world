// Javascript code

var map;
$(document).ready(function() {
	$("#submit").click(function() {
		// get map
		map = new Array();
		for (i = 1; i < gridN + 1; i++) {
			var key = i.toString();
			var value = $("#map input#" + i).val();
			if (value != "")
				map[key] = value;
		}
		
		// map the original to target
		for (i = 0; i < gridN; i++)
			for (j = 0; j < gridN; j++) {
				var key = $("#puzzle input#p" + i + j).val();
				
				if (key in map)
					$("#solution input#s" + i + j).val(map[key]);
				else
					$("#solution input#s" + i + j).val(key);
			}
	});
});
