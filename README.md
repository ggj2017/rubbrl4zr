## rubbrl4zr

A Global Game Jam 2017 game.

### Story

The superior scientists from the MFT-705 galaxy have invented a new type of laser beams: Rubber lasers, which don't emit the light linearly, but in sine waves.Although this kind of technology was originally developed for civil use, an intergalactic military organization adopted it for their warfare due to the devastating power of rubber lasers.However, the unpredictable nature of this technology requires hard trainings for starship crews in order to be ready for combat.

### Installation guide

#### Starting a server

The server is written in *Python* using the *Flask* web framework.
In order to run the server, you need an installation of Python 3 and you
have to have the flask library installed.

##### Linux

If you have a debian-like Linux system, it is likely that you already have
Python 3 installed. For installing flask use ``sudo pip3 install flask``.

For starting the server, open a terminal and navigate to the ``src`` directory.
type ``python3 main.py``. The HTTP server will start listening on port *5000*.

##### Windows

If you don't already have Python installed, you should get it at
[python.org](https://www.python.org/) (get version 3.4 or higher).
Python ships with *pip*, the Python package manager. In order to install
the Flask framework, open a terminal, type ``pip install flask`` and
hit enter.

For starting the server, open a terminal and navigate to the ``src`` directory.
type ``python main.py``. The HTTP server will start listening on port *5000*.

#### Joining a game as a client

In order to play the game, you need a web browser that supports the ECMA 6
standard for Javascript and the HTML5 canvas element.
The game is tested with recent versions of Firefox and Chromium.
