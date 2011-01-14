// Javascript code

// TdInput is defined in grid.js

var map;
$(document).ready(function() {
	$("#submit").click(function() {
		// get map
		map = new Array();
		for (i = 1; i < GridN + 1; i++) {
			var key = i.toString();
			var value = $("div#map input#" + i).val();
			if (value != "")
				map[key] = value;
		}
		
		// map the original to target
		for (i = 0; i < GridN; i++)
			for (j = 0; j < GridN; j++) {
				var key = $("div#puzzle " + TdInput("p", i, j)).val();
				
				if (key in map)
					$("div#solution " + TdInput("s", i, j)).val(map[key]);
				else
					$("div#solution " + TdInput("s", i, j)).val(key);
			}
	});
});
