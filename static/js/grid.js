// Javascript code
gridN = 9

$(document).ready(function() {
	$("div.grid td input").keydown(function(e) {
		var id = $(this).attr("id");
		var type = id.charAt(0);
		var loc = {"x" : parseInt(id.charAt(1)), "y" : parseInt(id.charAt(2))};
		
		switch (e.which) {
			case 37:	// left
				loc = move(loc, 0, -1);
				break;
				
			case 38:	// up
				loc = move(loc, -1, 0);
				break;
				
			case 39:	// right
				loc = move(loc, 0, 1);
				break;
				
			case 40:	// down
				loc = move(loc, 1, 0);
				break;
				
			default:
				return;
		}
		
		e.preventDefault();
		var tbody = $(this).parent().parent().parent();		// input => td => tr => tbody
		var td = "td input#" + type + loc["x"] + loc["y"];
		
		$(td, tbody).select();
	});
});

function check(v) {
	return 0 <= v && v < gridN;
}

function move(loc, dx, dy) {
	var res = {"x" : loc["x"] + dx, "y" : loc["y"] + dy};	
	return (check(res["x"]) && check(res["y"])) ? res : loc;
}