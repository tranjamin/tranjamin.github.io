document.addEventListener('deviceready', e => {  
console.log('deviceready');
var successful_email;


var options = $('options');

update_graphics();
update_nav_graphics();
window.addEventListener('resize', e => {
    update_graphics();
    update_nav_graphics();
})
window.addEventListener('load', e => {
    update_graphics();
    update_nav_graphics();
})


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

})

function draw_board(canvas) {
    var ctx = canvas.getContext('2d')
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
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + 'px';
    overlay.style.width = overlay.style.height;
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px";

    ([]).forEach.call(document.getElementsByClassName('suggested_game'), classElement => {
        classElement.style.height = getComputedStyle(classElement)['width'];
        draw_board(classElement);
    })
}