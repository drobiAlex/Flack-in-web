document.addEventListener("DOMContentLoaded", () => {

	// Set user to this chat
	/*let chat_id = {{ chatid }};
	localStorage.setItem('chat_id', chat_id);*/

	// Connect to web socket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure buttons
	socket.on('connect', () => {

		// Each button should emit a "submit vote" event
        document.querySelector('#send').onclick = () => {
                const message = document.querySelector('#exampleTextarea').value
				console.log('-----');
				console.log(message);
				console.log('-----');
                socket.emit('submit message', {'message': message});
				return false;
        };
    });

	socket.on("cast message", data => {

		if (1 === 1){

		console.log(data);
		//When message is sent

			// Add a message to the list
			const li = document.createElement('li');
			li.innerHTML = data.selection;
			console.log(li.innerHTML);

			document.querySelector('#message').append(li);

		}
	});
});
