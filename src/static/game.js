class Game {
    constructor(canvas, canvasPreview) {
        window._game = this;
        canvas.width = 800;
        canvas.height = 600;
        _game._canvas = canvas;
        _game._ctx = canvas.getContext("2d");
        _game._players = [];
        canvas.id = "game";
        _game._canvasPreview = canvasPreview;
        _game._previewLaser = this.createPreviewLaser(canvasPreview);

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

        _game.poll();
    }

    render() {
        if(_game._resourcesLoaded < _game._resouceCount) return;
        // _game._ctx.drawImage(...)
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for(var player of _game._players) {
            _game._ctx .save();
            player.render(_game._ctx);
            _game._ctx.restore();
        }
        this.previewContext.clearRect(0, 0, this._canvasPreview.width, this._canvasPreview.height)
        this._previewLaser.render(this.previewContext);
    }

    update() {
        // not yet needed
    }

    poll() {
        let r = new XMLHttpRequest();
        r.open("GET", "get_ready_states", true);
        r.onreadystatechange = function () {
            if (r.readyState != 4 || r.status != 200) return;
            let response = JSON.parse(r.response);
            let lamps = document.getElementsByClassName('playerlamp');
            let i = 0;
            for (let player_ready of response['player_states']) {
                if (player_ready === "true") {
                    lamps[i].classList.add('on');
                } else {
                    lamps[i].classList.remove('on');
                }
                ++i;
            }
            // In zwei Sekunden nochmal pollen:
            setTimeout(function () {
                _game.poll()
            }, 2000);
        };
        r.send();
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
      //  setTimeout(this._mainLoop,1);
    }

    createPreviewLaser(canvas) {
        let height = canvas.height;
        let width = canvas.width;
        let xAxis = 0;
        let yAxis = height/2;
        this.previewContext = canvas.getContext("2d");
        return new SinusLaser({canvas,height,width,xAxis,yAxis, color: '#00FF00', degree: 0});
    }


    // ----------------------------------------------------

    addPlayer(player) {
        const laser = new SinusLaser({
            height: _game._canvas.height,
            width: _game._canvas.width ,
            xAxis:player.renderable._pos.x,
            yAxis:player.renderable._pos.y,
            degree: player.renderable._degree,
            color: player.color
        });
        player.shoot(laser);
        _game._players.push(player);

    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale(val) {
        this.x *=val;
        this.y *= val;
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
