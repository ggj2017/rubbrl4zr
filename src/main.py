import json
import random
import string

from flask import Flask, render_template, request, redirect, url_for
app = Flask(__name__)

from game import Game

games = []

@app.route("/")
def hello():
    return "asdf"jahskfjhaksfd
    return render_template('welcome.html')

@app.route("/new")
def new_game():
    # Zufällige Game-ID erzeugen um andere Spieler per URL einladen zu können:
    game_id = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
    games = Game(game_id)
    return redirect(url_for('join', game_id=game_id))

@app.route("/join/<game_id>")
def join(game_id):
    return render_template('join.html', game_id=game_id, server_url=request.url_root)

@app.route("/test")
def test():
    return json.dumps({
        'schlüssel1': 123,
        'schlüssel2': 'irgend ein string',
    })

if __name__ == "__main__":
    app.run()
