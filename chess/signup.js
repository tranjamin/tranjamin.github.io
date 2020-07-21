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

	$('nav').getElementsByTagName('button')[0].innerHTML = "Login/Signup";
    if (getCookie('username') || sessionStorage.getItem('username')) {
            $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
        $('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
        $('nav').getElementsByTagName('button')[0].innerHTML += "<br>Logout";
        username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
    }
	
	if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        $('nav').style.width = window.innerHeight * 0.1 + "px";
        if ($('nav').getElementsByTagName('button')[0].innerHTML == "Login/Signup") {
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
        $('overlay2').style.right = '2%';
        $('overlay').style.left = 'unset';
        $('overlay2').style.left = 'unset';
        $('overlay').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
        $('overlay2').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
}
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
            if ((login_name == (e.target['username_or_email'].value == 'Username' ? doc.data().username : doc.data().email)) && doc.data().password == login_pass) {login_successful = true; 
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
                $('login_error').innerHTML = "Username or Password is Incorrect";
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
    var address;
    if (e.target['reset_config'].value == "Email") {
        db.collection('account').where('email', '==', e.target['reset_address'].value).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                address = doc.data().email;
            })
        }).then(docRef => {
            if (address) {
                sendEmail(address, 'Reset Your Password', 'To reset your password, use the following code: ' + random_str);
                e.target.nextElementSibling.innerHTML = ""; 
                console.log('sending');
            }    
            else {
                e.target['reset_address'].value = "";
                e.target.nextElementSibling.innerHTML = "Username/Email not found"
            }            
        })
    }
    else {
        db.collection('account').where('username', '==', e.target['reset_address'].value).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                address = doc.data().email;
            })
        }).then(docRef => {
            if (address) {
                sendEmail(address, 'Reset Your Password', 'To reset your password, use the following code: ' + random_str);
                e.target.nextElementSibling.innerHTML = "";
                console.log('sending');
            }
            else {
                e.target['reset_address'].value = "";
                e.target.nextElementSibling.innerHTML = "Username/Email not found"
            }            
        })     
    }
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
    if ($('nav').getElementsByTagName('button')[0].getElementsByTagName('a').length) {window.location.assign('signup.html')}
    else {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id')
        deleteAllCookies();
        setCookie('user_id', "", 0);
        setCookie('username', "", 0);
        
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
$('nav').getElementsByTagName('li')[5].addEventListener('click', e => {
    location.assign('statement.html');
});

function sendEmail (email_address, subject, body) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "tranjaminchess.noreply@gmail.com",
        Password: 'findArr(w_rooka.pos, white_arr)',
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