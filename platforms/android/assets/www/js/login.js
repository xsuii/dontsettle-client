/*

    login

*/

var wsUriTest = "ws://echo.websocket.org"
var wsuri = "ws://xsuii.meibu.net:8001/login"
var origin = "http://xsuii.meibu.net"

    function init() {
        console.log("initial");
        onWebSocket();
    }

    function onWebSocket() {
        //websocket = new plugins.WebSocket(wsUriTest);
        console.log("connecting to : [ ws:" + wsuri + "] [ origin:" + origin + "]");
        websocket = new plugins.WebSocket(wsuri, "", origin);
        websocket.onopen = function(evt) {
            onOpen(evt)
        };
        websocket.onclose = function(evt) {
            onClose(evt)
        };
        websocket.onmessage = function(evt) {
            onMessage(evt)
        };
        websocket.onerror = function(evt) {
            onError(evt)
        };
    }

    function onOpen(evt) {
        console.log("CONNECTED");
    }

    function onClose(evt) {
        console.log("DISCONNECTED");
    }

    function onMessage(evt) {
        console.log("RESPONSE: " + evt);

        // if login success, recieve string "0"; otherwise recieve "uid+username" which will store later
        if (evt != "0") {
            localStorage.uid = evt;
            localStorage.username = user;
            window.location.assign("chat.html");
        } else {
            loginError("user name or userpassword error!");
        }
    }

    function onError(evt) {
        console.log("ERROR: " + evt);
    }

    function doSend(message) {
        console.log("SENT: " + message);
        websocket.send(message);
    }

    function sendLogin() {
        user = document.getElementById("username").value;
        var passwd = document.getElementById("password").value;
        //doSend(user + "+" + passwd);
        doSend(JSON.stringify({
            "Username": user,
            "Userpasswd": passwd
        }));
    }

    function loginError(err) {
        var para = document.getElementById("loginError");
        para.innerHTML = err;
    }

    function onDeviceReady() {
        init();
    }

document.addEventListener("deviceready", onDeviceReady, false);