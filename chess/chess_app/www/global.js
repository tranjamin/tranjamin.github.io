
var username = "anon";
var user_id = "";

var overlay_or_canvas = $('overlay') ? $('overlay') : $('canvas1')


function $(id) { return document.getElementById(id); }

function find_overlap(element, x_or_y, single_line=true) {
	var overflow_bool = false;

	if (single_line) {
		if ((getComputedStyle(element).height.slice(0,-2)) / (isNaN(parseFloat(getComputedStyle(element).lineHeight)) ? getComputedStyle(element)['font-size'] * 1.5 : getComputedStyle(element).lineHeight) > 1.2) {
			return true;
		}
	}

    switch (x_or_y) {
		case 'x': 
			if (element.clientWidth != element.scrollWidth) {overflow_bool = true}
			break;
        case 'y': 
            if (element.clientHeight != element.scrollHeight || element.clientHeight > element.parentElement.clientHeight || (parseFloat(getComputedStyle(element).height.slice(0,-2)) > parseFloat(getComputedStyle(element.parentElement).height.slice(0,-2)))
            ) {overflow_bool = true}
			break;
		default: 
			if (element.clientWidth != element.scrollWidth || element.clientHeight != element.scrollHeight || (parseFloat(getComputedStyle(element).height.slice(0,-2)) > parseFloat(getComputedStyle(element.parentElement).height.slice(0,-2)))) {overflow_bool = true}
			break;
}
	return overflow_bool;
}



function reduce_size(element, x_or_y, single_line=true, interval=0.5) {
	while (find_overlap(element, x_or_y, single_line)) {
		element.style['font-size'] = (parseFloat(getComputedStyle(element)['font-size'].slice(0,-2)) - interval) + "px";
	}
	return getComputedStyle(element)['font-size'];
}

function global_function() {
console.log('global function');
update_nav_graphics();

username = "anon";
user_id = "";
overlay_or_canvas = $('overlay') ? $('overlay') : $('canvas1')

$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    e.preventDefault();
    if (e.target.innerHTML == "Login/Signup" || e.target.innerHTML == "👤") {window.location.assign('signup.html')}
    else {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('game_id');
        setCookie('user_id', "", 0);
		setCookie('username', "", 0);
		setCookie('game_id', 0)
		auth.signOut().then(() => {
            location.reload();
        });
        }
});
$('nav').getElementsByTagName('li')[1].addEventListener('click', e => {
    location.assign('account.html');
});
$('nav').getElementsByTagName('li')[2].addEventListener('click', e => {
location.assign('create.html');
});
$('nav').getElementsByTagName('li')[3].addEventListener('click', e => {
location.assign('load.html');
});
$('nav').getElementsByTagName('li')[4].addEventListener('click', e => {
location.assign('about.html');
});
$('nav').getElementsByTagName('li')[5].addEventListener('click', e => {
    location.assign('statement.html');
});
}

function update_nav_graphics () {
    console.log('updating nav graphics')
    var overlay = $('overlay');
    var nav = $('nav');
    nav.style.height = window.innerHeight * 0.05 + "px";
    nav.style.width = screen.width + "px";
    nav.style.top = 0;
    nav.style.left = 0;

    ([]).forEach.call(document.querySelectorAll('#nav a'), ele => {
        ele.style.lineHeight = getComputedStyle(ele).height;
    })

    var new_size;

}

window.addEventListener('DOMContentLoaded', e => {
    global_function();
})