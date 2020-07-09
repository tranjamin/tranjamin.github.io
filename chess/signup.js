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
    var overlay2 = $('overlay2');
    overlay2.style.height = overlay.style.height;
    overlay2.style.width = overlay.style.width;
    overlay2.style.left = overlay.style.left;
    overlay2.style.top = overlay.style.top;

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
            if ((doc.data().username == login_name || (doc.data().email == login_name && doc.data().email)) && doc.data().password == login_pass) {login_successful = true; 
                username = doc.data().username; 
                user_id = doc.id;
                setCookie('username',username,5);
                setCookie('user_id',user_id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',user_id);
                window.location.assign('account.html');

            
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
    if (signup_username != "anon") {
    db.collection('account').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().username == signup_username) {signup_decline = 'Username'}
            if (signup_email && doc.data().email == signup_email && !signup_decline) {signup_decline = 'Email'}
        })
    }).then(() => {   
        if (!signup_decline) {
            console.log('success');
            db.collection('account').add({
                username: signup_username,
                email: signup_email,
                password: signup_password,
                wins: 0,
                losses: 0,
                draws: 0,   
                ranking: 0     
            }).then(docRef => {
                username = signup_username; 
                user_id = docRef.id;
                setCookie('username',username,5);
                setCookie('user_id',user_id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',user_id);
                window.location.assign('account.html');
            })

        }
        else {
            $('signup_error').innerHTML = signup_decline + " already exists";
            $('login_error').innerHTML = "";
        }
    })
}
    else {
        $('signup_error').innerHTML = "'anon' cannot be used since it is the placeholder name";
        $('login_error').innerHTML = "";
    }
    }
    else {
        $('signup_error').innerHTML = "Passwords do not Match";
        $('login_error').innerHTML = "";
    }
})

$('forgot_password').addEventListener('click', e => {
    $('overlay2').style.visibility = "visible";
})
var random_str = "";
$('reset').addEventListener('submit', e => {
    e.preventDefault();
    var char_str = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',1,2,3,4,5,6,7,8,9,0]
    random_str = "";
    for (var i = 0; i < 15; i++) {
        random_str += char_str[Math.floor(Math.random() * 62)];
    }
    sendEmail($('reset')['reset_address'].value, 'Reset Your Password', 'To reset your password, use the following code: ' + random_str);
})
$('reset_code').addEventListener('submit', e => {
    e.preventDefault();
    if (e.target['reset_code'].value == random_str) {
        $('change_password').style.visibility = "visible";
        $('reset_error').innerHTML = "";
    }
    else {
        $('reset_error').innerHTML = "Reset Code is Incorrect";
    }
})
$('new_password').addEventListener('submit', e => {
    e.preventDefault();
    if (e.target['create_newpassword'].value == e.target['confirm_newpassword']) {
        $('newpassword_error').innerHTML = ""
        db.collection('account').doc(user_id).update({
            password: e.target['create_newpassword']
        }).then(docRef => {
            location.assign('account.html');
        })
    }
    else {
        $('newpassword_error').innerHTML = "Passwords do not match";
    }
})

$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if ($('nav').getElementsByTagName('button')[0].innerHTML == "<a href='signup.html'>Login/Signup</a>") {window.location.assign('signup.html')}
    else {
        sessionStorage.clear();
        deleteAllCookies();
        location.reload();}
});
$('nav').getElementsByTagName('li')[1].addEventListener('click', e => {
        location.assign('signup.html');
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