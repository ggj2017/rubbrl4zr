class Game:
    def __init__(self, id):
        self.id = id
        self.players = []

    def get_player(self, id):
        for player in self.players:
            if player.id == id:
                return player
        return None


    def add_player(self, player):
        self.players.append(player)
