class Game {
    constructor(element) {
        window._game = this;
        var canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        _game._canvas = canvas;
        _game._ctx = canvas.getContext("2d");
        _game._players = [];
        canvas.id = "game";
        console.log(canvas);

        element.replaceWith(canvas);
    }

    render() {
        if(_game._resourcesLoaded < _game._resouceCount) return;
        // _game._ctx.drawImage(...)
        for(var player of _game._players) {
            player.renderable.render(this._ctx);
        }
    }

    update() {
        // not yet needed
    }

    _mainLoop(){
        var now = Date.now();
    	var delta = now - _game._then;

    	_game.update(delta / 1000);
    	_game.render();
    	_game._then = now;

    	// Request to do _game again ASAP
    	requestAnimationFrame(_game._mainLoop);
    }

    run() {
        var w = window;
        requestAnimationFrame = w.requestAnimationFrame
                            || w.webkitRequestAnimationFrame
                            || w.msRequestAnimationFrame
                            || w.mozRequestAnimationFrame;

        _game._then = Date.now();
        this._mainLoop();
    }

    // ----------------------------------------------------

    addPlayer(player) {
        _game._players.push(player);
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Renderable {
    constructor(imgPath, pos){
        var self = this;
        self._pos = pos;
        self._loaded = false;
        self._img = new Image();
        self._img.onload = function() {
            self._loaded = true;
        }
        self._img.src = imgPath;
    }

    render(ctx) {
        if(!this._loaded) return;
        // console.log("rendering", this._img, this._pos)
        ctx.drawImage(this._img, this._pos.x, this._pos.y);
    }
}

class Player {
    constructor(id, name, renderable) {
        this.id = id;
        this.name = name;
        this.renderable = renderable;
    }
}
