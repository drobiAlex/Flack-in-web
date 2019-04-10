<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.11/handlebars.min.js"></script>

<script id="newmes" type="text/x-handlebars-template">
            <div class="package">
                {% raw -%}
                    {{ message }}
                {%- endraw %}
            </div>
</script>

<script>
	// Connect to web socket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure buttons
	socket.on('connect', () => {

			document.querySelector("#send").onclick = () => {
				const message = document.querySelector('#message').value;
				socket.emit('new message', {'new_message': message});

			}
		});

	socket.on('broad message', data => {

			console.log(data.message);
			console.log(data.time);
			console.log(data.sender);

			// Add a new post with given contents to DOM.
            const message_template = Handlebars.compile(document.querySelector('#newmes').innerHTML);
            function add_message(data) {

            // Create new post.
            const message = post_template({'message': data.message, 'time': data.time, 'sender': data.sender});

			// Add post to DOM.
            document.querySelector('#listofchats').innerHTML += message;
		};
	});

	document.addEventListener("DOMContentLoaded", () => {

		const request = new XMLHttpRequest();
		request.open('GET', '/chats');
		request.send();

		request.onload = () =>{
			const data = JSON.parse(request.responseText);
			if (Object.keys(data).length > 0) {
				data.forEach(createChat)
			}
		};

		// Event listener for click on button
		document.addEventListener('click', event => {
			const element = event.target;
			if (element.id == 'chat_id'){

				const chatname = element.innerText;

				// Make a new request to get chat messages
				const request = new XMLHttpRequest ();
				request.open("POST", "/chat");

				// Append data
				const data = new FormData();
				data.append('chatname', chatname);

				request.send(data);

				// Read data
				request.onload = () => {
					const data = JSON.parse(request.responseText);
					console.log(data);
				}
			}
		});

});


	// Validate a chatname
	function validation() {

		let chatname = document.querySelector('#chatname').value;

		console.log(chatname)

		const request = new XMLHttpRequest();
	    request.open('POST', '/chats');

		// Add start and end points to request data.
	    const data = new FormData();
	    data.append('chatname', chatname);

		// Send request
		request.send(data);

		request.onload = () => {
			console.log(request.responseText);
			const data = JSON.parse(request.responseText);
			if (Object.keys(data).length > 1) {
				createChat(data[(Object.keys(data).length) - 2]);
			}
			else {
				chatstatus(data.responce);
			}
		};
	};

	// Add a new post with given responce to DOM.
	function chatstatus(resp) {

		console.log('-------')
		// Create new element
		const responce = document.createElement('div');
		responce.className = 'responce';
		responce.innerHTML = resp;

		// Add responce to DOM
		document.querySelector('#chatvalid').append(responce)

	};

	function createChat(data) {

		console.log(data)
		const chat = document.createElement('div');
		chat.className = "list-group-item list-group-item-action";
		chat.innerHTML = data.name;
		chat.onclick = changeChat(data.name);
		chat.id = 'chat_id';

		// Add responce to DOM
		document.querySelector('#chatwindow').append(chat)

	};

	function changeChat(data) {
		console.log(data)
	};

</script>
