// Javascript Document

/*
 * This file contains code that implements the handlers for an editable grid
 * Handlers contained:
 *     arrow key controls
 *     validate the gird
 */

var GridN = 9

function Location(x, y) {
	this.x = x;
	this.y = y;
}

function Td(type, x, y) {
	return "td#" + type + x + y;
}

function TdInput(type, x, y) {
	return Td(type, x, y) + " input";
}

$(document).ready(function() {
	$("div.grid.editable").each(function(grid_index, grid) {
		$("td.cell", grid).each(function(td_index, td) {
			$("input", td).keydown(function(e) {
				var id = $(td).attr("id");
				var type = id.charAt(0);
				var loc = new Location(parseInt(id.charAt(1)), parseInt(id.charAt(2)));
				
				switch (e.which) {
					case 37:	// left
						MoveInBoundary(loc, 0, -1);
						break;
						
					case 38:	// up
						MoveInBoundary(loc, -1, 0);
						break;
						
					case 39:	// right
						MoveInBoundary(loc, 0, 1);
						break;
						
					case 40:	// down
						MoveInBoundary(loc, 1, 0);
						break;
						
					default:
						return;
				}
				e.preventDefault();
				$(TdInput(type, loc.x, loc.y), grid).select();
			}).keyup(function(e) {
				ValidateGrid(grid, type);
			});
		});
		var type = $("td.cell", grid).attr("id").charAt(0);
		ValidateGrid(grid, type);
	});
});

function IsValidLoc(v) {
	return 0 <= v && v < GridN;
}

function MoveInBoundary(loc, dx, dy) {
	if (IsValidLoc(loc.x + dx) && IsValidLoc(loc.y + dy)) {
		loc.x += dx;
		loc.y += dy;
	}
}

function IsValidForRow(grid, type, x, y, value) {
	for (j = 0; j < GridN; j++)
		if (j != y && $(TdInput(type, x, j), grid).val() == value)
			return false;
	return true;
}

function IsValidForCol(grid, type, x, y, value) {
	for (i = 0; i < GridN; i++)
		if (i != x && $(TdInput(type, i, y), grid).val() == value)
			return false;
	return true;
}

function IsValidForSquare(grid, type, x, y, value) {
	var si = parseInt(x / 3) * 3;
	var sj = parseInt(y / 3) * 3;
	
	for (i = si; i < si + 3; i++)
	for (j = sj; j < sj + 3; j++)
		if ((i != x || j != y) && $(TdInput(type, i, j), grid).val() == value)
			return false;
	return true;
}

function IsValidCell(grid, type, x, y, value) {
	if (value == "")
		return true;
	else
		return	IsValidForRow(grid, type, x, y, value) &&
				IsValidForCol(grid, type, x, y, value) &&
				IsValidForSquare(grid, type, x, y, value);
}

function ValidateGrid(grid, type) {
	$("td.conflict", grid).removeClass("conflict");
	
	var valid = true;
	for (x = 0; x < GridN; x++)
	for (y = 0; y < GridN; y++) {
		var value = $(TdInput(type, x, y), grid).val();
		if (!IsValidCell(grid, type, x, y, value)) {
			$(Td(type, x, y), grid).addClass("conflict");
			valid = false;
		}
	}
	return valid;
}
