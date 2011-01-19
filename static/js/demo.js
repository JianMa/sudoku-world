// Javascript Document

DemoStatus = {
	Error:		0,
	Ready:		1,
	Running:	2,
	Pausing:	3
}

// class Demo: handles demonstration
function Demo(inFgrid, outFgrid) {
	this.inFgrid = inFgrid;
	this.outFgrid = outFgrid;
	
	this.ResetLoc();
	
	// timer
	this.interval = 500;
	this.timer = null;
}

// move loc to last non-preset cell location
Demo.prototype.MovePrev = function(loc) {
	do {
		loc.y--;
		if (loc.y < 0) {
			loc.x--;
			loc.y = GridN - 1;
		}
		if (loc.x < 0)
			return false;
	} while(this.IsPreset(loc.x, loc.y));
	return true;
}

// move loc to next non-preset cell location
Demo.prototype.MoveNext = function(loc) {
	do {
		loc.y++;
		if (loc.y >= GridN) {
			loc.x++;
			loc.y = 0;
		}
		if (loc.x >= GridN)
			return false;
	} while(this.IsPreset(loc.x, loc.y));
	return true;
}

Demo.prototype.IsPreset = function(x, y) {
	return this.inFgrid.value(x, y) != 0;
}

Demo.prototype.ResetLoc = function() {
	this.loc = new Location(0, 0);
	if (this.IsPreset(0, 0))
		this.MoveNext(this.loc);
}

Demo.prototype.CopyToOut = function() {
	for (var i = 0; i < GridN; i++)
	for (var j = 0; j < GridN; j++) {
		var value = this.inFgrid.value(i, j);
		this.outFgrid.value(i, j, value);
	}
}

Demo.prototype.IsSuccessful = function() {
	return this.loc.x == GridN && this.loc.y == 0;
}

// returning false means end (it can be either successful or unsuceessful)
// returning true means a try
Demo.prototype.Next = function() {
	if (!IsValidLoc(this.loc.x) || !IsValidLoc(this.loc.y))
		return false;
	
	var value = this.outFgrid.value(this.loc.x, this.loc.y);
	value =  (value + 1) % (GridN + 1);					// try next value
	this.outFgrid.value(this.loc.x, this.loc.y, value);
	this.outFgrid.resolved();
	
	if (value == 0)
		return this.MovePrev(this.loc);
	else {
		if (!this.outFgrid.ValidateCell(this.loc.x, this.loc.y))
			return true;
		else
			return this.MoveNext(this.loc);
	}
}

// callback is invoked when running is finished
Demo.prototype.Run = function(callback) {
	var demo = this;
	if (this.Next()) {
		this.timer = setTimeout(function() {
			demo.Run(callback);
		}, this.interval);
	} else
		if (typeof callback == "function")
			callback(this, this.IsSuccessful());
}

Demo.prototype.Stop = function() {
	clearTimeout(this.timer);
}

Demo.prototype.Controller = function(enableStart, enableStop, enablePause, enableContinue) {
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

Demo.prototype.ChangeStatus = function(status) {
	switch(status) {
		case DemoStatus.Error:
			$("div#status span#name").text("Error");
			this.Controller(false, false, false, false);
			break;
			
		case DemoStatus.Ready:
			$("div#status span#name").text("Ready");
			this.Controller(true, false, false, false);
			this.Stop();
			break;
			
		case DemoStatus.Running:
			$("div#status span#name").text("Running");
			this.Controller(false, true, true, false);
			this.Run(finish);
			break;
			
		case DemoStatus.Pausing:
			$("div#status span#name").text("Pausing");
			this.Controller(false, true, false, true);
			this.Stop();
			break;
	}
	$("div#status span#result").text("");
}

function finish(demo, successful) {
	demo.ChangeStatus(DemoStatus.Ready);
	
	if (successful)
		$("div#status span#result").text("It succeeded to find a solution!");
	else
		$("div#status span#result").text(result = "It failed to find a solution!");
}


$(document).ready(function() {
	var inFgrid = new Fgrid($("div#puzzle"), "p");
	var outFgrid = new Fgrid($("div#demo"), "d");
	var demo = new Demo(inFgrid, outFgrid);
	
	inFgrid.RegisterEditable(function(valid) {
		demo.ChangeStatus(valid ? DemoStatus.Ready : DemoStatus.Error);
	});
	outFgrid.Register();
	
	
	$("input#start").click(function() {
		demo.CopyToOut();
		demo.ResetLoc();
		demo.ChangeStatus(DemoStatus.Running);
	});
	
	$("input#stop").click(function() {
		demo.ChangeStatus(DemoStatus.Ready);
	});
	
	$("input#pause").click(function() {
		demo.ChangeStatus(DemoStatus.Pausing);
	});
	
	$("input#continue").click(function() {
		demo.ChangeStatus(DemoStatus.Running);
	});
});
