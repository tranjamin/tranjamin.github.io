console.log('connection 2 initiated')
var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
var pixel_width = 10;
ctx.fillStyle = "#FF0000";
var stopped = false;
var iterations = 0.1;
var pattern1 = 1
var pattern2 = 1
var pattern3 = 1
var pattern4 = 1
var random = false;
var small = false;
var interval;
ctx.fillRect((canvas.width-pixel_width)/2,(canvas.height-pixel_width)/2,pixel_width,pixel_width);
var array = [];
var position = [(canvas.width-pixel_width)/(2*pixel_width),(canvas.height-pixel_width)/(2*pixel_width)];
var orientation = "up"
var img = document.getElementById("image")

function moveRight () {
    //console.log('right');
    switch (orientation) {
        case "up":
            position[0] ++;
            orientation = "right";
            break;
        case "down":
            position[0] --;
            orientation = "left";
            break;
        case "right":
            position[1] --;
            orientation = "down";
            break;
        case "left":
            position[1] ++;
            orientation = "up";
            break;
        default:
            //console.log("Error: invalid orientation")
            break;
    }
}
function moveLeft () {
    //console.log("left")
    switch (orientation) {
        case "up":
            position[0] --;
            orientation = "left";
            break;
        case "down":
            position[0] ++;
            orientation = "right";
            break;
        case "right":
            position[1] ++;
            orientation = "up";
            break;
        case "left":
            position[1] --;
            orientation = "down";
            break;
        default:
            console.log("Error: invalid orientation")
            break;
    }
}
function flipScreen () {
    //console.log("flip");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[0].length; j++) {
            if (array[i][j]) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(i*pixel_width,j*pixel_width,pixel_width,pixel_width)
            }
            else {
                ctx.fillStyle = "#000000";
                ctx.fillRect(i*pixel_width,j*pixel_width,pixel_width,pixel_width)
            }
        }
    }
}

function moveTotal () {
    //console.log('moving')
    var colour = array[position[0]][position[1]];
    //console.log(colour)
    if (colour) {
        array[position[0]][position[1]] = 0
        moveRight()
    }
    else {
        array[position[0]][position[1]] = 1
        moveLeft()
    }
    flipScreen();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(position[0]*pixel_width,position[1]*pixel_width,pixel_width,pixel_width);
    ctx.drawImage(img,position[0]*pixel_width,position[1]*pixel_width,pixel_width,pixel_width);
}

function repeat() 
{
    for (var i = 0; i < canvas.width / pixel_width; i++) {
        var sub_array = []
        for (var j = 0; j < canvas.height / pixel_width; j++) {
            if (!random) {
                if (i % 2 == 0) {
                    if (j % 2 == 0) { sub_array.push(pattern1); }
                    else { sub_array.push(pattern2); }
                }
                else {
                    if (j % 2 == 0) { sub_array.push(pattern3); }
                    else { sub_array.push(pattern4); }
                }
            }
            else if (small) {
                if ((i > Math.floor((canvas.width/pixel_width)/4) && i < Math.floor(3*((canvas.width/pixel_width)/4))) && (j > Math.floor((canvas.height/pixel_width)/4) && j < Math.floor(3*((canvas.height/pixel_width)/4)))) {sub_array.push(Math.round(Math.random()))}
                else {sub_array.push(1)}
            }
            else { sub_array.push(Math.round(Math.random())) }
        }
        array.push(sub_array);
    }
    //interval = setInterval(moveTotal,10);
/*var clock = 1
while (clock <= iterations) {
    console.log(stopped)
    var nothing = () => {console.log('nothing')}
    if (!stopped)
    setTimeout(nothing, 10000)
    moveTotal();
{    
    clock ++;
    if (!(clock % (iterations / 10))) {
        console.log(clock);
    }}
}*/
}


document.getElementById('stop').addEventListener('submit', e=> {
    console.log('stopping')
    var element = document.getElementById('stop');
    e.preventDefault();
    if (element["stop_button"].value == "Stop") {
    stopped = true; element["stop_button"].value = "Resume";clearInterval(interval)}
    else if (element["stop_button"].value == "Resume") {
    stopped = false; element["stop_button"].value = "Stop";interval = setInterval(moveTotal,iterations);}
})

document.getElementById('go').addEventListener('submit', e=> {
    var element2 = document.getElementById('go')
    e.preventDefault();
    if (element2["size"].value) { pixel_width = element2["size"].value; }
    if (element2["height"].value) { 
        var int_num = Math.ceil(element2["height"].value / pixel_width);
        if (int_num % 2 == 0) {int_num ++}
        canvas.height = int_num * pixel_width; }
    if (element2["width"].value) { 
        var int_num2 = Math.ceil(element2["width"].value / pixel_width);
        if (int_num2 % 2 == 0) {int_num2 ++}
        canvas.width = int_num2 * pixel_width; }
    if (element2["repetitions"].value) { iterations = element2["repetitions"].value }
    element2.style.display = "none";
    if (element2["pattern"].value) {
        console.log(element2['pattern'].value)
        switch (element2['pattern'].value) {
            case "Criss-Cross":
                pattern3 = 0;
                break
            case "Black Block":
                pattern1 = 0;
                pattern2 = 0;
                pattern3 = 0;
                pattern4 = 0;
                break
            case "Checkerboard":
                pattern1 = 0;
                pattern4 = 0;
                break;
            case "Random Centre":
                small = true;
            case "Random":
                random = true;
                break;
        }
    }
    position = [(canvas.width-pixel_width)/(2*pixel_width),(canvas.height-pixel_width)/(2*pixel_width)];
    repeat();
    interval = setInterval(moveTotal,iterations);
})
