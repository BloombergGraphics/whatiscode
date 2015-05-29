/* http://codepen.io/arjentienkamp/pen/MYpYMO */

$(document).ready(function(event) {

	$("div#swipe_like").on( "click", function() {
		swipeLike();
	});

	$("div#swipe_dislike").on( "click", function() {
		swipeDislike();
	});

	addNewProfile();

	function swipe() {
		Draggable.create("#photo", {
		   	throwProps:true,
		   	onDragEnd:function(endX) {
	   			if(Math.round(this.endX) > 0 ) {
	   				swipeLike();
	   			}
	   			else {
	   				swipeDislike();
	   			}
	   			console.log(Math.round(this.endX));
			}
		});
	}

	function swipeLike() {

			var $photo = $("div.content").find('#photo');

			var swipe = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0, onComplete:remove, onCompleteParams:[$photo]});
			swipe.staggerTo($photo, 0.8, {bezier:[{left:"+=400", top:"+=300", rotation:"60"}], ease:Power1.easeInOut});

			addNewProfile();
	}

	function swipeDislike() {

			var $photo = $("div.content").find('#photo');

			var swipe = new TimelineMax({repeat:0, yoyo:false, repeatDelay:0, onComplete:remove, onCompleteParams:[$photo]});
			swipe.staggerTo($photo, 0.8, {bezier:[{left:"+=-350", top:"+=300", rotation:"-60"}], ease:Power1.easeInOut});

			addNewProfile();
	}

	function remove(photo) {
	    $(photo).remove();
	}

	function addNewProfile() {
		var profile = [
			{
				"name": "D3",
				"author": "Mike Bostock",
				"photo": "5.png"
			},
			{
				"name": "D3 Jetpack",
				"author": "Gregor Aisch",
				"photo": "4.png"
			},
			{
				"name": "A bit of Code Issue",
				"author": "Toph Tucker",
				"photo": "3.png"
			},
			{
				"name": "Sandbox",
				"author": "Joss Crowcroft",
				"photo": "2.png"
			},
			{
				"name": "A bit of Paulbot",
				"author": "Toph Tucker",
				"photo": "1.png"
			},
		][Math.floor(Math.random()*5)];
		$("div.content").prepend('<div class="photo" id="photo" style="background-image:url(img/'+profile.photo+')">'
    	+ '<span class="meta">'
    	+ '<p>'+profile.name+', '+profile.author+'</p>'
    	+ '</span>'
    	+ '</div>');

    	swipe();
	}

});
