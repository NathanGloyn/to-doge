function Doge($){
	var colors = ["red", "green", "blue", "yellow", "magenta", "cyan"];
	var sizes = ["small", "medium", "big"];
	var phrases = ["wow", "much cool", "lol"];
	
	var dogePos;
	var dogeWidth = 0;
	
	function getPhrase() {
		if(!phrases.length) {
			return "wow";
		}
		var i = Math.floor(Math.random() * phrases.length);
		return phrases[i];
	}	
	
	function createText() {
		var text = $('.text');
		if(text.length > 50) {
			text[0].remove();
		}
		var div = $('<div />').addClass('text');
		div.addClass( sizes[Math.floor(Math.random() * sizes.length)] );
		div.addClass( colors[Math.floor(Math.random() * sizes.length)] );
		div.html(getPhrase());
		var leftPosition = (Math.random() * 550) + dogePos.left;
		if(leftPosition < dogePos.left){
			leftPosition = leftPosition + dogePos.left;
		}
		
		var topPosition = (Math.random() * 600) + dogePos.top;
		
		
		div.css('left', leftPosition + "px");
		div.css('top', topPosition + "px");
		div.hide();
		$('#doge').append(div);
		div.fadeIn(600);
	}

	this.display = function() {
		$('#doge').toggle();
		dogePos = $('#doge').position();
		dogeWidth = $('#doge').width();
		for(var i = 0; i < 50; i++) {
			createText();
		}			
	};
}