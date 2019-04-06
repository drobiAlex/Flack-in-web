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

@socketio.on("new_user")
def connect(user):
	if user not in users:
		abort(403)
	else:
		users.appent(user)

@app.route("/chats", methods=["GET"])
def chats():
	return render_template("chats.html")
