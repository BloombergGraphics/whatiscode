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
		var names = ['Lieke', 'Christina', 'Sanne', 'Soraya', 'Chanella', 'Larissa', 'Michelle'][Math.floor(Math.random() * 7)];
		var ages = ['19','22','18','27','21', '18', '24'][Math.floor(Math.random() * 7)]
		var photos = ['1', '2', '3', '4', '5', '6', '7'][Math.floor(Math.random() * 7)]
		$("div.content").prepend('<div class="photo" id="photo" style="background-image:url(http://web.arjentienkamp.com/codepen/tinder/photo'+photos+'.jpg)">'
    	+ '<span class="meta">'
    	+ '<p>'+names+', '+ages+'</p>'
    	+ '<span class="moments">0</span>'
    	+ '<span class="users">0</span>'
    	+ '</span>'
    	+ '</div>');

    	swipe();
	}

});
