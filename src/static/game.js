class Game {
    constructor(canvas) {
        window._game = this;
        canvas.width = 800;
        canvas.height = 600;
        _game._canvas = canvas;
        _game._ctx = canvas.getContext("2d");
        _game._players = [];
        canvas.id = "game";

        //_game._ctx .save();

        let rdyBtn = document.getElementById("rdy-btn");
        rdyBtn.onclick = function () {
            var beep = new Audio("/static/snd/beep01.mp3");
            beep.play();
            var r = new XMLHttpRequest();
            r.open("GET", "toggle_ready", true);
            r.onreadystatechange = function () {
                let img = 'img/ready-btn.png'
                if (r.responseText === "true") {
                   rdyBtn.style['opacity'] = 0.5;
                } else  {
                   rdyBtn.style['opacity'] = 1;
                }
            }
            r.send();
        }
    }

    render() {
        if(_game._resourcesLoaded < _game._resouceCount) return;
        // _game._ctx.drawImage(...)
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for(var player of _game._players) {
            _game._ctx .save();
            player.render(this._ctx);
            _game._ctx.restore();
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
        const laser = new SinusLaser({
            heigt: _game._canvas.height,
            width: _game._canvas.width ,
            xAxis:player.renderable._pos.x,
            yAxis:player.renderable._pos.y,
            degree: player.renderable._degree,
            color: player.color
        });
        player.shoot(laser);
        console.log(laser);
        console.log(player);
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
    constructor(imgPath, pos, degree){
        var self = this;
        self._pos = pos;
        self._degree = degree;
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
    constructor(id, name, renderable,color) {
        this.id = id;
        this.name = name;
        this.renderable = renderable;
        this.color = color;
    }

    shoot(laser) {
        this.laser = laser;
    }


    render(ctx) {
        this.renderable.render(ctx);
        //ctx.restore();
        if(this.laser) {
            this.laser.render(ctx);
        }
    }
}
