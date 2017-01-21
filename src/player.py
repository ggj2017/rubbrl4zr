class Player:
	def __init__(self, id):
		self.id = id
		self.name = "Spieler {}".format(id)
		self.ready = False

	def get_dict(self):
		return {
			"id" : self.id,
			"name" : self.name,
			"ready" : self.ready
		}
