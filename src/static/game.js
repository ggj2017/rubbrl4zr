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

        canvas.addEventListener('contextmenu', function(evt) {
            evt.preventDefault();
            var pos = new Vector(evt.clientX - canvas.offsetLeft,
                                 evt.clientY - canvas.offsetTop);
            _game.makeExplosion(pos);
        });

        canvas.onclick = (e) => {
            e.preventDefault();

            this.addAsteroidToGame({
                player: this.getOwnPlayer(),
                pos: {
                    x: e.clientX - _game._canvas.offsetLeft,
                    y: e.clientY - _game._canvas.offsetTop
                },
                callback: (type) => {
                    console.log('failed');
                }
            });

        };

        lib.setInterval(this._garbageCollectExplosions, 5000);

        this.rdyBtn = document.getElementById("rdy-btn");
        this.rdyBtn.style.opacity = 1;

        this.createStartingObstacles({count: 5});

        this.rdyBtn.onclick = () => {
            var beep = new Audio("/static/snd/beep01.mp3");
            beep.play();
            this.sendStateToServer();
        };

        _game.poll();
    }

    addAsteroidToGame({player, callback, pos}) {

        let id = null;

        for(let obstac of this._obstacles) {

            if (obstac.playerId != this.getOwnPlayer().id && obstac.collision.contains(pos)) {
                return;
            }

            for (let player of this._players) {
                if (player.collision.contains(pos)) {
                    return;
                }
            }
        }

        if(player) {
            this._obstacles = this._obstacles.filter((o) => o.playerId != _game.getOwnPlayer().id);
            id = this.getOwnPlayer().id;
        }

        let asteroid = new Asteroid(42,
            new Vector(pos.x, pos.y), id);

        this._obstacles.push(asteroid);

        if(player) {
            this.getOwnPlayer().asteroid[0] = asteroid.collision.x;
            this.getOwnPlayer().asteroid[1] = asteroid.collision.y;
        }
    }

    sendStateToServer() {
        let r = new XMLHttpRequest();
        r.open("POST", "set_state", true);
        r.onreadystatechange = () => {
            if (r.readyState != 4 || r.status != 200) return;
            this.toggleReadyButton();
        };
        let player = _game.get_player(lib.playerId);
        r.send(JSON.stringify({
            "angle": player.get_degree(),
            "dead": player.dead,
            "frequency": player.frequency,
            "amplitude": player.amplitude,
            "asteroid": player.asteroid,
        }));
    }

    createStartingObstacles({count = 4, offsetX = 100, offsetY = 100}) {

        Math.seedrandom(lib.gameId);


        for(let i = 0; i < count; i++) {

            let existingOstacle;
            let x;
            let y;
            do {
                existingOstacle = false;

                x = Math.floor((Math.random() * (this._canvas.width - offsetX - offsetX + 1)) + offsetX);
                y = Math.floor((Math.random() * (this._canvas.height - offsetY - offsetY + 1)) + offsetY);

                for(let obstac of this._obstacles) {
                    if(obstac.collision.contains(x+75,y+75/2)) {
                        existingOstacle = true;
                        console.log(obstac);
                    }
                }
            } while (existingOstacle);

            this._obstacles.push(new Asteroid(42, new Vector(x,y)));
        }
    }

    _animateToggleButton() {
        let currentOpacity = parseFloat(this.rdyBtn.style.opacity);
        let dif = this.rdyBtnTargetOpacity - currentOpacity;
        if (dif > 0) {
            this.rdyBtn.style.opacity = currentOpacity + 0.05;
        } else {
            this.rdyBtn.style.opacity = currentOpacity - 0.05;
        }
        if (Math.abs(dif) > 0.1) {
            setTimeout(() => { this._animateToggleButton(); }, 40);
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

    toggleReadyButton() {
        let r = new XMLHttpRequest();
        r.open("GET", "toggle_ready", true);
        r.onreadystatechange = () => {
            if (r.readyState != 4 || r.status != 200) return;
            let s = this.rdyBtn.style;
            this.rdyBtnIsReady = (r.responseText === "true");
            this.animateReadyButton();
        }
        r.send();
    }

    animateReadyButton() {
        if (this.rdyBtnIsReady) {
            this.rdyBtnTargetOpacity = 0.2;
        } else {
            this.rdyBtnTargetOpacity = 1;
        }
        this._animateToggleButton();
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

        this._previewLaser.update();
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
        let canStop = true;
        for (let player of this._players) {
            if (player.update()) {
                canStop = false;
            }
        }
        if (canStop) {
            this.stopSimulation();
        }
    }

    poll() {
        let players_alive = 0;
        let winning_player = null;
        for (let player of this._players) {
            if (!player.dead) {
                players_alive += 1;
                winning_player = player;
            }
        }
        if (!this._simulating && this._players.length > 1 && players_alive <= 1) {
            let msg = "GAME OVER\n";
            if (winning_player) {
                msg += winning_player.name + " hat gewonnen!";
            } else {
                msg += "Unendschieden.";
            }
            alert(msg);
            return;
        }
        let r = new XMLHttpRequest();
        r.open("GET", "get_ready_states", true);
        r.onreadystatechange = () => {
            if (r.readyState != 4 || r.status != 200) return;
            let response = JSON.parse(r.response);
            let lamps = document.getElementsByClassName('playerlamp');
            let i = 0;
            let cnt_ready = 0;
            for (let player_ready of response) {
                let ready = (player_ready === "true");
                if (ready) {
                    lamps[i].classList.add('on');
                    ++cnt_ready;
                } else {
                    lamps[i].classList.remove('on');
                }
                ++i;
                if (i == lib.playerId) {
                    this.rdyBtnIsReady = ready;
                    this.animateReadyButton();
                }
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
                        let p = _game.get_player(player.id);
                        p.set_degree(player.angle);
                        p.frequency = player.frequency;
                        p.amplitude = player.amplitude;
                    }

                    _game.startSimulation();
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

        for (let i = 0; i < 10; ++i) { // Zum Entwickeln etwas beschleunigen
    	    _game.update(delta / 1000);
        }
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
                degree: 0,
                maxReflections: 0
            });
    }

    // ----------------------------------------------------

    addPlayer(playerName) {
        let playerId = _game._players.length+1;
        var player;
        switch(playerId) {
            case 1:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-red.png", new Vector(30, 30), 0),
                    "#FF0000");
                break;
            case 2:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-blue.png", new Vector(800 - 30 ,600 - 30),180),
                    "#0066FF");
                break;
            case 3:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-green.png", new Vector(800 - 30, 30), 90),
                    "#00FF00");
                break;
            case 4:
                player = new Player(playerId, playerName,
                    new Renderable("/static/img/ship-yellow.png", new Vector(30, 600 - 30),270),
                    "#FFFF00");
                break;
            default:
                throw "invalid player ID "+playerId + "(must be in [1..4])";
        }
        _game._players.push(player);
        _game._obstacles.pop();
    }

    createLaser(player) {

        let rad = ( player.renderable._degree + player.renderable._init_degree - 90 )*Math.PI / 180;
        let x =0;
        let y = player.radius + 11;
        let tempX = (Math.cos(rad) * x) + (-Math.sin(rad) * y);
        y = Math.sin(rad) * x + Math.cos(rad) * y;
        x = tempX;

        const laser = new SinusLaser({
            game: _game,
            height: _game._canvas.height,
            width: _game._canvas.width ,
            xAxis: player.renderable._center.x + x,
            yAxis: player.renderable._center.y + y,

            amplitude: player.amplitude,
            frequency: player.frequency,
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
