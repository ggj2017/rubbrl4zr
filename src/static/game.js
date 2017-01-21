class Game {
    constructor(canvas, canvasPreview) {
        window._game = this;
        canvas.width = 800;
        canvas.height = 600;
        _game._canvas = canvas;
        _game._ctx = canvas.getContext("2d");
        _game._players = [];
        _game._obstacles = [];
        canvas.id = "game";
        _game._canvasPreview = canvasPreview;
        _game._previewLaser = this.createPreviewLaser(canvasPreview);

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

        for(var obstacle of _game._obstacles) {
            _game._ctx .save();
            obstacle.render(_game._ctx);
            _game._ctx.restore();
        }

        this.renderPreview();
    }

    renderPreview() {
        this.previewContext.clearRect(0, 0, this._canvasPreview.width, this._canvasPreview.height);
        this.previewContext.lineWidth = 5;
        this.previewContext.save();

        this._previewLaser.render(this.previewContext);
        this.previewContext.restore();
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
            for (let player_ready of response) {
                if (player_ready === "true") {
                    lamps[i].classList.add('on');
                } else {
                    lamps[i].classList.remove('on');
                }
                ++i;
            }
            for (; i < lamps.length; ++i) {
                // Alle übrigen Lampen ausblenden
                lamps[i].style['display'] = 'none';
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

    createPreviewLaser(canvas ,frequency = 30, amplitude = 30) {
        if(this._canvasPreview) {
            canvas = this._canvasPreview;
        }

        let height = canvas.height;
        let width = canvas.width;
        let xAxis = 0;
        let yAxis = height/2;
        this.previewContext = canvas.getContext("2d");
        return new SinusLaser({canvas,height,width,xAxis,yAxis, frequency,  amplitude, color: '#00FF00', degree: 0});
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

    scale(val) {
        this.x *=val;
        this.y *= val;
    }
}
