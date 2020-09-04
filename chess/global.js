function $(id) { return document.getElementById(id); }

function setCookie(cname, cvalue, exdays) {
    if (cookies_allowed) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}


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


var cookies_allowed = true;
if (getCookie('cookie_allowed') || sessionStorage.getItem('cookie_allowed')) {
    cookies_allowed = true;
}
else {
    cookies_allowed = false;
}
if (!cookies_allowed) {
    $('cookie_notice').style.display = "block";
    $('cookie_notice').getElementsByTagName('button')[0].addEventListener('click', e => {
        setCookie('cookie_allowed',true,365);
        sessionStorage.setItem('cookie_allowed', true);
        $('cookie_notice').style.display = "none";
    })
    $('cookie_notice').getElementsByTagName('button')[1].addEventListener('click', e => {
        sessionStorage.setItem('cookie_allowed', true);
        $('cookie_notice').style.display = "none";
    })
}

var username = "anon";
var user_id = "";



if (getCookie('user_id') || sessionStorage.getItem('user_id')) {
    user_id = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : getCookie('user_id');
    username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
    }
    else {
        auth.signOut();
    }
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
        } else {
            username = "anon";
            user_id = "";
            sessionStorage.removeItem('user_id');
            sessionStorage.removeItem('username');
            setCookie('user_id', '',0);
            setCookie('username', '', 0);
            update_graphics();
        }
    });

    


$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if (($('nav').getElementsByTagName('button')[0].getElementsByTagName('a')[0] && $('nav').getElementsByTagName('button')[0].getElementsByTagName('a')[0].innerHTML == "Login/Signup") || $('nav').getElementsByTagName('button')[0].innerHTML == "👤") {window.location.assign('signup.html')}
    else {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('game_id');
        setCookie('user_id', "", 0);
		setCookie('username', "", 0);
		setCookie('game_id', 0)
		auth.signOut();
        location.reload();}
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

function update_nav_graphics () {
    ([]).forEach.call(document.querySelectorAll('#nav a'), ele => {
        ele.style.lineHeight = getComputedStyle(ele).height;
        ele.style['font-size'] = '2em';   
    })

    var new_size;
    
    if (!user_id) {
        while (
            find_overlap($('nav').getElementsByTagName('a')[0],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[1],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[2],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[3],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[4],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[5],'xy',true)	
            ) {
        new_size = parseFloat(getComputedStyle($('nav').getElementsByTagName('li')[2].childNodes[0])['font-size']) - 0.5 + "px";         
        ([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = new_size})
    }
}
        else {
            while (
                $('nav').childNodes[1].childNodes[5].childNodes[0].getBoundingClientRect().height * 0.96 / $('nav').childNodes[1].childNodes[5].childNodes[0].childNodes[0].getBoundingClientRect().height < 2.5 ||	
                find_overlap($('nav').getElementsByTagName('a')[1],'xy',true) ||
                find_overlap($('nav').getElementsByTagName('a')[2],'xy',true) ||
                find_overlap($('nav').getElementsByTagName('a')[3],'xy',true) ||
                find_overlap($('nav').getElementsByTagName('a')[4],'xy',true) ||
                find_overlap($('nav').getElementsByTagName('a')[5],'xy',true)	
                ) {
            new_size = parseFloat(getComputedStyle($('nav').childNodes[1].getElementsByTagName('li')[2].childNodes[0].childNodes[0])['font-size']) - 0.5 + "px";         
            ([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = new_size})
        }
            reduce_size($('nav').getElementsByTagName('a')[0], 'xy', false)
        }

}
