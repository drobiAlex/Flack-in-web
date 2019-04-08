document.addEventListener('DOMContentLoaded', () => {

	// Ensure if user has a nickname
	if (localStorage.getItem('myNickname') == null){


		document.querySelector('#new-name').onsubmit = () => {

			// Create a new variable with nickname from form
			const new_name = document.querySelector('#input_name').value;

			// Open new request to get new posts.
            const request = new XMLHttpRequest();
            request.open('POST', '/user');
            request.onload = () => {
                const data = JSON.parse(request.responseText);
                data.forEach(add_post);
            };

			// Print output to the log
			console.log('------');
			console.log(new_name);
			console.log('------');

			document.querySelector('#name').innerHTML = new_name;
			// Save nickname in browser
			localStorage.setItem('myNickname', new_name);

			// Remove nickname form
			/*document.querySelector('#new-name').remove();
			setTimeout(function () {

			// Will redirect to your blog page (an ex: blog.html)
	        window.location.href = "chats";

			// Will call the function after 2 secs.
		}, 2000);*/

			return false;
		}
	}

	// Set user nickname
	else {

		//
		document.querySelector('#name').innerHTML = localStorage.getItem('myNickname');
		// Remove nickname form
		document.querySelector('#new-name').remove();
		setTimeout(function () {
		// Will redirect to your blog page (an ex: blog.html)
        window.location.href = "chats";

		// Will call the function after 2 secs.
	}, 3000);

		return false;
	}

});

function clr() {

	localStorage.clear();
	document.location.reload()
}
