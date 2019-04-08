class Channel ():

	def __init__(self, name):
		self.name = name
		self.messages = []

	def NewMessage(self, message, sender, channel, time):
		new_message = {'message': message, 'sender': sender, 'channel': channel, 'time': time}
		self.messages.append(new_message)
		while len(self.messages) >= 100:
			del (self.messages[0])
