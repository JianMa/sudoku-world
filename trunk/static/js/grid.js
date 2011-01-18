// Javascript Document

/*
 * This file contains code that implements the handlers for an editable grid
 * Handlers contained:
 *     arrow key controls
 *     validate the gird
 * Convention:
 *     fgrid:	a grid class containing jgrid and type information
 *     jgrid:	a div grid in jQuery wrap, like $("div#puzzle")
 *     grid:	a 2-dimension array grid, like grid[0][0] is a cell
 */

var GridN = 9

function IsValidValue(v) {
	return !isNaN(v) && 1 <= v && v <= GridN;
}

function IsValidLoc(v) {
	return 0 <= v && v < GridN;
}

function MoveInBoundary(loc, dx, dy) {
	if (IsValidLoc(loc.x + dx) && IsValidLoc(loc.y + dy)) {
		loc.x += dx;
		loc.y += dy;
	}
}

$.fn.conflict = function() {
	this.addClass("conflict");
}

$.fn.resolved = function() {
	this.removeClass("conflict");
}

// class Location
function Location(x, y) {
	this.x = x;
	this.y = y;
}

// class Fgrid (full information grid)
function Fgrid(jgrid, type){
	// initialization
	this.jgrid = jgrid;
	this.type = type;
	this.valid = null;
}

Fgrid.prototype.jTd = function(x, y) {
	return $("td#" + this.type + x + y, this.jgrid);
}

Fgrid.prototype.jTdInput = function(x, y) {
	return $("input", this.jTd(x, y));
}

Fgrid.prototype.value = function(x, y, value) {
	if (value == undefined) {
		value = parseInt(this.jTdInput(x, y).val());
		if (IsValidValue(value))
			return value;
		else
			return 0;
	} else
		if (IsValidValue(value))
			this.jTdInput(x, y).val(value);
		else
			this.jTdInput(x, y).val("");
}

Fgrid.prototype.resolved = function() {
	$(".conflict", this.jgrid).resolved();
}

Fgrid.prototype.RegisterEditable = function(callback) {
	var fgrid = this;
	this.Validate(callback);
	
	$("input.gridEmpty", this.jgrid).click(function() {
		for (var i = 0; i < GridN; i++)
		for (var j = 0; j < GridN; j++)
			fgrid.value(i, j, "");
	});
	
	$("td.cell", this.jgrid).each(function(td_index, td) {
		$("input", td).keydown(function(e) {
			// only handle arrow key control
			var id = $(td).attr("id");
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
			e.preventDefault();						// left and right arrow key works
			$(this).blur();
			fgrid.jTdInput(loc.x, loc.y).focus();
		}).keyup(function() {						// change event is only triggered when the input loses focus, so use keyup instead
			fgrid.Validate(callback);				// we must check the whole grid every time
			$(this).focus();
		}).focus(function() {
			$(this).select();
		});
	});
}

Fgrid.prototype.Register = function() {
	$("input.gridEmpty", this.jgrid).attr("disabled", "disabled");
}

// Validate functions
Fgrid.prototype.Validate = function(callback) {
	this.resolved();
	var valid = true;
	
	for (var i = 0; i < GridN; i++)
	for (var j = 0; j < GridN; j++) {
		if (!this.jTd(i, j).hasClass(".conflict"))
			if (!this.ValidateCell(i, j))
				valid = false;
	}
	
	if (valid != this.valid) {
		this.valid = valid;
		if (typeof callback == "function")
			callback(valid);
	}
	
	return valid;
}

Fgrid.prototype.ValidateRow = function(x, y) {
	var valid = true;
	var value = this.value(x, y);
	
	for (var j = 0; j < GridN; j++)
		if (j != y && this.value(x, j) == value) {
			this.jTd(x, j).conflict();
			valid = false;
		}
	return valid;
}

Fgrid.prototype.ValidateCol = function(x, y) {
	var valid = true;
	var value = this.value(x, y);
	
	for (var i = 0; i < GridN; i++)
		if (i != x && this.value(i, y) == value) {
			this.jTd(i, y).conflict();
			valid = false;
		}
	return valid;
}

Fgrid.prototype.ValidateSquare = function(x, y) {
	var valid = true;
	var value = this.value(x, y);
	var si = parseInt(x / 3) * 3;
	var sj = parseInt(y / 3) * 3;
	
	for (var i = si; i < si + 3; i++)
	for (var j = sj; j < sj + 3; j++)
		if ((i != x || j != y) && this.value(i, j) == value) {
			this.jTd(i, j).conflict();
			valid = false;
		}
	return valid;
}

Fgrid.prototype.ValidateCell = function(x, y) {
	if (this.value(x, y) == 0)
		return true;
	
	var valid =	this.ValidateRow(x, y) &&
				this.ValidateCol(x, y) &&
				this.ValidateSquare(x, y);
	
	if (!valid)
		this.jTd(x, y).conflict();
	return valid;
}
