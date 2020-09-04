var username = "anon";
var user_id = "";
var email;



sortData('current', 'load_current');
sortData('invites', 'load_invite');
sortData('completed', 'load_past');

update_graphics();
window.addEventListener('resize', e => {
	update_graphics();
})
window.addEventListener('load', e => {
    update_graphics();
})

function update_graphics() {
	var overlay = $('overlay');
	overlay.style.height = window.innerHeight * 0.95 + "px";
	overlay.style.width = overlay.style.height.slice(0, -2) * 1.2 + "px";
	overlay.style.left = (window.innerWidth - overlay.style.width.slice(0, -2)) / 2 + "px";
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
	document.getElementsByClassName('rules')[3].style.top = $('rules_nav').getElementsByTagName('li')[3].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";
	document.getElementsByClassName('rules')[4].style.top = $('rules_nav').getElementsByTagName('li')[3].getBoundingClientRect().bottom - $('overlay').getBoundingClientRect().top + "px";

	document.getElementsByClassName('rules')[0].style.maxHeight = $('overlay').style.height.slice(0, -2) - $('rules_nav').getElementsByTagName('li')[0].getBoundingClientRect().bottom + "px";
	document.getElementsByClassName('rules')[1].style.maxHeight = $('overlay').style.height.slice(0, -2) - $('rules_nav').getElementsByTagName('li')[1].getBoundingClientRect().bottom + "px";
	document.getElementsByClassName('rules')[2].style.maxHeight = $('overlay').style.height.slice(0, -2) - $('rules_nav').getElementsByTagName('li')[2].getBoundingClientRect().bottom + "px";
	document.getElementsByClassName('rules')[3].style.maxHeight = $('overlay').style.height.slice(0, -2) - $('rules_nav').getElementsByTagName('li')[3].getBoundingClientRect().bottom + "px";
	document.getElementsByClassName('rules')[4].style.maxHeight = $('overlay').style.height.slice(0, -2) - $('rules_nav').getElementsByTagName('li')[4].getBoundingClientRect().bottom + "px";

	([]).forEach.call(document.querySelectorAll('#nav a'), ele => {ele.style['font-size'] = '50px'; ele.style.width = $('nav').getBoundingClientRect().width * 0.9 + 'px'; ele.style['text-align'] = 'center';})

	var new_size;
    if (!user_id || $('nav').getElementsByTagName('li')[0].firstElementChild.firstElementChild.innerHTML == "⮈") {
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
	}
}
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

$('load_current').style.display = "none";
$('load_past').style.display = "none";
$('load_invite').style.display = "none";
$('settings').style.display = "none";	

$('rules_nav').getElementsByTagName('li')[0].addEventListener('click', e => {
	$('load_current').style.display = "none";
	$('load_past').style.display = "none";
	$('load_invite').style.display = "none";
	$('info').style.display = "unset";
	$('settings').style.display = "none";	
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[3].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[4].setAttribute('class', '');
})
$('rules_nav').getElementsByTagName('li')[1].addEventListener('click', e => {
	$('load_past').style.display = "none";
	$('load_invite').style.display = "none";
	$('info').style.display = "none";
	$('load_current').style.display = "unset";
	$('settings').style.display = "none";	
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[3].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[4].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[2].addEventListener('click', e => {
	$('load_past').style.display = "none";
	$('load_current').style.display = "none";
	$('info').style.display = "none";
	$('load_invite').style.display = "unset";
	$('settings').style.display = "none";	
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[3].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[4].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[3].addEventListener('click', e => {
	$('load_invite').style.display = "none";
	$('load_current').style.display = "none";
	$('info').style.display = "none";
	$('load_past').style.display = "unset";
	$('settings').style.display = "none";	
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[3].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[4].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
})
$('rules_nav').getElementsByTagName('li')[4].addEventListener('click', e => {
	$('load_invite').style.display = "none";
	$('load_current').style.display = "none";
	$('info').style.display = "none";
	$('load_past').style.display = "none";
	$('settings').style.display = "unset";	
	e.target.parentElement.getElementsByTagName('li')[0].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[1].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[2].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[3].setAttribute('class', '');
	e.target.parentElement.getElementsByTagName('li')[4].setAttribute('class', '');
	e.target.setAttribute('class', 'table_select');
	db.collection('account').doc(user_id).get().then(doc => {
		email = doc.data().email
		$('settings').getElementsByTagName('form')[1].innerHTML = `<label for="username">Username: ${username}</label><input type="submit" value="Change">`
		$('settings').getElementsByTagName('form')[3].innerHTML = `<label for="email">Email: ${email}</label><input type="submit" value="Change">`
	})
})

$('settings').getElementsByTagName('form')[0].addEventListener('submit', e => {
	e.preventDefault();
	auth.signInWithEmailAndPassword(auth.currentUser.email, $('settings').getElementsByTagName('form')[0].confirm.value).then(() => {
		e.target.style.display = "none";		
		e.target.nextElementSibling.style.display = "none";	
		$('settings').getElementsByTagName('form')[1].style.visibility = "visible";		
		$('settings').getElementsByTagName('form')[3].style.visibility = "visible";	
		$('settings').getElementsByTagName('form')[5].style.visibility = "visible";	
		e.target.nextElementSibling.innerHTML = "";	
	}).catch(() => {
		e.target.nextElementSibling.innerHTML = "Password is incorrect"
	})
})
$('settings').getElementsByTagName('form')[1].addEventListener('submit', e => {
	e.preventDefault();
	if (e.target.childElementCount == 2) {
	e.target.innerHTML = `<label for="username">Username: </label><input name="username" type="text" value="" required><input type="submit" value="Change">`;
	e.target.nextElementSibling.style.display = "unset";
}
	else {
	username = e.target.username.value;
	var username_exists = false;
	db.collection('account').where('username','==',username).get().then(snapshot => {
		if (snapshot.docs.length) {
			username_exists = true;
		}
	}).then(docRef => {
		if (username_exists) {
		username = e.target.username.value = "";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "Username already exists";
		}
		else {
		db.collection('account').doc(user_id).update({username: username})
		if ((/^.*@tranchess\.com$/).test(auth.currentUser.email)) {
			auth.currentUser.updateEmail(username + "@tranchess.com")
		}
		e.target.innerHTML = `<label for="username">Username: ${username}</label><input type="submit" value="Change">`
		e.target.nextElementSibling.style.display = "none";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "";
	}
	})
	}
})
$('settings').getElementsByTagName('form')[2].addEventListener('submit', e => {
	e.preventDefault();
	e.target.previousElementSibling.innerHTML = `<label for="username">Username: ${username}</label><input type="submit" value="Change">`
	e.target.style.display = "none";
	e.target.nextElementSibling.innerHTML = "";

})
$('settings').getElementsByTagName('form')[3].addEventListener('submit', e => {
	e.preventDefault();
	if (e.target.childElementCount == 2) {
	e.target.innerHTML = `<label for="email">Email: </label><input name="email" type="text" value="" required><input type="submit" value="Change">`;
	e.target.nextElementSibling.style.display = "unset";
}
	else {
	email = e.target.email.value;
	var email_exists = false;
	auth.currentUser.updateEmail(email).then(() => {
		db.collection('account').doc(user_id).update({email: email})
		e.target.innerHTML = `<label for="email">Email: ${email}</label><input type="submit" value="Change">`;
		e.target.nextElementSibling.style.display = "none";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "";
	}).catch(error => {
		e.target.email.value = "";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "Email already exists";
	})
	
}
})
$('settings').getElementsByTagName('form')[4].addEventListener('submit', e => {
	e.preventDefault();
	e.target.previousElementSibling.innerHTML = `<label for="email">Email: ${email}</label><input type="submit" value="Change">`;
	e.target.style.display = "none";
})
$('settings').getElementsByTagName('form')[5].addEventListener('submit', e => {
	e.preventDefault();
	if (e.target.childElementCount == 2) {
	e.target.innerHTML = `<label for="password">Password: </label><input name="password" type="password" value="" required><br><label for="confirm" style="padding: 0 0 0 5%;">Confirm Password: </label><input name="confirm" type="password" value="" required><br>
	<br><input type="submit" value="Change">`;
	e.target.nextElementSibling.style.display = "unset";
}
	else {
	if (e.target.password.value == e.target.confirm.value) {
		e.target.nextElementSibling.style.display = "none";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "";
		auth.currentUser.updatePassword(e.target.password.value).then(() => {
			e.target.innerHTML = `<label for="password">Password: ******</label><input type="submit" value="Change">`;
		}).catch(error => {
			e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = error
		})
			}
	else  {
		e.target.confirm.value = "";
		e.target.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML = "Passwords do not match";
	}
	}
})
$('settings').getElementsByTagName('form')[6].addEventListener('submit', e => {
	e.preventDefault();
	e.target.previousElementSibling.innerHTML = `<label for="password">Password: ******</label><input type="submit" value="Change">`;
	e.target.style.display = "none";
})

$('search_current').addEventListener('keyup', e => {
	if ($('search_current').increment.value != "0") {
		sortData('current', 'load_current', $('search_current').search.value, $('search_current').increment.value);
	}
	else {
		sortData('current', 'load_current', $('search_current').search.value);
	}
});
$('search_invite').addEventListener('keyup', e => {
	if ($('search_invite').increment.value != "0") {
		sortData('invites', 'load_invite', $('search_invite').search.value, $('search_invite').increment.value);
	}
	else {
		sortData('invites', 'load_invite', $('search_invite').search.value);
	}
});
$('search_past').addEventListener('keyup', e => {
	if ($('search_past').increment.value != "0") {
		sortData('completed', 'load_past', $('search_past').search.value, $('search_past').increment.value);
	}
	else {
		sortData('completed', 'load_past', $('search_past').search.value);
	}
});

db.collection('chess').onSnapshot(ref => {
	if ($('search_current').increment.value != "0") {
		sortData('current', 'load_current', $('search_current').search.value, $('search_current').increment.value);
	}
	else {
		sortData('current', 'load_current', $('search_current').search.value);
	}
	if ($('search_invite').increment.value != "0") {
		sortData('invites', 'load_invite', $('search_invite').search.value, $('search_invite').increment.value);
	}
	else {
		sortData('invites', 'load_invite', $('search_invite').search.value);
	}
	if ($('search_past').increment.value != "0") {
		sortData('completed', 'load_past', $('search_past').search.value, $('search_past').increment.value);
	}
	else {
		sortData('completed', 'load_past', $('search_past').search.value);
	}
})

function sortData(conditional, id, input = "", precision = 0.3) {
	var data_arr = {};
	var doc_name = [];
	db.collection('chess').get().then(snapshot => {
		snapshot.forEach(doc => {
			if (
				(relevancy.weight(doc.data().name, input) >= precision || input == "") && ((conditional == "invites" && doc.data().invited_user == username && (doc.data().white_user == null || doc.data().black_user == null)) ||
					(conditional == "current" && !doc.data().result && (doc.data().white_user == username || doc.data().black_user == username)) ||
					(conditional == "completed" && doc.data().result && (doc.data().white_user == username || doc.data().black_user == username))
				)) {
				data_arr[doc.data().name] = doc.data();
				doc_name.push(doc.data().name);
			}
		})
	}).then(docRef => {
		doc_name = relevancy.sort(doc_name, input);
		doc_name.splice(10, doc_name.length - 1);
		var header = $(id).getElementsByTagName('table')[0].getElementsByTagName('tr')[0];
		if (conditional == "current") {
			header.innerHTML = "<th>Name</th><th>Opponent</th><th>Mode</th><th>Play as</th><th>Ranked</th><th>Time Left</th>";
		}
		else if (conditional == "completed") {
			header.innerHTML = "<th>Name</th><th>Opponent</th><th>Mode</th><th>Play as</th><th>Ranked</th><th>Result</th>";
		}
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
						time += (index.split(',')[0] + "/" + parseInt(index.split(',')[1]) / 60 + "+" + (index.split(',')[2].slice(0, -1) ? index.split(',')[2].slice(0, -1) : 0) + " ");
					}
					catch (error) { }
				}
			}
			if (!data.randomised) {
				if (data.black_user == null) { play_as = "Black" }
				if (data.white_user == null) { play_as = "White" }
			}
			if (conditional == 'current') {
				new_table.innerHTML = `<td>${data.turn == (data.black_user == username ? 0 : 1) ? "<icon style='font-size: 75%'>&#9654 </icon>" : ""}${data.name}</td><td>${data.black_user == username ? data.white_user : data.black_user}</td><td>${variation}</td><td>${data.black_user == username ? "Black" : "White"}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${data.black_time == null ? time_to_str(data.black_user == username ? data.black_count : data.white_count) : "--:--.--"}</td>`;
			}
			else if (conditional == 'completed') {
				new_table.innerHTML = `<td>${data.name}</td><td>${data.black_user == username ? data.white_user : data.black_user}</td><td>${variation}</td><td>${data.black_user == username ? "Black" : "White"}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${data.result == "Draw" ? "Draw" : data.result == (data.black_user ? "Black" : "White") ? "Win" : "Loss"}</td>`;
			}
			else {
				new_table.innerHTML = `<td>${data.name}</><td>${data.admin}</td><td>${variation}</td><td>${play_as}</td><td>${data.points ? 'Ranked' : 'Casual'}</td><td>${time}</td>`;
			}
		}

	})
}

$('load_current').getElementsByTagName('table')[0].addEventListener('click', e => {
	if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
		var load_name = e.target.parentElement.cells[0].innerHTML.split('>');
		load_name = load_name[load_name.length - 1]
		var load_id;
		db.collection('chess').where('name', '==', load_name).get().then(snapshot => {
			snapshot.forEach(doc => {
					load_id = doc.id;
					setCookie('game_id', load_id, 2);
					sessionStorage.setItem('game_id', load_id);
					window.location.assign('play.html');
			
			})
		})
	}
})

$('load_invite').getElementsByTagName('table')[0].addEventListener('click', e => {
	if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
		var load_name = e.target.parentElement.cells[0].innerHTML.split('>');
		load_name = load_name[load_name.length - 1]
		var load_id;
		db.collection('chess').where('name', '==', load_name).get().then(snapshot => {
			snapshot.forEach(doc => {
					load_id = doc.id;
					if (doc.data().white_user == null) {
						db.collection('chess').doc(load_id).update({
							white_user: username,
							white_user_id: user_id,
							white_user_email: (auth.currentUser == null ? "" : auth.currentUser.email)
						}).then(docRef => {
							setCookie('game_id', load_id, 2);
							sessionStorage.setItem('game_id', load_id);
							window.location.assign('play.html');})
					}
					else if (doc.data().black_user == null) {
						db.collection('chess').doc(load_id).update({
							black_user: username,
							black_user_id: user_id,
							black_user_email: (auth.currentUser == null ? "" : auth.currentUser.email)
						}).then(docRef => {
							setCookie('game_id', load_id, 2);
							sessionStorage.setItem('game_id', load_id);
							window.location.assign('play.html');})
					}
					else {
						setCookie('game_id', load_id, 2);
						sessionStorage.setItem('game_id', load_id);
						window.location.assign('play.html');
					}
			})
		})
	}
	})

$('load_past').getElementsByTagName('table')[0].addEventListener('click', e => {
	if (e.target.parentElement.tagName == "TR" && e.target.tagName != "TH") {
		var load_name = e.target.parentElement.cells[0].innerHTML.split('>');
		load_name = load_name[load_name.length - 1]
		var load_id;
		db.collection('chess').where('name', '==', load_name).get().then(snapshot => {
			snapshot.forEach(doc => {
					load_id = doc.id;
					setCookie('game_id', load_id, 2);
					sessionStorage.setItem('game_id', load_id);
					window.location.assign('play.html');
			
			})
		})
	}
})
	

db.collection('account').doc(user_id).onSnapshot(doc => {
	$('wins').innerHTML = doc.data().wins;
	$('losses').innerHTML = doc.data().losses;
	$('draws').innerHTML = doc.data().draws;
	$('percents').innerHTML = !isNaN(doc.data().wins / (doc.data().losses)) ? (doc.data().wins / (doc.data().losses + doc.data().wins) * 100).toFixed(2) + "%" : "-";
	$('rankings').innerHTML = doc.data().ranking;
})

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

/**
 * relevancy.js v0.2
 * courtesy of James Padolsey
 **/
relevant();
function relevant() {

	var S = typeof module != 'undefined' && module && module.exports || (this.relevancy = {}),
		toString = Object.prototype.toString,
		hasOwn = Object.prototype.hasOwnProperty;

	S.sort = function relevancySort(array, subject, subWeightOperation) {
		return S.defaultSorter.sort(array, subject, subWeightOperation);
	};

	S.weight = function relevancyWeight(a, b) {
		return S.defaultSorter._calcWeight(b, S.defaultSorter._generateSubjectRegex(a), a);
	};

	S.Sorter = function (config, array) {
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

		this._secondaryComparator = config.comparator || function (a, b) {
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
		arrayMax: function (sub, calc) {
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

		_generateSubjectRegex: function (subject) {

			// Create a regular expression that contains all possible
			// substrings of a larger string.
			// E.g. "apple" -> /apple|appl|pple|app|ppl|ple|ap|pp|pl|le|a|p|l|e/

			var length = subject.length,
				ret = [],
				substring;

			for (var i = 0; i < length; ++i) for (var end = length; end--;) {
				substring = subject.substring(i, end + 1).replace(/[-[\]{}()*+?.,\\^$#\s|]/g, "\\$&");
				substring && ret.push(substring);
			}

			ret.sort(function (a, b) { return a.length > b.length ? -1 : 1; });
			return RegExp(ret.join('|'), 'ig');

		},
		_generateBoundRegex: function () {

			this.boundRegex = RegExp(this._bounds.join('|'));
			this.lastBoundRegex = RegExp('.+(?:' + this._bounds.join('|') + ')(?=.*$)');

		},
		setArray: function (array) {
			this._array = array;
			return this;
		},
		sort: function (array, subject, subWeightOperation) {
			return this.setArray(array).sortBy(subject, subWeightOperation);
		},
		sortBy: function (subject, subWeightOperation) {

			if (!subject) return this._array;

			subWeightOperation = subWeightOperation || this._subWeightOperation

			var array = this._array.slice(0),
				me = this,
				isRegexSearch = S._isRegExp(subject),
				fixedCalcWeight = function (str) {
					return me._calcWeight(str, regex, subject, isRegexSearch);
				},
				regex = isRegexSearch ?
					RegExp(subject.source, 'ig') :
					this._generateSubjectRegex(subject);

			return array.sort(function (a, b) {

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
		_calcWeight: function (value, regex, subject, isRegexSearch) {

			value = String(value);

			if (value === subject) return 1;
			if (value.toLowerCase() === subject.toLowerCase()) return 0.9;

			var match = S._getLargestMatch(value, regex);

			if (!match) return null;

			var upTillMatch = value.slice(0, match.index),
				lastBoundIndex = (upTillMatch.match(this.lastBoundRegex) || [''])[0].length,

				matchInValueIndexScore = (1 - (
					((match.index - lastBoundIndex) / (value.length - lastBoundIndex))
				)) - ((upTillMatch.split(this.boundRegex).length - 1) * 0.05),

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

	S._isRegExp = function (r) {
		return toString.call(r) == '[object RegExp]';
	};

	S._isArray = function (a) {
		return toString.call(a) == '[object Array]';
	};

}