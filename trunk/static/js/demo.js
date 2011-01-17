// Javascript Document

// Grid, TdInput, Location is defined in grid.js

function ValidateRow(fgrid, grid, x, y, value) {
	var valid = true;
	for (j = 0; j < GridN; j++)
		if (j != y && grid[x][j].value == value) {
			fgrid.jTd(x, j).conflict();
			valid = false;
		}
	return valid;
}

function ValidateCol(fgrid, grid, x, y, value) {
	var valid = true;
	for (i = 0; i < GridN; i++)
		if (i != x && grid[i][y].value == value) {
			fgrid.jTd(i, y).conflict();
			valid = false;
		}
	return valid;
}

function ValidateSquare(fgrid, grid, x, y, value) {
	var valid = true;
	var si = parseInt(x / 3) * 3;
	var sj = parseInt(y / 3) * 3;
	
	for (i = si; i < si + 3; i++)
	for (j = sj; j < sj + 3; j++)
		if ((i != x || j != y) && grid[i][j].value == value) {
			fgrid.jTd(i, j).conflict();
			valid = false;
		}
	return valid;
}

function ValidateGrid(fgrid, grid, x, y, value) {
	var valid =	ValidateRow(fgrid, grid, x, y, value) &&
				ValidateCol(fgrid, grid, x, y, value) &&
				ValidateSquare(fgrid, grid, x, y, value);
	if (!valid)
		fgrid.jTd(x, y).conflict();
	return valid;
}


// class Cell: represents a cell in the grid
function Cell(value, preset) {
	this.value = value;
	this.preset = preset;
}


// class Demo: handles demonstration
function Demo(inFgrid, outFgrid) {
	this.inFgrid = inFgrid;
	this.outFgrid = outFgrid;
	
	this.MovePrev = MovePrev;
	this.MoveNext = MoveNext;
	// inner grid
	this.grid = new Array();
	this.loc = new Location(0, 0);
	
	// timer
	this.interval = 500;
	this.timer = null;
	
	for (i = 0; i < GridN; i++) {
		this.grid[i] = new Array();
		for (j = 0; j < GridN; j++) {
			var value = parseInt(this.inFgrid.jTdInput(i, j).val());
			if (isNaN(value) || value < 1 || value > 9)
				this.grid[i][j] = new Cell(0, false);
			else
				this.grid[i][j] = new Cell(value, true);
		}
	}
	if (this.grid[0][0].preset)
		this.initial = !this.MoveNext(this.loc);
	else
		this.initial = false;
	
	
	// move loc to last non-preset cell location
	function MovePrev(loc) {
		do {
			loc.y--;
			if (loc.y < 0) {
				loc.x--;
				loc.y = GridN - 1;
			}
			if (loc.x < 0)
				return false;
		} while(this.grid[loc.x][loc.y].preset);
		return true;
	}
	
	// move loc to next non-preset cell location
	function MoveNext(loc) {
		do {
			loc.y++;
			if (loc.y >= GridN) {
				loc.x++;
				loc.y = 0;
			}
			if (loc.x >= GridN)
				return false;
		} while(this.grid[loc.x][loc.y].preset);
		return true;
	}
}


function IsValidLoc(loc) {
	return 0 <= loc && loc < GridN;
}



// returning false means end (it can be either successful or unsuceessful)
// returning true means a try
Demo.prototype.Next = function() {
	if (!IsValidLoc(this.loc.x) || !IsValidLoc(this.loc.y))
		return false;
	
	var cell = this.grid[this.loc.x][this.loc.y];
	cell.value = (cell.value + 1) % (GridN + 1);
	
	$("td.conflict", this.outJgrid).resolved();
	this.outFgrid.SetValue(this.loc.x, this.loc.y, cell.value);
	
	if (cell.value == 0)
		return this.MovePrev(this.loc);
	else {
		if (!ValidateGrid(this.outFgrid, this.grid, this.loc.x, this.loc.y, cell.value))
			return true;
		else
			return this.MoveNext(this.loc);
	}
}

function run(demo, callback) {
	if (demo.Next()) {
		demo.timer = setTimeout(function() {
			run(demo, callback);
		}, demo.interval);
	} else
		callback();
}

Demo.prototype.Start = function(callback) {
	run(this, callback);
}

Demo.prototype.Stop = function() {
	clearTimeout(this.timer);
}

Demo.prototype.Pause = function() {
	clearTimeout(this.timer);
}

Demo.prototype.Continue = function(callback) {
	run(this, callback);
}

function DemoController(enableStart, enableStop, enablePause, enableContinue) {
	if (enableStart)
		$("input#start").removeAttr("disabled");
	else
		$("input#start").attr("disabled", "disabled");
	
	if (enableStop)
		$("input#stop").removeAttr("disabled");
	else
		$("input#stop").attr("disabled", "disabled");
	
	if (enablePause)
		$("input#pause").removeAttr("disabled");
	else
		$("input#pause").attr("disabled", "disabled");
	
	if (enableContinue)
		$("input#continue").removeAttr("disabled");
	else
		$("input#continue").attr("disabled", "disabled");
}


function end() {
	DemoController(true, false, false, false);
	alert("finished demo!");
}

var demo = null;
$(document).ready(function() {
	var inFgrid = null;
	var outFgrid = null;
	
	DemoController(true, false, false, false);
	// demo should listen to ValidateJgrid change
	// button should be disabled if ValidateJgrid is false
	$("input#start").click(function() {
		DemoController(true, true, true, false);
		
		inFgrid = new Fgrid($("div#puzzle"), "p", null);
		if (!ValidateJgrid($("div#puzzle"), "p"))
			return;
		outFgrid = new Fgrid($("div#demo"), "d", inFgrid.grid);
		
		demo = new Demo(inFgrid, outFgrid);
		demo.Start(end);
	});
	
	$("input#stop").click(function() {
		DemoController(true, false, false, false);
		demo.Stop();
	});
	
	$("input#pause").click(function() {
		DemoController(true, true, false, true);
		demo.Pause();
	});
	
	$("input#continue").click(function() {
		DemoController(true, true, true, false);
		demo.Continue(end);
	});
});
