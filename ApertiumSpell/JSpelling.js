var SCR = {}

SCR.SCI = null;
SCR.STA = null;

SCR.loadModule = function() {
	SCR.SCI = $("#spellCheckInterface");
	SCR.STA = $(".spellTextArea");

	SCR.STA.attr("spellcheck","false");

	SCR.speeling = [];

	SCR.page = 0;
	
	//$("#spellCheckToggle").click(SCR.toggleSpellCheck);
	SCR.STA.keyup(SCR.spellTextEvent);

	SCR.STA.focus(SCR.staFocus);
	SCR.active = "translate";
	SCR.modes = ["translate","spellcheck"];

	$("#changemode").click(SCR.toggleActive);

	$("#next").click(SCR.nextPage);

	$("#prev").click(SCR.prevPage);
}

SCR.prevPage = function() {
	SCR.page-=1;
	if (SCR.page < 0) {
		SCR.page += SCR.speeling.length;
	}
	SCR.spellTextEvent()
}

SCR.nextPage = function() {
	SCR.page+=1;
	if (SCR.page >= SCR.speeling.length) {
		SCR.page -= SCR.speeling.length;;
	}
	SCR.spellTextEvent()
}

SCR.toggleActive = function(arg) {
	//console.log("asnything");
	if (typeof arg != "object") {
		SCR.active = arg;
	} else {
		SCR.spellTextEvent();
		SCR.populateSpellCheck(SCR.speeling,SCR.page);
		var index = SCR.modes.indexOf(SCR.active)+1;
		//console.log(index);
		if (index>=SCR.modes.length) {
			index-=SCR.modes.length;
			//console.log('yes')
		}
		SCR.active = SCR.modes[index];
		var i;
		//console.log(SCR.active);
		for (i in SCR.modes) {
			if (SCR.modes[i]==SCR.active) {
				continue;
			}
			//console.log(i)
			$("."+SCR.modes[i]).animate({
				opacity: 0,
			},500)/**.promise().done(function() {
				if (SCR.modes[i]!=SCR.active) {
					tmp = $("."+SCR.modes[i]);
					$("."+SCR.modes[i]).css("display","none");
				} else {
					console.log(SCR.modes[i]);
				}
				$("."+SCR.active).css("display","block");
				$("."+SCR.active).css("opacity","1");

			})*/
			setTimeout(SCR.dispNone(SCR.modes[i]),500);
		}
		setTimeout(function() {
			$("."+SCR.active).css("display","blocK");
			$("."+SCR.active).css("opacity","1");
		},500);
	}
}

SCR.dispNone = function(mode) {
	return function() {
		$("."+mode).css("display","none");
	}
}
	
SCR.staFocus = function(e) {
	if (SCR.expanded) {
		$("#spellCheckToggle").click();

	}
}

SCR.toggleSpellCheck = function(e) {
	var target = $(this)
	if (!SCR.expanded) {
		SCR.SCI.animate({
			height: '200px',
			width: '300px',
			left: '-310px',
		}, 500);
		SCR.expanded=true
		SCR.populateSpellCheck(SCR.speeling,SCR.page)
		SCR.page = 0;
	} else {
		SCR.SCI.animate({
			height: '28px',
			width: '150px',
			left: '-160px',
		}, 500);
		SCR.expanded=false
	}
		
}
SCR.populateSpellCheck = function(opt,index) {
	if (!opt[index]) {
		$("#spellCheckHeader span").text("")
		$("#spellCheckOpt").html("");
		$("#spellCheckToggle").html("<span>No Spelling Errors</span>")
		return;
	}
	var words = SCR.STA.val().split(" ");
	$("#spellCheckHeader span").text(words[opt[index][0]]);
	var spellCheckInnerHTML = ""
	for (i in opt[index][1]) {
		spellCheckInnerHTML+=SCR.genOpt(opt[index][1][i],opt[index][0]);
	}
	$("#spellCheckOpt").html(spellCheckInnerHTML);
	SCR.bindSpellCheckOpt()
	if (opt.length>1) {
		$("#spellCheckToggle").html("<span>"+opt.length+" Spelling Errors</span>")
	} else if (opt.length==1) {
		$("#spellCheckToggle").html("<span>"+opt.length+" Spelling Error</span>")
	}


	var highlight = $("#spellCheckHighlight")
	if (highlight) {
		//console.log(opt)
		var i;
		var adjust = " "+highlight.text()+" ";
		for (i in opt) {
			if (i==index) {
				adjust = adjust.replace(" "+words[opt[i][0]]+" "," <span style='background:yellow; color:yellow; border-bottom:1px solid red'>"+words[opt[i][0]]+"</span> ");
				//console.log(words);
				//console.log(adjust,words[opt[i][0]]);
			} else {
				adjust = adjust.replace(" "+words[opt[i][0]]+" "," <span style='border-bottom:1px solid red'>"+words[opt[i][0]]+"</span> ");
				//console.log(words);
				//console.log(adjust,words[opt[i][0]]);
			}
			//console.log(adjust)
		}
		adjust = adjust.slice(1,adjust.length-1);
		console.log(adjust)
		highlight.html(adjust);
	}
}
SCR.genOpt = function(opt,wordNum) {
	return "<span class='spellCheckOption' num='"+wordNum+"' value='"+opt+"'>"+opt+"</span>"
}
SCR.spellTextEvent = function(e) {
	SCR.speeling = SCR.dummySpelling(SCR.STA.val());
	var highlight = $("#spellCheckHighlight")
	if (highlight) {
		highlight.html(SCR.STA.val());
	}
	SCR.populateSpellCheck(SCR.speeling,SCR.page)

}
SCR.bindSpellCheckOpt = function() {
	var SCO = $(".spellCheckOption")
	SCO.off()
	SCO.click(function(e) {
		var opt = $(this)
		var toChange = SCR.STA.val()
		toChange = toChange.split(" ")
		toChange[parseInt(opt.attr("num"))] = opt.attr("value");
		toChange = toChange.join(" ");
		SCR.STA.val(toChange);
		SCR.spellTextEvent();
	})
}




//while Lucas.isDoing(usaco) == true:
SCR.dummySpelling = function(WC) {
	var dummyWords = ["hello", "world", "how", "are", "you", 'pizza','artichokical','blah','dah','tah', 'undefined'];
	var wordList = WC.split(" ");
	var corrections = [];
	for (i in wordList) {
		var tmpWord = wordList[i];
		if (dummyWords.indexOf(tmpWord) < 0 && tmpWord != "") {
			corrections.push([i, [dummyWords[i],'pizza','artichokical', 'blah', 'dah', 'tah']]);
		}
	}
	return corrections;
}

$(window).load(SCR.loadModule);
