function $(id) { return document.getElementById(id); }

function find_overlap(element, x_or_y, single_line=true) {
	var overflow_bool = false;
	var original_overflowY = element.style['overflow-y']
	var original_overflowX = element.style['overflow-x']
	var original_overflow = element.style['overflow']

	if (single_line) {
		if ((getComputedStyle(element)['height'].slice(0,-2)) / (getComputedStyle(element)['font-size'].slice(0,-2) * 1.5) > 1.2) {
			return true;
		}
	}
	element.style['overflow'] = 'scroll';
	element.style['overflow-x'] = 'scroll';
	element.style['overflow-y'] = 'scroll';
	switch (x_or_y) {
		case 'x': 
			if (element.clientWidth != element.scrollWidth) {overflow_bool = true}
			break;
		case 'y': 
			if (element.clientHeight != element.scrollHeight) {overflow_bool = true}
			break;
		default: 
			if (element.clientWidth != element.scrollWidth || element.clientHeight != element.scrollHeight) {overflow_bool = true}
			break;
}
	element.style['overflow'] = original_overflowX;
	element.style['overflow-x'] = original_overflowY;
	element.style['overflow-y'] = original_overflow;
	return overflow_bool;
}
function reduce_size(element, x_or_y, single_line=true, interval=0.5) {
	while (find_overlap(element, x_or_y, single_line)) {
		element.style['font-size'] = (parseFloat(getComputedStyle(element)['font-size'].slice(0,-2)) - interval) + "px";
	}
	return getComputedStyle(element)['font-size'];
}

var username = "anon";
var user_id = "";

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

if (getCookie('username') || sessionStorage.getItem('username')) {
    $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
$('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
$('nav').getElementsByTagName('button')[0].innerHTML += "<br>Logout";
}

update_graphics();
window.addEventListener('resize', e => {
    update_graphics()
})

function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + "px";
    overlay.style.width = overlay.style.height;
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px";

    //nav
    var nav = $('nav');
    nav.style.height = window.innerHeight + "px";
    nav.style.width = screen.width * 0.125 + "px";
    nav.style.top = 0;
    nav.style.left = 0;

	$('nav').getElementsByTagName('button')[0].innerHTML = "<a href='signup.html' style='text-decoration: none; color: white;'>Login/Signup</a>";
    if (getCookie('username') || sessionStorage.getItem('username')) {
            $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
        $('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
        $('nav').getElementsByTagName('button')[0].innerHTML += "<br>Logout";
        username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
    }
	
	if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        $('nav').style.width = window.innerHeight * 0.1 + "px";
        if ($('nav').getElementsByTagName('button')[0].getElementsByTagName('a').length) {
            $('nav').getElementsByTagName('li')[0].firstElementChild.innerHTML = "<a href='signup.html' style='text-decoration: none; color: white;'>&#128100</a>";
        }
        else {
            $('nav').getElementsByTagName('li')[0].firstElementChild.innerHTML = "&#11144";
        }
        $('nav').getElementsByTagName('li')[1].firstElementChild.firstElementChild.innerHTML = "&#9881";
        $('nav').getElementsByTagName('li')[2].firstElementChild.firstElementChild.innerHTML = "&#9998";
        $('nav').getElementsByTagName('li')[3].firstElementChild.firstElementChild.innerHTML = "&#9876";
        $('nav').getElementsByTagName('li')[4].firstElementChild.firstElementChild.innerHTML = "&#128366";
        $('nav').getElementsByTagName('li')[5].firstElementChild.firstElementChild.innerHTML = `&#128737        <div id="copyright" style='font-size: 40%;'>
		&copy 2020
	</div>`;
    }
    else {
        if (getCookie('username') || sessionStorage.getItem('username')) {
            $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
        $('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
        $('nav').getElementsByTagName('button')[0].innerHTML += "<br>Logout";
        username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
        }
        $('nav').getElementsByTagName('li')[1].firstElementChild.firstElementChild.innerHTML = "My Games";
        $('nav').getElementsByTagName('li')[2].firstElementChild.firstElementChild.innerHTML = "Create Game";
        $('nav').getElementsByTagName('li')[3].firstElementChild.firstElementChild.innerHTML = "Join Game";
        $('nav').getElementsByTagName('li')[4].firstElementChild.firstElementChild.innerHTML = "How to Play";
        $('nav').getElementsByTagName('li')[5].firstElementChild.firstElementChild.innerHTML = `Privacy Policy<br>
        <div id="copyright">
            &copy Benjamin Tran 2020<br>
            Powered by Github and Google Firebase
        </div>`;
    }
    if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        console.log('yes', window.innerWidth - $('nav').getBoundingClientRect().right);
        $('overlay').style.right = '2%';
        $('overlay').style.left = 'unset';
        $('overlay').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
        $('overlay').style.height = window.innerHeight * 0.95 + "px";
}
    var rules = $('rules_nav');
    rules.style.width = overlay.getBoundingClientRect().width;
    document.getElementsByClassName('rules')[0].style.top = $('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[1].style.top = $('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[2].style.top = $('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";

    document.getElementsByClassName('rules')[0].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom + "px";
    document.getElementsByClassName('rules')[1].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom + "px";
    document.getElementsByClassName('rules')[2].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom + "px";

    ([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = '50px'; ele.style['width'] = $('nav').getBoundingClientRect().width + 'px'; ele.style['text-align'] = 'center';})

	var new_size;
	while (
		$('nav').childNodes[1].childNodes[5].childNodes[0].getBoundingClientRect().height * 0.96 / $('nav').childNodes[1].childNodes[5].childNodes[0].childNodes[0].getBoundingClientRect().height < 2.5 ||	
		find_overlap($('nav').getElementsByTagName('a')[0],'x',false) ||
		find_overlap($('nav').getElementsByTagName('a')[1],'x',false) ||
		find_overlap($('nav').getElementsByTagName('a')[2],'x',false) ||
		find_overlap($('nav').getElementsByTagName('a')[3],'x',false) ||
		find_overlap($('nav').getElementsByTagName('a')[4],'x',false) ||
		find_overlap($('nav').getElementsByTagName('a')[5],'x',false)	
		) {
    var new_size = parseFloat(getComputedStyle($('nav').childNodes[1].getElementsByTagName('li')[2].childNodes[0].childNodes[0])['font-size']) - 0.5 + "px";         
	([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = new_size})
}
	([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style.top = (getComputedStyle(ele.parentElement)['height'].slice(0,-2) - getComputedStyle(ele)['height'].slice(0,-2)) / 2 + "px"})
	$('copyright').style.top = 'unset';
	$('copyright').style.bottom = 0;


}



$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if (($('nav').getElementsByTagName('button')[0].getElementsByTagName('a')[0] && $('nav').getElementsByTagName('button')[0].getElementsByTagName('a')[0].innerHTML == "Login/Signup") || $('nav').getElementsByTagName('button')[0].innerHTML == "👤") {window.location.assign('signup.html')}
    else {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id')
        deleteAllCookies();
        setCookie('user_id', "", 0);
        setCookie('username', "", 0);
        
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

$('variant_rules').style.display = "none";
$('time_rules').style.display = "none";

$('rules_nav').getElementsByTagName('li')[0].addEventListener('click', e=> {
    $('create_rules').style.display = "unset";
    $('variant_rules').style.display = "none";
    $('time_rules').style.display = "none";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[1].addEventListener('click', e=> {
    $('create_rules').style.display = "none";
    $('variant_rules').style.display = "unset";
    $('time_rules').style.display = "none";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[2].addEventListener('click', e=> {
    $('create_rules').style.display = "none";
    $('variant_rules').style.display = "none";
    $('time_rules').style.display = "unset";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
