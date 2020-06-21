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




var game = "";
var undo = [];
var clock;

if (getCookie('game_id'))
 {
     game = getCookie('game_id')
 }
else if (sessionStorage.getItem('game_id')) {
    game = sessionStorage.getItem('game_id')
}
else {
    console.error('Error getting game id');
}

window.addEventListener('load', e => {
    draw_board();
    show_pieces();
})

function $(id) { return document.getElementById(id); }

canvas = $("canvas1");
ctx = canvas.getContext("2d");

castle_rooka = true;
castle_rookh = true;

// sockets

var username = "anon";
var user_id = "";

var msg = $('message');
var msg_submit = $('submit_message');
var msg_title = $('chat_title');
var message_body = $("text");

if (getCookie('username') || sessionStorage.getItem('username')) {
    $('nav').getElementsByTagName('button')[0].innerHTML = "Welcome, ";
$('nav').getElementsByTagName('button')[0].innerHTML += sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
$('nav').getElementsByTagName('button')[0].innerHTML += "<br>Logout";
username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : getCookie('username');
}

update_graphics();
window.addEventListener('resize', e => {
    update_graphics();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_board();
    show_pieces();

})

function draw_board() {
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

function update_graphics() {
    canvas.height = window.innerHeight * 0.95;
    canvas.width = canvas.height;
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    canvas.style.top = window.innerHeight * 0.02 + "px";

    msg.style.height = canvas.getBoundingClientRect().height + "px";
    msg.style.width = (window.innerWidth - canvas.width) / 2 * 0.5 + 'px';
    msg.style.top = window.innerHeight * 0.02 + "px";
    msg.style.left = (canvas.getBoundingClientRect().left - msg.style.width.slice(0,-2)) * 0.98 + "px";

    msg_title.style.width = msg.style.width;
    msg_title.style.top = msg.style.top;
    msg_title.style.left = msg.style.left;
    msg_submit.style.bottom = window.innerHeight - msg.getBoundingClientRect().bottom + "px";
    $('message_form').childNodes[1].style.width = msg.style.width.slice(0,-2) * 0.99 + "px";
    msg_submit.style.left = msg.style.left;
    msg_submit.style.width = msg.style.width;
    $("message_form").childNodes[1].style.display = "absolute";
    $("message_form").childNodes[1].style.bottom = 0;

    message_body.style.height = $("message_form").childNodes[1].getBoundingClientRect().top - msg_title.getBoundingClientRect().bottom + "px";
    message_body.style.width = msg.style.width;
    message_body.style.top = msg_title.getBoundingClientRect().bottom + "px";
    message_body.style.left = msg.style.left;

    
	var interface = $('interface');
    interface.style.height = msg.style.height;
    interface.style.top = msg.style.top;
    interface.style.width = (window.innerWidth - canvas.getBoundingClientRect().right) * 0.95 + "px";
    interface.style.left = canvas.getBoundingClientRect().right * 1.01 + "px";

    var options = $('options');
    options.style.bottom = $('self_name').getBoundingClientRect().height + $('self_box').getBoundingClientRect().height + $('self_time').getBoundingClientRect().height + "px";
    options.style.left = '0px';

    //nav
    var nav = $('nav');
    nav.style.height = window.innerHeight + "px";
    nav.style.width = screen.width * 0.125 + "px";
    nav.style.top = 0;
    nav.style.left = 0;
    
}

var blackwhite = 1;
var observer = blackwhite == -1 ? true : false;
var handle_colour = blackwhite ? 'white' : 'black';
if (observer) {handle_colour = 'observer';}
var turn = 1;
var enpassant;

if (observer) {
    $("options").getElementsByTagName("button")[2].innerHTML = "Flip Board";
}

var white_arr = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2]];
var black_arr = [[1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]];

arrEqual = (arr1, arr2) => {
    if (arr1.length == arr2.length) { for (var i = 0; i < arr1.length; i++) { if (arr1[i] != arr2[i]) { return false; } } return true; }
    else { return false; }
}
findArr = (ele, arr) => {
    var match = -1;
    arr.forEach((element, index) => { match = arrEqual(element, ele) ? index : match; });
    return match;
}
detectSquare = (options, onboard2, colour, white_arrt = white_arr, black_arrt = black_arr) => {
    var choose = colour ? white_arrt : black_arrt;
    for (let option of options) {
        if ((0 < option[0] && option[0] < 9 && 0 < option[1] && option[1] < 9)) {
            if (findArr(option, choose) == -1) { onboard2.push(option); }
        }
    }
}

detectSingle = (option, onboard2, colour, repeat, white_arrt = white_arr, black_arrt = black_arr) => {
    //console.log(option);
    var choose = colour ? white_arrt : black_arrt;
    var opposite = colour ? black_arrt : white_arrt;
    if ((0 < option[0] && option[0] < 9 && 0 < option[1] && option[1] < 9)) {
        if (findArr(option, choose) == -1 && findArr(option, opposite) == -1) { onboard2.push(option); return 'blank'; }
        if (findArr(option, choose) == -1 && findArr(option, opposite) != -1 && repeat) { onboard2.push(option); return 'repeat'; }
        else { return 'block'; }
    }
}

check = (colour, w_list= white_list, b_list= black_list, w_arr= white_arr, b_arr= black_arr) => {
    var list = colour ? b_list : w_list;
    var check_nums = 0;
    var check_pieces = [];
    for (var piece of list) {
        if (piece.highlight(true, w_arr, b_arr, w_list, b_list)) {
            check_nums++;
            check_pieces.push(piece);
        }
    }
    return [check_nums, check_pieces];
}

copy_arr = (arr) => {
    var int = [];
    arr.forEach(ele => {int.push(ele)})
    return int;
}

class piece {
    constructor(colour, type, pos, name) {
        this.name = name;
        this.colour = colour; //int
        this.type = type; //char
        this.pos = pos; //tuple

    }

    mock_update(new_pos) {
        var original_pos = copy_arr(this.pos)
        var test_arr = this.colour ? copy_arr(white_arr) : copy_arr(black_arr);
        var opposite = this.colour ? copy_arr(black_arr) : copy_arr(white_arr);
        var sel = this.colour ? copy_arr(white_list) : copy_arr(black_list);
        var opp = this.colour ? copy_arr(black_list) : copy_arr(white_list);
        test_arr.splice(findArr(this.pos, test_arr), 1, new_pos);
        this.pos = new_pos;
        var capture_arr = copy_arr(opp);
        var capture = findArr(new_pos, opposite);
        if (capture != -1) {
            opposite.splice(findArr(new_pos, opposite), 1); //may be error
            for (let captured_piece in capture_arr) {
                if (arrEqual(capture_arr[captured_piece].pos, new_pos)) {
                    capture_arr[captured_piece].delete = true;
                    break;
                }
            }
        }
        var ret = check(this.colour, this.colour ? sel : opp, this.colour ? opp : sel, this.colour ? test_arr : opposite, this.colour ? opposite : test_arr);
        this.pos = original_pos;
        return ret;
        }

    update(new_pos, send = true, doublemove = false) {
        var elapsed_time = new Date();
        console.log('update');
        var original_pos = copy_arr(this.pos);
        var test_arr = this.colour ? white_arr : black_arr;
        var opposite = this.colour ? black_arr : white_arr;
        var original_test_arr = copy_arr(test_arr);
        var original_opposite = copy_arr(opposite);
        test_arr.splice(findArr(this.pos, test_arr), 1, new_pos);
        this.pos = new_pos;
        var capture_arr = this.colour ? black_list : white_list;
        var original_capture_arr = copy_arr(capture_arr);
        var capture = findArr(new_pos, opposite);
        if (capture != -1) {
            opposite.splice(findArr(new_pos, opposite), 1); //may be error
            for (let captured_piece in capture_arr) {
                if (arrEqual(capture_arr[captured_piece].pos, new_pos)) {
                    capture_arr.splice(captured_piece, 1);
                    break;
                }
            }
        }
        enpassant = undefined;
        if (this.type == "K" && this.colour == blackwhite) {
            // console.log("not doublemove");
            castle_rooka = false;
            castle_rookh = false;
            if (Math.abs(new_pos[0] - original_pos[0]) == 2) {
                // console.log(this.colour)
                if (this.colour) {
                    if (new_pos[0] == 3) {
                        w_rooka.update([4, 1], true, true);
                    }
                    else {
                        w_rookh.update([6, 1], true, true);
                    }
                }
                else {
                    if (new_pos[0] == 3) {
                        b_rooka.update([4, 8], true, true);
                    }
                    else {
                        b_rookh.update([6, 8], true, true);
                    }
                }
            }
        }

        if (this.type == "R" && this.colour == blackwhite) {
            if (this.colour) {
                if (this.name == 'w_rooka') { castle_rooka = false; }
                else { castle_rookh = false; }

            }
            else {
                if (this.name == 'b_rooka') { castle_rooka = false; }
                else { castle_rookh = false; }
            }
        }
        if (this.type == "P") {
            if (this.colour) {
                if (new_pos[1] == 8) { this.type = "Q" }

            }
            else {
                if (new_pos[1] == 1) { this.type = "Q" }

            }
            if (new_pos[0] != original_pos[0] && capture == -1) {
                test_arr.splice(findArr([new_pos[0], original_pos[1]], opposite), 1);
                for (let captured_piece in capture_arr) {
                    if (arrEqual(capture_arr[captured_piece].pos, [new_pos[0], original_pos[1]])) {
                        capture_arr.splice(captured_piece, 1);
                        break;
                    }
                }
            }
            if (Math.abs(this.pos[1] - original_pos[1]) == 2) {
                enpassant = this;
            }
        }

        if (check(this.colour)[0]) {
            console.log('in check')
            test_arr = original_test_arr;
            capture_arr = original_capture_arr;
            opposite = original_opposite;
            this.pos = original_pos;
            return false;

        }
        // console.log(capture_arr[capture]);
        if (!doublemove) {
            turn = turn ? 0 : 1;
            if (undo.length != 0) {
                if (undo[undo.length - 1][3] == "castle") {
                    undo[undo.length - 1][3] = [this.name, original_pos, new_pos, "", undefined];
                }
                else {
                    if (capture != -1) {
                        undo.push([this.name, original_pos, new_pos, "", capture_arr[capture].name]);
                    }
                    else {
                        undo.push([this.name, original_pos, new_pos, "", undefined]);
                    }
                    // console.log('turn',turn);
                }
            }
            else {
                if (capture != -1) {
                    undo.push([this.name, original_pos, new_pos, "", capture_arr[capture].name]);
                }
                else {
                    undo.push([this.name, original_pos, new_pos, "", undefined]);
                }
            }
        }
        else {
            undo.push([this.name, original_pos, new_pos, 'castle', undefined]);
        }
        var tempb = [];
        var tempw = [];
        white_list.forEach(obj => {
            tempw.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
        })
        black_list.forEach(obj => {
            tempb.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
        })
        
            if (capture_arr[capture]) {
                console.log(original_capture_arr[capture])
                switch (capture_arr[capture].type) {
                    case 'K':
                        $('self_box').innerHTML += '&#9818';
                        break;
                    case 'Q':
                        $('self_box').innerHTML += '&#9819';
                        break;
                    case 'P':
                        $('self_box').innerHTML += '&#9823';
                        break;
                    case 'B':
                        $('self_box').innerHTML += '&#9821';
                        break;
                    case 'N':
                        $('self_box').innerHTML += '&#9822';
                        break;
                    case 'R':
                        $('self_box').innerHTML += '&#9820';
                        break;
                }
            }
            var white_bank = blackwhite ? $('self_box').innerHTML : $('opposite_box').innerHTML;
            var black_bank = blackwhite ? $('opposite_box').innerHTML : $('self_box').innerHTML;

            var time_left = 0;
            db.collection('chess').doc(game).get().then(doc => {
                if (doc.data()['white_time'] != null) {
                console.log(doc.data().timer[1].toDate() - 0);
                console.log(elapsed_time - 0);
                elapsed_time = elapsed_time - doc.data().timer[1].toDate();
                elapsed_time /= 1000;
                time_left = blackwhite ? doc.data()['white_count'] : doc.data()['black_count'];
                time_left -= elapsed_time;
                clearInterval(clock);
            }

            }).then(() => {
                if (blackwhite) {
            db.collection('chess').doc(game).update({
                white_arr: stringify(white_arr),
                black_arr: stringify(black_arr),
                white_list: tempw,
                black_list: tempb,
                turn: blackwhite ? 0 : 1,
                white_bank: white_bank,
                black_bank: black_bank,
                white_count: time_left,
                
            }).catch(error => {console.log(error.lineNumber)})
        }
                else {
            db.collection('chess').doc(game).update({
                white_arr: stringify(white_arr),
                black_arr: stringify(black_arr),
                white_list: tempw,
                black_list: tempb,
                turn: blackwhite ? 0 : 1,
                white_bank: white_bank,
                black_bank: black_bank,
                black_count: time_left,
                
            }).catch(error => {console.log(error.lineNumber)})
                }
        })
    }

    highlight(checktest = false, white_arrt = white_arr, black_arrt = black_arr, white_listt = white_arr, black_listt = black_arr, recursion = true) {
        // console.log('highlight');
        var onboard = [];
        switch (this.colour, this.type) {
            case 'N':
                var options = [[this.pos[0] + 2, this.pos[1] + 1], [this.pos[0] + 2, this.pos[1] - 1],
                [this.pos[0] - 2, this.pos[1] + 1], [this.pos[0] - 2, this.pos[1] - 1],
                [this.pos[0] + 1, this.pos[1] + 2], [this.pos[0] + 1, this.pos[1] - 2],
                [this.pos[0] - 1, this.pos[1] + 2], [this.pos[0] - 1, this.pos[1] - 2]];
                detectSquare(options, onboard, this.colour, white_arrt, black_arrt);
                break;
            case 'P':
                var options = [];
                if (this.colour) {
                    var space = [];
                    options = [[this.pos[0], this.pos[1] + 1]];
                    if (detectSingle(options[0], space, 0, false, white_arrt, black_arrt) == "blank" && detectSingle(options[0], space, 1, false, white_arrt, black_arrt) == "blank") {
                        options = [[this.pos[0], this.pos[1] + 1]];
                        if (this.pos[1] == 2 && detectSingle(options[0], space, 0, false, white_arrt, black_arrt) == "blank" && detectSingle([options[0][0], options[0][1] + 1], space, 1, false, white_arrt, black_arrt) == "blank") {
                            options.push([this.pos[0], this.pos[1] + 2]);
                        }
                    }
                    else {
                        options = [];
                    }
                }
                else {
                    var space = [];
                    options = [[this.pos[0], this.pos[1] - 1]];
                    if (detectSingle(options[0], space, 0, false, white_arrt, black_arrt) == "blank" && detectSingle(options[0], space, 1, false, white_arrt, black_arrt) == "blank") {
                        options = [[this.pos[0], this.pos[1] - 1]];
                        if (this.pos[1] == 7 && detectSingle(options[0], space, 0, false, white_arrt, black_arrt) == "blank" && detectSingle([options[0][0], options[0][1] - 1], space, 1, false, white_arrt, black_arrt) == "blank") {
                            options.push([this.pos[0], this.pos[1] - 2]);
                        }
                    }
                    else {
                        options = [];
                    }
                }
                detectSquare(options, onboard, this.colour, white_arrt, black_arrt);
                if (!(onboard.length == 2 || onboard.length == 4)) {
                    onboard = [];
                }
                if (this.colour) {
                    var diagonal = [[this.pos[0] + 1, this.pos[1] + 1], [this.pos[0] - 1, this.pos[1] + 1]];
                    if (findArr(diagonal[0], black_arrt) != -1) { onboard.push(diagonal[0]) }
                    if (findArr(diagonal[1], black_arrt) != -1) { onboard.push(diagonal[1]) }
                }
                else {
                    var diagonal = [[this.pos[0] + 1, this.pos[1] - 1], [this.pos[0] - 1, this.pos[1] - 1]];
                    if (findArr(diagonal[0], white_arrt) != -1) { onboard.push(diagonal[0]) }
                    if (findArr(diagonal[1], white_arrt) != -1) { onboard.push(diagonal[1]) }
                }
                if (enpassant && enpassant.pos[1] == this.pos[1] && Math.abs(enpassant.pos[0] - this.pos[0]) == 1) {
                    if (this.colour) { onboard.push([enpassant.pos[0], this.pos[1] + 1]); }
                    else { onboard.push([enpassant.pos[0], this.pos[1] - 1]); }
                }
                // console.log(onboard);
                break;
            case 'R':
            case 'Q':
                var options = [];
                var repeat1 = true;
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var ret = detectSingle([i, this.pos[1]], options, this.colour, repeat1, white_arrt, black_arrt);
                    if (ret == "block") { break; }
                    else if (ret == "repeat") { repeat1 = false; }
                }
                var repeat2 = true;
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var ret2 = detectSingle([i, this.pos[1]], options, this.colour, repeat2, white_arrt, black_arrt);
                    if (ret2 == "block") { break; }
                    else if (ret2 == "repeat") { repeat2 = false; }
                }
                var repeat3 = true;
                for (var i = this.pos[1] + 1; i < 9; i++) {
                    var ret3 = detectSingle([this.pos[0], i], options, this.colour, repeat3, white_arrt, black_arrt);
                    if (ret3 == "block") { break; }
                    else if (ret3 == "repeat") { repeat3 = false; }
                }
                var repeat4 = true;
                for (var i = this.pos[1] - 1; i > 0; i--) {
                    var ret4 = detectSingle([this.pos[0], i], options, this.colour, repeat4, white_arrt, black_arrt);
                    if (ret4 == "block") { break; }
                    else if (ret4 == "repeat") { repeat4 = false; }
                }
                // console.log(options);
                onboard = onboard.concat(options);
                if (this.type == "R") { break; }
            case 'B':
            case 'Q':
                var optionsq = [];
                var repeat1 = true;
                var repeat2 = true;
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var retb = detectSingle([i, this.pos[1] - (this.pos[0] - i)], optionsq, this.colour, repeat1, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") { repeat1 = false; }
                }
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var retb = detectSingle([i, this.pos[1] + (this.pos[0] - i)], optionsq, this.colour, repeat2, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") { repeat2 = false; }
                }
                var repeat3 = true;
                var repeat4 = true;
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var retb = detectSingle([i, this.pos[1] - (this.pos[0] - i)], optionsq, this.colour, repeat3, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") { repeat3 = false; }
                }
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var retb = detectSingle([i, this.pos[1] + (this.pos[0] - i)], optionsq, this.colour, repeat4, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") { repeat4 = false; }
                }

                // console.log(options);
                onboard = onboard.concat(optionsq);
                break;
            case 'K':
                var options = [
                    [this.pos[0] + 1, this.pos[1] + 0],
                    [this.pos[0] - 1, this.pos[1] + 0],
                    [this.pos[0] + 1, this.pos[1] + 1],
                    [this.pos[0] - 1, this.pos[1] + 1],
                    [this.pos[0] + 1, this.pos[1] - 1],
                    [this.pos[0] - 1, this.pos[1] - 1],
                    [this.pos[0] + 0, this.pos[1] + 1],
                    [this.pos[0] + 0, this.pos[1] - 1],
                ]

                if (this.colour) {
                    if (castle_rooka) {
                        var castle_check = []
                        detectSingle([3, 1], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([2, 1], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([4, 1], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([2, 1], castle_check, 1, false, white_arrt, black_arrt);
                        detectSingle([3, 1], castle_check, 1, false, white_arrt, black_arrt);
                        detectSingle([4, 1], castle_check, 1, false, white_arrt, black_arrt);
                        if (castle_check.length == 6) {
                            options.push([3, 1]);
                        }
                    }
                    if (castle_rookh) {
                        var castle_check2 = []
                        detectSingle([7, 1], castle_check2, 0, false, white_arrt, black_arrt);
                        detectSingle([6, 1], castle_check2, 0, false, white_arrt, black_arrt);
                        detectSingle([7, 1], castle_check2, 1, false, white_arrt, black_arrt);
                        detectSingle([6, 1], castle_check2, 1, false, white_arrt, black_arrt);
                        if (castle_check2.length == 4) {
                            options.push([7, 1]);
                        }
                    }
                }
                else {
                    if (castle_rooka) {
                        var castle_check = []
                        detectSingle([2, 8], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([3, 8], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([4, 8], castle_check, 0, false, white_arrt, black_arrt);
                        detectSingle([2, 8], castle_check, 1, false, white_arrt, black_arrt);
                        detectSingle([3, 8], castle_check, 1, false, white_arrt, black_arrt);
                        detectSingle([4, 8], castle_check, 1, false, white_arrt, black_arrt);
                        if (castle_check.length == 6) {
                            options.push([3, 8]);
                        }
                    }
                    if (castle_rookh) {
                        var castle_check2 = []
                        detectSingle([7, 8], castle_check2, 0, false, white_arrt, black_arrt);
                        detectSingle([6, 8], castle_check2, 0, false, white_arrt, black_arrt);
                        detectSingle([7, 8], castle_check2, 1, false, white_arrt, black_arrt);
                        detectSingle([6, 8], castle_check2, 1, false, white_arrt, black_arrt);
                        if (castle_check2.length == 4) {
                            options.push([7, 8]);
                        }
                    }
                }


                detectSquare(options, onboard, this.colour, white_arrt, black_arrt);
                // console.log(onboard);
                break;
        }

        //first attempt
        /*
        if (recursion) {
        for (let checkcheck in onboard) {
            console.log('1 recursion')
            var tempwhite = white_arr;
            var tempblack = black_arr;
            var tempwhitelist = white_list;
            var tempblacklist = black_list;
            this.mock_update(onboard[checkcheck],tempwhite,tempblack,tempwhitelist,tempblacklist);
            console.log(tempwhite)
            console.log(tempblack)
            for (let checkpiece of this.colour ? tempblacklist : tempwhitelist) { 
                if (checkpiece.highlight(true,tempwhite,tempblack,tempwhitelist,tempblacklist,false)) {onboard.slice(checkcheck,1);break;}
            }
        }}*/

        var intermediary = (e) => {
            var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
            var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
            if (findArr(square, onboard) != -1) {
                this.update(square);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                show_pieces();
                canvas.removeEventListener('click', intermediary);
            }
            else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                show_pieces();
                canvas.removeEventListener('click', intermediary);
                document.elementFromPoint(e.clientX, e.clientY).click();
            }

        }

        if (!checktest) {
            //check
            if (check(this.colour)[0]) {
            console.log('check, no castling');
            if (this.type == "K") {
                var temp_onboard = [];
                for (var opt in onboard) {
                    if(Math.abs(onboard[opt][0] - this.pos[0]) < 1) {
                        temp_onboard.push(onboard[opt]);
                    }
                }
            }

            if (check(this.colour)[0] == 2) {
                console.log('doublecheck, king move only');
                if (this.type != "K") { onboard = [] }
            }

            if (check(this.colour)[1][0].type == "N" || check(this.colour)[1][0].type == "P") {
                console.log('knight/pawn check');
                var temp_onboard = [];
                for (var opt in onboard) {
                    if ((this.type == "K" || arrEqual(onboard[opt], check(this.colour)[1][0].pos))) {
                        temp_onboard.push(onboard[opt])
                    }
                }
                onboard = temp_onboard;}
            }

            for (let shade of onboard) {
                if (!this.mock_update(shade)[0]) {
                ctx.fillStyle = 'rgba(250,250,250,0.5)';
                if (blackwhite) {
                    ctx.fillRect(canvas.width / 8 * (shade[0] - 1), canvas.height - canvas.height / 8 * (shade[1]), canvas.width / 8, canvas.height / 8);
                }
                else {
                    ctx.fillRect(canvas.width - (canvas.width / 8 * (shade[0])), canvas.height - canvas.height / 8 * (9 - shade[1]), canvas.width / 8, canvas.height / 8);
                }}
            }

            canvas.addEventListener('click', intermediary);
        }
        else {
            //  console.log(onboard);
            var self_king = this.colour ? b_king : w_king;
            for (let check_piece of onboard) {
                if (arrEqual(check_piece, self_king.pos)) { return true; }
            }
            return false;

        }
        return onboard;
    }
}



//(rank (char --> int), file)

var w_rooka;
var w_knightb;
var w_bishopc;
var w_queen;
var w_king;
var w_bishopf;
var w_knightg;
var w_rookh;

var w_a;
var w_b;
var w_c;
var w_d;
var w_e;
var w_f;
var w_g;
var w_h;

var b_rooka;
var b_knightb;
var b_bishopc;
var b_queen;
var b_king;
var b_bishopf;
var b_knightg;
var b_rookh;

var b_a;
var b_b;
var b_c;
var b_d;
var b_e;
var b_f;
var b_g;
var b_h; 

function win() {
    console.log('win');
    db.collection('chess').doc(game).update({
        result: blackwhite ? 'white' : 'black'
    })
}
function lose() {
    console.log('lose');
    db.collection('chess').doc(game).update({
        result: blackwhite ? 'black' : 'white'
    })
}
function draw() {
    console.log('draw');
    db.collection('chess').doc(game).update({
        result: 'draw'
    })
}

var white_list = [];
var black_list = [];

$('options').getElementsByTagName('button')[1].addEventListener('click', e => {
    if (e.target.innerHTML == '⚑') {
        e.target.innerHTML = "<div style='width: 49%;display: inline-block;'>&#10004</div><div style='width: 49%;display: inline-block;'>&#10008</div>";
    }
    else if (e.target.innerHTML == '✔') {
        e.target.parentElement.innerHTML = '&#9873';
        lose();
    }
    else if (e.target.innerHTML == '✘') {
        e.target.parentElement.innerHTML = '&#9873';
    }
})
$('options').getElementsByTagName('button')[2].addEventListener('click', e => {
    if (e.target.innerHTML == "🤝") {
        e.target.innerHTML = '✘';
        $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has offered a draw</i><br>`;
        db.collection('chess').doc(game).update({
            draw_query: true,
            messages: $('text').innerHTML
        })
    }
    else if (e.target.innerHTML == '✘') {
        if (e.target.tagName == "button") {
        e.target.innerHTML = '🤝';
        }
        else {
        e.target.parentElement.innerHTML = '🤝';
    }
        $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has revoked the draw</i><br>`;
        db.collection('chess').doc(game).update({
            draw_query: false,
            messages: $('text').innerHTML
        })
    }
    else if (e.target.innerHTML == '✔') {
        e.target.parentElement.innerHTML = '🤝';
        $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has accepted the draw</i><br>`;
        db.collection('chess').doc(game).update({
            draw_query: false,
            messages: $('text').innerHTML
        })
        draw();
    }
})

db.collection('chess').doc(game).onSnapshot(doc => {    
    $('text').innerHTML = doc.data().messages;
    white_arr = arrayify(doc.data().white_arr, Number);
    black_arr = arrayify(doc.data().black_arr, Number);
    turn = doc.data().turn;
    white_list = [];
    black_list = [];
    $('self_time').innerHTML = blackwhite ? doc.data().white_count : doc.data().black_count;
    $('opposite_time').innerHTML = blackwhite ? doc.data().black_count : doc.data().white_count;
    $('self_time').innerHTML = time_to_str($('self_time').innerHTML);
    $('opposite_time').innerHTML = time_to_str($('opposite_time').innerHTML);


    $('self_box').innerHTML = blackwhite ? doc.data().white_bank : doc.data().black_bank;
    $('opposite_box').innerHTML = blackwhite ? doc.data().black_bank : doc.data().white_bank;
    if (doc.data().white_user == username) {blackwhite = 1}
    else if (doc.data().black_user == username) {blackwhite = 0}
    else {blackwhite = 1; observer = true;}
    // eval(`white_arr = [${doc.data().white_arr}]`);
    for (var i of doc.data().white_list) {
        var code = `${i.name} = new piece(${i.colour},"${i.type}",[${i.pos}],"${i.name}");`;
        eval(code);
        eval(`white_list.push(${i.name})`);
    }
    for (var i of doc.data().black_list) {
        var code = `${i.name} = new piece(${i.colour},"${i.type}",[${i.pos}],"${i.name}");`;
        eval(code);
        eval(`black_list.push(${i.name})`);
    }
    undo = arrayify(doc.data().undo);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    show_pieces();

    if (blackwhite) {
        $('self_time').style['background-color'] = 'white';
        $('self_name').style['background-color'] = 'white';
        $('self_box').style['background-color'] = 'white';
        $('opposite_name').style['background-color'] = 'black';
        $('opposite_time').style['background-color'] = 'black';
        $('opposite_box').style['background-color'] = 'black';
        $('self_name').style.color = 'black';
        $('self_time').style.color = 'black';
        $('self_box').style.color = 'black';
        $('opposite_name').style.color = 'white';
        $('opposite_time').style.color = 'white';
        $('opposite_box').style.color = 'white';
    }
    else {
        $('self_name').style['background-color'] = 'black';
        $('self_time').style['background-color'] = 'black';
        $('self_box').style['background-color'] = 'black';
        $('opposite_name').style['background-color'] = 'white';
        $('opposite_time').style['background-color'] = 'white';
        $('opposite_box').style['background-color'] = 'white';
        $('self_time').style.color = 'white';
        $('self_name').style.color = 'white';
        $('self_box').style.color = 'white';
        $('opposite_name').style.color = 'black';
        $('opposite_time').style.color = 'black';
        $('opposite_box').style.color = 'black';
    }

    if (doc.data()['draw_query']) {
        $('options').getElementsByTagName('button')[2].innerHTML = "<div style='width: 49%;display: inline-block;'>&#10004</div><div style='width: 49%;display: inline-block;'>&#10008</div>";
    }
    if (doc.data().timer[0] != blackwhite && doc.data().turn == blackwhite && doc.data()['white_time'] != null) {
        var new_date = new Date()
        db.collection('chess').doc(game).update({
            timer: [blackwhite, new_date]
        })
        var original_date = new_date;
        if (parseInt($('self_time').innerHTML.split(':')[0])) {
            interval1();
        }
        else {
            if (parseFloat($('self_time').innerHTML.split(":")[1])) {
                interval3();
            }
            else {
                interval2();
            }
        }

    }

})

interval3 = () => {
    clock = setInterval(() => {
        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) - 0.001);
        if (!parseFloat($('self_time').innerHTML.split(':')[0]) && !parseFloat($('self_time').innerHTML.split(':')[1])) {
            $('status').innerHTML = "time lost";
        }
    }, 1)
}
interval2 = () => {
    clock = setInterval(() => {
        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) - 0.01);
        if ($('self_time').innerHTML == "0:10.0") {
            clearInterval(clock);
            interval3();
        }
    }, 10)
}
interval1 = () => {
    clock = setInterval(() => {
        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) - 1);
            if ($('self_time').innerHTML == "1:00") {
                clearInterval(clock);
                interval2();
            }
    }, 1000)
}

function time_to_str(time) {
    var ret_string;
    if (Math.floor(time / 60) != 0) {
        ret_string = Math.floor(time / 60) + ":" + (((time % 60) < 10) ? "0" : "") + (time % 60).toFixed(0);
    }
    else {
        if ((time % 60) < 10) {
        ret_string = Math.floor(time / 60) + ":" + (((time % 60) < 10) ? "0" : "") + (time % 60).toFixed(3);
        }
        else {
            ret_string = Math.floor(time / 60) + ":" + (((time % 60) < 10) ? "0" : "") + (time % 60).toFixed(2);
        }
    }
    return ret_string;
}

function str_to_time(str) {
    return parseInt(str.split(':')[0] * 60) + parseFloat(str.split(':')[1])
}

function show_pieces() {
    draw_board();
    if (blackwhite) {
        for (let piece_showw of white_list) {
            var img = $(`w${piece_showw.type}`);
            ctx.drawImage(img, canvas.width / 8 * (piece_showw.pos[0] - 1), canvas.height - canvas.height / 8 * (piece_showw.pos[1]), canvas.width / 8, canvas.height / 8);
        }
        for (var piece_showb of black_list) {
            var img2 = $(`b${piece_showb.type}`);
            ctx.drawImage(img2, canvas.width / 8 * (piece_showb.pos[0] - 1), canvas.height - canvas.height / 8 * (piece_showb.pos[1]), canvas.width / 8, canvas.height / 8);
        }
    }
    else {
        for (let piece_showw of white_list) {
            var img = $(`w${piece_showw.type}`);
            ctx.drawImage(img, canvas.width - canvas.width / 8 * (piece_showw.pos[0]), canvas.height / 8 * (piece_showw.pos[1] - 1), canvas.width / 8, canvas.height / 8);
        }
        for (var piece_showb of black_list) {
            var img2 = $(`b${piece_showb.type}`);
            ctx.drawImage(img2, canvas.width - canvas.width / 8 * (piece_showb.pos[0]), canvas.height / 8 * (piece_showb.pos[1] - 1), canvas.width / 8, canvas.height / 8);
        }
    }
}

document.addEventListener('click', e => {
    var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
    var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
    // console.log(square);
    var clicked_piece_white = findArr(square, white_arr);
    var clicked_piece_black = findArr(square, black_arr);
    // console.log(clicked_piece_white,clicked_piece_black);
    var clicked;
    if (clicked_piece_white == -1 && clicked_piece_black == -1) {
        // console.log('blank space');
    }
    else {
        if (clicked_piece_white != -1) {
            for (var check of white_list) {
                if (arrEqual(check.pos, square)) { clicked = check; }
            }
        }
        else {
            for (var check of black_list) {
                // console.log(check.pos,square);
                if (arrEqual(check.pos, square)) { clicked = check; break; }
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        show_pieces();
        // console.log(clicked.colour,turn,blackwhite);
        // console.log(clicked);
        if (clicked.colour == turn && clicked.colour == blackwhite && !observer) { //change this back to multiplayer
            clicked.highlight();
        }
    }

});

var msg_ready = true;
$("message_form").addEventListener('submit', e => {
    e.preventDefault();
    if ($('message_form').childNodes[1].value && msg_ready) {
    msg_ready = false;
    var handle;
    if (observer) {handle = username}
    else if (blackwhite == 1) {handle = "white"}
    else if (blackwhite == 0) {handle = "black"}
    var prev_html = "";
    db.collection('chess').doc(game).get().then(doc => {
        prev_html = doc.data().messages;
    }).then(docRef => {
    db.collection('chess').doc(game).update({
        messages: prev_html + "<strong>" + handle + ":</strong> " + $('message_form').childNodes[1].value + "<br>"
    }).then(docRef => {
        $('message_form').childNodes[1].value = "";
        msg_ready = true;
    })
    
    })}
})

function socket_data(socket) {
    //console.log(socket);
    socket.on('chat', data => {
        $('text').innerHTML += "<strong>" + data.handle + ":</strong> " + data.message + "<br>";
        $('text').innerHTML = $('text').innerHTML.replace("<em><strong>" + data.handle + ":</strong> ... </em><br>", "");
    })

    $("message_form").addEventListener('keyup', () => {
        //console.log($('message_form').childNodes[1].value.length)
        if ($('message_form').childNodes[1].value.length > 0) {
            socket.emit('typing', handle_colour);
        }
        else {
            socket.emit('close_typing', handle_colour)
        }
    })

    socket.on('close_typing', data => {
        $('text').innerHTML = $('text').innerHTML.replace("<em><strong>" + data + ":</strong> ... </em><br>", "");
    })

    socket.on('typing', data => {
        if (!$('text').innerHTML.includes("<em><strong>" + data + ":</strong> ... </em><br>")) {
            $('text').innerHTML += "<em><strong>" + data + ":</strong> ... </em><br>";
        }
    })

    socket.on('player', data => {
        handle_colour = data;
        if (data == "white") { blackwhite = 1; observer = false; }
        else if (data == "black") { blackwhite = 0; observer = false; }
        else if (data == "observer") { blackwhite = -1; observer = true; }
        ready = true;
        if (loaded) { show_pieces() }
    })
    socket.on('position', data => {
        var chosen_list = blackwhite ? black_list : white_list;
        chosen_list.forEach(element => {
            if (element.name == data.piece) {
                element.update(data.pos, false, data.doublemove);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                show_pieces();
            }
        })
    })

}


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

arrayify = (arr2,type=String) => {
    var arr = arr2;
    /*
    if (arr[0] == '[') {
        arr = arr.slice(1)
    }
    if (arr[arr.length - 1] == ']') {
        arr = arr.slice(0,-1)
    }*/
    arr = arr.split(',');
    const original_arr = arr;
    var ret_arr = [];
    var index1;
    var inner = false;
    for (var index in original_arr) {
        if (original_arr[index].includes('[')) {
            
            index1 = index;
            inner = true;
        } 
        else if (original_arr[index].includes(']'))
        { 
            inner = false;
            var temp_arr = [];
            original_arr.forEach(name => {temp_arr.push(name)})
            temp_arr = temp_arr.splice(index1,(index-index1) + 1);
            temp_arr = temp_arr.join(',');
            temp_arr = temp_arr.split('[')[1].split(']')[0]
            var inter =  arrayify(temp_arr);
            ret_arr.push(inter);
        }
        else if (!inner) {
            if (type == Number) {
            ret_arr.push(parseInt(original_arr[index]));}
            else {
                ret_arr.push((original_arr[index]));
            }
        }
    }
    return ret_arr;
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
