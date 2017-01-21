import json
import random
import string

from flask import Flask, render_template, request, redirect, url_for
app = Flask(__name__)

from game import Game
from player import Player

games = []

@app.route("/")
def hello():
    return render_template('welcome.html')

@app.route("/new")
def new_game():
    # Zufällige Game-ID erzeugen um andere Spieler per URL einladen zu können:
    game_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    games.append(Game(game_id))
    return redirect(url_for('join', game_id=game_id))

def get_game(id):
    for g in games:
        if g.id == id:
            return g
    return None

@app.route("/join/<game_id>")
def join(game_id):
    game = get_game(game_id)
    player_id = len(game.players) + 1
    game.players.append(Player(player_id))
    return redirect(url_for('lobby', game_id=game_id, player_id=player_id))

@app.route('/lobby/<game_id>/<int:player_id>')
def lobby(game_id, player_id):
    if not get_game(game_id):
        game = Game(game_id)
        games.append(game)
        game.players.append(Player(player_id))
    return render_template('join.html', game_id=game_id, player_id=player_id,
                            server_url=request.url_root)

@app.route("/players/<game_id>")
def players(game_id):
    game = get_game(game_id)
    players_json = []
    for player in game.players:
        players_json.append({
            'id': player.id,
            'name': player.name,
        })
    return json.dumps(players_json)

@app.route("/set_player_name/<game_id>/<int:player_id>", methods=['POST'])
def set_player_name(game_id, player_id):
    game = get_game(game_id)
    data = json.loads(request.data.decode('utf-8'))
    print([x.id for x in game.players])
    for player in game.players:
        if player.id == player_id:
            player.name = data['name']
            return "OK"
    return "player not found"

@app.route("/play/<game_id>/<int:player_id>/")
def play(game_id, player_id):
    if not get_game(game_id):
        # Zum Debuggen ein Spiel anlegen, wenn man z. B. den Server neugestartet hat:
        game = Game(game_id)
        games.append(game)
        game.players.append(Player(player_id))
    return app.send_static_file('index.html')

@app.route("/play/<game_id>/<int:player_id>/toggle_ready")
def toggle_ready(game_id, player_id):
    '''Gibt zurück, ob der Spieler nun ready ist'''
    game = get_game(game_id)
    player = game.get_player(player_id)
    player.ready = not player.ready
    return "true" if player.ready else "false"

if __name__ == "__main__":
    app.run(threaded=True)
