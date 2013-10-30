var USER = localStorage.username;
var UID = localStorage.uid;

var fs = null; // filesystem

var wsUriTest = "ws://echo.websocket.org";
var wsuri = "ws://xsuii.meibu.net:8001/chat";
var origin = "http://xsuii.meibu.net";

var tbName = "h" + UID;
var dbName = "donsettle";
var talks;


/////////////////////// db test ////////////////////////////
/*
function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Query the database
//

function queryDB(tx) {
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Query the success callback
//

function querySuccess(tx, results) {
	var len = results.rows.length;
	console.log("DEMO table: " + len + " rows found.");
	for (var i = 0; i < len; i++) {
		console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
	}
}

// Transaction error callback
//

function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}

// Transaction success callback
//

function successCB() {
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(queryDB, errorCB);
}
*/

//////////////////////////////　File /////////////////////////////

function errorFile(e) {
	var msg = '';
	switch (e.code) {
		case FileError.NOT_FOUND_ERR:
			msg = 'NOT_FOUND_ERR';
			break;
		case FileError.SECURITY_ERR:
			msg = 'SECURITY_ERR';
			break;
		case FileError.ABORT_ERR:
			msg = 'ABORT_ERR';
			break;
		case FileError.NOT_READABLE_ERR:
			msg = 'NOT_READABLE_ERR';
			break;
		case FileError.ENCODING_ERR:
			msg = 'ENCODING_ERR';
			break;
		case FileError.NO_MODIFICATION_ALLOWED_ERR:
			msg = 'NO_MODIFICATION_ALLOWED_ERR';
			break;
		case FileError.INVALID_STATE_ERR:
			msg = 'INVALID_STATE_ERR';
			break;
		case FileError.SYNTAX_ERR:
			msg = 'SYNTAX_ERR';
			break;
		case FileError.INVALID_MODIFICATION_ERR:
			msg = 'INVALID_MODIFICATION_ERR';
			break;
		case FileError.QUOTA_EXCEEDED_ERR:
			msg = 'QUOTA_EXCEEDED_ERR';
			break;
		case FileError.TYPE_MISMATCH_ERR:
			msg = 'TYPE_MISMATCH_ERR';
			break;
		case FileError.PATH_EXISTS_ERR:
			msg = 'PATH_EXISTS_ERR';
			break;
	}
	console.log("Error : file :", msg);
	document.getElementById("chatError").innerHTML = 'Error: ' + msg;
}

function initFS() {
	console.log("init filesystem")
	window.requestFileSystem(LocalFileSystem.TEMPORARY, 1024 * 1024, function(filesystem) {
		fs = filesystem;
		console.log(fs.name);
	}, errorFile);
}

function upFile() {
	var f = document.getElementById("file");
	console.log("file upload fire :", f);
	var sendTo = document.getElementById("one").value;
	if (sendTo == null || sendTo == "") {
		document.getElementById("chatError").innerHTML = "Please fill up the one you send to";
		return;
	}
	var reader = new FileReader();
	var t = new Date();
	reader.onloadend = function(bytes) {
		fName = f.value.substring(f.value.lastIndexOf('\\') + 1);
		console.log("send file:", fName);
		doSend(JSON.stringify({
			"Addressee": sendTo,
			"Message": fName,
			"DateTime": t.toUTCString(),
			"Type": "FILE",
			"DstT": "S"
		}));
		console.log(bytes.target.result.toString());
		doSend(bytes.target.result);
	};
	reader.readAsText(f.files[0]);
}

////////////////////// database operate  ///////////////////////

function createTable(tx) {
	console.log("create table", tbName);
	tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tbName + '(talks)');
}

function addHistory(tx) {
	console.log("add history to :", tbName);
	tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tbName + '(talks)');
	tx.executeSql('INSERT INTO ' + tbName + ' VALUES("' + talks.Message + '")');
}

function showHistoryDB(tx) {
	console.log("check history");
	tx.executeSql('SELECT * FROM ' + tbName, [], showHistorySuccess, errorCB);
}

function clearHistoryDB(tx) {
	console.log("clear history");
	tx.executeSql('DROP TABLE IF EXISTS ' + tbName);
	tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tbName + '(talks)');
	document.getElementById("chatHistory").innerHTML = '';
}

function showHistorySuccess(tx, results) {
	var len = results.rows.length;
	var para = document.getElementById("chatHistory");
	if (len == 0) {
		para.innerHTML = "no history";
		return;
	}
	para.innerHTML = '';
	console.log(tbName + " table: " + len + " rows found.");
	for (var i = 0; i < len; i++) {
		console.log("Row = " + i + " history = " + results.rows.item(i).talks);
		var pre = document.createElement("p");
		pre.innerHTML = results.rows.item(i).talks;
		para.appendChild(pre);
		keepScrollButtom(para);
	}
}

function errorCB(err) {
	alert("Error processing SQL: " + err);
}

function successCB() {
	console.log("database excute success!")
}


function showHistory() {
	var db = window.openDatabase("donsettle", "1.0", "history store", 20000);
	db.transaction(showHistoryDB, errorCB);
}

function clearHistory() {
	var db = window.openDatabase("donsettle", "1.0", "history store", 20000);
	db.transaction(clearHistoryDB, errorCB);
}

//////////////////////// WebSocket //////////////////////////////

function onWebSocket() {
	//websocket = new plugins.WebSocket(wsUriTest);
	console.log("on websocket");
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
	document.getElementById("author").innerHTML = "Author:" + USER;
	document.getElementById("uid").innerHTML = "UID:" + UID;
	doSend(USER + "+" + UID); // send uid as identify
}

function onClose(evt) {
	console.log("DISCONNECTED");
}

function onMessage(evt) {
	talks = JSON.parse(evt);
	console.log("RESPONSE: ", evt);

	var para = document.getElementById("messageBox");
	var pre = document.createElement("p");
	pre.innerHTML = "[" + talks.DstT + "]" + talks.Author + ":" + talks.Message;

	if (talks.Type == "FILE" && talks.Author != "MASTER") {
		console.log("add file node")

		pre.style.fontStyle = "italic";
		pre.style.fontWeight = "bolder";
		pre.style.color = "#FF0087";
		pre.style.backgroundColor = "#D5D5D5"
		pre.style.padding = "5px";
		pre.setAttribute("author", talks.Author);
		pre.setAttribute("addressee", talks.Addressee);
		pre.setAttribute("filename", talks.Message);
		pre.setAttribute("datetime", talks.DateTime);
		pre.setAttribute("type", talks.Type);
		pre.setAttribute("dstt", talks.DstT);
		pre.onclick = function() { // send download file request
			console.log(this.getAttribute("filename"));
			var r = confirm("sure download?  " + this.getAttribute("filename"));
			if (r == true) {
				p = {
					"Author": this.getAttribute("author"),
					"Addressee": this.getAttribute("addressee"),
					"Message": this.getAttribute("filename"),
					"DateTime": this.getAttribute("dateTime"),
					"Type": this.getAttribute("type"),
					"DstT": this.getAttribute("dstt")
				};
				doSend(JSON.stringify(p))
			} else {
				return;
			}
		}
	} else if (talks.Type == "FILE" && talks.Author == "MASTER") { // recieve file
		file = JSON.parse(talks.Message)
		console.log(fs, "begin to recieve file", file.FileName);
		console.log("type of file :", typeof(file.Body))
		fs.root.getFile(file.FileName, {
			create: true
		}, function(fileEntry) {
		    console.log(fileEntry.fullPath);
			fileEntry.createWriter(function(fileWriter) {
				console.log("file_writer_test_s");
				fileWriter.onwriteend = function(e) {
					console.log("get file done");
				};

				fileWriter.onerror = function(e) {
					console.log("write error");
				};

                console.log("begin to write file.");
				/*var blob = new Blob([file.Body], {
					type: "text/plain"
				});
				fileWriter.write(blob);*/
				fileWriter.write(file.Body);
			}, errorFile);
		}, errorFile);
		console.log("file_writer_test_e");
		return;
	}

	para.appendChild(pre);
	keepScrollButtom(para);
	var db = window.openDatabase("donsettle", "1.0", "history store", 20000);
	db.transaction(addHistory, errorCB, successCB);
}

function onError(evt) {
	console.log('<span style="color: red;">ERROR: ' + evt + '</span>');
}

function doSend(message) {
	console.log("SENT: " + message);
	websocket.send(message);
}

function sendMessage() {
	var msg = document.getElementById("message").value;
	var one = document.getElementById("one").value;
	var group = document.getElementById("group").value;
	var t = new Date();
	var pack = {
		"Message": msg,
		"DateTime": t.toUTCString(),
		"Type": "MSG"
	};
	if (one) {
		var para = document.getElementById("messageBox");
		var pre = document.createElement("p");
		pre.innerHTML = "[S]" + USER + ":" + msg;
		para.appendChild(pre);
		keepScrollButtom(para);
		//msg = "S+" + one + "+" + msg; // single chat
		pack["DstT"] = "S";
		pack["Addressee"] = one;
	} else if (group) {
		//msg = "G+" + group + "+" + msg; // group chat
		pack["DstT"] = "G";
		pack["Addressee"] = group;
	} else {
		//msg = "B+" + msg; // broadcast chat
		pack["DstT"] = "B";
		pack["Addressee"] = "broadcast";
	}
	doSend(JSON.stringify(pack));
}

function chatError(err) {
	var para = document.getElementById("chatError");
	para.innerHTML = err;
}

function keepScrollButtom(node) {
	if (node.scrollHeight > node.clientHeight) {
		node.scrollTop = node.scrollHeight - node.clientHeight;
	}
}

function onDeviceReady() {
	if (window.requestFileSystem) {
		initFS();
	}
	console.log("device ready");
	onWebSocket();
}

document.addEventListener("deviceready", onDeviceReady, false);