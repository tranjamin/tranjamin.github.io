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

var time_control_array = ['All','None','Classic'];
var mode_array = ['All', 'Ranked', 'Casual'];
var opponent_ranking = ['All', "<input type='number' min='0' max='3000'>to<input type='number' min='0' max='3000'>"];
var game_mode = ['All','Classic','Chess960','Antichess','Armageddon','Atomic','Beirut','Crazyhouse','3 Check','Checkless','Circe','Dusanny\'s','KOTH','Really Bad','Schrodinger'];
var play_as = ['Any', 'White', 'Black', 'Random'];
var selected_time_control = "All";
var selected_mode = "All";
var selected_opponent_ranking = "All";
var selected_game_mode = "All";
var selected_play_as = "Any";

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

$('search_public').getElementsByTagName('div')[0].addEventListener('click', e => {
	formatFilter(e, time_control_array);
})
$('search_public').getElementsByTagName('div')[1].addEventListener('click', e => {
	formatFilter(e, mode_array);
})
$('search_public').getElementsByTagName('div')[2].addEventListener('click', e => {
	formatFilter(e, opponent_ranking);
})
$('search_public').getElementsByTagName('div')[3].addEventListener('click', e => {
	formatFilter(e, game_mode);
})
$('search_public').getElementsByTagName('div')[4].addEventListener('click', e => {
	formatFilter(e, play_as);
})
$('search_public').getElementsByTagName('button')[0].addEventListener('click', e => {
	e.preventDefault();
	selected_time_control = e.target.parentElement.getElementsByTagName('div')[0].getElementsByTagName('span')[1].innerHTML;
	selected_mode = e.target.parentElement.getElementsByTagName('div')[1].getElementsByTagName('span')[1].innerHTML;
	selected_opponent_ranking = e.target.parentElement.getElementsByTagName('div')[2].getElementsByTagName('span')[1].innerHTML;
	selected_game_mode = e.target.parentElement.getElementsByTagName('div')[3].getElementsByTagName('span')[1].innerHTML;
	selected_play_as = e.target.parentElement.getElementsByTagName('div')[4].getElementsByTagName('span')[1].innerHTML;
	if ($('search_public').increment.value != "0") {
		sortData('public', 'load_public', $('search_public').search.value, $('search_public').increment.value);
		}
		else {
		sortData('public', 'load_public', $('search_public').search.value);
		}
})

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
		setCookie('game_id','',0);
        setCookie('user_id', '',0);
        setCookie('username', '', 0);
        update_graphics();
    }
});

sortData('public', 'load_public');
sortData('observer', 'load_observer');
update_graphics();
window.addEventListener('resize', e => {
	// console.log(e);
    update_graphics()
})
window.addEventListener('load', e => {
    update_graphics();
})

function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + "px";
    overlay.style.width = overlay.style.height.slice(0,-2) * 1.2 + "px";
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

    var rules = $('rules_nav');
    rules.style.width = overlay.getBoundingClientRect().width;
    document.getElementsByClassName('rules')[0].style.top = $('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[1].style.top = $('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
    document.getElementsByClassName('rules')[2].style.top = $('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";

    document.getElementsByClassName('rules')[0].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom + "px";
    document.getElementsByClassName('rules')[1].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom + "px";
	document.getElementsByClassName('rules')[2].style.maxHeight = $('overlay').style.height.slice(0,-2)-$('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom + "px";

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
	}}
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
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('game_id');
        setCookie('user_id', "", 0);
		setCookie('username', "", 0);
		setCookie('game_id', 0)
		auth.signOut();
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
    console.clear();
    var data_arr = {};
	var doc_name = [];
    db.collection('chess').where('visibility', '==', 'Public').get().then(snapshot => {
        snapshot.forEach(doc => {
			if (((mode == "observer" && doc.data().white_user != null && doc.data().black_user != null) || 
				(mode == "public" && (doc.data().white_user == null || doc.data().black_user == null))) &&
				((selected_play_as == "Any") || (selected_play_as == "Random" && doc.data().randomised) || (selected_play_as == "White" && doc.data().white_user == null) || (selected_play_as == "Black" && doc.data().black_user == null)) &&
				((selected_game_mode == "All") || (doc.data().mode.indexOf(selected_game_mode) != -1)) &&
				((selected_mode == "All") || (selected_mode == "Casual" && !doc.data().points) || (selected_mode == "Ranked" && doc.data().points)) &&
				((selected_time_control == "All") || (selected_time_control == "None" && doc.data().white_time == null))
			) {
				console.log(1);
            if (
                (relevancy.weight(doc.data().name,input) >= precision || input == ""))
            {data_arr[doc.data().name] = doc.data();            
            doc_name.push(doc.data().name);}}
        })
    }).then(docRef => {
        doc_name = relevancy.sort(doc_name, input);
        doc_name.splice(10, doc_name.length - 1);
        var header = $(id).getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
        $(id).getElementsByTagName('table')[0].innerHTML = "";
        $(id).getElementsByTagName('table')[0].appendChild(header);    
        for (var element of doc_name) {
            var data = data_arr[element];
            var new_table = $(id).getElementsByTagName('table')[0].insertRow();
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
            new_table.innerHTML = `<td>${data.name}</td><td>${data.admin}</td><td>${variation}</td><td>${play_as}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${time}</td>`;
        }

    })
}

$('load_public').getElementsByTagName('table')[0].addEventListener('click', e => {
    if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
        var load_name = e.target.parentElement.cells[0].innerHTML;
        var load_id;
        db.collection('chess').where('name', '==', load_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().name == load_name) {
					load_id = doc.id;
					if (doc.data().white_user == null) {
						db.collection('chess').doc(load_id).update({
							white_user: username,
							white_user_id: user_id
						}).then(docRef => {
							console.log('t2')
							setCookie('game_id',load_id,2);
							sessionStorage.setItem('game_id',load_id);
							window.location.assign('play.html');
						})
					}
					else if (doc.data().black_user == null) {
						db.collection('chess').doc(load_id).update({
							black_user: username,
							black_user_id: user_id
						}).then(docRef => {
							console.log('t2')
							setCookie('game_id',load_id,2);
							sessionStorage.setItem('game_id',load_id);
							window.location.assign('play.html');
						})
					}
                }
            })
        })
    }
})

$('load_observer').getElementsByTagName('table')[0].addEventListener('click', e => {
    if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
        var load_name = e.target.parentElement.cells[0].innerHTML;
        var load_id;
        db.collection('chess').where('name', '==', load_name).get().then(snapshot => {
            snapshot.forEach(doc => {
                if (doc.data().name == load_name) {
					load_id = doc.id;
            }})
        }).then(docRef => {
            console.log(load_id);
            setCookie('game_id',load_id,2);
            sessionStorage.setItem('game_id',load_id);
            window.location.assign('play.html');
        })
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

