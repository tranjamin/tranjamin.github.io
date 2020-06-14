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

var undo = [];
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

function $(id) { return document.getElementById(id); }

var username = "anon";
var user_id = "";

var msg = $('message');
var msg_submit = $('submit_message');
var msg_title = $('chat_title');
var message_body = $("text");
var options = $('options');

if (getCookie('username') || sessionStorage.getItem('username')) {
    $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
$('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
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

    var left_column = $('left_column')
    left_column.style.position = 'absolute';
    left_column.style.left = 0;


    for (var object of document.getElementsByClassName('custom-select')) {
        var selectStyle = object.getElementsByTagName('select')[0].style;
        object.style.width = overlay.style.width.slice(0,-2) * 0.45 + "px";

      }

}


$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if ($('nav').getElementsByTagName('button')[0].innerHTML == "Login/Signup") {window.location.assign('signup.html')}
    else {
        sessionStorage.clear();
        document.cookie = "";
        location.reload();}
});
$('nav').getElementsByTagName('li')[1].addEventListener('click', e => {
    window.location.assign('account.html')
});
$('nav').getElementsByTagName('li')[2].addEventListener('click', e => {
    window.location.assign('create.html')
});
$('nav').getElementsByTagName('li')[3].addEventListener('click', e => {
    window.location.assign('create.html')
});
$('nav').getElementsByTagName('li')[4].addEventListener('click', e => {
    window.location.assign('about.html')
});


function create_new_user(user,newname,play_colour,mode,visibility,invited_user,points,time) {
var white_time = [];
console.log(white_time);
if (mode.indexOf('Armageddon') != -1) {
    for (var i in time) {
        white_time.push([time[i][0],Math.round(time[i][1] * 6/5),Math.round(time[i][2] * 6/5)]);
    }
}
console.log(white_time);
if (play_colour) {
    
db.collection('chess').add({
    name: newname,
    black_user: null,
    white_user: user,
    white_arr: stringify(white_arr),
    black_arr: stringify(black_arr),
    white_list: objectify(white_list),
    black_list: objectify(black_list),
    points: points,
    mode: mode,
    visibility: visibility,
    invited_user: invited_user,
    white_time: stringify(white_time),
    black_time: stringify(time),
    undo: stringify(undo)
}).then(docRef => {user_id = docRef.id;}).catch(function(error) {
    console.error("Error adding document: ", error);
});
}
else {

    db.collection('chess').add({
    name: newname,
    white_user: null,
    black_user: user,
    white_arr: stringify(white_arr),
    black_arr: stringify(black_arr),
    white_list: objectify(white_list),
    black_list: objectify(black_list),
    points: points,
    mode: mode,
    visibility: visibility,
    invited_user: invited_user,
    white_time: stringify(white_time),
    black_time: stringify(time),
    undo: stringify(undo)
    }).then(docRef => {user_id = docRef.id;}).catch(function(error) {
        console.error("Error adding document: ", error);
    });
}
}

stringify = (stringed_arr) => {
    var x = "";
    for (var y in stringed_arr) {
        if (y == stringed_arr.length - 1) {
            x += "[" + String(stringed_arr[y]) + "]";
        }
        else {
            x += "[" + String(stringed_arr[y]) + "],";
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

for (var i of document.getElementsByClassName('custom_time')) {
var moves = i.getElementsByTagName('input')['moves'];
var minutes = i.getElementsByTagName('input')['minutes'];
var seconds = i.getElementsByTagName('input')['seconds'];
var increment = i.getElementsByTagName('input')['increment'];
moves.addEventListener('keypress', e=> {
    if (moves.value.toString().length > 2) {
    e.preventDefault();
    }
  })
minutes.addEventListener('keypress', e=> {
    if (minutes.value.toString().length > 2) {
    e.preventDefault();
    }
  })
seconds.addEventListener('keypress', e=> {
    if (seconds.value.toString().length > 1) {
    e.preventDefault();
    }
  })
increment.addEventListener('keypress', e=> {
    if (increment.value.toString().length > 1) {
    e.preventDefault();
    }
  })

}


$('insert_new_phase').addEventListener('click', e=> {
    var new_item = document.createElement("DIV");
    new_item.setAttribute('class','custom_time');
    new_item.innerHTML = "<span style='font-size: 50%;'>&#x2716</span>" + document.getElementsByClassName('custom_time')[0].innerHTML;
    $('custom').insertBefore(new_item,$('insert_new_phase'));
    new_item.getElementsByTagName('icon')[0].style.display = "none";
}) 

$('custom').style.display = "none";

$('right_column').addEventListener('click', e => {
    if(e.target.parentNode.className) {
        console.log(e.target.parentNode.getElementsByTagName('input')[0].value);
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
    var play_name = $('game_creator')['create_name'].value;
    var play_colour = $('game_creator')['create_play'].value;
    if (play_colour == "Random") {
        play_colour = Math.round(Math.random());
    }
    else if (play_colour == "White") {
        play_colour = 1;
    }
    else {
        play_colour = 0;
    }
    var variation = $('game_creator')['create_type'].value;
    var visibility = $('game_creator')['create_public'].value;
    var other_user = $('game_creator')['create_invite'].value;
    var points = $('game_creator')['create_points'].value;
    var time_control = $('game_creator')['create_time'].value;
    
    if (time_control == "Custom") {
        time_control = [];
        ([]).forEach.call(document.getElementsByClassName('custom_time'),time => {
            var time2 = time.getElementsByTagName('input');
            time_control.push(time2['moves'].value + "/" + (60 * parseInt(time2['minutes'].value) + parseInt(time2['seconds'].value)) + "+" + time2['increment'].value)
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

    
    create_new_user(username,play_name,play_colour,variation,visibility,other_user,points,time_control);
})


/*$('game_creator').addEventListener('submit', e => {
    e.preventDefault();
    var create_name = $('game_creator').getElementsByTagName('input')[0].value;
    var exists = false;
    db.collection('chess').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().name == create_name) {exists = true;}
        })
    }).then(() => {
    console.log(exists)
    if (exists) {
        console.warn('name already exists');
        $('game_creator').getElementsByTagName('input')[0].value = "";
    }
    else {
        user_id = create_new_user(username,$('game_creator').getElementsByTagName('input')[0].value);
        $('game_creator').getElementsByTagName('input')[0].value = "";
        $('overlay').style.visibility = "hidden";
        
    }

    })
})*/

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