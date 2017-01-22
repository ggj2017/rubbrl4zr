import json
import random
import string

from flask import Flask, render_template, request, redirect, url_for
app = Flask(__name__)

import sys
import os
sys.path.append(os.path.dirname(os.path.realpath(__file__)))

from game import Game
from player import Player

games = []

@app.route("/")
def hello():
    return app.send_static_file('index.html')

@app.route("/welcome/")
def welcome():
    return app.send_static_file('index.html')

@app.route("/new/")
def new_game():
    # Zufällige Game-ID erzeugen um andere Spieler per URL einladen zu können:
    game_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    g = Game(game_id)
    games.append(g)
    p = Player(1)
    g.add_player(p)
    return json.dumps({
        "gameId" : game_id,
        "joinLink" : request.url_root[:-1] + url_for('join', game_id=game_id),
        "playerId" : p.id,
        "playerName" : p.name
    })

def get_game(id):
    for g in games:
        if g.id == id:
            return g
    return None

@app.route("/player/<game_id>/<int:player_id>/")
def get_player(game_id, player_id):
    g = get_game(game_id)
    player = g.get_player(player_id)
    return json.dumps(player.get_dict() if player is not None else None)

@app.route("/game_info/<game_id>/")
def get_game_info(game_id):
    g = get_game(game_id)
    return json.dumps({
        "gameId" : game_id,
        "joinLink" : request.url_root[:-1] + url_for('join', game_id=game_id),
    })

@app.route("/join/<game_id>/")
def join(game_id):
    if "Slackbot-LinkExpanding" in request.headers.get('User-Agent'):
        return "Slack bot detected"
    game = get_game(game_id)
    if len(game.players) >= 4:
        player_id = 0
    else:
        player_id = len(game.players) + 1
        game.players.append(Player(player_id))
    return redirect(url_for('lobby', game_id=game_id, player_id=player_id))

@app.route('/lobby/<game_id>/<int:player_id>/')
def lobby(game_id, player_id):
    return app.send_static_file('index.html')

@app.route("/players/<game_id>/")
def players(game_id):
    game = get_game(game_id)
    players_json = []
    for player in game.players:
        players_json.append({
            'id': player.id,
            'name': player.name
        })
    return json.dumps({
        "players" : players_json,
        "gameIsStarted": game.is_started
    })

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

@app.route("/game/<game_id>/<int:player_id>/start/", methods=['POST'])
def start_game(game_id, player_id):
    if player_id != 1:
        return "{\"status\" : \"unauthorized\"}"
    game = get_game(game_id)
    if game is not None:
        game.is_started = True
    return "{\"status\" : \"ok\"}"

@app.route("/game/<game_id>/<int:player_id>/")
def game(game_id, player_id):
    if not get_game(game_id):
        # Zum Debuggen ein Spiel anlegen, wenn man z. B. den Server neugestartet hat:
        game = Game(game_id)
        games.append(game)
        for i in range(1, 3):
            game.players.append(Player(i))
    return app.send_static_file('index.html')

@app.route("/game/<game_id>/<int:player_id>/toggle_ready/")
def toggle_ready(game_id, player_id):
    '''Gibt zurück, ob der Spieler nun ready ist'''
    game = get_game(game_id)
    player = game.get_player(player_id)

    # Wenn alle Spieler ready sind, kann man sich nicht wieder auf not ready schalten!
    if not all([x.get_ready() for x in game.players]):
        player.set_ready(not player.get_ready())

    return "true" if player.get_ready() else "false"

@app.route("/game/<game_id>/<int:player_id>/get_ready_states")
def get_ready_states(game_id, player_id):
    '''Gibt zurück, welche Spieler ready sind'''
    game = get_game(game_id)
    player_states = []
    for player in game.players:
        player_states.append("true" if player.get_ready() else "false")
    return json.dumps(player_states)

@app.route("/game/<game_id>/<int:player_id>/get_state")
def get_state(game_id, player_id):
    game = get_game(game_id)
    json_players = []
    for player in game.players:
        json_players.append(player.get_dict())

    game.get_player(player_id).in_sync = True # Wir schicken ihm gerade State, also ist er synchron

    print("Spieler synchronisiert: ", end="")
    print([x.in_sync for x in game.players])

    # Sind alle spieler synchron? Dann neue Runde anfangen.
    if all([x.in_sync for x in game.players]):
        for player in game.players:
            player.set_ready(False)
            player.in_sync = False

    return json.dumps({
        "players": json_players,
    })

@app.route("/game/<game_id>/<int:player_id>/set_state", methods=['POST'])
def set_state(game_id, player_id):
    game = get_game(game_id)
    player = game.get_player(player_id)
    data = json.loads(request.data.decode('utf-8'))
    player.angle = data['angle']
    player.dead = data['dead']
    print("Spieler tot: ", end="")
    print([x.dead for x in game.players])
    return "OK"

if __name__ == "__main__":
    app.run(host= '0.0.0.0', threaded=False)
