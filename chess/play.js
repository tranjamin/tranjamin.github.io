/*
This Version Includes:
Basic piece movement
Basic chat
En passant
Castling
Promotion

This Version does not Include:
Flip Board

*/


var game = "";
var undo = [];
var clock;
var mode;
var done = false;
var pre_selection = false;
var beirut_piece = null;
var moves_back = 0;

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
if (getCookie('user_id') || sessionStorage.getItem('user_id')) {
	user_id = sessionStorage.getItem('user_id') ? sessionStorage.getItem('user_id') : getCookie('user_id');
	}
window.addEventListener('load', e => {
    update_graphics();
    ctx.clearRect(0,0,canvas.width,canvas.height)
    draw_board();
    show_pieces();
})

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

$('nav').getElementsByTagName('li')[0].addEventListener('click', e => {
    if ($('nav').getElementsByTagName('button')[0].innerHTML == "<a href='signup.html'>Login/Signup</a>") {window.location.assign('signup.html')}
    else {
        sessionStorage.clear();
        deleteAllCookies();
        location.reload();}
});

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

detectSingle = (option, onboard2, colour, white_arrt = white_arr, black_arrt = black_arr) => {
    var choose = colour ? white_arrt : black_arrt;
    var opposite = colour ? black_arrt : white_arrt;
    if ((0 < option[0] && option[0] < 9 && 0 < option[1] && option[1] < 9)) {
        if (findArr(option, choose) == -1 && findArr(option, opposite) == -1) { onboard2.push(option); return 'blank'; }
        if (findArr(option, choose) == -1 && findArr(option, opposite) != -1) { onboard2.push(option); return 'repeat'; }
        else { return 'block'; }
    }
}

check = (colour, w_list= white_list, b_list= black_list, w_arr= white_arr, b_arr= black_arr) => {
    var list = colour ? b_list : w_list;
    var check_nums = 0;
    var check_pieces = [];
    for (var piece of list) {
        if (!piece.delete && mode.indexOf('Anti') == -1 && (mode.indexOf('Dusanny') == -1 || (mode.indexOf('Dusanny') != -1 && !colour))) {
        if (mode.indexOf('Checkless') == -1) {
        if (piece.highlight(true, w_arr, b_arr, w_list, b_list)) {
            check_nums++;
            check_pieces.push(piece);
        }}
        else {
        if (piece.highlight(true, w_arr, b_arr, w_list, b_list)[1]) {
            check_nums++;
            check_pieces.push(piece);
        }    
        }
    }}
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
        var cap_piece;
        if (capture != -1) {
            opposite.splice(findArr(new_pos, opposite), 1); //may be error
            for (let captured_piece in capture_arr) {
                if (arrEqual(capture_arr[captured_piece].pos, new_pos)) {
                    capture_arr[captured_piece].delete = true;
                    cap_piece = capture_arr[captured_piece];
                    break;
                }
            }
        }
        var ret = check(this.colour, this.colour ? sel : opp, this.colour ? opp : sel, this.colour ? test_arr : opposite, this.colour ? opposite : test_arr);

        if (mode.indexOf('Checkless') != -1) {
            var ret2 = check(this.colour ? 0 : 1, this.colour ? sel : opp, this.colour ? opp : sel, this.colour ? test_arr : opposite, this.colour ? opposite : test_arr)
            var checkmate = true;
            (this.colour ? black_list : white_list).forEach(ele => {
                if (ele.highlight(true, this.colour ? test_arr : opposite, this.colour ? opposite : test_arr)[0].length) {checkmate = false;}
            })
            this.pos = original_pos;
            if (capture != -1) {cap_piece.delete = false;}
            //console.log('retuuuuuuuuurn', [ret[0],ret[1],ret2, checkmate])
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            show_pieces();
            return [ret[0],ret[1],ret2, checkmate]
        }
        this.pos = original_pos;
        if (cap_piece) {cap_piece.delete = false;}
        return ret;
        }

    update(new_pos, doublemove = false, inter=null, selfkill=false) {
        if (this.type == "P" && new_pos[1] == (this.colour ? 8 : 1)) {
            ctx.fillStyle = "rgb(255,255,255)";
            console.log(new_pos[0]) 
            var promote_div = document.createElement('DIV');
            promote_div.setAttribute('id', 'promote')
            document.getElementsByClassName('bottom')[0].insertBefore(promote_div, document.getElementsByClassName('bottom')[0].childNodes[0])      
            var promote_queen = document.createElement("button")  
            promote_queen.innerHTML = '♛';
            $("promote").appendChild(promote_queen);
            var promote_rook = document.createElement("button")  
            promote_rook.innerHTML = "♜";
            $("promote").appendChild(promote_rook);
            var promote_bishop = document.createElement("button")  
            promote_bishop.innerHTML = "♝";
            $("promote").appendChild(promote_bishop);
            var promote_knight = document.createElement("button")  
            promote_knight.innerHTML = "♞";
            $("promote").appendChild(promote_knight);
            if (mode.indexOf('Anti') != -1) {
            var promote_king = document.createElement("button")  
            promote_king.innerHTML = "♚";
            $("promote").appendChild(promote_king);
            }
            var promote_options = $('promote');
            promote_options.style.bottom = $('self_name').getBoundingClientRect().height + $('self_box').getBoundingClientRect().height + $('self_time').getBoundingClientRect().height + $('options').getBoundingClientRect().height + "px";
            promote_options.style.left = '0px';
            if (mode.indexOf('Anti') != -1) {
                promote_options.childNodes.forEach(classElement => {
                    classElement.style.width = "18.2%";
                })
            }
            $('promote').addEventListener('click', e => {
                var new_type;
                switch (e.target.innerHTML) {
                    case "♛":
                        new_type = "Q";
                        break;
                    case "♚":
                        new_type = "K";
                        break;
                    case "♝":
                        new_type = "B";
                        break;
                    case "♞":
                        new_type = "N";
                        break;
                    case "♜":
                        new_type = "R";
                        break;
                }
                this.update2(new_pos, doublemove, new_type, inter, selfkill)

            })
        

    }
    else {
        this.update2(new_pos, doublemove, null, inter, selfkill)
    }
}
    update2(new_pos, doublemove = false, pawn_type=null, inter, selfkill) {
        clearInterval(clock);
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
        if (this.type == "P" && new_pos[1] == (this.colour ? 8 : 1)) {
            this.type = pawn_type;
        }
        if (capture != -1) {
            if (mode.indexOf('Circe') == -1) {
            opposite.splice(findArr(new_pos, opposite), 1); //may be error
            for (let captured_piece in capture_arr) {
                if (arrEqual(capture_arr[captured_piece].pos, new_pos)) {
                    capture_arr.splice(captured_piece, 1);
                    break;
                }
            }
        }
            else {
                opposite.splice(findArr(new_pos, opposite), 1); //may be error
                for (let captured_piece in capture_arr) {
                    if (arrEqual(capture_arr[captured_piece].pos, new_pos)) {
                        var new_square;
                        switch (capture_arr[captured_piece].name) {
                            case "w_king":
                                new_square = [5,1]
                                break;
                            case "b_king":
                                new_square = [5,8]
                                break;
                            case "w_queen":
                                new_square = [4,1]
                                break;
                            case "b_queen":
                                new_square = [4,8]
                                break;
                            case "w_bishopc":
                                new_square = [3,1]
                                break;
                            case "w_bishopf":
                                new_square = [6,1]
                                break;
                            case "b_bishopc":
                                new_square = [3,8]
                                break;
                            case "b_bishopf":
                                new_square = [6,8]
                                break;
                            case "w_knightb":
                            case "w_knightg":
                                if ((this.pos[0] + this.pos[1]) % 2) {
                                    new_square = [2,1]
                                }
                                else {
                                    new_square = [7,1]
                                }
                                break;
                            case "b_knightb":
                            case "b_knightg":
                                if ((this.pos[0] + this.pos[1]) % 2) {
                                    new_square = [7,8]
                                }
                                else {
                                    new_square = [2,8]
                                }
                                break;
                            case "w_rooka":
                            case "w_rookh":
                                if ((this.pos[0] + this.pos[1]) % 2) {
                                    new_square = [8,1]
                                }
                                else {
                                    new_square = [1,1]
                                }
                                break;
                            case "b_rooka":
                            case "b_rookh":
                                if ((this.pos[0] + this.pos[1]) % 2) {
                                    new_square = [1,8]
                                }
                                else {
                                    new_square = [8,8]
                                }
                                break;
                            default:
                                if (blackwhite) {
                                    new_square = [this.pos[0],7]
                                }
                                else {
                                    new_square = [this.pos[0],2]
                                }
                                                      
                        }
                        if (findArr(new_square, black_arr) != -1 || findArr(new_square, white_arr) != -1) {
                            capture_arr.splice(captured_piece, 1);
                            break;
                        }
                        else {
                            capture_arr[captured_piece].pos = new_square;
                            opposite.push(new_square);
                            capture = -1;
                            break;
                        }
                        }
                    }
                }
            }
        enpassant = null;
        if (this.type == "K" && this.colour == blackwhite) {
            // console.log("not doublemove");
            castle_rooka = false;
            castle_rookh = false;
            if (Math.abs(new_pos[0] - original_pos[0]) == 2) {
                // console.log(this.colour)
                if (this.colour) {
                    if (new_pos[0] == 3) {
                        w_rooka.update([4, 1], true, null, inter);
                    }
                    else {
                        w_rookh.update([6, 1], true, null, inter);
                    }
                }
                else {
                    if (new_pos[0] == 3) {
                        b_rooka.update([4, 8], true, null, inter);
                    }
                    else {
                        b_rookh.update([6, 8], true, null, inter);
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
                
        if (this.type == "P" && Math.abs(this.pos[1] - original_pos[1]) == 2) {
            enpassant = this.pos;
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
        // [piece_name, start_pos (@ options), end_pos, doublemove arr, capture_piece, check (0/1/2), promote_type, (null/rank/file), circe]
        if (!doublemove) {
            turn = turn ? 0 : 1;
            if (undo.length != 0) {
                if (undo[undo.length - 1][3] == "castle") {
                    undo[undo.length - 1][3] = [this.name, original_pos, new_pos, "", undefined, 0, null, null, null];
                }
                else {
                    if (capture_arr[capture]) {
                        undo.push([this.name, original_pos, new_pos, "", [original_capture_arr[capture].colour, original_capture_arr[capture].type, original_capture_arr[capture].pos, original_capture_arr[capture].name], 0, null, null, null]);
                    }
                    else {
                        undo.push([this.name, original_pos, new_pos, "", undefined, 0, null, null, null]);
                    }
                }
            }
            else {
                if (capture != -1) {
                    undo.push([this.name, original_pos, new_pos, "", [original_capture_arr[capture].colour, original_capture_arr[capture].type, original_capture_arr[capture].pos, original_capture_arr[capture].name], 0, null, null, null]);
                }
                else {
                    undo.push([this.name, original_pos, new_pos, "", undefined, 0, null, null, null]);
                }
            }
        }
        else {
            undo.push([this.name, original_pos, new_pos, 'castle', undefined, 0, null, null, null]);
        }
        undo[undo.length - 1][5] = check(this.colour ? 0 : 1)[0];
        undo[undo.length - 1][6] = (pawn_type != null && new_pos[1] == (this.colour ? 8 : 1)) ? pawn_type : null;
        if (this.type != "P" && pawn_type == null) {
            var same_type = [];
            var same_pos = [];
            var same_one = false;
            var same_two = false;
            for (var test_type of (this.colour ? white_list : black_list)) {
                if (test_type.type == this.type && test_type != this) {same_type.push(test_type)}
            }
            if (same_type.length > 1) {
                same_type.forEach(test_square => {
                    if (new_pos, findArr(test_square.highlight)) {
                        same_pos.push(test_square.pos)
                    }
                })
                same_pos.forEach(repetition => {
                    if (repetition[0] == new_pos[0]) {same_one = true;}
                    if (repetition[1] == new_pos[1]) {same_one = true;}
                })
                if (same_one && same_two) {undo[undo.length - 1][7] = 'both'}
                else if (same_one) {undo[undo.length - 1][7] = 'rank'}
                else if (same_two) {undo[undo.length - 1][7] = 'file'}
                else {undo[undo.length - 1][7] = null}
            }
            else {
                undo[undo.length - 1][7] = null;
            }
        }
        else {
            undo[undo.length - 1][7] = null;
        }

            if (capture_arr[capture]) {
                function convert_to_bank (type) {
                switch (type) {
                    case "P":
                        $('self_box').innerHTML += "♟";
                        break;
                    case "Q":
                        $('self_box').innerHTML += "♛";
                        break;
                    case "K":
                        $('self_box').innerHTML += "♚";
                        break;
                    case "B":
                        $('self_box').innerHTML += "♝";
                        break;
                    case "N":
                        $('self_box').innerHTML += "♞";
                        break;
                    case "R":
                        $('self_box').innerHTML += "♜";
                        break;
                }
                }
                convert_to_bank(original_capture_arr[capture].type);
                console.log('inner', $('self_box').innerHTML);
                if (mode.indexOf('Atomic') != -1) {
                    var explosion = [
                        [this.pos[0] + 1,this.pos[1] + 1],
                        [this.pos[0] - 1,this.pos[1] + 1],
                        [this.pos[0],this.pos[1] + 1],
                        [this.pos[0] + 1,this.pos[1] - 1],
                        [this.pos[0] - 1,this.pos[1] - 1],
                        [this.pos[0],this.pos[1] - 1],
                        [this.pos[0] + 1,this.pos[1]],
                        [this.pos[0] - 1,this.pos[1]]
                    ];
                    for (var frag of explosion) {
                        if (frag[0] > 8 || frag[0] < 1 || frag[1] > 8 || frag[1] < 1) {
                            explosion.splice(findArr(frag, explosion), 1);
                        }
                    }
                    console.log(explosion);
                    for (var frag of explosion) {
                        if (findArr(frag, white_arr.concat(black_arr)) != -1) {
                            console.log('frag', frag)
                            for (var casualty of white_list.concat(black_list)) {
                                if (casualty.type != "P" && arrEqual(casualty.pos,frag)) {
                                    if (casualty.colour) {
                                        console.log('casualty', casualty, white_list.length)
                                        white_list.splice(white_list.indexOf(casualty), 1);
                                        white_arr.splice(findArr(casualty.pos, white_arr), 1);
                                        console.log('casualty', white_list.length);
                                    }
                                    else {
                                        console.log('casualty', casualty, black_list.length)
                                        black_list.splice(black_list.indexOf(casualty), 1);
                                        black_arr.splice(findArr(casualty.pos, black_arr), 1);
                                        console.log('casualty', black_list.length);
                                    }
                                    if (casualty.type == "K") {win('Exploding the King')}
                                }
                            }
                        }
                     }
                    (blackwhite ? white_list : black_list).splice((blackwhite ? white_list : black_list).indexOf(this), 1);
                    (blackwhite ? white_arr : black_arr).splice(findArr(this.pos, (blackwhite ? white_arr : black_arr)), 1);
                }
            }
            if (selfkill) {
            (blackwhite ? white_list : black_list).splice((blackwhite ? white_list : black_list).indexOf(this), 1);
            (blackwhite ? white_arr : black_arr).splice(findArr(this.pos, (blackwhite ? white_arr : black_arr)), 1);                
            }
            var white_bank = blackwhite ? $('self_box').innerHTML : $('opposite_box').innerHTML;
            var black_bank = blackwhite ? $('opposite_box').innerHTML : $('self_box').innerHTML;
            var white_int = "";
            var black_int = "";
            white_bank.split("").forEach(ele => {
                switch (ele) {
                    case "♟":
                        white_int += "P";
                        break;
                    case "♛":
                        white_int += "Q";
                        break;
                    case "♚":
                        white_int += "K";
                        break;
                    case "♝":
                        white_int += "B";
                        break;
                    case "♞":
                        white_int += "N";
                        break;
                    case "♜":
                        white_int += "R";
                        break;
                }
            })
            black_bank.split("").forEach(ele => {
                switch (ele) {
                    case "♟":
                        black_int += "P";
                        break;
                    case "♛":
                        black_int += "Q";
                        break;
                    case "♚":
                        black_int += "K";
                        break;
                    case "♝":
                        black_int += "B";
                        break;
                    case "♞":
                        black_int += "N";
                        break;
                    case "♜":
                        black_int += "R";
                        break;
                }
            }) 

            if (mode.indexOf('Checkless Chess') != -1) {mode = 'Classic';
            var checkmate = true;
            (this.colour ? black_list : white_list).forEach(ele => {
                if (ele.highlight().length) {checkmate = false;}
            })
            mode = "Checkless Chess";}
            else {
                var checkmate = true;
                (this.colour ? black_list : white_list).forEach(ele => {
                    if (ele.highlight().length) {checkmate = false;}
                })                
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            show_pieces();
            
            if (mode.indexOf('Anti') == -1 && checkmate && check(this.colour ? 0 : 1)[0]) {
                if (mode.indexOf('Crazyhouse') == -1) {win('Checkmate'); undo[undo.length - 1][5] = 2;}
                else {
                    if ((check(this.colour ? 0 : 1)[0] == 2) || (!$('self_box').innerHTML || (
                        check(this.colour ? 0 : 1)[1].type == "K" ||
                        (Math.abs(check(this.colour ? 0 : 1)[1][0].pos[0] - (blackwhite ? w_king : b_king).pos[0]) <= 1 &&
                         Math.abs(check(this.colour ? 0 : 1)[1][0].pos[0] - (blackwhite ? w_king : b_king).pos[0]) <= 1)
                    ))) {
                        win('Checkmate'); undo[undo.length - 1][5] = 2;
                    }
                }
            }
            else if (checkmate && !check(this.colour ? 0 : 1)[0] && mode.indexOf('Anti') == -1) {
                if (mode.indexOf('Crazyhouse') == -1) {draw('Stalemate')}
                else {
                    if (!$('self_box').innerHTML && white_list.concat(black_list) != 64) {
                        draw('Stalemate')
                    }
                }
            }
            if (mode.indexOf("Anti") != -1) {
                var antimate = true;
                for (var anti of (blackwhite ? white_list : black_list)) {
                    if (anti.highlight(true).length) {antimate = false}
                }
                if (antimate) {
                    win('Stalemate')
                }
            }
            if (mode.indexOf("King") != -1) {
                if (this.type == "K" && findArr(this.pos,[[4,4],[4,5],[5,4],[5,5]]) != -1) {
                    win('Reaching the Hill');
                }
            }

            var tempb = [];
            var tempw = [];
            white_list.forEach(obj => {
                tempw.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
            })
            black_list.forEach(obj => {
                tempb.push({colour: obj.colour, type: obj.type, pos: obj.pos, name: obj.name})
            })

            var time_left = 0;
            var original_moves;
            var original_white_checks;
            var original_black_checks;
            var original_fifty;
            db.collection('chess').doc(game).get().then(doc => {
                original_white_checks = doc.data().black_checks;
                original_black_checks = doc.data().black_checks;
                original_fifty = doc.data().fifty_moves;
                var prev_bound = 0;
                var prev_total = 0;
                if (doc.data().white_time != null) {
                arrayify(blackwhite ? doc.data().white_time : doc.data().black_time).forEach(segment => {
                    prev_bound = prev_total;
                    prev_total += parseInt(segment[0]);
                    if ((!isNaN(prev_total) && prev_total == Math.floor(doc.data().moves / 2) + 1) || (isNaN(prev_total) && Math.floor(doc.data().moves / 2) == prev_bound + 1)) {
                        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) + parseFloat(segment[1]))
                    }
                    if (prev_bound <= (Math.floor(doc.data().moves / 2)) && ((Math.floor(doc.data().moves / 2)) < prev_total || isNaN(prev_total))) {
                        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) + parseFloat(segment[2]))
                    }

                    
                    
                })
            }
                original_moves = doc.data().moves + 1;


                if (blackwhite) {
                    if (check(0)[0]) {
                        original_white_checks ++;
                        if (original_white_checks == 3 && mode.indexOf('3 Check') != -1) {
                            win('3 Check');
                        }
                    }
                }
                else {
                    if (check(1)[0]) {
                        original_black_checks ++;
                        if (original_black_checks == 3 && mode.indexOf('3 Check') != -1) {
                            win('3 Check');
                        }
                    }
                }
                if (capture_arr[capture] || this.type == "P") {
                    original_fifty = 0;
                }
                else {
                    //console.log(original_fifty)
                    original_fifty ++;
                }
                if (original_fifty == 50) {
                    draw('Fifty Moves');
                }
                if (doc.data()['white_time'] != null) {
                /*elapsed_time = elapsed_time - (doc.data().timer[1] ? doc.data().timer[1].toDate() : elapsed_time);
                elapsed_time /= 1000;
                time_left = blackwhite ? doc.data()['white_count'] : doc.data()['black_count'];
                time_left -= elapsed_time;
                clearInterval(clock);*/
            }
            }).then(() => {
                if (blackwhite) {
            db.collection('chess').doc(game).update({
                white_arr: stringify(white_arr),
                black_arr: stringify(black_arr),
                white_list: tempw,
                black_list: tempb,
                turn: 0,
                white_bank: white_int,
                black_bank: black_int,
                white_count: str_to_time($('self_time').innerHTML),
                white_checks: original_white_checks,
                moves: original_moves,
                fifty_moves: original_fifty,
                enpassant: enpassant,
                undo: stringify(undo)
            }).catch(error => {console.log(error.lineNumber)})
        }
                else {
            db.collection('chess').doc(game).update({
                white_arr: stringify(white_arr),
                black_arr: stringify(black_arr),
                white_list: tempw,
                black_list: tempb,
                turn: 1,
                white_bank: white_int,
                black_bank: black_int,
                black_count: str_to_time($('self_time').innerHTML),
                black_checks: original_black_checks,
                moves: original_moves,
                fifty_moves: original_fifty,
                enpassant: enpassant,
                undo: stringify(undo)
            }).catch(error => {console.log(error.lineNumber)})
                }
        })
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //show_pieces();
        if (inter != null) {canvas.removeEventListener('click', inter)};
    }

    highlight(checktest = false, white_arrt = white_arr, black_arrt = black_arr, white_listt = white_arr, black_listt = black_arr, recursion = true) {
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
                    if (detectSingle(options[0], space, 0, white_arrt, black_arrt) == "blank" && detectSingle(options[0], space, 1, white_arrt, black_arrt) == "blank") {
                        options = [[this.pos[0], this.pos[1] + 1]];
                        if (this.pos[1] == 2 && detectSingle(options[0], space, 0, white_arrt, black_arrt) == "blank" && detectSingle([options[0][0], options[0][1] + 1], space, 1, white_arrt, black_arrt) == "blank") {
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
                    if (detectSingle(options[0], space, 0, white_arrt, black_arrt) == "blank" && detectSingle(options[0], space, 1, white_arrt, black_arrt) == "blank") {
                        options = [[this.pos[0], this.pos[1] - 1]];
                        if (this.pos[1] == 7 && detectSingle(options[0], space, 0, white_arrt, black_arrt) == "blank" && detectSingle([options[0][0], options[0][1] - 1], space, 1, white_arrt, black_arrt) == "blank") {
                            options.push([this.pos[0], this.pos[1] - 2]);
                        }
                    }
                    else {
                        options = [];
                    }
                }
                detectSquare(options, onboard, this.colour, white_arrt, black_arrt);
               /* if (!(onboard.length == 2 || onboard.length == 4)) {
                    onboard = [];
                }*/
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
                if (enpassant && enpassant[1] == this.pos[1] && Math.abs(enpassant[0] - this.pos[0]) == 1) {
                    if (this.colour) { onboard.push([enpassant[0], this.pos[1] + 1]); }
                    else { onboard.push([enpassant[0], this.pos[1] - 1]); }
                }
                break;
            case 'R':
            case 'Q':
                var options = [];
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var ret = detectSingle([i, this.pos[1]], options, this.colour, white_arrt, black_arrt);
                    if (ret == "block") {break; }
                    else if (ret == "repeat") {break; }
                }
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var ret2 = detectSingle([i, this.pos[1]], options, this.colour, white_arrt, black_arrt);
                    if (ret2 == "block") {break; }
                    else if (ret2 == "repeat") {break; }
                    if (!checktest) {console.log([i, this.pos[1]], ret2)}
                }
                for (var i = this.pos[1] + 1; i < 9; i++) {
                    var ret3 = detectSingle([this.pos[0], i], options, this.colour, white_arrt, black_arrt);
                    if (ret3 == "block") {break; }
                    else if (ret3 == "repeat") {break; }
                }
                for (var i = this.pos[1] - 1; i > 0; i--) {
                    var ret4 = detectSingle([this.pos[0], i], options, this.colour, white_arrt, black_arrt);
                    if (ret4 == "block") {break; }
                    else if (ret4 == "repeat") {break; }
                }
                if (!checktest) {console.log(options)}
                onboard = onboard.concat(options);
                if (this.type == "R") {break;}
            case 'B':
                var optionsq = [];
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var retb = detectSingle([i, this.pos[1] - (this.pos[0] - i)], optionsq, this.colour, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") {break;}
                }
                for (var i = this.pos[0] - 1; i > 0; i--) {
                    var retb = detectSingle([i, this.pos[1] + (this.pos[0] - i)], optionsq, this.colour, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") {break;}
                }
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var retb = detectSingle([i, this.pos[1] - (this.pos[0] - i)], optionsq, this.colour, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") {break;}
                }
                for (var i = this.pos[0] + 1; i < 9; i++) {
                    var retb = detectSingle([i, this.pos[1] + (this.pos[0] - i)], optionsq, this.colour, white_arrt, black_arrt);
                    if (retb == "block") { break; }
                    else if (retb == "repeat") {break;}
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
                detectSquare(options, onboard, this.colour, white_arrt, black_arrt);
                if (!checktest) {
                    if (castle_rooka && (blackwhite ? w_rooka : b_rooka) && mode.indexOf('Antichess') == -1 && mode.indexOf('Really') == -1) {
                        var accepted = true;
                        var king_options = [];
                        var rook_options = [];
                        for (var i = 1; i <= Math.abs(this.pos[0] - 3); i++) {
                            if (this.pos[0] < 3) {
                                king_options.push([this.pos[0] + i, this.colour ? 1 : 8])
                            }
                            else {
                                king_options.push([this.pos[0] - i, this.colour ? 1 : 8])
                            }
                        }
                        for (var i = 1; i <= Math.abs((blackwhite ? w_rooka.pos[0] : b_rooka.pos[0]) - 4); i++) {
                            if (this.pos[0] < 3) {
                                rook_options.push([(blackwhite ? w_rooka.pos[0] : b_rooka.pos[0]) - i, this.colour ? 1 : 8])
                            }
                            else {
                                rook_options.push([(blackwhite ? w_rooka.pos[0] : b_rooka.pos[0]) + i, this.colour ? 1 : 8])
                            }
                        }
                        rook_options.splice(findArr(blackwhite ? w_rooka.pos : b_rooka.pos, rook_options), 1)
                        for (var pos of king_options) {
                            if ((findArr(pos, white_arr.concat(black_arr)) != -1 && !arrEqual(pos, blackwhite ? w_rooka.pos : b_rooka.pos)) || this.mock_update(pos)[0]) {accepted = false;}
                        }
                        for(var pos of rook_options) {
                            if (findArr(pos, white_arr.concat(black_arr)) != -1) {accepted = false;}
                        }
                        if (checktest || (!checktest && accepted && !check(this.colour)[0])) {
                            onboard.push([3, this.colour ? 1 : 8]);
                    }
                
                }
                    if (castle_rookh && (blackwhite ? w_rookh : b_rookh) && mode.indexOf('Antichess') == -1 && mode.indexOf('Really') == -1) {
                        var accepted = true;
                        var king_options = [];
                        var rook_options = [];
                        for (var i = 1; i <= Math.abs(this.pos[0] - 7); i++) {
                            if (this.pos[0] < 7) {
                                king_options.push([this.pos[0] + i, this.colour ? 1 : 8])
                            }
                            else {
                                king_options.push([this.pos[0] - i, this.colour ? 1 : 8])
                            }
                        }
                        for (var i = 1; i <= Math.abs((blackwhite ? w_rookh : b_rookh).pos[0] - 6); i++) {
                            if (this.pos[0] < 6) {
                                rook_options.push([(blackwhite ? w_rookh : b_rookh).pos[0] - i, this.colour ? 1 : 8])
                            }
                            else {
                                rook_options.push([(blackwhite ? w_rookh : b_rookh).pos[0] + i, this.colour ? 1 : 8])
                            }
                        }
                        rook_options.splice(findArr(blackwhite ? w_rookh.pos : b_rookh.pos, rook_options), 1)
                        for (var pos of king_options) {
                            //console.log(findArr(pos, white_arr.concat(black_arr)));
                            if ((findArr(pos, white_arr.concat(black_arr)) != -1  && !arrEqual(pos, blackwhite ? w_rookh.pos : b_rookh.pos))|| this.mock_update(pos)[0]) {accepted = false;}
                        }
                        for(var pos of rook_options) {
                            if (findArr(pos, white_arr.concat(black_arr)) != -1) {accepted = false;}
                        }
                        if (checktest || (!checktest && accepted && !check(this.colour)[0])) {
                            onboard.push([7, this.colour ? 1 : 8]);
                    }
                }
            }

        }
        if (!checktest) {
        if (mode.indexOf('Anti') != -1) {
            var forced_moves = [];
            var capturable = false;
            for (var pce of (blackwhite ? white_list : black_list)) {
                for (var pce_options of pce.highlight(true)) {
                    if (findArr(pce_options, blackwhite ? black_arr : white_arr) != -1) {
                        capturable = true;
                        break;
                    }
                }
            }
            if (capturable) {
                for (var cap_opt of onboard) {
                    if (findArr(cap_opt, blackwhite ? black_arr : white_arr) != -1) {forced_moves.push(cap_opt)}
                }
                onboard = forced_moves;
            }
        }
    }

        if (!checktest) {
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
            var int_onboard = [];

            for (let shade of onboard) {
                var checkless_mock;
                console.log(shade);
                if (mode.indexOf('Checkless') != -1) {checkless_mock = this.mock_update(shade);}
                if ((!this.mock_update(shade)[0] && 
                    ((mode.indexOf('Checkless') == -1 && mode.indexOf('Atomic') == -1) || 
                    (mode.indexOf('Atomic') != -1 && findArr(shade, this.colour ? white_arr : black_arr) == -1 && (
                        findArr(shade, this.colour ? black_arr : white_arr) == -1 || (
                        ((this.type != "K" && (Math.abs(shade[0] - (this.colour ? w_king.pos[0] : b_king.pos[0])) > 1 || Math.abs(shade[1] - (this.colour ? w_king.pos[1] : b_king.pos[1])) > 1))
                )))
                )
                )
                ) || (mode.indexOf('Checkless') != -1 && !checkless_mock[0] && (!checkless_mock[2][0] || checkless_mock[3])) 
                ) {
                int_onboard.push(shade) }}
            for (let shade of int_onboard) {
                ctx.fillStyle = 'rgba(250,250,250,0.5)';
                if (blackwhite) {
                    ctx.fillRect(canvas.width / 8 * (shade[0] - 1), canvas.height - canvas.height / 8 * (shade[1]), canvas.width / 8, canvas.height / 8);
                }
                else {
                    ctx.fillRect(canvas.width - (canvas.width / 8 * (shade[0])), canvas.height - canvas.height / 8 * (9 - shade[1]), canvas.width / 8, canvas.height / 8);
                }

            }
            onboard = int_onboard;
            var intermediary = (e) => {
                console.log('inter clicker')
                var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
                var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
                if (findArr(square, onboard) != -1) {
                    this.update(square, false, intermediary)
                }
                else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    show_pieces();
                    canvas.removeEventListener('click', intermediary);
                    document.elementFromPoint(e.clientX, e.clientY).click();
                    try {document.getElementsByClassName('bottom')[0].removeChild($('promote'));}
                    catch (TypeError) {}
                }
    
            }
            canvas.addEventListener('click', intermediary);
        }
        else if (mode.indexOf('Checkless') != -1) {
            mode = "Classic";
            if (check(this.colour)[0]) {
                if (this.type == "K") {
                    var temp_onboard = [];
                    for (var opt in onboard) {
                        if(Math.abs(onboard[opt][0] - this.pos[0]) < 1) {
                            temp_onboard.push(onboard[opt]);
                        }
                    }
                }
    
                if (check(this.colour)[0] == 2) {
                    if (this.type != "K") { onboard = [] }
                }
    
                if (check(this.colour)[1][0].type == "N" || check(this.colour)[1][0].type == "P") {
                    var temp_onboard = [];
                    for (var opt in onboard) {
                        if ((this.type == "K" || arrEqual(onboard[opt], check(this.colour)[1][0].pos))) {
                            temp_onboard.push(onboard[opt])
                        }
                    }
                    onboard = temp_onboard;}
                }
                var int_onboard = [];
                for (let shade of onboard) {
                    if (!this.mock_update(shade)[0]) {
                    int_onboard.push(shade) }}
            mode = "Checkless Chess";
            //console.log('onboarrrrrd', int_onboard)
            var self_king = this.colour ? b_king : w_king;
            for (let check_piece of onboard) {
                if (arrEqual(check_piece, self_king.pos)) { return [int_onboard, true]; }
            }
            return [int_onboard, false];
        }
        else if ((mode.indexOf('Anti') == -1 && mode.indexOf('Dusanny') == -1) || mode.indexOf('Dusanny') != -1 && !blackwhite) {
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

function win(message) {
    $("status").innerHTML = `You Won by ${message}`;
    var original_wins;
    var other_user;
    var other_id;
    var other_losses;
    var elo;
    var other_elo;
    console.log('win');
    db.collection('chess').doc(game).update({
        result: blackwhite ? 'white' : 'black',
        result_method: message
    })
    db.collection('account').doc(user_id).get().then(doc => {
        original_wins = doc.data().wins;
        elo = doc.data().ranking
    }).then(docRef => {
        db.collection('account').doc(user_id).update({
            wins: original_wins + 1
        })
    }).then(docRef => {
    db.collection('chess').doc(game).get().then(doc => {
        other_user = blackwhite ? doc.data().black_user : doc.data().white_user;
    }).then(docRef => {
        db.collection('account').where('username','==',other_user).get().then(snapshots => {
            snapshots.forEach(doc => {
                other_id = doc.id;
                other_losses = doc.data().losses;
                other_elo = doc.data().ranking;
            })
        }).then(docRef => {
            var r = 10**(elo/400);
            var other_r = 10**(other_elo/400);
            var e = r / (r + other_r);
            var other_e = other_r / (r + other_r);
            var new_elo = elo + 32 * (1 - e);
            var new_other_elo = other_elo + 32 * (0 - other_e);
            db.collection('account').doc(other_id).update({
                losses: other_losses + 1,
                ranking: (Math.round(new_other_elo) >= 0 ? Math.round(new_other_elo) : 0)
            })
            db.collection('account').doc(user_id).update({
                ranking: (Math.round(new_elo) >= 0 ? Math.round(new_elo) : 0)
            })
        })
    })
})
}
function lose(message) {
    $("status").innerHTML = `You Lost by ${message}`;
    var original_losses;
    var other_user;
    var other_id;
    var other_wins;
    var elo;
    var other_elo;
    console.log('lose');
    db.collection('chess').doc(game).update({
        result: blackwhite ? 'black' : 'white',
        result_method: message
    })
    db.collection('account').doc(user_id).get().then(doc => {
        original_losses = doc.data().losses;
        elo = doc.data().ranking
    }).then(docRef => {
        db.collection('account').doc(user_id).update({
            losses: original_losses + 1
        })
    }).then(docRef => {
    db.collection('chess').doc(game).get().then(doc => {
        other_user = blackwhite ? doc.data().black_user : doc.data().white_user;
    }).then(docRef => {
        db.collection('account').where('username','==',other_user).get().then(snapshots => {
            snapshots.forEach(doc => {
                other_id = doc.id;
                other_wins = doc.data().wins;
                other_elo = doc.data().ranking;
            })
        }).then(docRef => {
            var r = 10**(elo/400);
            var other_r = 10**(other_elo/400);
            var e = r / (r + other_r);
            var other_e = other_r / (r + other_r);
            var new_elo = elo + 32 * (0 - e);
            var new_other_elo = other_elo + 32 * (1 - other_e);
            db.collection('account').doc(other_id).update({
                wins: other_wins + 1,
                ranking: (Math.round(new_other_elo) >= 0 ? Math.round(new_other_elo) : 0)
            })
            db.collection('account').doc(user_id).update({
                ranking: (Math.round(new_elo) >= 0 ? Math.round(new_elo) : 0)
            })
        })
    })
})
}
function draw(message) {
    if (mode.indexOf('Armageddon') != -1) {
        if (blackwhite) {lose('Draw')}
        else {win('Draw')}
    }
    else {
    $("status").innerHTML = `You Drew by ${message}`;
    var original_draws;
    var other_id;
    var other_user;
    var other_draws;
    var elo;
    var other_elo;
    var is_it_rated;
    console.log('draw');
    db.collection('chess').doc(game).update({
        result: 'draw',
        result_method: message
    })
    db.collection('account').doc(user_id).get().then(doc => {
        original_draws = doc.data().draws;
        elo = doc.data().ranking;
    }).then(docRef => {
        db.collection('account').doc(user_id).update({
            draws: original_draws + 1
        })
    }).then(docRef => {
    db.collection('chess').doc(game).get().then(doc => {
        other_user = blackwhite ? doc.data().black_user : doc.data().white_user;
        is_it_rated = doc.data().points
    }).then(docRef => {
        db.collection('account').where('username','==',other_user).get().then(snapshots => {
            snapshots.forEach(doc => {
                other_id = doc.id;
                other_draws = doc.data().draws;
                other_elo = doc.data().ranking
            })
        }).then(docRef => {
            if (is_it_rated) {
            var r = 10**(elo/400);
            var other_r = 10**(other_elo/400);
            var e = r / (r + other_r);
            var other_e = other_r / (r + other_r);
            var new_elo = elo + 32 * (0.5 - e);
            var new_other_elo = other_elo + 32 * (0.5 - other_e);}
            else {
            var new_other_elo = other_elo;
            var new_elo = elo;
            }
            db.collection('account').doc(other_id).update({
                draws: other_draws + 1,
                ranking: (Math.round(new_other_elo) >= 0 ? Math.round(new_other_elo) : 0)
            })
            db.collection('account').doc(user_id).update({
                ranking: (Math.round(new_elo) >= 0 ? Math.round(new_elo) : 0)
            })
        })
    })
})}
}

var white_list = [];
var black_list = [];
$('options').getElementsByTagName('button')[0].addEventListener('click', e => {
    if (moves_back != undo.length) {
    moves_back ++;
    formatUndo(undo[undo.length - moves_back])
    $('options').getElementsByTagName('button')[3].style['opacity'] = 1
    if (moves_back == undo.length) {
        $('options').getElementsByTagName('button')[0].style['opacity'] = 0.6        
    }
    }
})
$('options').getElementsByTagName('button')[3].addEventListener('click', e => {
    if (moves_back >= 1) {
        moves_back --;
        formatRedo(undo[undo.length - moves_back - 1])
        $('options').getElementsByTagName('button')[0].style['opacity'] = 1
        if (moves_back == 0) {
            $('options').getElementsByTagName('button')[3].style['opacity'] = 0.6
        }    
    };

    
})
$('options').getElementsByTagName('button')[1].addEventListener('click', e => {
    if (!done) {
    if (e.target.innerHTML == '⚑') {
        e.target.innerHTML = "<div style='width: 49%;display: inline-block;'>&#10004</div><div style='width: 49%;display: inline-block;'>&#10008</div>";
    }
    else if (e.target.innerHTML == '✔') {
        e.target.parentElement.innerHTML = '&#9873';
        $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has resigned</i><br>`;
        lose('Resignation');
    }
    else if (e.target.innerHTML == '✘') {
        e.target.parentElement.innerHTML = '&#9873';
    }}
})
$('options').getElementsByTagName('button')[2].addEventListener('click', e => {
    if (!done) {
    if (e.target.innerHTML == "🤝") {
        e.target.innerHTML = '✘';
        $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has offered a draw</i><br>`;
        db.collection('chess').doc(game).update({
            draw_query: (blackwhite ? "white" : "black"),
            messages: $('text').innerHTML
        })
    }
    else if (e.target.innerHTML == '✘') {
        if (e.target.parentElement.childElementCount == 2) {
            $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has declined the draw</i><br>`;
        }
        else { 
            $('text').innerHTML += `<i>${blackwhite ? 'white' : 'black'} has revoked the draw</i><br>`;
        }
        if (e.target.parentElement.tagName != "BUTTON") {
        e.target.innerHTML = '🤝';
        }
        else {
        e.target.parentElement.innerHTML = '🤝';
    }
        
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
        draw('Agreement');
    }}
})

db.collection('chess').doc(game).get().then(doc => {
    if (doc.data().white_user == username) {blackwhite = 1}
    else if (doc.data().black_user == username) {blackwhite = 0}
    else {blackwhite = 1; observer = true;}

    if (doc.data().white_time != null && doc.data().timer[1] != null) {
    var new_white_count = doc.data().white_count;
    var new_black_count = doc.data().black_count;
    if (blackwhite) {
        new_white_count -= ((new Date()) - doc.data().timer[1].toDate())/1000
        $('self_time').innerHTML = time_to_str(new_white_count);
        if (new_white_count <= 0) {
            new_white_count = 0;
            lose('Time');
        }
    }
    else {
        new_black_count -= ((new Date()) - doc.data().timer[1].toDate())/1000
        $('self_time').innerHTML = time_to_str(new_black_count);
        if (new_black_count <= 0) {
            new_black_count = 0;
            lose('Time');
        }
    }

    db.collection('chess').doc(game).update({
        white_count: new_white_count,
        black_count: new_black_count,
        timer: [blackwhite, new Date()]
    }).then(docRef => {
        if (doc.data().turn == blackwhite && doc.data().timer[0] == blackwhite) {
        clearInterval(clock)
        if (!parseInt($('self_time').innerHTML.split(':')[0]) && !parseInt($('self_time').innerHTML.split(':')[1])) {

        }
        else if (parseInt($('self_time').innerHTML.split(':')[0])) {
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
}
})

db.collection('chess').doc(game).onSnapshot(doc => {    
    if (doc.data().white_user == username) {blackwhite = 1}
    else if (doc.data().black_user == username) {blackwhite = 0}
    else {blackwhite = 1; observer = true;}
    $('text').innerHTML = doc.data().messages;
    white_arr = arrayify(doc.data().white_arr, Number);
    black_arr = arrayify(doc.data().black_arr, Number);
    turn = doc.data().turn;
    mode = doc.data().mode;
    white_list = [];
    black_list = [];
    done = doc.data().result ? true : false;
    if (done) {
        $('status').innerHTML = `You ${doc.data().result == "draw" ? "Drew" : ((doc.data().result == 'white' ? 1 : 0) == blackwhite ? 'Won' : 'Lost')} by ${doc.data().result_method}`; 
    }
    enpassant = doc.data().enpassant;
    moves_back = 0;
    $('options').getElementsByTagName('button')[3].style['opacity'] = 0.6    

    for (var i of doc.data().white_list) {
        window[i.name] = new piece (i.colour, i.type, i.pos, i.name);
        white_list.push(window[i.name])
    }
    for (var i of doc.data().black_list) {
        window[i.name] = new piece (i.colour, i.type, i.pos, i.name);
        black_list.push(window[i.name])
    }
    undo = arrayify(doc.data().undo);
    if (doc.data().undo) {
    for (var prev_turn of undo) {
        if (prev_turn[0] == (blackwhite ? 'w_king' : 'b_king')) {
            castle_rooka = false;
            castle_rookh = false;
            break;
        }
        else if (prev_turn[0] == (blackwhite ? 'w_rooka' : 'b_rooka')) {
            castle_rooka = false;
        }
        else if (prev_turn[0] == (blackwhite ? 'w_rookh' : 'b_rookh')) {
            castle_rookh = false;
        }
    }
    $('tracking').innerHTML = "";
    undo.forEach((prev_turn, ind) => {
        if (!(ind % 2)) {$('tracking').innerHTML += '<b>' + ((ind / 2) + 1) + ". </b>"}
        $('tracking').innerHTML += formatMove(prev_turn) + " "
    })
    if (undo.length % 2) {$('tracking').innerHTML += "..."}
}
    else {
        undo = [];
    }

    if (mode.indexOf('Beirut') != -1) {
        pre_selection = ((blackwhite ? doc.data().white_beirut_piece : doc.data().black_beirut_piece) == null) ? false : true;
        beirut_piece = blackwhite ? doc.data().white_beirut_piece : doc.data().black_beirut_piece;
        if (!$('beirut_button')) {
            var choose_beirut = document.createElement("DIV");
            choose_beirut.setAttribute('id', 'beirut_button');
            var beirut_button = document.createElement("BUTTON");
            choose_beirut.appendChild(beirut_button);
            document.getElementsByClassName('bottom')[0].insertBefore(choose_beirut, document.getElementsByClassName('bottom')[0].childNodes[0]);
        }
        var beirut_button = $('beirut_button').childNodes[0];
        beirut_button.innerHTML = !pre_selection ? "Choose Your Suicide Piece" : ("Detonate on " + formatPos(window[beirut_piece].pos));
        if (pre_selection && turn != blackwhite) {
            beirut_button.style.opacity = "0.7";
            beirut_button.style.color = "grey";
        }
        else if (pre_selection) {
            if (Math.abs(window[beirut_piece].pos[0] - (blackwhite ? w_king.pos[0] : b_king.pos[0])) > 1 || Math.abs(window[beirut_piece].pos[1] - (blackwhite ? w_king.pos[1] : b_king.pos[1])) > 1) {
            beirut_button.style.opacity = "1";
            beirut_button.style.color = "black";         
        }
            else {
            beirut_button.style.opacity = "0.7";
            beirut_button.style.color = "grey";
            }
        }
        var beirut_options = $('beirut_button');
        beirut_options.style.bottom = $('self_name').getBoundingClientRect().height + $('self_box').getBoundingClientRect().height + $('self_time').getBoundingClientRect().height + 2 * $('options').getBoundingClientRect().height + "px";
        beirut_options.style.left = '0px';
        var beirut_listener = (e) => {
            var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
            var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
            var clicked_piece_white = findArr(square, white_arr);
            var clicked_piece_black = findArr(square, black_arr);
            var clicked;
            if (clicked_piece_white == -1 && clicked_piece_black == -1) {
            }
            else {
                if (clicked_piece_white != -1) {
                    for (var check of white_list) {
                        if (arrEqual(check.pos, square)) { clicked = check; }
                    }
                }
                else {
                    for (var check of black_list) {
                        if (arrEqual(check.pos, square)) { clicked = check; break; }
                    }
                }
                if (clicked.colour == blackwhite && clicked.type != "K") {
                    console.log(clicked);
                    if (blackwhite) {
                        db.collection('chess').doc(game).update({
                            white_beirut_piece: clicked.name
                    })}
                    else {
                        db.collection('chess').doc(game).update({
                            black_beirut_piece: clicked.name
                    })}
                }
            }
        }
        beirut_options.addEventListener('click', e => {
            if (beirut_options.childNodes[0].innerHTML == "Choose Your Suicide Piece") {
            ctx.fillStyle = 'rgba(250,250,250,0.5)';
            ctx.fillRect(0, canvas.height / 4 * 3, canvas.width, canvas.height / 8);
            ctx.fillRect(0, canvas.height / 8 * 7, canvas.width * 3 / 8, canvas.height / 8);
            ctx.fillRect(canvas.width * 4 / 8, canvas.height / 8 * 7, canvas.width * 4 / 8, canvas.height / 8);
            beirut_options.childNodes[0].innerHTML = "Click To Select Your Piece";
            canvas.addEventListener('click', beirut_listener)
        }
            else if (beirut_options.childNodes[0].innerHTML == "Click To Select Your Piece") {
                ctx.clearRect(0,0,canvas.width,canvas.height);
                show_pieces();
                beirut_options.childNodes[0].innerHTML = "Choose Your Suicide Piece";
                canvas.removeEventListener('click', beirut_listener)
            }
            else {
                if (blackwhite == turn && beirut_piece && (Math.abs(window[beirut_piece].pos[0] - (blackwhite ? w_king.pos[0] : b_king.pos[0])) > 1 || Math.abs(window[beirut_piece].pos[1] - (blackwhite ? w_king.pos[1] : b_king.pos[1])) > 1)) {
                console.log('explosion');
                    var explosion = [
                        [window[beirut_piece].pos[0] + 1,window[beirut_piece].pos[1] + 1],
                        [window[beirut_piece].pos[0] - 1,window[beirut_piece].pos[1] + 1],
                        [window[beirut_piece].pos[0],window[beirut_piece].pos[1] + 1],
                        [window[beirut_piece].pos[0] + 1,window[beirut_piece].pos[1] - 1],
                        [window[beirut_piece].pos[0] - 1,window[beirut_piece].pos[1] - 1],
                        [window[beirut_piece].pos[0],window[beirut_piece].pos[1] - 1],
                        [window[beirut_piece].pos[0] + 1,window[beirut_piece].pos[1]],
                        [window[beirut_piece].pos[0] - 1,window[beirut_piece].pos[1]]
                    ];
                    for (var frag of explosion) {
                        if (frag[0] > 8 || frag[0] < 1 || frag[1] > 8 || frag[1] < 1) {
                            explosion.splice(findArr(frag, explosion), 1);
                        }
                    }
                    for (var frag of explosion) {
                        if (findArr(frag, white_arr.concat(black_arr)) != -1) {
                            console.log('frag', frag)
                            for (var casualty of white_list.concat(black_list)) {
                                if (arrEqual(casualty.pos,frag)) {
                                    if (casualty.colour) {
                                        white_list.splice(white_list.indexOf(casualty), 1);
                                        white_arr.splice(findArr(casualty.pos, white_arr), 1);
                                    }
                                    else {
                                        black_list.splice(black_list.indexOf(casualty), 1);
                                        black_arr.splice(findArr(casualty.pos, black_arr), 1);
                                    }
                                    if (casualty.type == "K") {win('Exploding the King')}
                                }
                            }
                        }
                        }
                    window[beirut_piece].update(window[beirut_piece].pos, false, null, true)
            }
        }
    })
    }
    else {
        pre_selection = true;
    }

    $('self_time').innerHTML = blackwhite ? doc.data().white_count : doc.data().black_count;
    $('opposite_time').innerHTML = blackwhite ? doc.data().black_count : doc.data().white_count;
    $('self_time').innerHTML = time_to_str($('self_time').innerHTML);
    $('opposite_time').innerHTML = time_to_str($('opposite_time').innerHTML);

    $('self_box').innerHTML = blackwhite ? doc.data().white_bank : doc.data().black_bank;
    $('opposite_box').innerHTML = blackwhite ? doc.data().black_bank : doc.data().white_bank;

    var white_elo;
    var black_elo;
    db.collection('account').where('username', '==', doc.data().white_user).get().then(snapshot => {
        snapshot.forEach(doc => {white_elo = doc.data().ranking})
    }).then(() => {
        db.collection('account').where('username', '==', doc.data().black_user).get().then(snapshot => {
            snapshot.forEach(doc => {
                black_elo = doc.data().ranking})
            console.log(black_elo);
        }).then(() => {
    if (blackwhite) {
        $('self_name').innerHTML = ((turn == blackwhite) ? "<icon style='font-size: 75%'>&#9654</icon> " : "") + doc.data().white_user + " (" + white_elo + ")";
        $('opposite_name').innerHTML = ((turn != blackwhite) ? "<icon style='font-size: 75%'>&#9654</icon> " : "") + ((doc.data().black_user == null) ? "Waiting for opponent..." : (doc.data().black_user + " (" + black_elo + ")"));
    }
    else {
        $('self_name').innerHTML = ((turn == blackwhite) ? "<icon style='font-size: 75%'>&#9654</icon> " : "") + doc.data().black_user + " (" + black_elo + ")";
        $('opposite_name').innerHTML = ((turn != blackwhite) ? "<icon style='font-size: 75%'>&#9654</icon> " : "") + ((doc.data().white_user == null) ? "Waiting for opponent..." : (doc.data().white_user + " (" + white_elo + ")"));
    }
    })})
    var self_int = "";
    var opp_int = "";
    $('self_box').innerHTML = $('self_box').innerHTML.split("").forEach(ele => {
        switch (ele) {
            case "P":
                self_int += "<icon>♟</icon>";
                break;
            case "Q":
                self_int += "<icon>♛</icon>";
                break;
            case "K":
                self_int += "<icon>♚</icon>";
                break;
            case "B":
                self_int += "<icon>♝</icon>";
                break;
            case "N":
                self_int += "<icon>♞</icon>";
                break;
            case "R":
                self_int += "<icon>♜</icon>";
                break;
        }
    })
    $('self_box').innerHTML = self_int
    $('opposite_box').innerHTML = $('opposite_box').innerHTML.split("").forEach(ele => {
        switch (ele) {
            case "P":
                opp_int += "<icon>♟</icon>";
                break;
            case "Q":
                opp_int += "<icon>♛</icon>";
                break;
            case "K":
                opp_int += "<icon>♚</icon>";
                break;
            case "B":
                opp_int += "<icon>♝</icon>";
                break;
            case "N":
                opp_int += "<icon>♞</icon>";
                break;
            case "R":
                opp_int += "<icon>♜</icon>";
                break;
        }
    })
    $('opposite_box').innerHTML = opp_int


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
        if (doc.data()['draw_query'] != (blackwhite ? 'white' : 'black')) {
        $('options').getElementsByTagName('button')[2].innerHTML = "<div style='width: 49%;display: inline-block;'>&#10004</div><div style='width: 49%;display: inline-block;'>&#10008</div>";}
        else {
        $('options').getElementsByTagName('button')[2].innerHTML = "✘";
        }
    }
    else {
        $('options').getElementsByTagName('button')[2].innerHTML = "🤝";
    }
    if (doc.data()['white_time'] != null && doc.data().timer[0] != blackwhite && doc.data().turn == blackwhite) {
        var new_date = new Date()
        db.collection('chess').doc(game).update({
            timer: [blackwhite, new_date]
        })
        var original_date = new_date;
        clearInterval(clock)
        if (!parseInt($('self_time').innerHTML.split(':')[0]) && !parseInt($('self_time').innerHTML.split(':')[1])) {

        }
        else if (parseInt($('self_time').innerHTML.split(':')[0])) {
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

    update_graphics();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    show_pieces();
})

interval3 = () => {
    clock = setInterval(() => {
        console.log('int3')
        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) - 0.01);
        if ($('self_time').innerHTML == "0:00.00") {
            clearInterval(clock);
            lose('Time')
        }
    }, 10)
}
interval2 = () => {
    clock = setInterval(() => {
        console.log('int2')
        $('self_time').innerHTML = time_to_str(str_to_time($('self_time').innerHTML) - 0.01);
        if ($('self_time').innerHTML.split)
        if ($('self_time').innerHTML == "0:10.00") {
            clearInterval(clock);
            interval3();
        }
    }, 10)
}
interval1 = () => {
    clock = setInterval(() => {
        console.log('int1')
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
        ret_string = Math.floor(time / 60) + ":" + (((time % 60) < 10) ? "0" : "") + (time % 60).toFixed(2);
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
    if (!done && (mode.indexOf('Beirut') == -1 || pre_selection) && !moves_back) {
    var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
    var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
    var clicked_piece_white = findArr(square, white_arr);
    var clicked_piece_black = findArr(square, black_arr);
    var clicked;
    if (clicked_piece_white == -1 && clicked_piece_black == -1) {
    }
    else {
        if (clicked_piece_white != -1) {
            for (var check of white_list) {
                if (arrEqual(check.pos, square)) { clicked = check; }
            }
        }
        else {
            for (var check of black_list) {
                if (arrEqual(check.pos, square)) { clicked = check; break; }
            }
        }
        if (clicked.colour == turn && clicked.colour == blackwhite && !observer) {
            clicked.highlight();
        }
    }
    }
});
$('self_box').addEventListener('click', e => {
    var event_for_crazyhouse = 0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    show_pieces();
    if (mode.indexOf("Crazyhouse") != -1 && turn == blackwhite && !done && !moves_back) {
    var target = e.target;
    e.target.parentElement.childNodes.forEach(child => {child.style.color = "inherit";})
    e.target.style.color = 'red';
    var crazy_type;
    switch (e.target.innerHTML) {
        case "♟":
            crazy_type = "P";
            break;
        case "♛":
            crazy_type = "Q";
            break;
        case "♚":
            crazy_type = "K";
            break;
        case "♝":
            crazy_type = "B";
            break;
        case "♞":
            crazy_type = "N";
            break;
        case "♜":
            crazy_type = "R";
            break;
        default:
            crazy_type = "Q";
            break;
    }
    var spaces = [];
    var free_spaces = [];
    var noncheck_spaces = [];
    for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 8; j++) {
            spaces.push([i,j]);
        }
    }
    for (var space of spaces) {
        if (findArr(space, white_arr.concat(black_arr)) == -1) {
            if ((crazy_type == "P" && space[1] != (blackwhite ? 8 : 1)) || crazy_type != "P") {
            free_spaces.push(space);
        }
        }
    }
    if (check(blackwhite)[0]) {
    for (var free of free_spaces) {
        if (blackwhite) {
            var w_crazytemp = new piece (1, 'P', free, "w_crazytemp");
            white_list.push(w_crazytemp);
            white_arr.push(free);
            if (!check(blackwhite)[0]) {noncheck_spaces.push(free);}
            white_list.pop();
            white_arr.pop();
        }
        else {
            var b_crazytemp = new piece (0, 'P', free, "b_crazytemp");
            black_list.push(b_crazytemp);
            black_arr.push(free);
            if (!check(blackwhite)[0]) {noncheck_spaces.push(free);}
            black_list.pop();
            black_arr.pop();
        }
    }
}
    else {
        noncheck_spaces = free_spaces;
    }
    for (var shade of noncheck_spaces) {
    ctx.fillStyle = 'rgba(250,250,250,0.5)';
    if (blackwhite) {
        ctx.fillRect(canvas.width / 8 * (shade[0] - 1), canvas.height - canvas.height / 8 * (shade[1]), canvas.width / 8, canvas.height / 8);
    }
    else {
        ctx.fillRect(canvas.width - (canvas.width / 8 * (shade[0])), canvas.height - canvas.height / 8 * (9 - shade[1]), canvas.width / 8, canvas.height / 8);
    }
}
var intermediary = (e) => {
    event_for_crazyhouse ++;
    if (event_for_crazyhouse > 2) {
    console.log('listening to int')
    var baseline = [canvas.getBoundingClientRect().top, canvas.getBoundingClientRect().left];
    var square = blackwhite ? [Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), 9 - Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))] : [9 - Math.ceil((e.clientX - baseline[1]) / (canvas.width / 8)), Math.ceil((e.clientY - baseline[0]) / (canvas.height / 8))];
    if (findArr(square, noncheck_spaces) != -1) {
        var recent_addition = false;
        var addition_number = 1;
            while (!recent_addition) {
                if (typeof(window[(blackwhite ? "w" : "b") + '_crazy' + addition_number]) == 'undefined') {recent_addition = true;}
                else {addition_number++;}
            }
        console.log('addition #', square)
        window[(blackwhite ? "w" : "b") + '_crazy' + addition_number] = new piece (blackwhite, crazy_type, square, (blackwhite ? "w" : "b") + '_crazy' + addition_number);
        (blackwhite ? white_list : black_list).push(window[(blackwhite ? "w" : "b") + '_crazy' + addition_number]);
        (blackwhite ? white_arr : black_arr).push(square);
        target.parentElement.removeChild(target);
        window[(blackwhite ? "w" : "b") + '_crazy' + addition_number].update(square, false, intermediary);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        show_pieces();
        target.style.color = 'inherit';
    }
    else {
        event_for_crazyhouse = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        show_pieces();
        document.removeEventListener('click', intermediary);
        document.elementFromPoint(e.clientX, e.clientY).click();
        target.style.color = 'inherit';
    }
    }
}
document.addEventListener('click', intermediary);    
}
})

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

}



formatPos = (pos) => {
    var letter;
    switch (parseInt(pos[0])) {
        case 1:
            letter = 'a'; 
            break;
        case 2:
            letter = 'b'; 
            break;
        case 3:
            letter = 'c'; 
            break;
        case 4:
            letter = 'd'; 
            break;
        case 5:
            letter = 'e'; 
            break;
        case 6:
            letter = 'f'; 
            break;
        case 7:
            letter = 'g'; 
            break;
        case 8:
            letter = 'h'; 
            break;
    }
    return letter + pos[1];
}

/*stringify = (stringed_arr) => {
    var x = "";
    for (var y in stringed_arr) {
        if (y == stringed_arr.length - 1) {
            x += "[" + String(stringed_arr[y]) + "]";
        }
        else {
            x += "[" + String(stringed_arr[y]) + "],";
        }}
    return x;
}*/
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

arrayify = (arr2,type=String) => {
    if (arr2 != null && arr2 != "") {
    var arr = arr2;
    arr = arr.split(',');
    const original_arr = arr;
    var ret_arr = [];
    var index1;
    var num_open = 0;
    var num_closed = 0;
    var inner = false;
    for (var index in original_arr) {
        if (original_arr[index].includes('[')) {
            num_open += original_arr[index].match(/\[/g).length;
            if (!inner) {index1 = index};
            inner = true;
        } 
        if (original_arr[index].includes(']'))
        {
            num_closed += original_arr[index].match(/\]/g).length;
            if (num_closed == num_open) {
            inner = false;
            var temp_arr = [];
            original_arr.forEach(name => {temp_arr.push(name)})
            temp_arr = temp_arr.splice(index1,(index-index1) + 1);
            temp_arr = temp_arr.join(',');
            temp_arr = temp_arr.slice(1, temp_arr.length - 1)
            var inter =  arrayify(temp_arr);
            ret_arr.push(inter);
        }
        }
        else if (!inner) {
            if (type == Number) {
            ret_arr.push(parseInt(original_arr[index]));}
            else {
                ret_arr.push((original_arr[index]));
            }
        }
    }
    return ret_arr;}
    else {
        return null;
    }
}

//undo format
// [piece_name, start_pos (@ options), end_pos, doublemove arr, capture_piece, check (0/1/2), promote_type, (null/rank/file), circe]

formatMove = (move) => {
    var return_move = "";
    if (!move[3]) {
    if (move[0].indexOf('rook') != -1) {return_move += "R"}
    else if (move[0].indexOf('bishop') != -1) {return_move += "B"}
    else if (move[0].indexOf('knight') != -1) {return_move += "N"}
    else if (move[0].indexOf('queen') != -1) {return_move += "Q"}
    else if (move[0].indexOf('king') != -1) {return_move += "K"}
    else {
        return_move += formatPos(move[1])[0]
    }
    if (move[7]) {
        if (move[7] == "both") {
            return_move += formatPos(move[1])
        }
        else if (move[7] == "rank") {
            return_move += formatPos(move[1])[1]
        }
        else {
            return_move += formatPos(move[1])[0]
        }
    }
    if (move[4] && move[4] != 'undefined') {
        return_move += "x";
    }
    if (move[1] == "@") {
        return_move += "@";
    }
    if (move[0].length == 3) {
        if (move[4] && move[4] != 'undefined') {
        return_move += formatPos(move[2])
        }
        else {
        return_move += formatPos(move[2])[1]}
        if (move[6]) {
            return_move += "=" + move[6]
        }
    }
    else {
        return_move += formatPos(move[2])
    }
    if (move[5] == 1) {return_move += "+"}
    else if (move[5] == 2) {return_move += "#"}
    if (move[8]) {return_move += "(" + formatMove(move[8]) + ")"}
}
    else {
        if (move[0].indexOf('h') != -1) {return_move = "O-O"}
        else {return_move = "O-O-O"}
    }
    return return_move;
}

formatUndo = (undo_arr) => {
    if (undo_arr[3]) {
        switch (undo_arr[0]) {
            case "w_rooka":
                w_rooka.pos = [1,1];
                w_king.pos = [5,1];
                break;
            case "b_rooka":
                b_rooka.pos = [1,8];
                b_king.pos = [5,8];
                break;
            case "w_rookh":
                w_rookh.pos = [8,1];
                w_king.pos = [5,1];
                break;
            case "b_rookh":
                b_rookh.pos = [8,8];
                b_king.pos = [5,8];
                break;
        }
    }
    else {
        window[undo_arr[0]].pos = undo_arr[1];
        if (window[undo_arr[0]].colour) {
            white_arr.splice(undo_arr[2], 1, undo_arr[1])
        }
        else {
            black_arr.splice(undo_arr[2], 1, undo_arr[1])
        }
        if (undo_arr[4] && undo_arr[4] != "undefined") {
                window[undo_arr[4][3]] = new piece(undo_arr[4][0], undo_arr[4][1], undo_arr[4][2], undo_arr[4][3]);
                if (parseInt(undo_arr[4][0])) {
                    white_list.push(window[undo_arr[4][3]])
                    white_arr.push(undo_arr[4][2])
                }
                else {
                    black_list.push(window[undo_arr[4][3]])
                    black_arr.push(undo_arr[4][2])
            }
        }
        if (undo_arr[6]) {
            window[undo_arr[0]].type = "P";
        }
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    show_pieces();
}

formatRedo = (redo_arr) => {
    if (!redo_arr[3]) {
    if (window[redo_arr[0]].colour) {
        white_arr.splice(findArr(window[redo_arr[0]].pos, white_arr), 1, redo_arr[2])
    }
    else {
        black_arr.splice(findArr(window[redo_arr[0]].pos, black_arr), 1, redo_arr[2])
}
    window[redo_arr[0]].pos = redo_arr[2];
    if (redo_arr[6]) {
        window[redo_arr[0]].type = redo_arr[6];
    }
    if (redo_arr[4] && redo_arr[4] != "undefined") {
        if (parseInt(redo_arr[4][0])) {
            var remove_index;
            white_list.forEach((pce, ind) => {
                if (pce.name == redo_arr[4][3]) {remove_index = ind}
            })
            white_list.splice(remove_index, 1)
            white_arr.splice(findArr(redo_arr[4][2], white_arr), 1)
        }
        else {
            var remove_index;
            black_list.forEach((pce, ind) => {
                if (pce.name == redo_arr[4][3]) {remove_index = ind}
            })
            black_list.splice(remove_index, 1)
            black_arr.splice(findArr(redo_arr[4][2], black_arr), 1)
        }
    }
}
    else {
        switch(redo_arr[0]) {
            case "w_rooka":
                w_king.pos = [3,1];
                window[redo_arr[0]].pos = [4,1];
                break;
            case "w_rookh":
                w_king.pos = [7,1];
                window[redo_arr[0]].pos = [6,1];
                break;
            case "b_rooka":
                b_king.pos = [3,8];
                window[redo_arr[0]].pos = [4,8];
                break;
            case "b_rookh":
                b_king.pos = [7,1];
                window[redo_arr[0]].pos = [6,1];
                break;
        }
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    show_pieces();
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
