$.textSlide.option.autosize = false; // time for size ms
	
//* get slide height or width
$.textSlide.fn.dimension = function ($slide, step, offset) {
	for (var i = 1, pos = $slide[0][offset]; i < step; i++) { 
		pos += $slide.next()[0][offset]; 
	}
	return pos;		
};

//* set slide size
$.textSlide.fn.autosize = function (node, $next) {
	var coords, o = node.options, fn = $.textSlide.fn;

	if (o.axis == 'horizontal') 
		coords = {width: fn.dimension ($next, o.slides, 'offsetWidth')};
	else if (o.axis == 'vertical') 
		coords = {width: $next.width(), height: fn.dimension ($next, o.slides, 'offsetHeight')};

	$(node).animate (coords, o.autosize);	
};

$.textSlide.fn.onCreate.push (function ($node) {
	var o = $node[0].options;
	if (o.autosize) $.textSlide.fn.autosize ($node[0], o.data[o.slide]);
});

$.textSlide.fn.onSlide.push (function ($node, $slides) {
	if ($node[0].options.autosize) $.textSlide.fn.autosize ($node[0], $slides.next);
});		