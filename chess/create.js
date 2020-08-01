var white_arr = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]];
var black_arr = [[1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]];

class piece {
    constructor(colour, type, pos, name) {
        this.name = name;
        this.colour = colour; //int
        this.type = type; //char
        this.pos = pos; //tuple

    }
}

var w_rooka = new piece(1, "R", [1, 1], "w_rooka");
var w_knightb = new piece(1, "N", [2, 1], "w_knightb");
var w_bishopc = new piece(1, "B", [3, 1], "w_bishopc");
var w_queen = new piece(1, "Q", [4, 1], "w_queen");
var w_king = new piece(1, "K", [5, 1], "w_king");
var w_bishopf = new piece(1, "B", [6, 1], "w_bishopf");
var w_knightg = new piece(1, "N", [7, 1], "w_knightg");
var w_rookh = new piece(1, "R", [8, 1], "w_rookh");

var w_a = new piece(1, "P", [1, 2], "w_a");
var w_b = new piece(1, "P", [2, 2], "w_b");
var w_c = new piece(1, "P", [3, 2], "w_c");
var w_d = new piece(1, "P", [4, 2], "w_d");
var w_e = new piece(1, "P", [5, 2], "w_e");
var w_f = new piece(1, "P", [6, 2], "w_f");
var w_g = new piece(1, "P", [7, 2], "w_g");
var w_h = new piece(1, "P", [8, 2], "w_h");

var b_rooka = new piece(0, "R", [1, 8], "b_rooka");
var b_knightb = new piece(0, "N", [2, 8], "b_knightb");
var b_bishopc = new piece(0, "B", [3, 8], "b_bishopc");
var b_queen = new piece(0, "Q", [4, 8], "b_queen");
var b_king = new piece(0, "K", [5, 8], "b_king");
var b_bishopf = new piece(0, "B", [6, 8], "b_bishopf");
var b_knightg = new piece(0, "N", [7, 8], "b_knightg");
var b_rookh = new piece(0, "R", [8, 8], "b_rookh");

var b_a = new piece(0, "P", [1, 7], "b_a");
var b_b = new piece(0, "P", [2, 7], "b_b");
var b_c = new piece(0, "P", [3, 7], "b_c");
var b_d = new piece(0, "P", [4, 7], "b_d");
var b_e = new piece(0, "P", [5, 7], "b_e");
var b_f = new piece(0, "P", [6, 7], "b_f");
var b_g = new piece(0, "P", [7, 7], "b_g");
var b_h = new piece(0, "P", [8, 7], "b_h");

var white_list = [w_rooka, w_knightb, w_bishopc, w_queen, w_king, w_bishopf, w_knightg, w_rookh, w_a, w_b, w_c, w_d, w_e, w_f, w_g, w_h];
var black_list = [b_rooka, b_knightb, b_bishopc, b_queen, b_king, b_bishopf, b_knightg, b_rookh, b_a, b_b, b_c, b_d, b_e, b_f, b_g, b_h];

function generate_position(mode) {
    if (mode.indexOf('Chess960') != -1) {
        var original = [1,2,3,4,5,6,7,8];
        w_bishopc.pos = [Math.ceil(Math.random() * 4) * 2, 1];
        w_bishopf.pos = [Math.ceil(Math.random() * 4) * 2 - 1, 1];
        original.splice(original.indexOf(w_bishopc.pos[0]),1);
        original.splice(original.indexOf(w_bishopf.pos[0]),1);
        w_queen.pos = [original[Math.floor(Math.random() * 6)], 1];
        original.splice(original.indexOf(w_queen.pos[0]),1);
        w_knightb.pos = [original[Math.floor(Math.random() * 5)], 1];
        original.splice(original.indexOf(w_knightb.pos[0]),1);
        w_knightg.pos = [original[Math.floor(Math.random() * 4)], 1];
        original.splice(original.indexOf(w_knightg.pos[0]),1);
        w_rooka.pos = [original[0], 1];
        w_king.pos = [original[1], 1];
        w_rookh.pos = [original[2], 1];
        b_rooka.pos = [w_rooka.pos[0], 8]
        b_rookh.pos = [w_rookh.pos[0], 8]
        b_bishopc.pos = [w_bishopc.pos[0], 8]
        b_bishopf.pos = [w_bishopf.pos[0], 8]
        b_knightb.pos = [w_knightb.pos[0], 8]
        b_knightg.pos = [w_knightg.pos[0], 8]
        b_queen.pos = [w_queen.pos[0], 8]
        b_king.pos = [w_king.pos[0], 8]
    }
    else if (mode.indexOf('Really') != -1) {
        for (var ele of white_list.concat(black_list)) {
            if (ele.type != "K") {
                ele.type = (['P','R','Q','B','N'])[Math.floor(Math.random() * 5)]
            }
        }
    }
    else if (mode.indexOf('Dusanny') != -1) {
        white_list = [];
        white_arr = [];
        for (var i = 1; i <= 8; i++) {
            for (var j = 1; j <= 4; j++) {
                white_list.push(new piece(1, "P", [i,j], ('w_pawn' + i) + j));
                white_arr.push([i,j]);
            }
        }
    }
}

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

var username = "anon";
var user_id = "";

var msg = $('message');
var msg_submit = $('submit_message');
var msg_title = $('chat_title');
var message_body = $("text");
var options = $('options');

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

update_graphics();
window.addEventListener('resize', e => {
    update_graphics();
})
window.addEventListener('load', e => {
    update_graphics();
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

	$('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML = "Login/Signup";
    if (getCookie('username') || sessionStorage.getItem('username')) {
            $('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML = "Welcome, ";
        $('nav').getElementsByTagName('button')[0].firstElementChild.innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
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

    var left_column = $('left_column')
    left_column.style.position = 'absolute';
    left_column.style.left = 0;


    for (var object of document.getElementsByClassName('custom-select')) {
        var selectStyle = object.getElementsByTagName('select')[0].style;
        object.style.width = overlay.style.width.slice(0,-2) * 0.45 + "px";

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
            reduce_size($('nav').getElementsByTagName('a')[0], 'xy', false)
        }

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


function create_new_user(user,newname,play_colour,mode,visibility,invited_user,points,time, randomised, admin) {
var white_time = time;
var tempb = [];
var tempw = [];
generate_position(mode);
white_list.forEach(obj => {
	tempw.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
})
black_list.forEach(obj => {
    tempb.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
})
if (mode.indexOf('Armageddon') != -1) {
    white_time = [];
    for (var i in time) {
        white_time.push([time[i][0],Math.round(time[i][1] * 6/5),Math.round(time[i][2] * 6/5)]);
    }
}
console.log(white_time);
var rated = points == "Casual" ? false : true;
var white_user;
var black_user;
if (play_colour) {
    white_user = user;
    black_user = null; }
else {
    white_user = null;
    black_user = user;
}
db.collection('chess').add({
    name: newname,
    black_user: black_user,
    white_user: white_user,
    white_arr: stringify(white_arr),
    black_arr: stringify(black_arr),
    white_list: tempw,
    black_list: tempb,
    points: rated,
    mode: mode,
    visibility: visibility,
    invited_user: invited_user,
    white_time: stringify(white_time) ? stringify(white_time) : null,
    black_time: stringify(time) ? stringify(time) : null,
    randomised: randomised,
    admin: admin,
    messages: "",
    white_bank: "",
    black_bank: "",
    draw_query: false,
    result: null,
    turn: (mode.indexOf('Dusanny') == -1 ? 1 : 0),
    white_count: white_time ? white_time[0][1] : null,
    black_count: time ? time[0][1] : null,
    timer: [(mode.indexOf('Dusanny') == -1 ? 1 : 0),null],
    white_checks: 0,
    black_checks: 0,
    moves: 0,
    fifty_moves: 0,
    white_beirut_piece: null,
    black_beirut_piece: null,
    undo: null
}).then(docRef => {
    setCookie('game_id',docRef.id,2);
    sessionStorage.setItem('game_id',docRef.id);
    window.location.assign('play.html');

}).catch(function(error) {
    console.error("Error adding document: ", error);
    $('error').innerHTML = "Could not connect to server. Please try again later";
});
}

stringify = (stringed_arr) => {
    var x = "";
    for (var y in stringed_arr) {
        if (y == stringed_arr.length - 1) {
            if (typeof(stringed_arr[y]) == "object") {
                x += "[" + stringify(stringed_arr[y]) + "]"
            }
            else {
            x += String(stringed_arr[y]);
            }
        }
        else {
            if (typeof(stringed_arr[y]) == "object") {
                x += "[" + stringify(stringed_arr[y]) + "],"
            }
            else {
            x += String(stringed_arr[y]) + ",";
            }
        }}
    return x;
}

objectify = (objectified_arr) => {
    var x = "";
    for (var y in objectified_arr) {
        if (y == objectified_arr.length - 1) {
        x += objectified_arr[y].name;}
        else {
            x += objectified_arr[y].name + ",";
        }
    }
    return x;
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



var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect); 
document.addEventListener("hover", closeAllSelect); 

for (var i of ([]).slice.call(document.getElementsByClassName('custom_time'))) {
console.log('0')
var moves = i.getElementsByTagName('input').moves;
var minutes = i.getElementsByTagName('input').minutes;
var seconds = i.getElementsByTagName('input').seconds;
var increment = i.getElementsByTagName('input').increment;
moves.addEventListener('keypress', e=> {
    if (moves.value.toString().length > 2) {
    e.preventDefault();
    }})
minutes.addEventListener('keypress', e=> {
    if (minutes.value.toString().length > 2) {
    e.preventDefault();
    }})
seconds.addEventListener('keypress', e=> {
    if (seconds.value.toString().length > 1) {
    e.preventDefault();
    }})
increment.addEventListener('keypress', e=> {
    console.log(increment.value.toString());
    if (increment.value.toString().length > 2) {
    e.preventDefault();
    }})
}

$("invite").getElementsByClassName('select-selected')[0].addEventListener('click', e => {
    if (e.target.innerHTML == "Custom") {
        e.target.innerHTML = "<form><input type='text' id='custom_player' name='invite_player''></form>";
        e.target.getElementsByTagName('input')[0].style['background-color'] = 'inherit';
        e.target.getElementsByTagName('input')[0].style.border = 'none';
        e.target.getElementsByTagName('input')[0].style.height = '100%';
        e.target.getElementsByTagName('input')[0].style['text-align'] = 'center';
        e.target.getElementsByTagName('input')[0].style['font-family'] = 'inherit';
        e.target.getElementsByTagName('input')[0].style['font-size'] = 'inherit';
        e.target.getElementsByTagName('input')[0].style.color = 'inherit';
    }
})

$('insert_new_phase').addEventListener('click', e=> {
    var new_item = document.createElement("DIV");
    new_item.setAttribute('class','custom_time');
    new_item.innerHTML = "<span style='font-size: 50%;'>&#x2716</span>" + document.getElementsByClassName('custom_time')[0].innerHTML;
    $('custom').insertBefore(new_item,$('insert_new_phase'));
    new_item.getElementsByTagName('icon')[0].style.display = "none";

    var i = document.getElementsByClassName('custom_time')[([]).slice.call(document.getElementsByClassName('custom_time')).length - 1];
        console.log('0')
        var moves = i.getElementsByTagName('input').moves;
        var minutes = i.getElementsByTagName('input').minutes;
        var seconds = i.getElementsByTagName('input').seconds;
        var increment = i.getElementsByTagName('input').increment;
        moves.addEventListener('keypress', e=> {
            if (moves.value.toString().length > 2) {
            e.preventDefault();
            }})
        minutes.addEventListener('keypress', e=> {
            if (minutes.value.toString().length > 2) {
            e.preventDefault();
            }})
        seconds.addEventListener('keypress', e=> {
            if (seconds.value.toString().length > 1) {
            e.preventDefault();
            }})
        increment.addEventListener('keypress', e=> {
            console.log(increment.value.toString());
            if (increment.value.toString().length > 2) {
            e.preventDefault();
            }})

}) 

$('custom').style.display = "none";

$('right_column').addEventListener('click', e => {
    if(e.target.parentNode.className) {
        if (e.target.parentNode.getElementsByTagName('input')[0].type == "radio" && e.target.parentNode.getElementsByTagName('input')[0].value != "Custom") {
            $('custom').style.display = "none";
        }
        else {
            $('custom').style.display = "unset";
        }
    }
})

$('custom').addEventListener('click', e=> {
    if (e.target.tagName == "SPAN") {
        e.target.parentElement.remove();
    }
})

$('game_creator').addEventListener('submit', e=> {
    e.preventDefault();
    $('error').innerHTML = "";
    var is_random = false;
    var play_name = $('game_creator').create_name.value;
    var play_colour = $('game_creator').create_play.value;
    if (play_colour == "Random") {
        is_random = true;
        play_colour = Math.round(Math.random());
    }
    else if (play_colour == "White") {
        play_colour = 1;
    }
    else {
        play_colour = 0;
    }
    var variation = $('game_creator').create_type.value;
    var visibility = $('game_creator').create_public.value;
    var other_user = $('game_creator').create_invite.value;
    if (other_user == "Custom") {
        other_user = document.getElementById('custom_player').value;
    }
    else {
        other_user = null;
    }


    var points = $('game_creator').create_points.value;
    var time_control = $('game_creator').create_time.value;

    var exists = false;
    var user_exists = false;
    if (play_name.indexOf(' - Rematch') != -1) {
        $('error').innerHTML = "' - Rematch' is the default name for rematches. Please avoid using it."
    }
    else if (points == "Rated" && username == "anon") {
        $('error').innerHTML = "You must sign in to play rated games"
    }
    else {
    db.collection('account').where('username', '==', other_user).get().then(snapshot => {
        if (other_user != null) {
            snapshot.docs.forEach(doc => {
                if (doc.data().username == other_user) {
                user_exists = true;
            }
        })}
        else {
            user_exists = true;
        }
    }).then(snapshot => {
    db.collection('chess').get().then(snapshot => {
        snapshot.docs.forEach(doc => {if (doc.data().name == play_name) {exists = true;}})}).then(() => {
    if (exists) {
        console.warn('name already exists');
        $('game_creator').create_name.value = "";
        $('error').innerHTML = "Name already exists";
    }
    else {
    
    var arr_length = ([]).slice.call(document.getElementsByClassName('custom_time')).length
    var valid_numbers = true;
    var g_at_end = true;
    var valid_time = true;
    ([]).forEach.call(document.getElementsByClassName('custom_time'),(time,index) => {
        var time_input = time.getElementsByTagName('input');
        if (!(new RegExp("(\\d+|[gG])")).test(time_input.moves.value)) {
            valid_numbers = false;
        }
        if (((new RegExp("[gG]")).test(time_input.moves.value) && index != arr_length - 1) || (!(new RegExp('[gG]')).test(time_input.moves.value) && index == arr_length - 1)) {
            g_at_end = false;
        }
        if (!time_input.minutes.value == !time_input.seconds.value) {
            valid_time = false;
        }
    })

    if (variation.indexOf('Armageddon') != -1 && time_control == "Unlimited") {
        $('error').innerHTML = "'Armageddon' mode must be timed"
    }
    else if (variation.indexOf('Really Bad Chess') != -1 && points == "Rated") {
        $('error').innerHTML = "'Really Bad Chess' mode cannot be rated"
    }
    else if (time_control == "Custom" && !valid_numbers) {
        $('error').innerHTML = "Please enter a valid number of turns or G for game";
    }
    else if (time_control == "Custom" && !g_at_end) {
        $('error').innerHTML = "G must be the last phase";
    }
    else if (time_control == "Custom" && !valid_time) {
        $('error').innerHTML = "Please enter a nonzero time";
    }

    else if (!user_exists) {
        $('error').innerHTML = "Invited user does not Exist";
    }
    else {
    if (time_control == "Custom") {
        time_control = [];
        ([]).forEach.call(document.getElementsByClassName('custom_time'),time => {
            var time2 = time.getElementsByTagName('input');
            time_control.push(time2.moves.value + "/" + (60 * (isNaN(parseInt(time2.minutes.value)) ? 0 : parseInt(time2.minutes.value)) + (isNaN(parseInt(time2.seconds.value)) ? 0 : parseInt(time2.seconds.value))) + "+" + time2.increment.value)
          })
          
        time_control = convert_time_to_arr(time_control);
    }
    else if (time_control == "Unlimited") {
        time_control = null;
    }
    else {
        time_control = time_control.split('(')[1].split(')')[0].split(" ");
        
        time_control = convert_time_to_arr(time_control);
        for (let i in time_control) {
            time_control[i][1] = parseInt(time_control[i][1]) * 60;
        }
    }

    
    create_new_user(username,play_name,play_colour,variation,visibility,other_user,points,time_control,is_random,username);
}
}}).catch(error => {
    console.error("Error adding document: ", error);
    $('error').innerHTML = "Could not connect to server. Please try again later";
})
})
}
})


//in the form [##/MM:SS+II]
function convert_time_to_arr(str) {
    if (str) {
    var x = [];
    str.forEach(phase => {x.push(phase.split(new RegExp('[/:+]')))})
    for (var i in x) {
        if (!x[i][2]) {x[i][2] = 0}
        else {x[i][2] = parseInt(x[i][2])}
    }
    return x;
    }
    else {
        return null;
    }
}
