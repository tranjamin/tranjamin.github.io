
  

// var username = "anon";
// var user_id = "";
var successful_email;

var clickable = true;

var options = $('options');

var reset_code_GET;


update_graphics();
update_nav_graphics();
window.addEventListener('resize', e => {
    update_graphics();
    update_nav_graphics();
})
window.addEventListener('load', e => {
    update_graphics();
    update_nav_graphics();
    if (location.search) {
        location.search.split('&').forEach(ele => {
            if (ele.split('=')[0] == 'oobCode') {
                reset_code_GET = ele.split('=')[1];
                $('overlay2').style.visibility = "visible";
                auth.confirmPasswordReset(reset_code_GET).then(doc => {
                    $('reset').reset_address.value = doc;
                    $('reset_code').reset_code.value = reset_code_GET;
                }).catch(error => {
                    $('reset_error').innerHTML = error.message;
                })
            }
        })
        }
})


function update_graphics() {
    var overlay = $('overlay');
    overlay.style.height = window.innerHeight * 0.95 + 'px';
    overlay.style.width = overlay.style.height;
    overlay.style.left = (window.innerWidth - overlay.style.width.slice(0,-2)) / 2 + "px";
    overlay.style.top = window.innerHeight * 0.02 + "px";
    var overlay2 = $('overlay2');
    overlay2.style.height = overlay.style.height;
    overlay2.style.width = overlay.style.width;
    overlay2.style.left = overlay.style.left;
    overlay2.style.top = overlay.style.top;

    
    if ($('overlay').getBoundingClientRect().left < $('nav').getBoundingClientRect().right) {
        console.log('yes', window.innerWidth - $('nav').getBoundingClientRect().right);
        $('overlay').style.right = '2%';
        $('overlay2').style.right = '2%';
        $('overlay').style.left = 'unset';
        $('overlay2').style.left = 'unset';
        $('overlay').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
        $('overlay2').style.width = (window.innerWidth - $('nav').getBoundingClientRect().right) * 0.95 + "px";
        $('overlay').style.height = window.innerHeight * 0.95 + "px";
        $('overlay2').style.height = window.innerHeight * 0.95 + "px";
}

}

$('login').addEventListener('submit', e=> {
    e.preventDefault();
    if (clickable) {
    $('login_error').innerHTML = "";
    $('signup_error').innerHTML = "";
    clickable = false;
    var login_name = $('login').getElementsByTagName('input')[0].value;
    var login_pass = $('login').getElementsByTagName('input')[1].value;
    var login_successful = false;
    if (e.target.username_or_email.value == "Email") {
        auth.signInWithEmailAndPassword(login_name,login_pass).then(docRef => {
            console.log(auth.currentUser.uid);
            db.collection('account').where('auth_id', '==', auth.currentUser.uid).get().then(snapshot => {snapshot.docs.forEach(doc => {
                console.log('auth 0')
                username = doc.data().username;
                setCookie('username',username,5);
                setCookie('user_id',doc.id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',doc.id);
                window.location.assign('account.html')
            })}).catch(error => {
                console.log('catch 1');
                $('login_error').innerHTML = error.message;
                clickable = true;
            })
        }).catch(error => {
                console.log('catch 2');
                $('login_error').innerHTML = error.message;
                clickable = true;
        })
    }
    else {
        var username_exists = false;
        db.collection('account').where('username','==',login_name).get().then(snapshot => {snapshot.docs.forEach(doc => {
            console.log('yee')
            username_exists = true;
            if (doc.data().email) {
            auth.signInWithEmailAndPassword(doc.data().email, login_pass).then(docRef => {
                console.log('yaa')
                username = doc.data().username;
                setCookie('username',username,5);
                setCookie('user_id',doc.id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',doc.id);
                window.location.assign('account.html')
            }).catch(error => {
                console.log(error);
                $('login_error').innerHTML = error.message;
                clickable = true;
            })
        }
        else {
            auth.signInWithEmailAndPassword(login_name + "@tranchess.com", login_pass).then(docRef => {
                console.log('yaa')
                username = doc.data().username;
                setCookie('username',username,5);
                setCookie('user_id',doc.id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',doc.id);
                window.location.assign('account.html')
            }).catch(error => {
                console.log(error);
                $('login_error').innerHTML = error.message;
                clickable = true;
            })
        }
    })
        }).catch(error => {
            console.log(error);
            $('login_error').innerHTML = error.message;
            clickable = true;
        }).then(() => {
            if (!username_exists) {
                $('login_error').innerHTML = "Username or password is incorrect";
                clickable = true;
            }
        })
    }}
})

$('signup').addEventListener('submit', e=> {
    e.preventDefault();
    if (clickable) {
    clickable = false;
    $('signup_error').innerHTML = "";
    $('login_error').innerHTML = "";
    var signup_arr = $('signup').getElementsByTagName('input');
    var signup_username = signup_arr[0].value;
    var signup_email = signup_arr[1].value;
    var signup_password = signup_arr[2].value;
    var signup_confirm = signup_arr[3].value;
    var signup_decline = "";
    if (signup_password == signup_confirm) {
    if (signup_username != "anon") {
    db.collection('account').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.data().username == signup_username) {signup_decline = 'Username'}
        })
    }).then(() => {   
        if (!signup_decline) {
            console.log('success');
            auth.createUserWithEmailAndPassword(signup_email ? signup_email : signup_username + "@tranchess.com", signup_password).then(ref1 => {
                db.collection('chess').get().then(() => {
                console.log('auth1')
                db.collection('account').add({
                auth_id: ref1.user.uid,
                username: signup_username,
                email: signup_email,
                wins: 0,
                losses: 0,
                draws: 0,   
                ranking: 0     
            }).then(docRef => {
                console.log('auth2')
                username = signup_username; 
                user_id = docRef.id;
                setCookie('username',username,5);
                setCookie('user_id',user_id,5);
                sessionStorage.setItem('username',username);
                sessionStorage.setItem('user_id',user_id);
                window.location.assign('account.html');
            }).catch(error => {
                console.log('auth 3');
                console.log('error', error)
                $('signup_error').innerHTML = error.message;
                $('login_error').innerHTML = "";
            })
        }).catch(error => {
            console.log('auth 4')
            $('signup_error').innerHTML = error.message;
            clickable = true;
        })
    })
        }
        else {
            $('signup_error').innerHTML = signup_decline + " already exists";
            clickable = true;
        }
    })
}
    else {
        $('signup_error').innerHTML = "'anon' cannot be used since it is the placeholder name";
        clickable = true;
    }
    }
    else {
        $('signup_error').innerHTML = "Passwords do not Match";
        clickable = true;
    }}
})

$('forgot_password').addEventListener('click', e => {
    $('overlay2').style.visibility = "visible";
})
var address;
$('reset').addEventListener('submit', e => {
    e.preventDefault();
    if (e.target.reset_config.value == "Email") {
        auth.sendPasswordResetEmail(e.target.reset_address.value).then(e.target.reset_submit.value = "Resend").catch(error => {
            e.target.nextElementSibling.innerHTML = error.message;
            e.target.reset_submit.value = "Send Email";
        })
    }
    else {
        db.collection('account').where('username', '==', e.target.reset_address.value).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                address = doc.data().email;
            })
        }).then(() => {
            if (address) {
            auth.sendPasswordResetEmail(e.target.reset_address.value).then(e.target.reset_submit.value = "Resend").catch(error => {
                e.target.nextElementSibling.innerHTML = error.message;
            })}
            else {
                e.target.nextElementSibling.innerHTML = 'Username is invalid or does not have an linked email'; 
            }
        }).catch(error => {
            e.target.nextElementSibling.innerHTML = error.message; 
        })     
    }
})
$('reset_code').addEventListener('submit', e => {
    e.preventDefault();
    auth.verifyPasswordReset(e.target.reset_code.value).then(email => {
        $('change_password').style.visibility = "visible";
        $('reset_error').innerHTML = "";
    }).catch(error => {$('reset_error').innerHTML = error.message;})
})
$('new_password').addEventListener('submit', e => {
    e.preventDefault();
    if (e.target.create_newpassword.value == e.target.confirm_newpassword) {
        $('newpassword_error').innerHTML = ""
        auth.confirmPasswordReset($('reset_code').reset_code.value, e.target.create_newpassword).then(() => {
        db.collection('account').doc(user_id).update({
            password: e.target.create_newpassword
        }).then(docRef => {
            location.assign('account.html');
        })
    }).catch(error => {$('newpassword_error').innerHTML = error.message})
    }
    else {
        $('newpassword_error').innerHTML = "Passwords do not match";
    }
})