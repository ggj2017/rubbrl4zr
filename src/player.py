class Player:
	def __init__(self, id):
		self.id = id
		self.name = "Player {}".format(id)
		self.ready = False
		self.in_sync = False
		self.angle = 140

	def get_dict(self):
		return {
			"id" : self.id,
			"name" : self.name,
			"ready" : self.ready,
			"angle" : self.angle,
		}
