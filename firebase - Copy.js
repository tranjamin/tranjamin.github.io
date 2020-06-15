//INITIALISING DATA
/*db.collection("users").get().then(function(snapshot){
    snapshot.docs.forEach(function(doc){
        //console.log(doc.data());
        //name = console.log(doc.data()["name"]);
        })
    })
*/

//HOMEPAGE STATEMENT
if (location.title == "Benjamin Tran | Homepage") {
    //ACHIEVEMENT
document.getElementById("sample-image4").addEventListener("click", e => {scum()});
document.getElementById("figcaption4").addEventListener("click", e => {scum()});
document.getElementById("sample-image5").addEventListener("click", e => {
    if (loggedIn) {
        db.collection("users").doc(id).get().then(doc => {
            if (doc.data()["reuben"] == true) {
                document.getElementById("a11").style.display = "block";
                function hide() {document.getElementById("a11").style.display = "none";}
                setTimeout(hide,8000);}
            })
            }

    else { 
        if (getCookie('scum')) {
            document.getElementById("a11").style.display = "block";
            function hide() {document.getElementById("a11").style.display = "none";}
            setTimeout(hide,8000);
        }
    }
})

    //SLIDESHOW
var days = Math.floor((((new Date()/1000)/3600)/24));
console.log(days % 4);
console.log(document.getElementById("slideshow-container"));
switch (days % 4) {
    case 0:
        console.log("0");
        document.getElementById("caption").innerHTML = "Slideshow of the Day: House";
        document.getElementById("slideshow1").src = "House slideshow.png";
        document.getElementById("slideshow2").src = "House slideshow2.png";
        document.getElementById("slideshow3").src = "House slideshow3.png";
        document.getElementById("slideshow4").src = "House slideshow4.png";
        document.getElementById("slideshow5").src = "House slideshow5.png";
        document.getElementById("slideshow6").src = "House slideshow6.png";
        document.getElementById("slideshow7").src = "House slideshow7.png";
        document.getElementById("slideshow8").src = "House slideshow8.png";
            break;
    case 1:
            console.log("1");
            console.log("yes");
            document.getElementById("caption").innerHTML = "Slideshow of the Day: Granny Flat";
            document.getElementById("slideshow1").src = "Flat slideshow.png";
            document.getElementById("slideshow2").src = "Flat slideshow2.png";
            document.getElementById("slideshow3").src = "Flat slideshow3.png";
            document.getElementById("slideshow4").src = "Flat slideshow4.png";
            document.getElementById("slideshow5").src = "Flat slideshow5.png";
            document.getElementById("slideshow6").src = "Flat slideshow6.png";
            document.getElementById("slideshow7").src = "Flat slideshow7.png";
            document.getElementById("slideshow8").src = "Flat slideshow8.png";
            break;
    case 2:
            console.log("2");
            document.getElementById("caption").innerHTML = "Slideshow of the Day: Woodworking";
            break;
    case 3:
            console.log("3");
            document.getElementById("caption").innerHTML = "Slideshow of the Day: Programming";
            break;
}}

//SET COOKIES
if (getCookie("name")) {
     if (getCookie("loggedIn") == "true") {var loggedIn = true;};
     var name = getCookie("name");
     var id = getCookie("identification");
}
else {
    var loggedIn = false;
    var name = "";
    var id = "";
}

//REVEAL POINTS
revealPoints();

//LOGIN
//window.addEventListener("load",(e) => {
    if (name) {
        document.getElementById("login").innerHTML = "Welcome, " + name + ".";
        document.getElementById("signup").innerHTML = "Logout.";
        document.getElementById("loginform").style.visibility = "hidden";
        document.getElementById("incorrectusername").innerHTML = "";
        document.getElementById("password").value = "";
        document.getElementById("username").value = "";
        toggleVisibilityLogin(document.getElementById("login"),document.getElementById("loginform"));
        toggleVisibilitySignUp(document.getElementById("signup"),document.getElementById("signupform"));
        document.getElementById('member-benefits').style.display = "block";
       }
    //});
window.addEventListener("load", (e) => {checkStreaks()});
window.addEventListener("load", (e) => {updatePurchases()});

       //SIGNUP FUNCTION
const signup = document.querySelector("#signupform");
signup.addEventListener('submit', (e) => {
    e.preventDefault();
    if (signup.newPassword.value === signup.confirmPassword.value) {
        //console.log("first function")
        var counter = 0;
        var outsideUsername = signup.newUsername.value;
        //console.log(outsideUsername);
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                //console.log("Function 1 starts");
                data = doc.data()["username"];
                //console.log(data);
                if (data == outsideUsername) {
                    counter += 1; 
                    //console.log("counter: " + counter);
                }
            })
        }).then(ifUsernameExists);
        function ifUsernameExists() {
            
        if (counter == 0) {
            //console.log("ifUsernameExists");
        db.collection('users').add({
            name: signup.newName.value,
            username: signup.newUsername.value,
            password: signup.newPassword.value,
            streaks: new Date(),
            repaying_favour: false,
            seven_streaks: false,
            fifty_streaks: false,
            year_streaks: false,
            prevbirthday: new Date(),
            birthday: new Date(),
            points: 0,
            scum: false,
            granny_flat_benefit: false,
            number_visited: 0}).then(docRef => {
                //console.log(docRef.id);
                id = docRef.id;
                setCookie("identification", id,2);
        //console.log("submitted...");
        loggedIn = true;
        name = signup.newName.value;
        document.getElementById("signup").innerHTML = "Logout.";
        document.getElementById("login").innerHTML = "Hello, " + name + ".";
        document.getElementById("newPassword").value = "";
        document.getElementById("newUsername").value = "";
        document.getElementById("confirmPassword").value = "";
        document.getElementById("newName").value = "";

        function vis() {document.getElementById("newPassword").style.visibility = "";
        document.getElementById("newPassword").value = "";}
        function vis22() {document.getElementById("newUsername").style.visibility = "";
        document.getElementById("newUsername").value = "";}
        function vis3() {document.getElementById("newName").style.visibility = "";
        document.getElementById("newName").value = "";}
        function vis7() {document.getElementById("confirmPassword").style.visibility = "";
        document.getElementById("confirmPassword").value = "";}
        document.getElementById("nonmatchingpasswords").style.visibility = "";
        document.getElementById("nonmatchingpasswords").style.display = "none";
        document.getElementById("signupbutton").style.visibility = "";
        setTimeout(vis7,100);
        setTimeout(vis,200);
        setTimeout(vis22,300);
        setTimeout(vis3,400);

        function vis2() {document.getElementById("username").style.visibility = "";document.getElementById("username").value="";}
        function vis21() {document.getElementById("password").style.visibility = "";document.getElementById("password").value="";}
        document.getElementById("incorrectusername").style.display = "none";
        document.getElementById("incorrectusername").style.visibility = "";
        document.getElementById("loginbutton").style.visibility = "";
        setTimeout(vis2,200);
        setTimeout(vis21,100);

        setCookie("name",name,2);
        setCookie("loggedIn", "true", 2);
        checkStreaks(); 
        revealPoints();
        updatePurchases();
        document.getElementById('member-benefits').style.display = "block";           })
        }
        else {
            //console.log("ready: " + ready);
            document.getElementById("nonmatchingpasswords").innerHTML = "Username already exists";
            document.getElementById("nonmatchingpasswords").style.display = "";
            document.getElementById("newUsername").value = "";
            //document.getElementById("newPassword").value = "";
            //document.getElementById("confirmPassword").value = "";
        }}
    }
    else {document.getElementById("nonmatchingpasswords").innerHTML = "Passwords do not match";
    document.getElementById("nonmatchingpasswords").style.display = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("newPassword").value = "";
}

})
    //LOGIN FUNCTION
const login = document.querySelector('#loginform');
login.addEventListener("submit", (e) => {
    e.preventDefault();
    checkLogin();
})

toggleVisibilityLogin(document.getElementById("login"),document.getElementById("loginform"));

toggleVisibilitySignUp(document.getElementById("signup"),document.getElementById("signupform"));

document.getElementById("credit").addEventListener("click", e => {
    if(loggedIn){
        db.collection("users").doc(id).get().then(doc => {
            
    if(doc.data()["repaying_favour"] == false){
    document.getElementById("a3").style.display = "block";
    function hide() {document.getElementById("a3").style.display = "none";}
    setTimeout(hide,8000);
    db.collection('users').doc(id).update({
    repaying_favour: true,
    points: doc.data()["points"] + 30
})

}})}})


/*if (document.getElementById("points").style.display == "block") {
    buyMore();
}

function buyMore () {
    document.getElementById("buy_more").addEventListener("click", e => {
        e.preventDefault();
        document.getElementById("buy_more").innerHTML = "coming soon!";
        function changeBack () {document.getElementById("buy_more").innerHTML = "Buy More"}
        setTimeout(changeBack, 6000);})}*/




        //TITLE ACHIEVEMENT
document.getElementById("title").addEventListener("click", e => 
{
    //console.log("You scum!");
    if(loggedIn){
        db.collection("users").doc(id).get().then(doc => {
            
    if((doc.data()["scum"] == false) && (doc.data()["reuben"] == true)){
    document.getElementById("a1").style.display = "block";
    function hide() {document.getElementById("a1").style.display = "none";}
    setTimeout(hide,8000);
    db.collection('users').doc(id).update({
    scum: true,
    points: doc.data()["points"] + 20})
    
}})}})



    //PATCH FIX
console.log(`Next patch fix:
Smoother transitions for achievements
Mobile
Less loading time
Security
`);
    //UPDATE
         db.collection('users').orderBy('name').onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    var points = change.doc.data()["points"];
                    console.log(points);
                     document.getElementById("points").innerHTML = points + "pts<div id='buy_more' style='font-size: 10pt'>Buy More (coming soon)</div>";
                    var streaks = change.doc.data()["number_visited"];
                    console.log(streaks);
                    document.getElementById("streaks").innerHTML = streaks;
                })
         });


//FUNCTIONS

         //COOKIE FUNCTION
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i <ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == ' ') {c = c.substring(1);}
  if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}
}
return "";
}

        //PURCHASES FUNCTION ONLOAD
function updatePurchases () {
    if (loggedIn) {
        db.collection('users').doc(id).get().then( doc => {
            //countDownloads();
            if (doc.data()["granny_flat_benefit"] && location.title == "Benjamin Tran | Projects | Member Benefits") {
                document.getElementById("flat_purchase").innerHTML = "<a href=\"" + 'Subscription Granny Flat.zip' + "\" download>Download Here</a>";}})
    }
}

        //CHECK STREAKS FUNCTION
function checkStreaks() {
    //console.log(loggedIn);
    if (loggedIn) {
    db.collection("users").doc(id).get().then(doc => {
    var previousDate = ((doc.data()["streaks"]["seconds"])*1000);
    var number_visited = doc.data()["number_visited"];
    //console.log(previousDate);
    previousDate = new Date(previousDate);
    console.log(previousDate);
    //console.log(new Date());
    var previousYear = previousDate.getFullYear();
    var previousMonth = previousDate.getMonth();
    var previousDay = previousDate.getDate();
    console.log("previous year" + previousYear);
    console.log("previous month" + previousMonth);
    console.log("previous day" + previousDay);
    var d = new Date();
    var e = d.setDate(d.getDate()-1);
    var f = new Date(e);
    console.log("f: " + f);
    var yesterdayYear = f.getFullYear();
    var yesterdayMonth = f.getMonth();
    var yesterdayDay = f.getDate();
    var Year =(new Date()).getFullYear();
    var Month = (new Date()).getMonth();
    var Day = (new Date()).getDate();
    console.log(yesterdayYear);
    console.log(yesterdayMonth);
    console.log(yesterdayDay);
    console.log("year" + Year);
    console.log("month" + Month);
    console.log("day" + Day);
    console.log(Year == previousYear);
    console.log(Month == previousMonth);
    console.log(Day == previousDay);
    if (yesterdayYear == previousYear && yesterdayMonth == previousMonth && yesterdayDay == previousDay) {
        console.log('added');
        db.collection("users").doc(id).update({
            number_visited: number_visited + 1,
            streaks: new Date()
    })}
    else if (Year == previousYear && Month == previousMonth && Day == previousDay) {
        console.log('nothing');
    }
    else {
        console.log("reset");
            var streaks = doc.data()["number_visited"];
            var current_points = doc.data()["points"];
            console.log(streaks);
        db.collection("users").doc(id).update({
            number_visited: 0,
            streaks: new Date(),
            points: (((streaks - 1)**2 + (streaks - 1)) / 4) + current_points
        })        }
    
    
    var num_streaks = doc.data()["number_visited"];
    var _bool = doc.data()["seven_streaks"];
    var _bool2 = doc.data()["fifty_streaks"];
    var _bool3 = doc.data()["year_streaks"];
    //console.log(num_streaks);
    //console.log(_bool);
    //console.log(_bool2);
    //console.log(_bool3);
    if ((num_streaks == 7) && (_bool == false)) {
        document.getElementById("a5").style.display = "block";
        function hide() {document.getElementById("a5").style.display = "none";}
        setTimeout(hide,8000);
        db.collection('users').doc(id).update({
        seven_streaks: true,
        points: doc.data()["points"] + 20 })
    }
    if ((num_streaks == 50) && (_bool2 == false)) {
        document.getElementById("a8").style.display = "block";
        function hide() {document.getElementById("a8").style.display = "none";}
        setTimeout(hide,8000);
        db.collection('users').doc(id).update({
        fifty_streaks: true,
        points: doc.data()["points"] + 600 })
    }
    if ((num_streaks == 365) && (_bool3 == false)) {
        document.getElementById("a9").style.display = "block";
        function hide() {document.getElementById("a9").style.display = "none";}
        setTimeout(hide,8000);
        db.collection('users').doc(id).update({
        year_streaks: true,
        points: doc.data()["points"] + 7000 })
    }
    var birthday = ((doc.data()["birthday"]["seconds"])*1000);
    var prevbirthday = (doc.data()["prevbirthday"]["seconds"])*1000;
    //console.log(birthday);
    //console.log(prevbirthday);
    prevbirthday = new Date(prevbirthday);
    birthday = new Date(birthday);
    var prevbirthdayYear = prevbirthday.getFullYear();
    var birthdayYear = birthday.getFullYear();
    var birthdayMonth = birthday.getMonth();
    var birthdayDay = birthday.getDate();
    if (birthdayYear !== Year && birthdayMonth == Month && birthdayDay == Day && prevbirthdayYear !== Year) {
        document.getElementById("a4").style.display = "block";
        function hide() {document.getElementById("a4").style.display = "none";}
        setTimeout(hide,8000);
        db.collection('users').doc(id).update({
        prevbirthday: new Date(),
        points: doc.data()["points"] + 50 })
    }
    })
    }
    else {
        console.log("not logged in");
    }
}

        //VISIBILITY FUNCTIONS
function toggleVisibilityLogin(host, element1){
    host.addEventListener("click", (e) => {e.preventDefault();
    //console.log(document.getElementById("username").style.visibility);
    //console.log(document.getElementById("password").style.visibility);
    //console.log(element1);
    //console.log(element1.visibility);
    if (document.getElementById("password").style.visibility == "visible") {
        //console.log("break 3");
        function vis2() {document.getElementById("username").style.visibility = "";document.getElementById("username").value="";}
        function vis21() {document.getElementById("password").style.visibility = "";document.getElementById("password").value="";}
        document.getElementById("incorrectusername").style.display = "none";
        document.getElementById("incorrectusername").style.visibility = "";
        document.getElementById("loginbutton").style.visibility = "";
        setTimeout(vis2,200);
        setTimeout(vis21,100);}
    else if (element1.style.visibility == "hidden") {
        function vis() {document.getElementById("password").style.visibility = "visible";}
        function vis11() {document.getElementById("loginbutton").style.visibility = "visible";}
        document.getElementById("username").style.visibility = "visible";
        setTimeout(vis,100);
        setTimeout(vis11,200);}
})}

function toggleVisibilitySignUp(host, element1){
    host.addEventListener("click", (e) => {e.preventDefault();
        //console.log("break1");
        //console.log(element1.style.visibility);
    if (host.innerHTML === "Logout.") {
        logout();}
    else if (document.getElementById("newPassword").style.visibility == "visible") {
        function vis() {document.getElementById("newPassword").style.visibility = "";
        document.getElementById("newPassword").value = "";}
        function vis2() {document.getElementById("newUsername").style.visibility = "";
        document.getElementById("newUsername").value = "";}
        function vis3() {document.getElementById("newName").style.visibility = "";
        document.getElementById("newName").value = "";}
        function vis7() {document.getElementById("confirmPassword").style.visibility = "";
        document.getElementById("confirmPassword").value = "";}
        document.getElementById("nonmatchingpasswords").style.visibility = "";
        document.getElementById("nonmatchingpasswords").style.display = "none";
        document.getElementById("signupbutton").style.visibility = "";
        setTimeout(vis7,100);
        setTimeout(vis,200);
        setTimeout(vis2,300);
        setTimeout(vis3,400);
        }
    else if (element1.style.visibility == "hidden") {
        //console.log("break 2");
        function vis4() {document.getElementById("newUsername").style.visibility = "visible";}
        function vis5() {document.getElementById("newPassword").style.visibility = "visible";}
        function vis6() {document.getElementById("confirmPassword").style.visibility = "visible";}
        function vis8() {document.getElementById("signupbutton").style.visibility = "visible";}
        document.getElementById("newName").style.visibility = "visible";
        setTimeout(vis4,100);
        setTimeout(vis5,200);
        setTimeout(vis6,300);
        setTimeout(vis8,400);
        }
})}


        //LOGOUT FUNCTIONS
function logout() {
    loggedIn = false;
    name = "";
    id = null;
    document.cookie = "name=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "loggedIn=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "identification=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (document.title === "Benjamin Tran | Projects | Member Benefits" ) {
        if (location == "file:///C:/Users/benja/OneDrive%20-%20Moreton%20Bay%20Colleges(1)/Coding/New%20Website/member_benefits.php") {location = "file:///C:/Users/benja/OneDrive%20-%20Moreton%20Bay%20Colleges(1)/Coding/New%20Website/index.php"}
        else if (location == "mbbcyear11.github.io/member_benefits.html") {
            location == "mbbcyear11.github.io/index.html";
        }
        }
    }

        //REVEAL POINTS
function revealPoints () {
        if (loggedIn) {
            db.collection('users').doc(id).get().then(doc => {
                var points =  doc.data()["points"];
                console.log("points: " + points);
                document.getElementById("points").innerHTML = points + "pts<div id='buy_more' style='font-size: 10pt'>Buy More (coming soon)</div>";
                var streaks = doc.data()["number_visited"];
                document.getElementById("streaks").innerHTML = streaks;
                document.getElementById("points").style.display = "block";
                document.getElementById("streaks").style.display = "block";
            });
        }
    }

        //PURCHASE FUNCTION
    function purchase(host, points_deducted, link) {
        db.collection('users').doc(id).get().then( doc => {
        if (points_deducted <= doc.data()["points"]) {
            if (confirm("This process is irreversible. Are you sure you want to continue?"))
            {document.getElementById(host).innerHTML = "<a href=\"" + link + "\" download>Download Here</a>";
            db.collection('users').doc(id).update({
                points: doc.data()["points"] - points_deducted,
                granny_flat_benefit: true,
            })}
    
            }
        })
        }

        //SCUM ACHIEVEMENT
        function scum() {
            if (loggedIn) {
                db.collection("users").doc(id).get().then(doc => {
                    document.getElementById("a10").style.display = "block";
                    function hide() {document.getElementById("a10").style.display = "none";}
                    setTimeout(hide,8000);
                    db.collection('users').doc(id).update({reuben: true});
                })
            }
            else {
                document.getElementById("a10").style.display = "block";
                    function hide() {document.getElementById("a10").style.display = "none";}
                    setTimeout(hide,8000);
                    setCookie("scum",true,1);
            }
        }


        //CHECK LOGIN FUNCTION
        function checkLogin() {
            var counter = 0;
            db.collection("users").get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    var localUsername = doc.data()["username"];
                    var localPassword = doc.data()["password"];
                    if ((localUsername == login.username.value) && (localPassword == login.password.value)) {
                        counter = 1;
                        loggedIn = true;
                        name = doc.data()["name"];
                        //console.log(doc.data().id);
                        document.getElementById("login").innerHTML = "Welcome, " + name + ".";
                        document.getElementById("signup").innerHTML = "Logout.";
                        //console.log(loginform.style.visibility);
                        document.getElementById("loginform").style.visibility = "hidden";
                        document.getElementById("incorrectusername").innerHTML = "";
                        document.getElementById("password").value = "";
                        document.getElementById("username").value = "";
    
                        function vis() {document.getElementById("newPassword").style.visibility = "";
                        document.getElementById("newPassword").value = "";}
                        function vis22() {document.getElementById("newUsername").style.visibility = "";
                        document.getElementById("newUsername").value = "";}
                        function vis3() {document.getElementById("newName").style.visibility = "";
                        document.getElementById("newName").value = "";}
                        function vis7() {document.getElementById("confirmPassword").style.visibility = "";
                        document.getElementById("confirmPassword").value = "";}
                        document.getElementById("nonmatchingpasswords").style.visibility = "";
                        document.getElementById("nonmatchingpasswords").style.display = "none";
                        document.getElementById("signupbutton").style.visibility = "";
                        setTimeout(vis7,100);
                        setTimeout(vis,200);
                        setTimeout(vis22,300);
                        setTimeout(vis3,400);
    
                        function vis2() {document.getElementById("username").style.visibility = "";document.getElementById("username").value="";}
                        function vis21() {document.getElementById("password").style.visibility = "";document.getElementById("password").value="";}
                        document.getElementById("incorrectusername").style.display = "none";
                        document.getElementById("incorrectusername").style.visibility = "";
                        document.getElementById("loginbutton").style.visibility = "";
                        setTimeout(vis2,200);
                        setTimeout(vis21,100);
    
                        id = doc.id;
                        //console.log(id);
                        setCookie("name",name,2);
                        setCookie("loggedIn", "true", 2);
                        setCookie("identification", id, 2);
                        checkStreaks();
                        revealPoints();
                        updatePurchases();
                        document.getElementById('member-benefits').style.display = "block";
                    }
                })
            }).then(incorrect);
            //console.log(counter);
                /*console.log("incorrect");*/ 
                function incorrect() {
                    if (counter === 0) {document.getElementById("incorrectusername").innerHTML = "Incorrect Username or Password";
                    document.getElementById("incorrectusername").style.display = "";
                    document.getElementById("password").value = "";
                }}
                //setTimeout(incorrect, 500);
        }
            //DOWNLOAD ACHIEVEMENT
    function countDownloads() {
        console.log("first");
        if (loggedIn) {
        var iterator = 0;
        var check;
        var points;
        db.collection('users').doc(id).get().then(doc => {
            check = doc.data()["five_downloads"];
            points = doc.data()["points"];
            if (doc.data()["granny_flat_benefit"] == true) {iterator ++;}
            followFunction();
        }).then(followFunction());
    function followFunction() {
        console.log('followFunction');
    if (iterator == 1 && check == false) {
        db.collection('users').doc(id).update({
            five_downloads: true,
            points: points + 20
        });
        document.getElementById("a6").style.display = "block";
        function hide() {document.getElementById("a6").style.display = "none";}
        setTimeout(hide,8000)
    }

    }}
    }