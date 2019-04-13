<script id="newmes" type="text/x-handlebars-template">
<div class="contain" style="text-align: right">
	<div class="package rounded">
                {% raw -%}
				<div class="sender">{{ sender }}</div>
				<div class="main-text">{{ message }}</div>
				<div class="time text-muted">{{ time }}</div>
			{%- endraw %}

		</div>
</div>
</script>

<script id="in_message" type="text/x-handlebars-template">
<div class="contain" style="text-align: left">
	<div class="package-input rounded">
                {% raw -%}
				<div class="in_sender">{{ sender }}</div>
				<div class="in_main-text">{{ message }}</div>
				<div class="in_time text-muted">{{ time }}</div>
			{%- endraw %}

		</div>
</div>
</script>

<script>
	// Connect to web socket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure buttons
	socket.on('connect', () => {

			document.querySelector("#send").onclick = () => {
				const message = document.querySelector('#message').value;
				const channel = localStorage.getItem('channel');

				socket.emit('new message', {'new_message': message, 'channel': channel});
				document.querySelector('#message').value = "";
			};

			document.addEventListener("keypress", function(key) {
				const message = document.querySelector('#message').value;
					if ( key.keyCode == 13 && message != '') {
						const channel = localStorage.getItem('channel');
						socket.emit('new message', {'new_message': message, 'channel': channel});
						document.querySelector('#message').value = "";
					};
				});
			});

	socket.on('broad message', data => {

		// Add message
		addMessage(data);

	});

	document.addEventListener("DOMContentLoaded", () => {

		var nickname = "{{ username }}";
		localStorage.setItem('nickname', nickname);
		// Make a request to get messages for the first time
		const request = new XMLHttpRequest();
		request.open('GET', '/chats');
		request.send();

		request.onload = () =>{
			const data = JSON.parse(request.responseText);
			if (Object.keys(data).length > 0) {
				data.forEach(createChat)
			}
		};

		// Load the last chat
		if (localStorage.getItem('channel')) {

			const chatname = localStorage.getItem('channel');
			changeChat(chatname);
		}

		// Event listener for click on button
		document.addEventListener('click', event => {
			const element = event.target;
			if (element.id == 'chat_id'){

				const chatname = element.innerText;

				// Set a chatname to a localStorage in browser
				localStorage.setItem('channel', chatname);

				// Change an active element
				if (element.className != "list-group-item list-group-item-action active") {

					if (document.querySelector('div.active')) {
						var toChange = document.querySelector('div.active');
						toChange.className = "list-group-item list-group-item-action";
					};
					var add = element.className + " active";
					element.className = add;
				};
				changeChat(chatname);
			};
		});

		// By default, submit button is disabled
        document.querySelector('#Creat').disabled = true;

		// Enable button only if there is text in the input field
		document.querySelector('#chatname').onkeyup = () => {
			if (document.querySelector('#chatname').value.length > 0)
				document.querySelector('#Creat').disabled = false;
			else
				document.querySelector('#Creat').disabled = true;
		};

		// By default, submit button is disabled
        document.querySelector('#send').disabled = true;

		document.querySelector('#message').onkeyup = () => {
			if (document.querySelector('#message').value.length > 0)
				document.querySelector('#send').disabled = false;
			else
				document.querySelector('#send').disabled = true;
		};


});
	// Validate a chatname
		document.querySelector('#Creat').onclick = () => {

			let chatname = document.querySelector('#chatname').value;

			// Creat new request to the chats
			const request = new XMLHttpRequest();
		    request.open('POST', '/chats');

			// Add start and end points to request data.
		    const data = new FormData();
		    data.append('chatname', chatname);

			// Send request
			request.send(data);

			// Delete chatname from input form
			document.querySelector('#chatname').value = '';

			// Procced data
			request.onload = () => {
				console.log(request.responseText);
				const data = JSON.parse(request.responseText);
				if (Object.keys(data).length > 1) {
					createChat(data[(Object.keys(data).length) - 2]);
				}
				else {
					chatstatus(data);
				}
			};
		};

	// Add a new post with given responce to DOM.
	function chatstatus(resp) {

		console.log(resp);
		let responce = resp.responce;
		console.log(responce);
		// Alert that chat is already exist
		alert(responce);

	};

	function createChat(data) {

		console.log(data)
		const chat = document.createElement('div');
		chat.className = "list-group-item list-group-item-action";
		chat.innerHTML = data.name;
		chat.id = 'chat_id';

		// Add responce to DOM
		document.querySelector('#listofchats').append(chat);

		// Set localStorage to current chat
		localStorage.setItem('channel', data.name);

		changeChat(data.name);
	};

	function changeChat(data) {

		const request = new XMLHttpRequest();
		request.open("POST", "/chat");

		// Append data
		const chatdata = new FormData();
		chatdata.append('chatname', localStorage.getItem('channel'));

		request.send(chatdata);

		// Crear all old messages
		clearMessages();

		request.onload = () => {
			const data = JSON.parse(request.responseText);
            data.forEach(addMessage);
		}
	};

	function addMessage(data)	{

		// Check local storage to unsure that user in current chatroom
		if (localStorage.getItem('channel') == data.channel) {

			var message_template = null;
			if (localStorage.getItem('nickname') == data.sender) {

				// Add a new post with given contents to DOM.
				message_template = Handlebars.compile(document.querySelector('#newmes').innerHTML);
			}
			else
				// Add a new post with given contents to DOM.
				message_template = Handlebars.compile(document.querySelector('#in_message').innerHTML);

			// Create new post.
			const message = message_template({'message': data.message, 'time': data.time, 'sender': data.sender});

			// Add post to DOM.
			document.querySelector('#chatwindow').innerHTML += message;

			//
			$('#chatwindow').scrollTop(500000);
		};
	};

	function clearMessages() {
		document.querySelector('#chatwindow').innerHTML = "";
	};


</script>
