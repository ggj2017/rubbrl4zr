class Game {
    constructor(canvas) {
        window._game = this;
        canvas.width = 800;
        canvas.height = 600;
        _game._canvas = canvas;
        _game._ctx = canvas.getContext("2d");
        _game._players = [];
        canvas.id = "game";

        _game._ctx .save();

    }

    render() {
        if(_game._resourcesLoaded < _game._resouceCount) return;
        // _game._ctx.drawImage(...)
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for(var player of _game._players) {
            _game._ctx .save();
            player.render(this._ctx);
            this._ctx.restore();
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
        setTimeout(this._mainLoop,1);
    }


    // ----------------------------------------------------

    addPlayer(player) {
        _game._players.push(player);

        let xAxis = 0;
       // let yAxis = _game._canvas.height/2;
        let yAxis = 0;
        let degree = 45;
        let laser = new GameSinus({xAxis,yAxis,degree});
        player.shoot(laser);
    }

    // ----------------------------------------------------

    loopMusic(filePath) {
        _game.music = new Audio(filePath);
        _game.music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        _game.music.play();
    }

    stopMusic() {
        if(_game.music) {
            _game.music.stop();
            _game.music = null;
        }
        _game.music = new Audio(filePath);
        _game.music.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        _game.music.play();
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

    shoot(laser) {
        this.laser = laser;
    }


    render(ctx) {
        this.renderable.render(ctx);
        ctx.restore();
        if(this.laser) {
            this.laser.render(ctx);
        }
    }
}
