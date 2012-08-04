$.textSlide.option.breadcrumb = true;
$.textSlide.option.breadcrumbTitle = 'slide '; //'slide 1'
	
// select current breadcrumb
$.textSlide.fn.current = function (id, node) {
	var $breadcrumb = $('ul.t-breadcrumb', node); 
	$('a.active', $breadcrumb).removeClass ('active');
	$('a[slide=' + id + ']', $breadcrumb).addClass ('active');
	$breadcrumb.next().text ((node.options._nextslide+1) + '/' + node.options.data.length);
};

// create breadcrumb TODO - own template		
$.textSlide.fn.breadcrumb = function ($this) {
	var html = '<ul class="t-breadcrumb">', o = $this[0].options, i = 0, len, title;
	
	for (len=o.data.length; i<len; i+=o.step) {
		title = (o.data[i].alt||o.data[i].title||(o.breadcrumbTitle+(i+1))); // alt from img or title from div
		html += '<li><a href="#slide" title="' + title + '" slide="' + i + '">' + (i+1) + '</a></li>';	
	}
	o._slides = i*o.step;
	
	return html + '</ul><strong class="t-breadcrumb-count"/>';	
};

$.textSlide.fn.onSlide.push (function ($node, $slides) {
	var o = $node[0].options;
	if (!o.breadcrumb) return;
	$.textSlide.fn.current (Math.ceil (o._nextslide/o.step)*o.step, $node[0]); // check *o.step
});

$.textSlide.fn.onCreate.push (function ($node) {
	var o = $node[0].options, fn = $.textSlide.fn;
	if (!o.breadcrumb) return;
	
	$node.prepend (fn.breadcrumb ($node));
	fn.current (o.slide, $node[0]); 
		
	function hover (self) {
		var node = fn.parentClass (self, 't-slider');
		return $('ul.t-breadcrumb a[slide=' + (Math.floor($(self).prevAll().length/o.step)*o.step) + ']', node);
	}	
		
	/*$('div.t-container > *', $node).live ('mouseenter', function () {
		hover (this).addClass ('current');
	}).live ('mouseleave', function () {
		hover (this).removeClass ('current')
	});*/	
});		