/* 
 * slide text boxes, images, lists ...
 * @plugin textSlide
 * @author {macem | acem@go2.pl} Marcin Sołtysiuk
 * @version {0.6beta}
 * @support {IE6+ , FF , Safari , Opera}
 * 
 * --------------------------------------------
 * version 0.6.5beta
 * - support jQuery 1.4.1-1.4.2,
 * - rewrite code for performance, 
 * - fix blinking slideshow stop text, when hover on breadcrumb,
 * - add new param slides - how many slides show on,
 * version 0.7
 * - move some part of code to plugins,
 * - x5 faster initialize plugin,
 * - new design for plugin,
*/

$.textSlide = { 
	option : {
		step      : 1,            // how many slides
		axis      : 'horizontal', // [vertical, horizontal]
		slide     : 0,            // start from this slide  
		slides    : 1,            // how many slides visible
		navigate  : true,
		fx        : 'slide',      // [slide, show, fade]
		fxoption  : [1500], 
		onSlideEnd: function ($pane, option) {}, 
		previous  : { 
			href  : '#previous-slide',
			className: 't-previous',
			title : 'previous slide',
			innerHTML : 'previous'
		},
		next : { 
			href  : '#next-slide',
			className : 't-next',
			title : 'next slide',
			innerHTML : 'next'
		},
		_nextslide: 0
	},
	events : 'click', // mouseover mouseout keyup
	event : { // object events
		click : [function ($target, node) {
			var fn = $.textSlide.fn;
			if ($target.hasClass ('t-previous')) {
				fn.go ($target, 'previous'); 
			} else if ($target.hasClass ('t-next')) {
				fn.go ($target, 'next'); 
			} else if ($target.parent().parent().hasClass ('t-breadcrumb')) {
				fn.go ($target, $target.attr ('slide'));
			} 
			return false;	
		}]	
	},
	fn : {
		coords : function (option) {
			if (option.axis == 'horizontal') return {
				left: -option._nextpos }; 
			else if (option.axis == 'vertical') return { 
				top: -option._nextpos };				
		},
		space : function (self, style) {
			return self[0][style[0]] + parseInt (self.css(style[1])) + parseInt (self.css(style[2]));
		},		
		parentClass : function (node, className) {
			var parent = node.parentNode || null;
			while (parent) {
				if (!parent) return false;
				else if (parent.className.indexOf (className) != -1) return parent;
				parent = parent.parentNode || null;
			}
		},
		size : function ($first, params) {
			var $prev = $first, size = 0;
			while (($prev = $prev.prev()).length > 0) {
				size += $.textSlide.fn.space ($prev, params);
			};
			return size;			
		},				
		slide : function ($pane, $slide, option) {
			$pane.animate ($.textSlide.fn.coords (option), option.fxoption[0], function () { 
				option._fx = false; option.onSlideEnd ($pane, option);
			});
		},
		show : function ($pane, $slide, option) {
			$pane.css ($.textSlide.fn.coords (option));
			option._fx = false;
			option.onSlideEnd ($pane, option);
		},
		fade : function ($pane, $slide, option) {
			$pane.fadeOut (option.fxoption[0], function () {
				$pane.css ($.textSlide.fn.coords (option)).fadeIn (option.fxoption[0], function () { 
					option._fx = false; option.onSlideEnd ($pane, option); 
				});
			});
		},
		onCreate : [], // function () {}
		onSlide : [] // function () {}			
	}
};

$.fn.textSlide = function (o) {
	
	var options = $.extend ({}, $.textSlide.option, o);
		
	// display slide 
	$.textSlide.fn.display = function ($tag, $container) {
		var node = $container[0].parentNode.parentNode, o = node.options, i=0, len, $prev,
		$slides = {
			current : $(o.data[o.slide]),
			next    : $(o.data[o._nextslide])
		};

		o._fx = true;
		o._nextpos = 0;

		o._nextpos = $.textSlide.fn.size ($slides.next, (o.axis=='horizontal' ? ['offsetWidth', 'marginLeft', 'marginRight'] : ['offsetHeight', 'marginTop', 'marginBottom']));

		for (len=$.textSlide.fn.onSlide.length; i<len; i++) {
			$.textSlide.fn.onSlide[i] ($(node), $slides);
		}
		
		$.textSlide.fn[o.fx] ($container, $slides, o);
	
		o.slide = o._nextslide;
	};

	// show [next, previous, int] slide  
	$.textSlide.fn.go = function ($tag, direction) {
		var $this = $tag, o = $.textSlide.fn.parentClass ($tag[0], 't-slider').options, 
		elements = o.data.length, tmp = (elements-o.slide-o.slides);
	
		if (direction == 'next') {
			o._nextslide = o.slide + (o.step<tmp ? o.step : tmp); 
		} else if (direction == 'previous') {
			o._nextslide = o.slide - (o.slide%o.step || o.step);
		} else {
			o._nextslide = (((direction*1)+o.slides)>elements ? (elements-o.slides) : (direction*1));	
		}

		if (o._nextslide < 0) {
			o._nextslide = elements - o.slides;
		} else if (o._nextslide > (elements-1) || direction == 'next' && (o.slide + o.slides) >= elements) {
			o._nextslide = 0;
		} 
			
		$.textSlide.fn.display ($this, o.container);

		return false;
	};
	
	// create navigation
	$.textSlide.fn.navigate = function ($node) {
		var o = $node[0].options;
		$node.prepend ($('<a/>').attr(o.next), $('<a/>').attr(o.previous));
	};
	
	$.textSlide.fn.init = function ($node) {
		var o = $node[0].options;
		
		$node.addClass ('t-slider t-' + o.axis + (o.autosize?' t-autosize':''));

		if (!$node[0].children[0].className.match (/t-pane/)) {
			$('<div/>').addClass('t-pane')
			.append ((o.container=$('<div/>')).addClass('t-container').append ($node[0].children))
			.appendTo ($node);
		} 

                (o.data = $(o.container[0].children)).addClass ('t-slide');

		$slide = o.data[o.slide];

		if (o.navigate) $.textSlide.fn.navigate ($node);

		if (o.slide !== 0) {
			o._nextslide = options.slide;
			o.slide = 0;
			$.textSlide.fn.display ($node, o.container); 
		}
	};
				
	this.each (function () {
		var $this = $(this), $slide, fn = $.textSlide.fn, i = 0, len;
		
                this.options = options; 
		
		fn.init ($this);         

		for (len=fn.onCreate.length; i<len; i++) {
			fn.onCreate[i] ($this);
		}

		$this.bind ($.textSlide.events, function (event) {
			var $return = false, $target = $(event.target), node = $.textSlide.fn.parentClass ($target[0], 't-slider');
			for (eventname in $.textSlide.event) {
				for (var i=0, len=$.textSlide.event[eventname].length; i<len; i++) {
					$return = $.textSlide.event[eventname][i]($target, node);
				}
			}
			return $return;
		});
	});
};