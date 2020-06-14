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




// socket

var socket;
var loaded;
var ready;


loaded = false;
ready = false;
window.addEventListener('load', e => {
    show_pieces();
})

function $(id) { return document.getElementById(id); }

canvas = $("canvas1");
ctx = canvas.getContext("2d");

castle_rooka = true;
castle_rookh = true;

// sockets

// AJAX
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
       console.log('READY');
      }
    };
    xhttp.open("GET", "chess.php", true);
    xhttp.send();
  

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    show_pieces();

})

function update_graphics() {
    canvas.height = window.innerHeight * 0.95;
    canvas.width = canvas.height;
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    canvas.style.top = window.innerHeight * 0.02 + "px";

    msg.style.height = canvas.getBoundingClientRect().height + "px";
    msg.style.width = (window.innerWidth - canvas.width) / 2 * 0.96 + 'px';
    msg.style.top = window.innerHeight * 0.02 + "px";

    msg_title.style.width = msg.style.width;
    msg_title.style.top = msg.style.top;
    msg_submit.style.bottom = window.innerHeight - msg.getBoundingClientRect().bottom + "px";
    $('message_form').childNodes[1].style.width = (window.innerWidth - canvas.width) / 2 * 0.9555 + 'px';

    message_body.style.height = $("message_form").childNodes[1].getBoundingClientRect().top - msg_title.getBoundingClientRect().bottom + "px";
    message_body.style.width = msg.style.width;
    message_body.style.top = msg_title.getBoundingClientRect().bottom + "px";

    options.style.height = msg.style.height;
    options.style.width = window.innerWidth - msg.getBoundingClientRect().left - (canvas.getBoundingClientRect().left - msg.getBoundingClientRect().right) - canvas.getBoundingClientRect().right - parseInt(canvas.style["border-width"].slice(0, -2)) * 2 + "px";
    options.style.top = msg.style.top;
    options.style.right = msg.getBoundingClientRect().left + "px";

    var overlay = $('overlay');
    overlay.style.height = canvas.height + "px";
    overlay.style.top = canvas.getBoundingClientRect().top + parseInt(canvas.style['border-width'].slice(0, -2)) + "px";
    overlay.style.left = canvas.getBoundingClientRect().left + parseInt(canvas.style['border-width'].slice(0, -2)) + "px";
    overlay.style.width = canvas.width + "px";

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

check = (colour, w_list = white_list, b_list = black_list) => {
    var list = colour ? b_list : w_list;
    var check_nums = 0;
    var check_pieces = [];
    for (var piece of list) {
        if (piece.highlight(true)) {
            check_nums++;
            check_pieces.push(piece);
        }
    }
    return [check_nums, check_pieces];
}

class piece {
    constructor(colour, type, pos, name) {
        this.name = name;
        this.colour = colour; //int
        this.type = type; //char
        this.pos = pos; //tuple

    }

    mock_update(new_pos, white_arrtemp, black_arrtemp, white_arrlist, black_arrlist) {
        var original_pos = this.pos;
        var test_arr = this.colour ? white_arrtemp : black_arrtemp;
        var opposite = this.colour ? black_arrtemp : white_arrtemp;
        var opp = this.colour ? black_arrlist : white_arrlist;
        test_arr.splice(findArr(this.pos, test_arr), 1, new_pos);
        for (let captured_pos in opp) {
            if (arrEqual(opp[captured_pos].pos, new_pos)) {
                opposite.splice(findArr(new_pos, opposite), 1);
                opp.splice(captured_pos, 1);

                break;
            }
        }
    }

    update(new_pos, send = true, doublemove = false) {
        console.log('update');
        var original_pos = this.pos;
        var test_arr = this.colour ? white_arr : black_arr;
        var opposite = this.colour ? black_arr : white_arr;
        var original_test_arr = test_arr;
        var original_opposite = opposite;
        test_arr.splice(findArr(this.pos, test_arr), 1, new_pos);
        this.pos = new_pos;
        var capture_arr = this.colour ? black_list : white_list;
        var original_capture_arr = capture_arr;
        var capture = findArr(new_pos, opposite)
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
        console.log(capture_arr[capture]);
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
        if (send) {
            console.log('sending')
            socket.emit("position", {
                pos: new_pos,
                piece: this.name,
                doublemove: doublemove
            })
        }
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
                detectSquare(options, onboard, 1, white_arrt, black_arrt);
                detectSquare(options, onboard, 0, white_arrt, black_arrt);
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
            if (check(this.colour)[0] == 2) {
                console.log('doublecheck, king move only');
                if (this.type != "K") { onboard = [] }
            }
            else if (check(this.colour)[0] && check(this.colour)[1].type == "N") {
                console.log('knight check');
            }

            for (let shade of onboard) {
                ctx.fillStyle = 'rgba(250,250,250,0.5)';
                if (blackwhite) {
                    ctx.fillRect(canvas.width / 8 * (shade[0] - 1), canvas.height - canvas.height / 8 * (shade[1]), canvas.width / 8, canvas.height / 8);
                }
                else {
                    ctx.fillRect(canvas.width - (canvas.width / 8 * (shade[0])), canvas.height - canvas.height / 8 * (9 - shade[1]), canvas.width / 8, canvas.height / 8);
                }
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
    }
}


//(rank (char --> int), file)



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

function show_pieces() {
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


$("message_form").addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('chat', {
        message: $('message_form').childNodes[1].value,
        handle: handle_colour
    })

    $('message_form').childNodes[1].value = "";
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
var options_list = $('options').getElementsByTagName('button');
options_list[0].addEventListener('click', e => {
    // start new game
})
options_list[1].addEventListener('click', e => {
    //load
})
options_list[2].addEventListener("click", e => {
    //resign
    if (observer) {
        blackwhite = blackwhite ? black : white;
    }
})
var previous_innerHTML;
options_list[3].addEventListener('click', e => {
    console.log('click');
    if ($("login").style.display != "none") {
        $('login').style.display = "none";
        $('signup').style.display = "none";
        options_list[3].innerHTML = previous_innerHTML;
    }
    else {
        $('login').style.display = "initial";
        $('signup').style.display = "initial";
        previous_innerHTML = options_list[3].innerHTML;
        options_list[3].innerHTML = "";
    }
})

$('game_creator').addEventListener('submit', e => {
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
    })
$('game_loader').addEventListener('submit', e => {
    e.preventDefault();
    var load_name = $('game_loader').getElementsByTagName('input')[0].value;
    db.collection("chess").get().then(function (snapshot) {
        snapshot.docs.forEach(function (doc) {
            if (load_name == doc.data().name) {
                console.warn('loaded successfully');
                user_id = doc.id;
                $('overlay').style.visibility = "hidden";
            }
        })
    })
})

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



function load_new_game(user,name) {
    db.collection('chess');
}

function create_new_user(user,newname) {
var random = Math.round(Math.random());
if (random) {
    
db.collection('chess').add({
    name: newname,
    black_user: null,
    white_user: user,
    white_arr: stringify(white_arr),
    black_arr: stringify(black_arr),
    white_list: objectify(white_list),
    black_list: objectify(black_list),
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