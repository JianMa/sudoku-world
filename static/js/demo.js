// Javascript Document

// TdInput is defined in grid.js
var grid;
$(document).ready(function() {
	$("input#demo").removeAttr("disabled");
	$("input#demo").click(function() {
		InitializeGrid();
		CopyPuzzleToDemo();
		if (ValidateGrid($("div#puzzle"), "p")) {
			Demo();
		}
	});
});

function InitializeGrid() {
	grid = new Array();
	for (i = 0; i < GridN; i++) {
		grid[i] = new Array();
		for (j = 0; j < GridN; j++) {
			var p = "div#puzzle " + TdInput("p", i, j);
			grid[i][j] = parseInt($(p).val());
			if (isNaN(grid[i][j]) || grid[i][j] < 1 || grid[i][j] > 9)
				grid[i][j] = 0;
		}
	}
}

function CopyPuzzleToDemo() {
	for (i = 0; i < GridN; i++)
	for (j = 0; j < GridN; j++) {
		var td = "div#demo " + Td("d", i, j);
		var tdInput = "div#demo " + TdInput("d", i, j);
		if (grid[i][j] != 0) {
			$(tdInput).val(grid[i][j]);
			$(td).addClass("const");
		} else {
			$(tdInput).val("");
			$(td).removeClass("const");
		}
	}
}
/*
function IsValidRow() {
	for (i = 0; i < GridN; i++) {
		var occur = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for (j = 0; j < GridN; j++) {
			var value = grid[i][j];
			if (value != 0) {
				if (occur[value] == -1)
					occur[value] = j;
				else {
					$("div#demo table " + TdInput("d", i, occur[value])).parent().addClass("conflict");
					$("div#demo table " + TdInput("d", i, j)).parent().addClass("conflict");
					return false;
				}
			}
		}
	}
	return true;
}

function IsValidCol() {
	for (j = 0; j < GridN; j++) {
		var occur = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
		for (i = 0; i < GridN; i++) {
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
	for (si = 0; si < GridN / 3; si++)
	for (sj = 0; sj < GridN / 3; sj++) {
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
	$(".conflict").removeClass("conflict");
	return IsValidRow() && IsValidCol() && IsValidSquare();
}*/

function ValidateDemoForRow(x, value) {
	var result = true;
	for (j = 0; j < GridN; j++)
		if (j != y && grid[x][j] == value) {
			$("div#demo " + Td("d", x, j)).addClass("conflict");
			result = false;
		}
	return result;
}

function ValidateDemoForCol(y, value) {
	var result = true;
	for (i = 0; i < GridN; i++)
		if (i != x && grid[i][y] == value) {
			$("div#demo " + Td("d", i, y)).addClass("conflict");
			result = false;
		}
	return result;
}

function ValidateDemoForSquare(x, y, value) {
	var result = true;
	var si = parseInt(x / 3) * 3;
	var sj = parseInt(y / 3) * 3;
	
	for (i = si; i < si + 3; i++)
	for (j = sj; j < sj + 3; j++)
		if ((i != x || j != y) && grid[i][j] == value) {
			$("div#demo " + Td("d", i, j)).addClass("conflict");
			result = false;
		}
	return result;
}

function ValidateDemo(x, y, value) {
	$("div#demo td.conflict").removeClass("conflict");
	
	var isValidRow = ValidateDemoForRow(x, value);
	var isValidCol = ValidateDemoForCol(y, value);
	var isValidSquare = ValidateDemoForSquare(x, y, value);
	
	return isValidRow && isValidCol && isValidSquare;
}

function Do(x, y) {
	var result = false;
	while (grid[x][y] != 0) {
		if (x == GridN - 1 && y == GridN - 1) {
			return true;
		} else {
			y += 1;
			if (y == GridN) {
				x += 1;
				y = 0;
			}
		}
	}
	
	var value;
	for (value = 1; value < GridN + 1; value++)
		if (ValidateDemo(x, y, value)) {
			$("div#demo " + TdInput("d", x, y)).val(value);
			//alert(value);
			grid[x][y] = value;
			result = result || Do(x, y)
			if (result)
				break;
			$("div#demo " + TdInput("d", x, y)).val("");
			grid[x][y] = 0;
		} else
			$("div#demo " + Td("d", x, y)).addClass("conflict");
	return result;
}

function Demo() {
	// avoid double-clicking the Demo button during demonstrating
	$("input#demo").val("Demonstrating").attr("disabled", "disabled");
	
	Do(0, 0);
	
	$("input#demo").val("Demo").removeAttr("disabled");
}
