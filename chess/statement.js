/*
This Version Includes:
Basic piece movement
Basic chat
En passant
Castling
Promotion

This Version does not Include:
Check / Checkmate
Underpromotion
Undo
Flip Board

*/

// socket


function $(id) { return document.getElementById(id); }


// sockets
  
var username = "anon";
var user_id = "";
var successful_email;


var options = $('options');

window.addEventListener('resize', e => {
    update_graphics();
})

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


function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + 'px';
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
            $('nav').getElementsByTagName('li')[0].firstElementChild.innerHTML = "&#128100";
        }
        else {
            $('nav').getElementsByTagName('li')[0].firstElementChild.innerHTML = "&#11144";
        }
        $('nav').getElementsByTagName('li')[1].firstElementChild.firstElementChild.innerHTML = "&#9881";
        $('nav').getElementsByTagName('li')[2].firstElementChild.firstElementChild.innerHTML = "&#9998";
        $('nav').getElementsByTagName('li')[3].firstElementChild.firstElementChild.innerHTML = "&#9876";
        $('nav').getElementsByTagName('li')[4].firstElementChild.firstElementChild.innerHTML = "&#128366";
        $('nav').getElementsByTagName('li')[5].firstElementChild.firstElementChild.innerHTML = "&#128737";
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
([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = '0px'; ele.style['width'] = $('nav').getBoundingClientRect().width + 'px'; ele.style['text-align'] = 'center';})

var new_size;
while ($('nav').childNodes[1].childNodes[5].childNodes[0].getBoundingClientRect().height * 0.96 / $('nav').childNodes[1].childNodes[5].childNodes[0].childNodes[0].getBoundingClientRect().height > 3.1) {
var new_size = parseFloat(getComputedStyle($('nav').childNodes[1].getElementsByTagName('li')[2].childNodes[0].childNodes[0])['font-size']) + 0.5 + "px";         
$('nav').childNodes[1].getElementsByTagName('li')[2].childNodes[0].childNodes[0].style['font-size'] = new_size;

}
([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = new_size})
}

update_graphics();

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

function sendEmail (email_address, subject, body) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "tranjaminchess.noreply@gmail.com",
        Password: 'Tranjaminchess',
        To: email_address,
        From: "tranjaminchess.noreply@gmail.com",
        Subject: subject,
        Body: body
    }).then(error => {successful_email = error})
}


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