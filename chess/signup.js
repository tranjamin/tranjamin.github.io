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


var options = $('options');

window.addEventListener('resize', e => {
    update_graphics();
})

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
}

update_graphics();

$('login').addEventListener('submit', e=> {
    e.preventDefault();
    var login_name = $('login').getElementsByTagName('input')[0].value;
    var login_pass = $('login').getElementsByTagName('input')[1].value;
    var login_successful = false;
    db.collection('account').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data());
            if (doc.data().username == login_name && doc.data().password == login_pass) {login_successful = true; 
                username = login_name; 
                user_id = doc.id;
                console.log('successful');
                setCookie('username',username,5);
                setCookie('user_id',user_id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',user_id);
                location.reload();

            
            }
        })}).then(docRef => {
            if (login_successful) {
                $("login_error").innerHTML = "";
                $('signup_error').innerHTML = "";
            }
            else {
                $('login_error').innerHTML = "Username and Password is Incorrect";
                $('signup_error').innerHTML = "";
        }
        }).catch(error => {
            console.log(error);
            $('login_error').innerHTML = "Server Inaccessible. Please try again.";
            $('signup_error').innerHTML = "";
        })
}) 
$('signup').addEventListener('submit', e=> {
    e.preventDefault();
    var signup_arr = $('signup').getElementsByTagName('input');
    var signup_username = signup_arr[0].value;
    var signup_email = signup_arr[1].value;
    var signup_password = signup_arr[2].value;
    var signup_confirm = signup_arr[3].value;
    var signup_decline = "";
    if (signup_password == signup_confirm) {
    db.collection('account').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().username == signup_username) {signup_decline = 'Username'}
            if (doc.data().email == signup_email && !signup_decline) {signup_decline = 'Email'}
        })
    }).then(() => {   
        if (!signup_decline) {
            console.log('success');
            db.collection('account').add({
                username: signup_username,
                email: signup_email,
                password: signup_password
        
            })

        }
        else {
            $('signup_error').innerHTML = signup_decline + " already exists";
            $('login_error').innerHTML = "";
        }
    })
    }
    else {
        $('signup_error').innerHTML = "Passwords do not Match";
        $('login_error').innerHTML = "";
    }
})

$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if ($('nav').getElementsByTagName('button')[0].innerHTML == "Login/Signup") {window.location.assign('signup.html')}
    else {
        sessionStorage.clear();
        deleteAllCookies();
        location.reload();}
});
$('nav').getElementsByTagName('li')[1].addEventListener('click', e => {
    window.location.assign('account.html')
});
$('nav').getElementsByTagName('li')[2].addEventListener('click', e => {
    window.location.assign('create.html')
});
$('nav').getElementsByTagName('li')[3].addEventListener('click', e => {
    window.location.assign('load.html')
});
$('nav').getElementsByTagName('li')[4].addEventListener('click', e => {
    window.location.assign('about.html')
});



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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