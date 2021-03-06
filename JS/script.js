var textarea = document.getElementById("textarea");
var pop_up = document.getElementById("pop_up");
var limit = 10000;

var posts_title_arr = ["The story"];
var posts_text_arr = ["A long, long time ago in a warped, warped galaxy... After leaving the fragile planet Jupiter, a group of wizards fly toward a distant speck. The speck gradually resolves into a frosty, space hall. Civil war strikes the galaxy, which is ruled by Beth Jolie, a warped robot capable of jealousy and even violence. Terrified, a ripped witch known as Roger Sparkle flees the Empire, with his protector, Jessica Zeus. They head for Philadelphia on the planet Mooyani. When they finally arrive, a fight breaks out. Zeus uses her warped candlestick to defend Roger. Zeus and Witch Roger decide it's time to leave Mooyani and steal a scooter to shoot their way out. They encounter a tribe of aliens. Zeus is attacked and the witch is captured by the aliens and taken back to Philadelphia."];
var posts_time_arr = ["Ghost Post"];

var curr_post_displayed = 0;
var messagesRef = new Firebase('https://brilliant-fire-8407.firebaseio.com/');
var posted = 0;
//Random number Generator
function randNum( min, max ) {
    return Math.random() * ( max - min ) + min;
}

function new_post(title, post, time){
	var posts = $(".posts");
	
	posts.prepend("<div id=\"post_" + posted + "\" class=\"anon_text_container topdown_view\"> <div id=\"title_" + posted + "\" class=\"title box_view\">" + title + " <span class=\"time_posted\">" + sort_time(time) + "</span></div> <div id=\"text_" + posted + "\" class=\"text\">" + post + "</div> </div>" );
	posted++;
}
function GID(id){
	return document.getElementById(id);
}

function replace(text, item, new_item){
	var re = new RegExp(item,"g");
	text = text.replace(re, new_item);
	return text;
}

function sanatize(text){
	text = (replace(text, ">", "&gt"));
	text = (replace(text, "<", "&lt"));

	return text;
}

function sort_time(time){
	if(time.length > 5){
		return time;
	}
	var curr_time = new Date().getTime();
	var time_diff = (((curr_time - time)/1000)/60).toFixed(0); 
	if((time_diff/60) >= 24){
		time = ((time_diff/60)/24).toFixed(0) + " days ago";
	} else if(time_diff >= 60){
	    time = (time_diff/60).toFixed(0) + " Hours ago";
	} else {
		time = time_diff + " Minutes ago"; 
	}
	return time;
}

messagesRef.on('child_added', function (snapshot) {
	var data = snapshot.val();
    title = data.title_;
    post = data.post_;
	time = data.time_;

    posts_title_arr.push(sanatize(title));
    posts_text_arr.push(sanatize(post));
	posts_time_arr.push(sanatize(sort_time(time)));
});
window.setTimeout(function(){
	GID("posts").innerHTML = "";
	for(var i = 0; i < posts_title_arr.length; i++){
		new_post(sanatize(posts_title_arr[i]), posts_text_arr[i].slice(0, randNum(100, 200)) +  "...", posts_time_arr[i]);
	}
}, 2000);

function get_end_ID(id){
    var x = "";
	if(id.length > 6){
		for(var i = 0; i < id.length; i++){
          if(i > 4){
              x += id[i];
          }
        }
	} else {
	   return id[id.length - 1];	
	}
	return x;
}

function scroll_to_top(){
	$('html,body').animate({
      scrollTop: $("#top").offset().top + -190
    }, 1000);
}
$(document).on('click', '.anon_text_container' ,function() {
    var x = this.id;
    var indx = Number(get_end_ID(x));
	GID("post_title").innerHTML = posts_title_arr[indx];
	GID("post_text").innerHTML = posts_text_arr[indx];
	GID("time_posted").innerHTML = posts_time_arr[indx];
	curr_post_displayed = indx;
	$(".display_post_continer").toggleClass("not_displayed");
	scroll_to_top();
	$(".container").addClass("not_displayed_text");
	$(".site-footer").addClass("not_displayed_text");
});

window.setInterval(function(){
	if(curr_post_displayed <= 0){
		$(".previous_post").addClass("remove_switch");
		$(".next_post").removeClass("remove_switch");
	} else {
		$(".previous_post").removeClass("remove_switch");
		$(".next_post").addClass("remove_switch");
	}
    if(curr_post_displayed > (posts_text_arr.length - 2)){
		$(".next_post").addClass("remove_switch");
	} else {
		$(".next_post").removeClass("remove_switch");
	}
}, 100);

$(".switch_post").click(function(){
	var id = this.id;
	if(id == "next"){
		curr_post_displayed++;
	} else if(id == "previous"){
		curr_post_displayed--;
	}
	GID("post_title").innerHTML = posts_title_arr[curr_post_displayed];
	GID("post_text").innerHTML = posts_text_arr[curr_post_displayed];
	GID("time_posted").innerHTML = posts_time_arr[curr_post_displayed];
});

$(".close_button").click(function(){
	$(".display_post_continer").toggleClass("not_displayed");
	$(".container").removeClass("not_displayed_text"); 
	$(".site-footer").removeClass("not_displayed_text");
});