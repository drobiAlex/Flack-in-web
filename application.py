import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = []

@app.route("/")
def index():
	return render_template("index.html")


@app.route("/chats", methods=["GET"])
def chats():
	return render_template("chats.html")

@app.route("/username", methods=["POST"])
def username():


	print("You are here!")

	name = request.form.get('new_name')
	print(f"Here is a name: {name}")

	return render_template("chats.html")


'''
// Add new user to the chat

// Open new request to get new posts.
/*const request = new XMLHttpRequest();
request.open('POST', '/posts');
request.onload = () => {
	const data = JSON.parse(request.responseText);
	data.forEach(add_post);*/'''
