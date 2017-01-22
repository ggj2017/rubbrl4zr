class Game {
    constructor(canvas, canvasPreview) {
        window._game = this;
        canvas.width = 800;
        canvas.height = 600;
        this._canvas = canvas;
        this._ctx = canvas.getContext("2d");
        this._players = [];
        this._obstacles = [];
        this._explosions = [];
        this._removeExplosions = []; // the indices of explosions that are done
        this._simulating = false;
        canvas.id = "game";
        this._canvasPreview = canvasPreview;
        this._previewLaser = this.createPreviewLaser(canvasPreview);

        canvas.onclick = function(evt) {
            var pos = new Vector(evt.clientX - canvas.offsetLeft - 64,
                                evt.clientY - canvas.offsetTop - 64);
            _game.makeExplosion(pos);
        }

        lib.setInterval(this._garbageCollectExplosions, 5000);

        this.rdyBtn = document.getElementById("rdy-btn");
        this.rdyBtn.style.opacity = 1;
        this.rdyBtn.onclick = () => {
            var beep = new Audio("/static/snd/beep01.mp3");
            beep.play();
            let r = new XMLHttpRequest();
            r.open("POST", "set_state", true);
            r.onreadystatechange = () => {
                if (r.readyState != 4 || r.status != 200) return;
                // Jetzt dem Server mitteilen, dass wir Ready sind
                let r2 = new XMLHttpRequest();
                r2.open("GET", "toggle_ready", true);
                r2.onreadystatechange = () => {
                    if (r2.readyState != 4 || r2.status != 200) return;
                    let img = 'img/ready-btn.png'
                    this.setReadyButtonToggled(r2.responseText === "true");
                }
                r2.send();
            };
            let player = _game.get_player(lib.playerId);
            r.send(JSON.stringify({
                "angle": player.get_degree(),
            }));
        }

        _game.poll();
        _game.startSimulation();
    }

    animateToggleButton() {
        let currentOpacity = parseFloat(this.rdyBtn.style.opacity);
        let dif = this.rdyBtnTargetOpacity - currentOpacity;
        if (dif > 0) {
            this.rdyBtn.style.opacity = currentOpacity + 0.05;
        } else {
            this.rdyBtn.style.opacity = currentOpacity - 0.05;
        }
        if (Math.abs(dif) > 0.1) {
            setTimeout(() => { this.animateToggleButton(); }, 40);
        }
    }

    _garbageCollectExplosions() {
        var activeExplosions = [];
        var explosions = _game._explosions;
        for(var explosion of explosions) {
            if(!explosion.done){
                activeExplosions.push(explosion);
            }
        }
        _game._explosions = activeExplosions;
    }

    setReadyButtonToggled(toggled) {
        let s = this.rdyBtn.style;
        if (toggled) {
            this.rdyBtnTargetOpacity = 0.2;
        } else {
            this.rdyBtnTargetOpacity = 1;
        }
        this.animateToggleButton();
    }

    makeExplosion(pos){
        lib.playSound("/static/snd/explosion.mp3");
        _game._explosions.push(new Explosion(pos));
    }

    get_player(id) {
        // TODO: Wenn man Spieler in der Lobby kicken können soll, könnte man hier dann stattdessen
        //       die Spieler durchgehen und den mit der richtigen ID raussuchen.
        return this._players[id - 1];
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

        var explosions = _game._explosions;
        for(var explosion of explosions) {
            _game._ctx .save();
            explosion.render(_game._ctx);
            _game._ctx.restore();
        }

        this.renderPreview();
    }

    renderPreview() {
        this.previewContext.clearRect(0, 0, this._canvasPreview.width, this._canvasPreview.height);
        this.previewContext.lineWidth = 5;
        //this.previewContext.save();

        this._previewLaser.render(this.previewContext);
        //this.previewContext.restore();
    }

    startSimulation() {
        for (let player of this._players) {
            this.createLaser(player);
        }
        this._simulating = true;
    }

    stopSimulation() {
        this._simulating = false;
    }

    update() {
        if (!this._simulating) {
            return;
        }

        let toDelete = [];
        for (let player of this._players) {
            player.update();
        }
    }

    poll() {
        let r = new XMLHttpRequest();
        r.open("GET", "get_ready_states", true);
        r.onreadystatechange = () => {
            if (r.readyState != 4 || r.status != 200) return;
            let response = JSON.parse(r.response);
            let lamps = document.getElementsByClassName('playerlamp');
            let i = 0;
            let cnt_ready = 0;
            for (let player_ready of response) {
                if (player_ready === "true") {
                    lamps[i].classList.add('on');
                    ++cnt_ready;
                } else {
                    lamps[i].classList.remove('on');
                }
                ++i;
            }
            let number_of_players = i; // FIXME: Über lib stattedessen
            for (; i < lamps.length; ++i) {
                // Alle übrigen Lampen ausblenden
                lamps[i].style['display'] = 'none';
            }
            if (cnt_ready == number_of_players) { // Alle Spieler sind bereit
                let r = new XMLHttpRequest();
                r.open("GET", "get_state", true);
                r.onreadystatechange = () => {
                    if (r.readyState != 4 || r.status != 200) return;
                    let response = JSON.parse(r.response);
                    for (let player of response["players"]) {
                        _game.get_player(player.id).set_degree(player.angle);
                    }

                    _game.startSimulation();

                    // Eine neue Runde beginnt, der Ready-Button sollte wieder deaktiviert werden:
                    this.setReadyButtonToggled(false);
                };
                r.send();
            }
            // In zwei Sekunden nochmal pollen:
            setTimeout(() => { _game.poll() }, 2000);
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

    onObstacleCollision({obstacle}) {
        _game._obstacles = _game._obstacles.filter(ob => { return ob.id != obstacle.id});
        _game.makeExplosion(obstacle.renderable._pos);
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
        return new SinusLaser(
            {
                game: this,
                canvas,
                height,
                width,
                xAxis,
                yAxis,
                lineWidth: 4,
                frequency,
                amplitude,
                color: '#00FF00',
                degree: 0
            });
    }

    // ----------------------------------------------------

    addPlayer(playerName) {
        let playerId = _game._players.length+1;
        var player;
        switch(playerId) {
            case 1:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-red.png", new Vector(20 ,0 ),0),
                    "#FF0000");
                break;
            case 2:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-blue.png", new Vector(800 - 50,0),90),
                    "#0066FF");
                break;
            case 3:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-green.png", new Vector(800 -50 ,600 -70),180),
                    "#00FF00");
                break;
            case 4:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-yellow.png", new Vector(20 ,600 -70),270),
                    "#FFFF00");
                break;
            default:
                throw "invalid player ID "+playerId + "(must be in [1..4])";
        }
        _game._players.push(player);
    }

    createLaser(player, fre = 30 , amp = 30) {

        let rad = ( player.renderable._degree + player.renderable._init_degree - 90 )*Math.PI / 180;
        let x =0;
        let y = 64
        let tempX = (Math.cos(rad) * x) + (-Math.sin(rad) * y);
        y = Math.sin(rad) * x + Math.cos(rad) * y;
        x = tempX;




        const laser = new SinusLaser({
            game: _game,
            height: _game._canvas.height,
            width: _game._canvas.width ,
            xAxis:player.renderable._pos.x + x ,
            yAxis:player.renderable._pos.y + y,

            amplitude: amp,
            frequency: fre,
            degree: player.renderable._degree + player.renderable._init_degree,
            color: player.color,
            collisionCallback: this.onObstacleCollision,
        });
        player.shoot(laser);
    }

    getOwnPlayer() {
        return this.get_player(lib.playerId);
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
