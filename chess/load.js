
// var username = "anon";
// var user_id = "";

var time_control_array = ['Time Control','None','Timed','Classic', 'Rapid', 'Blitz'];
var mode_array = ['Mode', 'Ranked', 'Casual'];
var game_mode = ['Variation','Classic','Chess960','Antichess','Armageddon','Atomic','Beirut','Crazyhouse','3 Check','Checkless','Circe','Dusanny\'s','KOTH','Really Bad','Schrodinger'];
var play_as = ['Play As', 'White', 'Black', 'Random'];

var selected_time_control = "Time Control";
var selected_mode = "Mode";
var selected_game_mode = "Variation";
var selected_play_as = "Play As";

var selected_time_control_observer = 'Time Control';
var selected_mode_observer = 'Mode';
var selected_game_mode_observer = 'Variation';

var join_arr = [];
var observe_arr = [];

function formatFilter(e, array) {
	if (e.target.getAttribute('name') == 'back') {
		var filter = e.target.parentElement.getElementsByTagName('span')[1];
		filter.innerHTML = array[array.indexOf(filter.innerHTML) ? (array.indexOf(filter.innerHTML) - 1) : (array.length - 1)];

	}
	else if (e.target.getAttribute('name') == 'forward' || e.target.getAttribute('name') == 'current') {
		var filter = e.target.parentElement.getElementsByTagName('span')[1];
		filter.innerHTML = array[array.indexOf(filter.innerHTML) == array.length - 1 ? 0 : (array.indexOf(filter.innerHTML) + 1)];
	}
}

$('search_public').nextElementSibling.getElementsByTagName('th')[3].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, game_mode);
})
$('search_public').nextElementSibling.getElementsByTagName('th')[4].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, play_as);
})
$('search_public').nextElementSibling.getElementsByTagName('th')[5].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, mode_array);
})
$('search_public').nextElementSibling.getElementsByTagName('th')[6].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, time_control_array);
})


$('search_observer').nextElementSibling.getElementsByTagName('th')[5].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, game_mode_observer);
})
$('search_observer').nextElementSibling.getElementsByTagName('th')[6].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, mode_array_observer);
})
$('search_observer').nextElementSibling.getElementsByTagName('th')[7].addEventListener('click', e => {
	console.log(e.target.parentElement);
	formatFilter(e, time_control_array_observer);
})


$('search_public').getElementsByTagName('button')[0].addEventListener('click', e => {
	e.preventDefault();
	if (document.getElementById('search_public').getElementsByTagName('button')[0].style['animation-play-state'] != 'running') {
	document.getElementById('search_public').getElementsByTagName('button')[0].style['animation-play-state'] = 'running';
	selected_time_control = $('search_public').nextElementSibling.getElementsByTagName('th')[6].getElementsByTagName('span')[1].innerHTML;
	selected_mode = $('search_public').nextElementSibling.getElementsByTagName('th')[5].getElementsByTagName('span')[1].innerHTML;
	selected_game_mode = $('search_public').nextElementSibling.getElementsByTagName('th')[3].getElementsByTagName('span')[1].innerHTML;
	selected_play_as = $('search_public').nextElementSibling.getElementsByTagName('th')[4].getElementsByTagName('span')[1].innerHTML;
	if ($('search_public').increment.value != "0") {
		sortData('public', 'load_public', $('search_public').search.value, $('search_public').increment.value);
		}
		else {
		sortData('public', 'load_public', $('search_public').search.value);
		}
	}
})

$('search_observer').getElementsByTagName('button')[0].addEventListener('click', e => {
	e.preventDefault();
	if (document.getElementById('search_observer').getElementsByTagName('button')[0].style['animation-play-state'] != 'running') {
	document.getElementById('search_observer').getElementsByTagName('button')[0].style['animation-play-state'] = 'running';
	selected_time_control_observer = $('search_observer').nextElementSibling.getElementsByTagName('th')[7].getElementsByTagName('span')[1].innerHTML;
	selected_game_mode_observer = $('search_observer').nextElementSibling.getElementsByTagName('th')[5].getElementsByTagName('span')[1].innerHTML;
	selected_mode_observer = $('search_observer').nextElementSibling.getElementsByTagName('th')[6].getElementsByTagName('span')[1].innerHTML;
	if ($('search_observer').increment.value != "0") {
		sortData('observer', 'load_observer', $('search_observer').search.value, $('search_observer').increment.value);
		}
		else {
		sortData('observer', 'load_observer', $('search_observer').search.value);
		}
	}
})


sortData('public', 'load_public');
sortData('observer', 'load_observer');
update_graphics();
update_nav_graphics();
window.addEventListener('resize', e => {
    update_graphics()
	update_nav_graphics();
})
window.addEventListener('load', e => {
    update_graphics();
	update_nav_graphics();
})

function update_graphics() {

    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + "px";
    overlay.style.width = overlay.style.height.slice(0,-2) * 1.2 + "px";
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px"

    var rules = $('rules_nav');
    rules.style.width = overlay.getBoundingClientRect().width;
    document.getElementsByClassName('rules')[0].style.top = $('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[1].style.top = $('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[2].style.top = $('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";


}

$('load_public').getElementsByClassName('page_controls')[0].addEventListener('click', e => {
	if (getComputedStyle(e.target).color != "rgb(128, 128, 128)" && !e.target.childElementCount) {
	var current_page = 1;
	for (var i = 2; i <= 6; i++) {
		if (e.target.parentElement.getElementsByTagName('span')[i].style.color == "orangered") {
			current_page = i - 1;
			break;
		}
	}

	var page_number = null;
	if (!isNaN(parseInt(e.target.innerHTML))) {
		page_number = parseInt(e.target.innerHTML);
	 }
	else if (e.target.innerHTML == '⭰') {
		page_number = 1
	}
	else if (e.target.innerHTML == "🠤") {
		page_number = current_page - 1
	}
	else if (e.target.innerHTML == "🠦") {
		page_number = current_page + 1

	}
	else if (e.target.innerHTML == "⭲") {
		page_number = (Math.ceil(join_arr.length / 10))
	}
	var header = $('load_public').getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
	$('load_public').getElementsByTagName('table')[0].innerHTML = "";
	$('load_public').getElementsByTagName('table')[0].appendChild(header); 

	for (var i = ((page_number - 1) * 10); i < (join_arr.length < (page_number * 10) ? join_arr.length : (page_number * 10) ); i++) {
		render_data('load_public','public',join_arr,i)
	}
	e.target.parentElement.getElementsByTagName('span')[page_number + 1].style.color = 'orangered';
	e.target.parentElement.getElementsByTagName('span')[current_page + 1].style.color = 'white';
	if (page_number != 1) {
		e.target.parentElement.getElementsByTagName('span')[0].style.color = 'white';
		e.target.parentElement.getElementsByTagName('span')[1].style.color = 'white';	
	}
	else {
		e.target.parentElement.getElementsByTagName('span')[0].style.color = 'grey';
		e.target.parentElement.getElementsByTagName('span')[1].style.color = 'grey';	
	}
	if (page_number == Math.ceil(join_arr.length / 10)) {
		e.target.parentElement.getElementsByTagName('span')[7].style.color = 'grey';
		e.target.parentElement.getElementsByTagName('span')[8].style.color = 'grey';	
	}
	else {
		e.target.parentElement.getElementsByTagName('span')[7].style.color = 'white';
		e.target.parentElement.getElementsByTagName('span')[8].style.color = 'white';	
	}

	}
})
$('load_observer').getElementsByClassName('page_controls')[0].addEventListener('click', e => {
	if (getComputedStyle(e.target).color != "rgb(128, 128, 128)" && !e.target.childElementCount) {
	var current_page = 1;
	for (var i = 2; i <= 6; i++) {
		if (e.target.parentElement.getElementsByTagName('span')[i].style.color == "orangered") {
			current_page = i - 1;
			break;
		}
	}

	var page_number = null;
	if (!isNaN(parseInt(e.target.innerHTML))) {
		page_number = parseInt(e.target.innerHTML);
	 }
	else if (e.target.innerHTML == '⭰') {
		page_number = 1
	}
	else if (e.target.innerHTML == "🠤") {
		page_number = current_page - 1
	}
	else if (e.target.innerHTML == "🠦") {
		page_number = current_page + 1

	}
	else if (e.target.innerHTML == "⭲") {
		page_number = (Math.ceil(observe_arr.length / 10))
	}
	var header = $('load_observer').getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
	$('load_observer').getElementsByTagName('table')[0].innerHTML = "";
	$('load_observer').getElementsByTagName('table')[0].appendChild(header); 

	for (var i = ((page_number - 1) * 10); i < (observe_arr.length < (page_number * 10) ? observe_arr.length : (page_number * 10) ); i++) {
		render_data('load_observer','observer',observe_arr,i)
	}
	e.target.parentElement.getElementsByTagName('span')[page_number + 1].style.color = 'orangered';
	e.target.parentElement.getElementsByTagName('span')[current_page + 1].style.color = 'white';
	if (page_number != 1) {
		e.target.parentElement.getElementsByTagName('span')[0].style.color = 'white';
		e.target.parentElement.getElementsByTagName('span')[1].style.color = 'white';	
	}
	else {
		e.target.parentElement.getElementsByTagName('span')[0].style.color = 'grey';
		e.target.parentElement.getElementsByTagName('span')[1].style.color = 'grey';	
	}
	if (page_number == Math.ceil(observe_arr.length / 10)) {
		e.target.parentElement.getElementsByTagName('span')[7].style.color = 'grey';
		e.target.parentElement.getElementsByTagName('span')[8].style.color = 'grey';	
	}
	else {
		e.target.parentElement.getElementsByTagName('span')[7].style.color = 'white';
		e.target.parentElement.getElementsByTagName('span')[8].style.color = 'white';	
	}

	}
})


$('load_private').style.display = "none";
$('load_observer').style.display = "none";

$('rules_nav').getElementsByTagName('li')[0].addEventListener('click', e=> {
    $('load_public').style.display = "unset";
    $('load_private').style.display = "none";
	$('load_observer').style.display = "none";
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[1].addEventListener('click', e=> {
    $('load_public').style.display = "none";
    $('load_private').style.display = "unset";
	$('load_observer').style.display = "none";
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[2].addEventListener('click', e=> {
    $('load_public').style.display = "none";
    $('load_private').style.display = "none";
	$('load_observer').style.display = "unset";
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})

$('search_public').addEventListener('keyup',e => {
    if ($('search_public').increment.value != "0") {
    sortData('public', 'load_public', $('search_public').search.value, $('search_public').increment.value);
    }
    else {
    sortData('public', 'load_public', $('search_public').search.value);
    }
});
$('search_observer').addEventListener('keyup',e => {
    if ($('search_observer').increment.value != "0") {
    sortData('observer', 'load_observer', $('search_observer').search.value, $('search_observer').increment.value);
    }
    else {
    sortData('observer', 'load_observer', $('search_observer').search.value);
    }
});

db.collection('chess').onSnapshot(ref => {
	if ($('search_public').increment.value != "0") {
		sortData('public', 'load_public', $('search_public').search.value, $('search_public').increment.value);
		}
		else {
		sortData('public', 'load_public', $('search_public').search.value);
		}
	if ($('search_observer').increment.value != "0") {
		sortData('observer', 'load_observer', $('search_observer').search.value, $('search_observer').increment.value);
		}
		else {
		sortData('observer', 'load_observer', $('search_observer').search.value);
		}
})

function sortData(mode, id, input="", precision=0.3) {
	//data, name, date/elo
    var data_arr = [];
    db.collection('chess').where('visibility', '==', 'Public').where('creation_date','>',new Date(new Date() - 30*24*3600*1000)).orderBy('creation_date','desc').get().then(snapshot => {
        snapshot.forEach(doc => {
			if (((mode == "observer" && doc.data().white_user != null && doc.data().black_user != null) || 
				(mode == "public" && (doc.data().white_user == null || doc.data().black_user == null))) && 
				((username == "anon" && !getCookie(doc.id + "_info")) || 
				(username != doc.data().white_user && username != doc.data().black_user))
				&& (
				
				(mode == "public" &&
				((selected_play_as == "Play As") || (selected_play_as == "Random" && doc.data().randomised) || (selected_play_as == "White" && doc.data().white_user == null) || (selected_play_as == "Black" && doc.data().black_user == null)) &&
				((selected_game_mode == "Variation") || (doc.data().mode.indexOf(selected_game_mode) != -1)) &&
				((selected_mode == "Mode") || (selected_mode == "Casual" && !doc.data().points) || (selected_mode == "Ranked" && doc.data().points)) &&
				((selected_time_control == "Time Control") || (selected_time_control == "None" && doc.data().white_time == null)) &&
				(($('search_public').lbound.value == "" && $('search_public').ubound.value == "") || (doc.data().white_user != null ? (parseFloat(doc.data().white_user_elo) <= parseInt($('search_public').ubound.value != "" ? $('search_public').ubound.value : 10000) && parseFloat(doc.data().white_user_elo) >= parseInt($('search_public').lbound.value ? $('search_public').lbound.value : 0)) : (parseFloat(doc.data().black_user_elo) <= parseInt($('search_public').ubound.value != "" ? $('search_public').ubound.value : 10000) && parseFloat(doc.data().black_user_elo) >= parseInt($('search_public').lbound.value ? $('search_public').lbound.value : 0)))) &&
				($('search_public').opponent_search.value == "" || $('search_public').opponent_search.value == (doc.data().white_user ? doc.data().white_user : doc.data().black_user))) 
				
				||
				
				(mode == "observer" &&
				((selected_game_mode_observer == "Variation") || (doc.data().mode.indexOf(selected_game_mode_observer) != -1)) &&
				((selected_mode_observer == "Mode") || (selected_mode_observer == "Casual" && !doc.data().points) || (selected_mode_observer == "Ranked" && doc.data().points)) &&
				((selected_time_control_observer == "Time Control") || (selected_time_control_observer == "None" && doc.data().white_time == null)) &&
				(($('search_observer').lbound.value == "" && $('search_observer').ubound.value == "") || (doc.data().white_user != null ? (parseFloat(doc.data().white_user_elo) <= parseInt($('search_observer').ubound.value != "" ? $('search_observer').ubound.value : 10000) && parseFloat(doc.data().white_user_elo) >= parseInt($('search_observer').lbound.value ? $('search_observer').lbound.value : 0)) : (parseFloat(doc.data().black_user_elo) <= parseInt($('search_observer').ubound.value != "" ? $('search_observer').ubound.value : 10000) && parseFloat(doc.data().black_user_elo) >= parseInt($('search_observer').lbound.value ? $('search_observer').lbound.value : 0)))) &&
				($('search_observer').opponent_search.value == "" || $('search_observer').opponent_search.value == (doc.data().white_user ? doc.data().white_user : doc.data().black_user)))
				
				)
			) {
			if (mode == "observer") {console.log(doc.data())}
            if (
                (relevancy.weight(doc.data().name,input) >= precision || input == ""))
            {  
			var weighting = null;
			if (mode == "observer")    {   
			weighting = (1 / (Math.ceil((new Date() - doc.data().creation_date.toDate())/(1000*60) / 5) ? Math.ceil((new Date() - doc.data().creation_date.toDate())/(1000*60) / 5) : 1)) + 
			0.5*(doc.data().white_user_elo + doc.data().black_user_elo) / (1 + 0.0005*Math.abs(doc.data().white_user_elo - doc.data().black_user_elo))
		}
			data_arr.push([doc.data(), doc.id, relevancy.weight(doc.data().name,input), weighting]);
		}}
        })
    }).then(docRef => {
		if (input != "") {
			data_arr = data_arr.sort((a, b) => {
				return b[2] - a[2]
			  });
		}
		else if (mode == "observer") {
			data_arr = data_arr.sort((a, b) => {
				return b[3] - a[3]
			  });
		}
		data_arr.splice(50, data_arr.length - 1);
		if (mode == "public") {
			join_arr = data_arr;
		}
		else {
			observe_arr = data_arr
		}
        var header = $(id).getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
        $(id).getElementsByTagName('table')[0].innerHTML = "";
		$(id).getElementsByTagName('table')[0].appendChild(header); 
        for (var i = 0; i < (data_arr.length < 10 ? data_arr.length : 10); i++) {
			render_data(id, mode, data_arr, i);
		}

    }).then(() => {
	if (mode == "public") {document.getElementById('search_public').getElementsByTagName('button')[0].style['animation-play-state'] = 'paused';}
	else if (mode == "observer") {document.getElementById('search_observer').getElementsByTagName('button')[0].style['animation-play-state'] = 'paused';}
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[2].style.color = 'orangered';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[1].style.color = "grey";
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[0].style.color = "grey";

	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[3].style.color = 'white';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[4].style.color = 'white';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[5].style.color = 'white';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[6].style.color = 'white';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[7].style.color = 'white';
	$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[8].style.color = 'white';
	if (data_arr.length <= 40) {
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[6].style.color = "grey";
	}
	if (data_arr.length <= 30) {
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[5].style.color = "grey";
	}
	if (data_arr.length <= 20) {
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[4].style.color = "grey";
	}
	if (data_arr.length <= 10) {
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[3].style.color = "grey";
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[7].style.color = "grey";
		$(id).getElementsByClassName('page_controls')[0].getElementsByTagName('span')[8].style.color = "grey";
	}
	})
}

function render_data(id, mode, data_arr, i)  {
	var element = data_arr[i];
	var data = element[0];
	var new_table = $(id).getElementsByTagName('table')[0].insertRow();
	new_table.setAttribute('id', element[1])
	var play_as = data.randomised ? 'Random' : null;
	var variation = data.mode;
	if (data.mode.indexOf(' Chess') > 0) {
		variation = data.mode.split(' Chess')[0];
	}
	if (data.mode.indexOf('Hill') != -1) {
		variation = 'KOTH';
	}
	if (data.mode.indexOf('Check Checkmate') != -1) {
		variation = '3 Check';
	}
	var time = null;
	if (data.white_time) {
		time = "";
	for (var index of data.black_time.split('[')) {
		try {
		time += (index.split(',')[0] + "/" + parseInt(index.split(',')[1])/60 + "+" + (index.split(',')[2].slice(0,-1) ? index.split(',')[2].slice(0,-1) : 0) + " ");
	}
		catch (error) {}
	}}
	if (!data.randomised) {
	if (data.black_user == null) {play_as = "Black"} 
	if (data.white_user == null) {play_as = "White"}}
	if (mode == "public") {
		new_table.innerHTML = `<td>${data.name}</td><td>${data.admin}</td><td>${data.white_user ? data.white_user_elo : data.black_user_elo}</td><td>${variation}</td><td>${play_as}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${time}</td>`;
	}
	else {
		new_table.innerHTML = `<td>${data.name}</td><td>${data.white_user}</td><td>${data.white_user_elo}</td><td>${data.black_user}</td><td>${data.black_user_elo}</td><td>${variation}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${time}</td>`;	
	}
}

$('load_public').getElementsByTagName('table')[0].addEventListener('click', e => {
    if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
		var load_id = e.target.parentElement.getAttribute('id');
		var doc_data;
		for (var join of join_arr) {if (join[1] == load_id) {doc_data = join[0]}} 
		var user_elo = null;
		db.collection('account').doc(user_id ? user_id : " ").get().then(doc => {
			user_elo = doc.data() ? doc.data().ranking : null;
		}).then(() => {
			if (doc_data.white_user == null && doc_data.black_user != username) {
				db.collection('chess').doc(load_id).update({
					white_user: username,
					white_user_id: user_id,
					white_user_email: (auth.currentUser == null ? "" : auth.currentUser.email),
					white_user_elo: user_elo
				}).then(docRef => {
					console.log('t2')
					setCookie('game_id',load_id,2);
					sessionStorage.setItem('game_id',load_id);
					if (username == "anon") {
						setCookie(load_id + "_info", 'white', 9999);
						sessionStorage.setItem(load_id + "_info", 'white', 9999);
					}
					window.location.assign('play.html');
				})
			}
			else if (doc_data.black_user == null && doc_data.white_user != username) {
				db.collection('chess').doc(load_id).update({
					black_user: username,
					black_user_id: user_id,
					black_user_email: (auth.currentUser == null ? "" : auth.currentUser.email),
					black_user_elo: user_elo
				}).then(docRef => {
					console.log('t2')
					setCookie('game_id',load_id,2);
					sessionStorage.setItem('game_id',load_id);
					if (username == "anon") {
						setCookie(load_id + "_info", 'black', 9999);
						sessionStorage.setItem(load_id + "_info", 'black', 9999);
					}
					window.location.assign('play.html');
				})
			}
			else {
				setCookie('game_id',load_id,2);
				sessionStorage.setItem('game_id',load_id);
				window.location.assign('play.html');
				
			}
					
		})

    }
})

$('load_observer').getElementsByTagName('table')[0].addEventListener('click', e => {
    if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
        var load_id = e.target.parentElement.getAttribute('id')
		console.log(load_id);
		setCookie('game_id',load_id,2);
		sessionStorage.setItem('game_id',load_id);
		window.location.assign('play.html');
    }
})

$('search_private').addEventListener('submit', e => {
	$('private_error').innerHTML = "";
	e.preventDefault();
	var exists = false;
	var data = $('search_private').getElementsByTagName('input')[0].value;
	db.collection('chess').where('visibility', '==', 'Private').where('name', '==', data).get().then(snapshot => {
		snapshot.forEach(doc => {
		exists = true;
		setCookie('game_id',doc.id,2);
		sessionStorage.setItem('game_id',doc.id);
		if (doc.data().white_user == null) {
			db.collection('chess').doc(doc.id).update({
				white_user: username,
				white_user_id: user_id
			}).then(() => {
						if (!exists) {
			$('private_error').innerHTML = "Game does not exist"; }
		else {
		window.location.assign('play.html');
		}
			})
		}
		else if (doc.data().black_user == null) {
			db.collection('chess').doc(doc.id).update({
				black_user: username,
				black_user_id: user_id
			}).then(() => {
		if (!exists) {
			$('private_error').innerHTML = "Game does not exist"; }
		else {
		window.location.assign('play.html');
		}
			})
		}
		else {
if (!exists) {
			$('private_error').innerHTML = "Game does not exist"; }
		else {
		window.location.assign('play.html');
		}
		}
	}
		)
	})
})


/**
 * relevancy.js v0.2
 **/
relevant();
function relevant (){
	
	var S = typeof module != 'undefined' && module && module.exports || (this.relevancy = {}),
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty;

	S.sort = function relevancySort(array, subject, subWeightOperation) {
		return S.defaultSorter.sort(array, subject, subWeightOperation);
	};

	S.weight = function relevancyWeight(a, b) {
		return S.defaultSorter._calcWeight(b, S.defaultSorter._generateSubjectRegex(a), a);
	};

	S.Sorter = function(config, array) {
		return new Sorter(config, array);
	};

	function Sorter(config, array) {

		config || (config = {})

		this._array = array;

		this._bounds = config.bounds || ['\\s'];
		this._subWeightOperation = config.subWeightOperation &&
			(
				typeof config.subWeightOperation == 'function' ?
					config.subWeightOperation :
					S.Sorter.subWeightOperations[config.subWeightOperation]
			) || S.Sorter.subWeightOperations.max;

		this._weights = {
			matchInSubjectLength: 0.5,
			matchInSubjectIndex: 0.25,
			matchInValueLength: 2,
			matchInValueIndex: 0.25
		}

		this._secondaryComparator = config.comparator || function(a, b) {
			return a > b ? 1 : -1;
		};

		if (config.weights) for (var i in this._weights) {
			if (hasOwn.call(config.weights, i)) {
				this._weights[i] = config.weights[i];
			}
		}

		this._generateBoundRegex();

	}

	var subWeightOperation = S.Sorter.subWeightOperations = {
		arrayMax: function(sub, calc) {
			// Return maxmium weight found in array
			for (var max, l = sub.length; l--;) {
				max = Math.max(
					max || 0,
					calc(sub[l])
				);
			}
			return max;
		}
	};

	// max deprecated, but still here so we don't break anything:
	// TODO: remove
	subWeightOperation.max = subWeightOperation.arrayMax;

	Sorter.prototype = S.Sorter.prototype = {

		_generateSubjectRegex: function(subject) {

			// Create a regular expression that contains all possible
			// substrings of a larger string.
			// E.g. "apple" -> /apple|appl|pple|app|ppl|ple|ap|pp|pl|le|a|p|l|e/

			var length = subject.length,
				ret = [],
				substring;

			for (var i = 0; i < length; ++i) for (var end = length; end--;) {
				substring = subject.substring(i, end+1).replace(/[-[\]{}()*+?.,\\^$#\s|]/g, "\\$&");
				substring && ret.push(substring);
			}

			ret.sort(function(a,b){ return a.length > b.length ? -1 : 1; });
			return RegExp(ret.join('|'), 'ig');

		},
		_generateBoundRegex: function() {
			
			this.boundRegex = RegExp(this._bounds.join('|'));
			this.lastBoundRegex = RegExp('.+(?:' + this._bounds.join('|') + ')(?=.*$)');

		},
		setArray: function(array) {
			this._array = array;
			return this;
		},
		sort: function(array, subject, subWeightOperation) {
			return this.setArray(array).sortBy(subject, subWeightOperation);
		},
		sortBy: function(subject, subWeightOperation) {

			if (!subject) return this._array;

			subWeightOperation = subWeightOperation || this._subWeightOperation

			var array = this._array.slice(0),
				me = this,
				isRegexSearch = S._isRegExp(subject),
				fixedCalcWeight = function(str) {
					return me._calcWeight(str, regex, subject, isRegexSearch);
				},
				regex = isRegexSearch ?
					RegExp(subject.source, 'ig') :
					this._generateSubjectRegex(subject);

			return array.sort(function(a, b){

				var l, max, aWeight, bWeight;

				if (a === Object(a)) {
					aWeight = subWeightOperation(a, fixedCalcWeight);
				} else {
					aWeight = me._calcWeight(a, regex, subject, isRegexSearch);
				}

				if (b === Object(b)) {
					bWeight = subWeightOperation(b, fixedCalcWeight);
				} else {
					bWeight = me._calcWeight(b, regex, subject, isRegexSearch);
				}

				return aWeight == null && bWeight == null ? 0 :
					aWeight == null ? 1 : 
						bWeight == null ? -1 :
							aWeight === bWeight ? 
								me._secondaryComparator(a, b) :
								bWeight > aWeight ? 1 : -1;
				
			});


		},
		_calcWeight: function(value, regex, subject, isRegexSearch) {

			value = String(value);

			if (value === subject) return 1;
			if (value.toLowerCase() === subject.toLowerCase()) return 0.9;

			var match = S._getLargestMatch(value, regex);

			if (!match) return null;

			var upTillMatch = value.slice(0, match.index),
				lastBoundIndex = (upTillMatch.match(this.lastBoundRegex)||[''])[0].length,

				matchInValueIndexScore = (1 - (
					((match.index - lastBoundIndex) / (value.length - lastBoundIndex))
				)) - ((upTillMatch.split(this.boundRegex).length-1) * 0.05),

				matchInValueLengthScore = match.length / value.length,

				matchInSubjectIndexScore = isRegexSearch ? 1 :
					1 - (
						subject.toLowerCase().indexOf(
							match.match.toLowerCase()
						)
					) / (subject.length - match.length + 1) || 1,

				matchInSubjectLengthScore = match.length / subject.length,

				score = 0;

			score += matchInValueIndexScore * this._weights.matchInValueIndex;
			score += matchInValueLengthScore * this._weights.matchInValueLength;
			score += matchInSubjectIndexScore * this._weights.matchInSubjectIndex;
			score += matchInSubjectLengthScore * this._weights.matchInSubjectLength;

			score /= 5;

			return score;

		}
	};

	S.defaultSorter = new Sorter;

	S._getLargestMatch = function _getLargestMatch(str, regex) {

		regex.lastIndex = 0;

		var m, prev, index;

		while (m = regex.exec(str)) {
			if (!prev || m[0].length > prev.length) {
				prev = m[0];
				index = regex.lastIndex;
			}
		}

		return prev && {
			string: str,
			match: prev,
			length: prev.length,
			index: index - prev.length
		};

	};

	S._isRegExp = function(r) {
		return toString.call(r) == '[object RegExp]';
	};

	S._isArray = function(a) {
		return toString.call(a) == '[object Array]';
	};

}

