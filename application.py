import os
import datetime

from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from channels import Channel

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []
chatlist = []

@app.route("/")
def index():

	# Validate if user is in chat
	if "user_name" in session:
		return render_template("chats.html")

	return render_template("index.html")

#
@app.route("/username", methods=['GET', 'POST'])
def username():

	# Read new username
	if request.method == 'POST':

		name = request.form.get('input_name')

		# just for me
		print(f'User name: {name}')

		# Check if username already not exist
		if name in users:
			error = "The username is already exist."
			return render_template("error.html", error=error)

		#
		else:
			users.append(name)
			print(f"Here is a name: {name}")
			session['user_name'] = name
			return render_template("chats.html", chatlist=chatlist, username=session['user_name'])

	# Ensure that user logined in
	if request.method == 'GET' and 'user_name' not in session:
		error = 'Login first'
		return render_template("error.html", error=error)


@app.route("/chatroom/<int:chat_id>", methods=['POST', 'GET'])
def channel(chat_id):

	if request.method == 'POST':

		chatname = request.form.get('chat_name')

		print (f'Here is a chatname: {chatname}')


		# Ensure that chatname is uniqe
		if chatname in chatlist:
			error = 'Chatroom is already exist'
			return render_template('error.html', error=error)

		else:
			# Add new chatroom
			newchat = Channel(chatname)
			chatlist.append(newchat)
			print (f'Here is a chatlist: {chatlist}')

			# Dict of chatlist
			channelsFeed = []
			for object in chatlist:
				channelsFeed.append(object.name)
			return render_template("chats.html", chatlist=channelsFeed, username=session['user_name'])


	else:
		# Ensure if user logined in to let user in
		if 'user_name' not in session:
			error = 'First login'
			return render_template("error.html", error=error)

	session['chat_id'] = chat_id
	print(f'Chat id: {chat_id}')

	return render_template("chatroom.html", username=session['user_name'], chatid=chat_id)

@socketio.on("send message")
def message(data):

	message = data["message"]
	time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

	# Dictionary with saved messages


	emit("cast message", {**responce_dict, **{"chat_id": str(session["chat_id"])}}, broadcast=True)
