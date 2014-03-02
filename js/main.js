/*The MIT License (MIT)

Copyright (c) 2014 Dee Roberts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

$(document).ready(function() {

	//localStorage.clear();

	//Main drawing tools
	var tool = "Pencil";
	var $canvas = $("#paintingArea");
	var context = $canvas.get(0).getContext('2d');
	var drawing = false;
	var lastX, lastY;
	var canvX = $canvas.offset().left;
	var canvY = $canvas.offset().top;
	var recX = 300;
	var recY = 200;

	//Customisation variables - Sprayer
	var spray_size = 50;
	var spray_speed = 50;
	var horizontal_size = 1;
	var vertical_size = 1;

	//Customisation variables - Paintbrush
	var brush_size = 5;
	var brush_angle = 0;

	//Customisation variables - Pencil
	var pencil_size = 1;

	for(var value in localStorage) {
		$('#painting_browser').append("<li class='close-reveal-modal key'>" + value + "\</li>");
	}

	function colourGenerator() {
		var values = "0123456789abcdef".split('');
		var randomColour = "#";

		for (var i = 0; i < 6; i++) {
			randomColour += values[Math.round(Math.random() * 15)]
		};

		console.log("The colour that was chosen was " + values);
		$('.gradient').css("background-color", randomColour);
	};

	$('.gradient').click(function() {
		colourGenerator();
	});

	$('.swatch:not(".gradient")').each(function() {
		$(this).css("background-color",$(this).text()).empty();
	});
	
	$('.swatch').click(function() {
		color = $(this).css('background-color');
		context.strokeStyle = color;
		context.fillStyle = color;

		$('.cursor').css('background-color', color);
	});

	$('.swatch').on({
	    click: function() {
	        $('.swatch').not(this).removeClass('active').animate({ borderTopLeftRadius: 100 }, 200);
	        $(this).addClass('active').css({ borderTopLeftRadius: 40 });
	    },
	    mouseenter: function() {
	        if (! $(this).hasClass('active') ) {
	            $(this).animate({ borderTopLeftRadius: 40 }, 200)
	        }
	    },
	    mouseleave: function() {
	        if (! $(this).hasClass('active') ) {
	            $(this).animate({ borderTopLeftRadius: 100 }, 200)
	        }
	    }
	});

	$('#painting_browser span').click(function() {
		localStorage.clear();	
		location.reload();
	}); 

	var clear = function()
	{
		context.clearRect(0, 0, $canvas.attr("width"), $canvas.attr("height"));		
	};
	var save_painting = function()
	{
		var painting_title = prompt("What is the painting called?").toTitleCase();		
		var canvas = document.getElementById("paintingArea");
		localStorage.setItem(painting_title, canvas.toDataURL());
	}
	var load_painting = function()
	{
		var painting_title = prompt("Which painting do you want to call up?").toTitleCase();
		clear();
		var painting = new Image;
		painting.src = localStorage.getItem(painting_title);
		painting.onload = function() {
			context.drawImage(painting, 0, 0);
		}
	} 
	var export_painting = function()
	{
		var canvas = document.getElementById("paintingArea");
		window.open(canvas.toDataURL("image/png"));
		var pngUrl = canvas.toDataURL();
		console.log(pngUrl);
		$(this).removeClass('selected');
	}
	var print_painting = function()
	{
		var title = prompt("What is your painting called?");

		if(title == "") {
			$('#print').text("My Creative Painting");
		} else {
			$('#print').text(title);
		}

		window.print();
	}

	$('.new').click(function() {
		clear();
	});
	$('.save').click(function() {
		save_painting();
	});
	$('.export').click(function() {
		export_painting();
	});
	$('.print').click(function() {
		print_painting();
	})

	$('.tool').click(function(evt){
		var t_old = tool;
		tool = $(this).text().trim();

		if( tool != "New" || tool != "Export" || tool != "Print" || tool != "Save" )
		{
			$('.tool').removeClass("selected");
			$(this).addClass("selected");
		}
		else
		{
			tool = t_old;
		}
	});

	$('#painting_browser li').click(function() {
		clear();
		var painting_name = $(this).text();
		var painting = new Image;
		painting.src = localStorage.getItem(painting_name);
		painting.onload = function() {
			context.drawImage(painting, 0, 0);
		}
	});

	$('#painting_browser li').dblclick(function() {
		var painting_name = $(this).text();
		var painting = new Image;
		localStorage.removeItem(painting_name);
		$(this).fadeOut('5000');
	});

	$('#painting_browser li').dblclick(function() {
		var painting_name = $(this).text();
		$(this).fadeOut('slow');
		localStorage.removeItem(painting_name);
	})

	//Now it's time for some spraying action!
	function spray()
	{
		var ang,rad,px,py;

		for(var i = 0; i < spray_speed; i++)
		{
			ang = Math.random() * 90000 * Math.PI;
			rad = Math.random() * spray_size;
			px = lastX + rad * Math.cos(ang);
			py = lastY + rad * Math.sin(ang);
			context.fillRect(px - 1, py - 1, horizontal_size, vertical_size);
		}

		if(drawing)
			setTimeout(spray, 0.1);
	}

	//Now, the main act - oh yes, let's do some drawing!
	$('#paintingArea').mousedown(function(evt){

		drawing = true;
		lastX = evt.pageX - canvX;
		lastY = evt.pageY - canvY;

		if(drawing && tool == "Sprayer")
		{
			spray();;
		}
		if( tool == "Paintbrush" )
		{
			context.beginPath();
			context.arc(lastX,last,last,last,Math.PI*2);
			context.fill();	
		}

	}).mouseup(function(evt){
		drawing = false;
	}).mousemove(function(evt){

		if(drawing)
		{
			var cx = evt.pageX - canvX;
			var cy = evt.pageY - canvY;
			
			switch(tool)
			{
				case "Pencil":
					context.lineWidth = pencil_size;
					context.beginPath();
					context.moveTo(lastX,lastY);
					context.lineTo(cx,cy);
					context.stroke();
				break;
				case "Paintbrush":
				{	
					var dx = cx - lastX;
					var dy = cy - lastY;
					var px = lastX;
					var py = lastY;
					var steps = Math.floor(Math.sqrt(dx * dx + dy * dy));
					dx /= steps;
					dy /= steps;
					for(var i= 0; i < steps; ++i)
					{
						context.beginPath();
						context.arc(px, py, brush_size, brush_angle, Math.PI*2);
						context.fill();	
						px += dx;
						py += dy;
					}
				}
				break;
			}
			lastX = cx;
			lastY = cy;
		}
	}).mouseenter(function(evt){

		lastX = evt.pageX - canvX;
		lastY = evt.pageY - canvY;

	});

	String.prototype.toTitleCase = function() {
	    var i, str, lowers, uppers;
	    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
	        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    });

	    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
	    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With', 'Is'];
	    for (i = 0; i < lowers.length; i++)
	        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
	            function(txt) {
	                return txt.toLowerCase();
	            });

	    uppers = ['Id', 'Tv'];
	    for (i = 0; i < uppers.length; i++)
	        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
	            uppers[i].toUpperCase());

	    return str;
	}

	$('.spray_size_slider').noUiSlider({
		range: [10,500]
		,start: [50,50]
		,handles: 1
		,step: 10
		,slide: function() {
			spray_size = $(this).val();
			$('.sprayer_size span').text("Sprayer Size - " + spray_size);
			console.log(spray_size);
		}
	});

	$('.spray_speed_slider').noUiSlider({
		range: [10,500]
		,start: [50,50]
		,handles: 1
		,step: 10
		,slide: function() {
			spray_speed = $(this).val();
			$('.sprayer_speed span').text("Sprayer Speed - " + spray_speed);
			console.log(spray_speed);
		}
	});

	$('.spray_horizontal_slider').noUiSlider({
		range: [1,100]
		,start: [1,1]
		,handles: 1
		,step: 1
		,slide: function() {
			horizontal_size = $(this).val();
			$('.sprayer_horizontal span').text("Horizontal Sprayer Size - " + horizontal_size);
			console.log(horizontal_size);
		}
	});

	$('.spray_vertical_slider').noUiSlider({
		range: [1,100]
		,start: [1,1]
		,handles: 1
		,step: 1
		,slide: function() {
			vertical_size = $(this).val();
			$('.sprayer_vertical span').text("Vertical Sprayer Size - " + vertical_size);
			console.log(vertical_size);
		}
	});

	$('.brush_size_slider').noUiSlider({
		range: [1,100]
		,start: [5,5]
		,handles: 1
		,step: 1
		,slide: function() {
			brush_size = $(this).val();
			$('.paintbrush_size span').text("Paintbrush Size - " + brush_size);
			console.log(brush_size);
		}
	});

	$('.brush_angle_slider').noUiSlider({
		range: [0,200]
		,start: [1,200]
		,handles: 1
		,step: 1
		,slide: function() {
			brush_angle = $(this).val();
			$('.paintbrush_angle span').text("Paintbrush Angle - " + brush_angle);
			console.log(brush_angle);
		}
	});

	$('.pencil_size_slider').noUiSlider({
		range: [1,200]
		,start: [1,1]
		,handles: 1
		,step: 1
		,slide: function() {
			pencil_size = $(this).val();
			$('.pencil_size span').text("Pencil Size - " + pencil_size);
			console.log(pencil_size);
		}
	});

});