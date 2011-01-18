// Javascript Document

$(document).ready(function() {
	var pFgrid = new Fgrid($("div#puzzle"), "p");
	var sFgrid = new Fgrid($("div#solution"), "s");
	
	pFgrid.RegisterEditable();
	sFgrid.Register();
});