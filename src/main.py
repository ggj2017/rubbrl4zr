import json

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/test")
def test():
    return json.dumps({
        'schlüssel1': 123,
        'schlüssel2': 'irgend ein string',
    })

if __name__ == "__main__":
    app.run()
