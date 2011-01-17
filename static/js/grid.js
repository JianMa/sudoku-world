// Javascript Document

/*
 * This file contains code that implements the handlers for an editable grid
 * Handlers contained:
 *     arrow key controls
 *     validate the gird
 * Convention:
 *     jgrid:	a div grid in jQuery wrap, like $("div#puzzle")
 *     grid:	a 2-dimension array grid, like grid[0][0] is a cell
 */

var GridN = 9

function IsValidValue(value) {
	return !isNaN(value) && 1 <= value && value <= GridN;
}

// class Location
function Location(x, y) {
	this.x = x;
	this.y = y;
}

// class Fgrid (full information grid)
function Fgrid(jgrid, type, grid){
	// define method
	this.SetValue = function(x, y, value) {
		if (IsValidValue(value)) {
			this.jTdInput(x, y).val(value);
			this.grid[x][y] = value;
		} else {
			this.jTdInput(x, y).val("");	
			this.grid[x][y] = 0;
		}
	}
	
	this.jTd = function(x, y) {
		return $("td#" + this.type + x + y, this.jgrid);
	}
	
	this.jTdInput = function(x, y) {
		return $("input", this.jTd(x, y));
	}
	
	// initialization
	this.jgrid = jgrid;
	this.type = type;
	this.grid = grid;
	
	if (grid == null) {
		// initialize grid by jgrid
		this.grid = new Array();
		
		for (i = 0; i < GridN; i++) {
			this.grid[i] = new Array();
			for (j = 0; j < GridN; j++) {
				var value = parseInt(this.jTdInput(i, j).val());
				if (IsValidValue(value))
					this.grid[i][j] = new Cell(value, true);
				else
					this.grid[i][j] = new Cell(0, false);	
			}
		}
	} else {
		// copy grid to jgrid
		for (i = 0; i < GridN; i++)
		for (j = 0; j < GridN; j++) {
			var value = this.grid[i][j].value;
			if (IsValidValue(value))
				this.jTdInput(i, j).val(value);
			else
				this.jTdInput(i, j).val("");
		}
	}
}


// clean them up
function Td(type, x, y) {
	return "td#" + type + x + y;
}

function TdInput(type, x, y) {
	return Td(type, x, y) + " input";
}

$.fn.conflict = function() {
	this.addClass("conflict");
}

$.fn.resolved = function() {
	this.removeClass("conflict");
}

$(document).ready(function() {
	$("div.grid.editable").each(function(dGrid_index, jgrid) {
		$("td.cell", jgrid).each(function(td_index, td) {
			// should use change handler
			$("input", td).keydown(function(e) {
				var id = $(td).attr("id");
				var type = id.charAt(0);
				var loc = new Location(parseInt(id.charAt(1)), parseInt(id.charAt(2)));
				
				$(TdInput(type, loc.x, loc.y), jgrid).blur();
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
						$(TdInput(type, loc.x, loc.y), jgrid).focus();
						return;
				}
				e.preventDefault();
				$(TdInput(type, loc.x, loc.y), jgrid).focus();
			}).keyup(function(e) {
				$(this).focus();
				ValidateJgrid(jgrid, type);
			}).focus(function(e) {
				$(this).select();
			});
		});
		var type = $("td.cell", jgrid).attr("id").charAt(0);
		ValidateJgrid(jgrid, type);
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

function IsValidForRow(jgrid, type, x, y, value) {
	for (j = 0; j < GridN; j++)
		if (j != y && $(TdInput(type, x, j), jgrid).val() == value)
			return false;
	return true;
}

function IsValidForCol(jgrid, type, x, y, value) {
	for (i = 0; i < GridN; i++)
		if (i != x && $(TdInput(type, i, y), jgrid).val() == value)
			return false;
	return true;
}

function IsValidForSquare(jgrid, type, x, y, value) {
	var si = parseInt(x / 3) * 3;
	var sj = parseInt(y / 3) * 3;
	
	for (i = si; i < si + 3; i++)
	for (j = sj; j < sj + 3; j++)
		if ((i != x || j != y) && $(TdInput(type, i, j), jgrid).val() == value)
			return false;
	return true;
}

function IsValidCell(jgrid, type, x, y, value) {
	if (value == "")
		return true;
	else
		return	IsValidForRow(jgrid, type, x, y, value) &&
				IsValidForCol(jgrid, type, x, y, value) &&
				IsValidForSquare(jgrid, type, x, y, value);
}

function ValidateJgrid(jgrid, type) {
	$("td.conflict", jgrid).removeClass("conflict");
	
	var valid = true;
	for (x = 0; x < GridN; x++)
	for (y = 0; y < GridN; y++) {
		var value = $(TdInput(type, x, y), jgrid).val();
		if (!IsValidCell(jgrid, type, x, y, value)) {
			$(Td(type, x, y), jgrid).addClass("conflict");
			valid = false;
		}
	}
	return valid;
}
