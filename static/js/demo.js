// Javascript code

var grid;
$(document).ready(function() {
	$("input#demo").removeAttr("disabled");
	$("input#demo").click(function() {
		InitializeGrid();
		CopyPuzzleToDemo();
		if (IsValidPuzzle()) {
			Demo();
		}
	});
});

function InitializeGrid() {
	grid = new Array();
	for (i = 0; i < gridN; i++) {
		grid[i] = new Array();
		for (j = 0; j < gridN; j++) {
			var p = "div#puzzle table input#p" + i + j;
			grid[i][j] = parseInt($(p).val());
			if (isNaN(grid[i][j]) || grid[i][j] < 1 || grid[i][j] > 9)
				grid[i][j] = 0;
		}
	}
}

function CopyPuzzleToDemo() {
	for (i = 0; i < gridN; i++)
	for (j = 0; j < gridN; j++) {
		var d = "div#demo table input#d" + i + j;
		if (grid[i][j] != 0)
			$(d).val(grid[i][j]);
		else
			$(d).val("");
	}
}

function IsValidRow() {
	for (i = 0; i < gridN; i++) {
		var occur = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for (j = 0; j < gridN; j++) {
			var value = grid[i][j];
			if (value != 0) {
				if (occur[value] == -1)
					occur[value] = j;
				else {
					$("div#demo table td input#d" + i + occur[value]).parent().addClass("conflict");
					$("div#demo table input#d" + i + j).parent().addClass("conflict");
					return false;
				}
			}
		}
	}
	return true;
}

function IsValidCol() {
	for (j = 0; j < gridN; j++) {
		var occur = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for (i = 0; i < gridN; i++) {
			var value = grid[i][j];
			if (value != 0) {
				if (occur[value] == -1)
					occur[value] = i;
				else {
					$("div#demo table td input#d" + occur[value] + j).parent().addClass("conflict");
					$("div#demo table input#d" + i + j).parent().addClass("conflict");
					return false;
				}
			}
		}
	}
	return true;
}

function IsValidSquare() {
	for (si = 0; si < gridN / 3; si++)
	for (sj = 0; sj < gridN / 3; sj++) {
		// choose a square
		var occur = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for (di = 0; di < 3; di++)
		for (dj = 0; dj < 3; dj++) {
			var i = si * 3 + di, j = sj * 3 + dj;
			var value = grid[i][j];
			if (value != 0) {
				if (occur[value] == -1)
					occur[value] = di * 3 + dj;
				else {
					oi = si * 3 + parseInt(occur[value] / 3);
					oj = sj * 3 + occur[value] % 3;
					$("div#demo table td input#d" + oi + oj).parent().addClass("conflict");
					$("div#demo table input#d" + i + j).parent().addClass("conflict");
					return false;
				}
			}
		}
	}
	return true;
}

function IsValidPuzzle() {
	return IsValidRow() && IsValidCol() && IsValidSquare();
}

function Demo() {
	$("input#demo").val("Demonstrating").attr("disabled", "disabled");
}
