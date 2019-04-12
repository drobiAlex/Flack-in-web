import os
import datetime
import time

from flask import Flask, render_template, session, request, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from channels import Channel

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []
chatlist = []

@app.route("/", methods=['GET', 'POST'])
def index():

	if request.method == 'POST':

		if not request.form.get('username'):
			return render_template("error.html", error="No nickname")

		username = request.form.get('username')

		# Ensure that username isn't already exist
		if username in users:
			return render_template("error.html", error="Username is already exist")


		# Add new username
		else:
			users.append(username)
			session['user_name'] = username
			return render_template("chats.html", username=username)

	else:
		# Validate if user is in chat
		if "user_name" in session:
			return render_template("chats.html")

	return render_template("index.html")


@app.route("/chats", methods=['POST', 'GET'])
def chats():

		# If user want to create a new chat
		if request.method == 'POST':

			chatname = request.form.get('chatname')
			chatname = chatname.strip()

			for chats in chatlist:
				if chatname in chats.name:
					return jsonify({
									"responce": "Chat is already created"
									})

			# Create new channel class and append to existing one
			newchannel = Channel(chatname)
			chatlist.append(newchannel)

			chatls = []

			# Create a dictionary for every object so then can be tranformed easily into JSON objects
			for object in chatlist:
				chatls.append(object.__dict__)

			chatls.append({'true': 'true'})
			return jsonify(chatls)

		# If user promt for chatlist
		if request.method == 'GET':

			chatls = []
			for object in chatlist:
				chatls.append(object.__dict__)

			return jsonify(chatls)


@app.route("/chat", methods=['POST'])
def chat():

	chatname = request.form.get('chatname')
	print(f'Chatname is {chatname}')

	for chat in chatlist:
		if chatname in chat.name:
			return jsonify(chat.messages)




@socketio.on("new message")
def new_message(data):

	#Get new message
	message = data["new_message"]
	channel = data["channel"]
	time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
	sender = session["user_name"]

	package = {"message": message, "time":time, "sender": sender, 'channel': channel}

	for chat in chatlist:
		if channel == chat.name:
			chat.NewMessage(message, sender, channel, time)

	emit("broad message", package, broadcast=True)
