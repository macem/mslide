$.textSlide.option.onAuto     = function() {};
$.textSlide.option.onAutoStop = function() {};
$.textSlide.option.auto       = 'next'; // [next, previous]  autoslide
$.textSlide.option.wait       = 6000;   // ms
$.textSlide.option._mouseover = false;  // when mouseover
$.textSlide.option._timeout   = null;
$.textSlide.option.play = { 
	href  : '#slideshow-play',
	className : 't-play',
	title : 'start slideshow',
	innerHTML : 'play'	
};
$.textSlide.option.stop = {
	href  : '#slideshow-stop',
	className : 't-play t-stop',
	title : 'stop slideshow',
	innerHTML : 'stop'
};
	
$.textSlide.fn.auto = function (node) {
	var o = node.options;
	if (!o.auto || o._mouseover) return; 
	
	o.onAuto (node);
	
	$('ul.t-breadcrumb a:eq(' + Math.ceil (o._nextslide/o.step) + ')', node).fadeTo (o.wait, 0, function () {
		this.removeAttribute ('style');
	});
	
	o._timeout = setTimeout (function () {
		$.textSlide.fn.go ($(node.firstChild), o.auto);
	}, (o.wait + o.fxoption[0])); 
};

$.textSlide.fn.stopAuto = function (node) {
	$(node).mouseover (function () {
		var o = this.options;
		o._mouseover = true;
		if (!o.auto) return;
		clearTimeout (o._timeout);
		// TODO
		$('ul.t-breadcrumb a:eq(' + Math.ceil (o.slide/o.step) + ')', this).stop().removeAttr ('style');
		o.onAutoStop (this);
	}).mouseout (function () {
		var o = this.options;
		o._mouseover = false;
		if (o.auto) $.textSlide.fn.auto (this);
	});		
};

$.textSlide.fn.onCreate.push (function ($node) {
	var o = $node[0].options, fn = $.textSlide.fn;
	
	o.container.parent().before ($('<a/>').attr(o.auto?o.stop:o.play));

	$.textSlide.event.click.push (function ($target, node) {
		var o = node.options;
		if (!$target.hasClass ('t-play')) return false;
		if (!o.auto) {
			o.auto = 'next';
			$target.attr (o.stop).blur();
		} else {
			o.auto = false;
			$target.attr (o.play).blur();
		}  		
		return false;
	});	
	
	fn.stopAuto ($node[0]);

	if (o.auto) fn.auto ($node[0]);	
});

$.textSlide.fn.onSlide.push (function ($node, $slides) {
	if ($node[0].options.auto) $.textSlide.fn.auto ($node[0]);	
});		