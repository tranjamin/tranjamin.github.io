

function $(id) { return document.getElementById(id); }

function find_overlap(element, x_or_y, single_line=true) {
	var overflow_bool = false;
	var original_overflowY = element.style['overflow-y']
	var original_overflowX = element.style['overflow-x']
	var original_overflow = element.style.overflow

	if (single_line) {
		if ((getComputedStyle(element).height.slice(0,-2)) / (getComputedStyle(element)['font-size'].slice(0,-2) * 1.5) > 1.2) {
			return true;
		}
	}
	element.style.overflow = 'scroll';
	element.style['overflow-x'] = 'scroll';
    element.style['overflow-y'] = 'scroll';
    console.log(parseFloat(getComputedStyle(element).height.slice(0,-2)) > parseFloat(getComputedStyle(element.parentElement).height.slice(0,-2)))
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
	element.style.overflow = original_overflowX;
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

function draw_board(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(33,33,33,1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (((i % 2) && (j % 2)) || (!(i % 2) && !(j % 2))) {
            ctx.fillStyle = 'rgba(255,105,0,1)';
            ctx.fillRect(i * canvas.width / 8, j * canvas.height / 8, canvas.width / 8, canvas.height / 8);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(i * canvas.width / 8, j * canvas.height / 8, canvas.width / 8, canvas.height / 8);
        }
        }
    }
}

// sockets
  
var username = "anon";
var user_id = "";
var successful_email;

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

var options = $('options');

update_graphics();
window.addEventListener('resize', e => {
    update_graphics();
})
window.addEventListener('load', e => {
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

function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + 'px';
    overlay.style.width = overlay.style.height;
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px";

    ([]).forEach.call(document.getElementsByClassName('suggested_game'), classElement => {
        classElement.style.height = getComputedStyle(classElement)['width'];
        draw_board(classElement);
    })

    //nav
    var nav = $('nav');
    nav.style.height = window.innerHeight + "px";
    nav.style.width = screen.width * 0.125 + "px";
    nav.style.top = 0;
    nav.style.left = 0;

	$('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML = "Login/Signup";
    if (user_id) {
            $('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML = "Welcome, ";
        $('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML += username;
        $('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML += "<br>Logout";
        username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
    }
	
	if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        $('nav').style.width = window.innerHeight * 0.1 + "px";
        if ($('nav').getElementsByTagName('li')[0].firstElementChild.firstElementChild.innerHTML == 'Login/Signup') {
            $('nav').getElementsByTagName('li')[0].firstElementChild.firstElementChild.innerHTML = "&#128100";
        }
        else {
            $('nav').getElementsByTagName('li')[0].firstElementChild.firstElementChild.innerHTML = "&#11144";
        }
        $('nav').getElementsByTagName('li')[1].firstElementChild.firstElementChild.innerHTML = "&#9881";
        $('nav').getElementsByTagName('li')[2].firstElementChild.firstElementChild.innerHTML = "&#9998";
        $('nav').getElementsByTagName('li')[3].firstElementChild.firstElementChild.innerHTML = "&#9876";
        $('nav').getElementsByTagName('li')[4].firstElementChild.firstElementChild.innerHTML = "&#128366";
        $('nav').getElementsByTagName('li')[5].firstElementChild.firstElementChild.innerHTML = "&#128737";
        $('copyright').innerHTML = "&copy 2020";
    }
    else {
        $('nav').getElementsByTagName('li')[1].firstElementChild.firstElementChild.innerHTML = "My Games";
        $('nav').getElementsByTagName('li')[2].firstElementChild.firstElementChild.innerHTML = "Create Game";
        $('nav').getElementsByTagName('li')[3].firstElementChild.firstElementChild.innerHTML = "Join Game";
        $('nav').getElementsByTagName('li')[4].firstElementChild.firstElementChild.innerHTML = "How to Play";
        $('nav').getElementsByTagName('li')[5].firstElementChild.firstElementChild.innerHTML = "Privacy Policy";
        $('copyright').innerHTML = "&copy Benjamin Tran 2020<br>Powered by Github and Google Firebase";
    }
        if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        console.log('yes', window.innerWidth - $('nav').getBoundingClientRect().right);
        $('overlay').style.right = '2%';
        $('overlay').style.left = 'unset';
        $('overlay').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
        $('overlay').style.height = window.innerHeight * 0.95 + "px";
}
([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = '50px'; ele.style.width = $('nav').getBoundingClientRect().width * 0.9 + 'px'; ele.style['text-align'] = 'center';})

	var new_size;
    if (!user_id) {
        while (
            $('nav').childNodes[1].childNodes[5].childNodes[0].getBoundingClientRect().height * 0.96 / $('nav').childNodes[1].childNodes[5].childNodes[0].childNodes[0].getBoundingClientRect().height < 2.5 ||	
            find_overlap($('nav').getElementsByTagName('a')[0],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[1],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[2],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[3],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[4],'xy',true) ||
            find_overlap($('nav').getElementsByTagName('a')[5],'xy',true)	
            ) {
        new_size = parseFloat(getComputedStyle($('nav').childNodes[1].getElementsByTagName('li')[2].childNodes[0].childNodes[0])['font-size']) - 0.5 + "px";         
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
            reduce_size($('nav').getElementsByTagName('a')[0], 'xy', false);

        }
}

update_graphics();

highest_order_id = ["",0];
var num_of_its;
var it_num = 0;
db.collection('chess').where('result', '==', null).where('visibility','==','public').where('invited_user', '==',null).get().then(snapshot => {
    snapshot.docs.forEach(doc => {
        if ((doc.data().white_user == null || doc.data().black_user == null)) {
            console.log(doc.data().white_user)
        }
    })
})
/*db.collection('chess').where('result','==', null).get().then(snapshot => {num_of_its = snapshot.docs.length;
    snapshot.docs.forEach(doc => {
    it_num++;
    var temp_num = it_num
    if (doc.data().white_user != null && doc.data().black_user != null) {
        db.collection('account').where('username', '==', doc.data().white_user).get().then(snapshot => snapshot.docs.forEach(acc => {
            db.collection('account').where('username', '==', doc.data().black_user).get().then(snapshot => snapshot.docs.forEach(acc2 => {
                console.log(acc.data().ranking + acc2.data().ranking);
                if (acc.data().ranking + acc2.data().ranking > highest_order_id[1]) {
                    highest_order_id = [doc.id, acc.data().ranking + acc2.data().ranking]
                }
            })).then(() => {
                if (num_of_its == temp_num) {
                console.log(highest_order_id)
            }
            })
        }))
        
    }
})})*/



$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if (!user_id) {window.location.assign('signup.html')}
    else {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('user_id')
        deleteAllCookies();
        setCookie('user_id', "", 0);
        setCookie('username', "", 0);
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
