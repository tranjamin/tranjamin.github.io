console.log(cookies_allowed);

update_graphics();
update_nav_graphics();
window.addEventListener('resize', e => {
    update_graphics();
    update_nav_graphics();
})
window.addEventListener('load', e => {
    console.log('has loaded')
    update_graphics();
    update_nav_graphics();
})

function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + "px";
    overlay.style.width = overlay.style.height;
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px";
    
    var rules = $('rules_nav');
    rules.style.width = overlay.getBoundingClientRect().width;
    document.getElementsByClassName('rules')[0].style.top = $('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[1].style.top = $('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[2].style.top = $('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";

    document.getElementsByClassName('rules')[0].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom + "px";
    document.getElementsByClassName('rules')[1].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom + "px";
    document.getElementsByClassName('rules')[2].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom + "px";



}



$('variant_rules').style.display = "none";
$('time_rules').style.display = "none";

$('rules_nav').getElementsByTagName('li')[0].addEventListener('click', e=> {
    $('create_rules').style.display = "unset";
    $('variant_rules').style.display = "none";
    $('time_rules').style.display = "none";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[1].addEventListener('click', e=> {
    $('create_rules').style.display = "none";
    $('variant_rules').style.display = "unset";
    $('time_rules').style.display = "none";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[2].addEventListener('click', e=> {
    $('create_rules').style.display = "none";
    $('variant_rules').style.display = "none";
    $('time_rules').style.display = "unset";
    e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
    e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
    e.target.setAttribute('class', 'table_select');
})
