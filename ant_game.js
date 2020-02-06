console.log('connection initiated');

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var current_level = 6;
document.getElementById("middle_text").style.top = canvas.getBoundingClientRect().top + canvas.height / 2;


function level1(input_array)  {

//General Init
ctx.fillStyle = "#FF0000";
document.getElementById('resume').innerHTML = "<img src='resume.png'></img>";
document.getElementById('middle_text').style.visibility = "hidden";
var continual = false;

//Square Init
var squares = input_array[0]; //---------------------------------------Vary-for-Levels---------------------------------------//
canvas.height = Math.floor(window.innerHeight / squares * 0.98) * squares;
canvas.width = canvas.height;
var pixel_width = canvas.height / squares;
document.getElementById("middle_text").style.top = canvas.getBoundingClientRect().top + canvas.height/2;

var array = []
for (var i=0; i < input_array[1].length; i++) {
    var temp_arr = []
    for (var j=0; j < input_array[1][0].length; j++) {
        temp_arr.push(input_array[1][i][j])
    }
    array.push(temp_arr)

}  //---------------------------------------Vary-for-Levels---------------------------------------//
//Person Init
var person_width = 0.15 * pixel_width;
var speed = input_array[2]; //---------------------------------------Vary-for-Levels---------------------------------------//
var person_position = [input_array[3],input_array[4]]; //--------------Vary-for-Levels------------------------//
var started;
var end = input_array[5]; //---------------------------------------Vary-for-Levels---------------------------------------//

//Screen Update Init
var stopped = false;
var iterations = input_array[6] //---------------------------------------Vary-for-Levels---------------------------------------//
var interval;
var interval2;
var count = 5;
var count_interval;
var message_timeout;

//Acceleration Init
var accelerator;
var accelerated = false;
var accelerations = 0;
var allowed_accelerations = input_array[7] //--------------------------------Vary-for-Levels---------------------------------------//

//Swap Init
var allowed_swaps = input_array[10];
var swaps = 0;
var blocked_swaps = input_array[11];

//Ant Init
var position = [input_array[8],input_array[9]]; //-------------------------------Vary-for-Levels-------------------------------//
var orientation = "up";
var img = document.getElementById("image");

//Ant Moving Functions
function moveRight() {
    switch (orientation) {
        case "up":
            position[0]++;
            orientation = "right";
            break;
        case "down":
            position[0]--;
            orientation = "left";
            break;
        case "right":
            position[1]--;
            orientation = "down";
            break;
        case "left":
            position[1]++;
            orientation = "up";
            break;
        default:
            console.log("Error: invalid orientation")
            break;
    }
}
function moveLeft() {
    switch (orientation) {
        case "up":
            position[0]--;
            orientation = "left";
            break;
        case "down":
            position[0]++;
            orientation = "right";
            break;
        case "right":
            position[1]++;
            orientation = "up";
            break;
        case "left":
            position[1]--;
            orientation = "down";
            break;
        default:
            console.log("Error: invalid orientation")
            break;
    }
}

//Update Screen Functions
function flipScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[0].length; j++) {
            if (array[i][j]) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(i * pixel_width, j * pixel_width, pixel_width, pixel_width)
                if (array_includes([i+1,j+1],blocked_swaps)) { 
                ctx.lineWidth = 5;
                ctx.strokeStyle = "brown";
                ctx.strokeRect(i * pixel_width + ctx.lineWidth/2, j * pixel_width + ctx.lineWidth/2, pixel_width - ctx.lineWidth, pixel_width - ctx.lineWidth)
                }
            }
            else {
                ctx.fillStyle = "#000000";
                ctx.fillRect(i * pixel_width, j * pixel_width, pixel_width, pixel_width)
                if (array_includes([i+1,j+1],blocked_swaps)) { 
                ctx.lineWidth = 5;
                ctx.strokeStyle = "brown";
                ctx.strokeRect(i * pixel_width + ctx.lineWidth/2, j * pixel_width + ctx.lineWidth/2, pixel_width - ctx.lineWidth, pixel_width - ctx.lineWidth)
                }
            }
        }
    }
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(position[0] * pixel_width, position[1] * pixel_width, pixel_width, pixel_width);
    ctx.drawImage(img, position[0] * pixel_width, position[1] * pixel_width, pixel_width, pixel_width);

    if (UP_DOWN && pixelToSquareColour([person_position[0], person_position[1] - speed])) {person_position[1] -= speed}
    if (DOWN_DOWN && pixelToSquareColour([person_position[0], person_position[1] + speed + person_width])) {person_position[1] += speed;}
    if (RIGHT_DOWN && pixelToSquareColour([person_position[0] + person_width + speed, person_position[1]])) {person_position[0] += speed}
    if (LEFT_DOWN && pixelToSquareColour([person_position[0] - speed, person_position[1]])) {person_position[0] -= speed}
    if (SPACE_DOWN) {spacebar()}
    

    ctx.fillStyle = "#FF0000"
    person = ctx.fillRect(person_position[0], person_position[1], person_width, person_width);

    if (collideAnt()) {lose()}
    
    isWinning()
}

function moveTotal() {
    try {
    var colour = array[position[0]][position[1]];
    if (colour) {
        array[position[0]][position[1]] = 0
        moveRight()
    }
    else {
        array[position[0]][position[1]] = 1
        moveLeft()
    }
}
    catch (ValueError) {
        console.log("offscreen")

        //clearInterval(interval)
        document.getElementById('middle_text').style.visibility = "visible";
        document.getElementById('middle_text').innerHTML = count;
        if (!count) {
                document.getElementById('middle_text').style.visibility = "hidden";
                lose()}
        count -= 1;

    }
}

//Pausing/Starting Functions
document.getElementById('stop').addEventListener('click', e => {
    var element = document.getElementById('stop');
        console.log('stopping')
        stopped = true; 
        element.style.display = "none";
        overlay.style.display = "grid";
        clearInterval(interval2);
        clearInterval(interval);
        document.getElementById('resume').style.display = "inline-block";
        document.getElementById('go').style.display = "inline-block";
        document.getElementById('levels').style.display = "inline-block";
        try { accelerator.pause() }
        catch (ValueError) { }
        try {count_interval.pause() }
        catch (ValueError) { }
})
document.getElementById('resume').addEventListener('click', e => {
    if (continual) {
        current_level += 1;
        level1(window["level_array" + current_level])

    }
    else {
        console.log("resuming")
        document.getElementById('stop').style.display = "inline"; 
        interval = setInterval(moveTotal, iterations);
        interval2 = setInterval(flipScreen, 1 / 60);
        overlay.style.display = "none";
        try { accelerator.resume() }
        catch (ValueError) { }
        try { count_interval.resume() }
        catch (ValueError) { }
        stopped = false; 
    }}
)

function start() {
    var element2 = document.getElementById('go');
    interval = setInterval(moveTotal, iterations);
    interval2 = setInterval(flipScreen, 1 / 60);
    element2.style.display = "none";
    overlay.style.display = "none";
    document.getElementById('stop').style.display = "inline";
    var started = true;

    
    //Draw Functions
    ctx.fillStyle = "#FF0000"
    ctx.fillRect((canvas.width - pixel_width) / 2, (canvas.height - pixel_width) / 2, pixel_width, pixel_width);
    var person = ctx.fillRect((person_position[0] - 0.5) * pixel_width, (person_position[1] - 0.5) * pixel_width, person_width, person_width);
    person_position[0] = (person_position[0] - 0.5) * pixel_width
    person_position[1] = (person_position[1] - 0.5) * pixel_width


}

document.getElementById('go').addEventListener("click", e => {
    clearTimeout(message_timeout); 
    clearInterval(interval); 
    clearInterval(interval2);
    level1(window["level_array" + current_level])
})

//controls code


var UP_DOWN = false;
var DOWN_DOWN = false;
var LEFT_DOWN = false;
var RIGHT_DOWN = false;
var SPACE_DOWN = false;

function two_arrays_equal(array_1, array_2) {
    var returne = true;
    if (array_1.length != array_2.length) {returne = false}
    else {
    for (var i = 0; i < array_1.length; i++) {
        if (array_1[i] != array_2[i]) {
        returne = false;
        break;
    }
    }
}
return returne
}
function array_includes(subject_arr, target_arr) {
    var returni = false;
    for (var i = 0; i < target_arr.length; i++) {
        if (two_arrays_equal(subject_arr, target_arr[i])) {
            returni = true
            break
        }
    }
    return returni
}

function spacebar() {
    var space_person_position = [Math.ceil(person_position[0] / pixel_width), Math.ceil(person_position[1] / pixel_width)]
    var edging = false;
    if ((person_position[0] % pixel_width) / pixel_width < 0.1) {space_person_position[0] -= 1; edging = true;}
    else if ((((person_position[0]+person_width) % pixel_width)/pixel_width) > 0.9) {space_person_position[0] += 1; edging = true;}
    else if ((person_position[1] % pixel_width) / pixel_width < 0.1) {space_person_position[1] -= 1; edging = true;}
    else if (((person_position[1]+person_width) % pixel_width / pixel_width) > 0.9) {space_person_position[1] += 1; edging = true;}
    if (swaps < allowed_swaps && edging) {
        console.log('swaps++')
        var change_target = [space_person_position[0],space_person_position[1]]
        if (!array_includes(change_target, blocked_swaps))
{        if (array[change_target[0]-1][change_target[1]-1]) {array[change_target[0]-1][change_target[1]-1] = 0}
        else {array[change_target[0]-1][change_target[1]-1] = 1}
        swaps ++;
        SPACE_DOWN = false;}
        
    }    
}

window.addEventListener('keyup', e => {
    var upcode = e.key
    if (!started)
    switch (upcode) {
        case " ":
        case 'Space':
        case 'Spacebar':
            e.preventDefault();
            SPACE_DOWN = false;
            break;
        case "ArrowUp": 
        case "w":
            UP_DOWN = false
            break
        case "ArrowDown":
        case "s":
            DOWN_DOWN = false
            break
        case "ArrowLeft":
        case "a":
            LEFT_DOWN = false
            break
        case "ArrowRight":
        case "d":
            RIGHT_DOWN = false
            break
    }
})

window.addEventListener("keydown", e => {
    var code = e.key
    if (!started)
        switch (code) {
            case "Space":
            case "Spacebar":
            case " ":
            case "PageUp":
            case "PageDown":
            case "Home":
            case "End":
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
                e.preventDefault();
                break
        }
    if (stopped) {
    }
    else {
        switch (code) {
            case "PageUp":
            case "PageDown":
            case "Home":
            case "End":
                e.preventDefault();
                break
            case "Space":
            case " ":
            case "Spacebar":
                SPACE_DOWN = true;
                break
            case "m":
            case "z":
                if (accelerations < allowed_accelerations && !accelerated) {
                    accelerated = true;
                    console.log('accelerate');
                    accelerate();
                    accelerator = new Timer(decelerate, 5000)
                    function decelerate() {
                        accelerations++;
                        accelerated = false;
                        speed /= 2;
                    }
                }
                break
            case "ArrowDown":
                e.preventDefault()
            case "s":
                if (pixelToSquareColour([person_position[0], person_position[1] + speed + person_width])) {
                    DOWN_DOWN = true;
                    DOWN_UP = false;
                }
                break
            case "ArrowUp":
                e.preventDefault()
            case "w":
                if (pixelToSquareColour([person_position[0], person_position[1] - speed])) {
                    UP_DOWN = true;
                    UP_UP = false;
                }
                break
            case "ArrowLeft":
                e.preventDefault();
            case "a":
                if (pixelToSquareColour([person_position[0] - speed, person_position[1]])) {
                    LEFT_DOWN = true;
                    LEFT_UP = false;
                }
                break
            case "ArrowRight":
                e.preventDefault();
            case "d":
                if (pixelToSquareColour([person_position[0] + person_width + speed, person_position[1]])) {
                    RIGHT_DOWN = true;
                    RIGHT_UP = false;
                }
                break

        }
    }
})

function pixelToSquareColour(array2) {
    var ret_array = []
    ret_array[0] = Math.floor(array2[0] / (canvas.width / squares));
    ret_array[1] = Math.floor(array2[1] / (canvas.width / squares));
    try {var ret2_array = array[ret_array[0]][ret_array[1]];}
    catch (TypeError) {var ret2_array = 0}
    return ret2_array;
}

function accelerate() {
    speed *= 2; 
}

var Timer = function(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= Date.now() - start;
    };

    this.resume = function() {
        start = Date.now();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
};


//overlay code
var overlay = document.getElementById('overlay');
overlay.style.height = (canvas.height + parseInt(canvas.style["border-top-width"].slice(0, -2)) + parseInt(canvas.style["border-bottom-width"].slice(0, -2))) + "px";
overlay.style.width = (canvas.width + parseInt(canvas.style["border-right-width"].slice(0, -2)) + parseInt(canvas.style["border-left-width"].slice(0, -2))) + "px";
overlay.style.top = canvas.getBoundingClientRect().top + "px";
overlay.style.left = canvas.getBoundingClientRect().left + "px";
document.getElementById('stop').style.right = canvas.getBoundingClientRect().left * 1.01 + "px";

document.getElementById('go').style.width = canvas.width/8 + "px";
document.getElementById('resume').style.width = canvas.width/4 + "px";
document.getElementById('levels').style.width = canvas.width/8 + "px";
document.getElementById('go').firstChild.style.width = canvas.width/12 + "px";
document.getElementById('resume').firstChild.style.width = canvas.width/4 + "px";
document.getElementById('levels').firstChild.style.width = canvas.width/12 + "px";



//Ant collisions
function collideAnt() {
    var ant_x_min = position[0] * pixel_width;
    var ant_x_max = ant_x_min + pixel_width;
    var ant_y_min = position[1] * pixel_width;
    var ant_y_max = ant_y_min + pixel_width;
    
    return (((ant_x_min < person_position[0] && ant_x_max > person_position[0])||(ant_x_min < (person_position[0]+person_width) && ant_x_max > (person_position[0]+person_width))) && ((ant_y_min < person_position[1] && ant_y_max > person_position[1])||(ant_y_min < (person_position[1]+person_width) && ant_y_max > (person_position[1]+person_width))))
}

//Win/Lose Functions
function isWinning() {
    var end_orientation;
    if (end[1] == 1 || end[1] == squares) {end_orientation = 'horizontal'}
    else {end_orientation = "vertical"}
    ctx.strokeStyle = "#00FF00";
    var colour;

    //Draw
    if (end[0] == position[0] == end[1] == position[1]) { colour = "red" } else { colour = "#00000000" }
    if (end_orientation == "horizontal") {
        if (end[1] == 1) {
            var gradient = ctx.createLinearGradient(end[0] - 1 * pixel_width, 0, end[0] - 1 * pixel_width, pixel_width / 2);
            gradient.addColorStop(0, "green");
            gradient.addColorStop(1, colour);
            ctx.fillStyle = gradient;
            ctx.fillRect((end[0] - 1) * pixel_width, 0, pixel_width, pixel_width / 2)
        }
        else {
            var gradient = ctx.createLinearGradient((end[0] - 1) * pixel_width, canvas.width - pixel_width, (end[0] - 1) * pixel_width, canvas.width);
            gradient.addColorStop(1, "green");
            gradient.addColorStop(0, colour);
            ctx.fillStyle = gradient;
            ctx.fillRect((end[0] - 1) * pixel_width, canvas.width - pixel_width, pixel_width, pixel_width)
        }
    }
    else {
        if (end[0] == 1) {
            var gradient = ctx.createLinearGradient(0, (end[1] - 1) * pixel_width, pixel_width, (end[1]-1) * pixel_width);
            gradient.addColorStop(0, "green");
            gradient.addColorStop(1, colour);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, (end[1] - 1) * pixel_width, pixel_width, pixel_width)
        }
        else {
            var gradient = ctx.createLinearGradient(canvas.width - pixel_width, (end[1] - 1) * pixel_width, canvas.width, (end[1]-1) * pixel_width);
            gradient.addColorStop(1, "green");
            gradient.addColorStop(0, colour);
            ctx.fillStyle = gradient;
            ctx.fillRect(canvas.width - pixel_width, (end[1] - 1) * pixel_width, pixel_width, pixel_width)
        }
    }

    //Calculate

    if (end_orientation == "horizontal") {
        if (((end[0]-1)*pixel_width < person_position[0]) && ((end[0])*pixel_width > (person_position[0]+person_width))) {
            if (end[1] == 1 && (person_position[1]-speed) <= 0) {
                win()
            }
            else if (end[1] == squares && (person_position[1]+speed+person_width) >= canvas.height) {
                win()
            }
        }

    }
    else {
        if (((end[1]-1)*pixel_width < person_position[1]) && ((end[1])*pixel_width > (person_position[1]+person_width))) {
            if (end[0] == 1 && (person_position[0]-speed) <= 0) {

                win()
            }
            else if (end[0] == squares && (person_position[0]+speed+person_width) >= canvas.width) {
                win()
            }
        }

    }
}


function win() {
    document.getElementById('stop').click();
    document.getElementById('resume').innerHTML = "<img src='next_level.png'>";
    document.getElementById('resume').firstChild.style.width = canvas.width/4 + "px";
    document.getElementById('middle_text').style.visibility = "visible";
    document.getElementById('middle_text').innerHTML = "Success!";
    continual = true;
    var exists = !(typeof(window["level_array" + (current_level+1)]) == "undefined")
    if (!exists) {document.getElementById('resume').style.visibility = "hidden"}
}

function lose() {
    document.getElementById('stop').click();
    document.getElementById('resume').innerHTML = "YOU WON...";
    message_timeout = setTimeout(fun, 3000)
    function fun() {    document.getElementById('resume').innerHTML = "LAST PLACE";}
    document.getElementById('resume').removeEventListener('click', e => {}, false)
    
}

start();
}
//var level_arrayx = [squares, array, speed, person_position_x,person_position_y, end, iterations, allowed accelerations, position_x,position_y, allowed_swaps, blocked_swaps]
var level_array1 = [7, [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
], 0.4, 4,1, [3,7], 1500, 0, 3,3,0, []]


var level_array2 = [7, [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
], 0.4, 4, 1, [4,7], 1500, 1, 3,3,0,[]]


var level_array3 = [7, [
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [1, 0, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 1]
], 0.4, 1,2, [7,6], 1500, 3, 3,4,1,[]]

var level_array4 = [8, [
    [1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
], 0.4, 3,5, [1,8], 1000, 0, 2,3,2,[[1,8],[3,6]]]

var level_array5 = [11, [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,],
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
], 0.4, 4,5, [1,1], 1500, 3, 5,6,20,[[1,2],[2,1]]]

var level_array6 = [15, [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
], 0.4, 7,8, [15,3], 200, 4, 1,1,6, [[6,6],[6,7],[6,8],[6,9],[6,10],[7,6],[7,10],[8,5],[8,10],[9,6],[9,10],[9,6],[9,10],[10,6],[10,7],[10,8],[10,9],[10,10]]]

window.addEventListener('load', e=> {
level1(window["level_array" + current_level]);
})