import json

from flask import Flask, render_template
app = Flask(__name__)

from game import Game

games = []

@app.route("/")
def hello():
    return render_template('welcome.html')

@app.route("/test")
def test():
    return json.dumps({
        'schlüssel1': 123,
        'schlüssel2': 'irgend ein string',
    })

if __name__ == "__main__":
    app.run()
