class Player:
	def __init__(self, id):
		self.id = id
		self.name = "Player {}".format(id)
		self._ready = False
		self.in_sync = False
		self.angle = 140
		self.dead = False

	def get_ready(self):
		if self.dead:
			return True
		return self._ready

	def set_ready(self, ready):
		self._ready = ready

	def get_dict(self):
		return {
			"id" : self.id,
			"name" : self.name,
			"ready" : self.get_ready(),
			"angle" : self.angle,
		}
