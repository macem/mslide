$.textSlide.option.wheel = true;
	
$.textSlide.fn.wheel = function (event) {
	var node = $.textSlide.fn.parentClass (event.target, 't-slider')||null, ieev = window.event, delta;

        if (!node) return;

	delta = (ieev && ieev.wheelDelta) ? ev.wheelDelta/120 : (event.detail ? -event.detail/3 : null);  // IE/Opera // Mozilla
	
	$.textSlide.fn.go ($(node.firstChild), (delta > 0 ? 'next' : 'previous'));

	(addEventListener ? event.preventDefault() : ieev.returnValue = false);
	
	return false;
};

$.textSlide.fn.onCreate.push (function ($node) {
	if (!$node[0].options.wheel) return;
	
	(addEventListener ? addEventListener ('DOMMouseScroll', $.textSlide.fn.wheel, false)
		: document.onmousewheel = $.textSlide.fn.wheel);
});		