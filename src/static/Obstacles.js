class Obstacle {
    constructor(id, renderable) {
        this.id = id;
        this.renderable = renderable;
    }

    render(ctx) {
        this.renderable._degree += 0.3;
        this.renderable.render(ctx);
    }
}

class Asteroid extends Obstacle {
    constructor(id, pos, playerId) {
        var path;

        switch(playerId) {
            case 1:
                path = "/static/img/asteroid-red.png";
                break;
            case 2:
                path = "/static/img/asteroid-blue.png";
                break;
            case 3:
                path = "/static/img/asteroid-green.png";
                break;
            case 4:
                path = "/static/img/asteroid-yellow.png";
                break;
            default:
                path = "/static/img/asteroid01.png";
        }
        super(id, new Renderable(path, pos, 0));

        this.playerId = playerId || 0;

        this.collision = new Circle(pos.x, pos.y, 75/2);
        this._rotationSpeed = Math.random()-0.5;
    }

    render(ctx) {
        this.renderable._degree += this._rotationSpeed;
        this.renderable.render(ctx);
    }
}


class Explosion {
    constructor(pos) {
        this.renderable = new Renderable("/static/img/explosion.png", pos, 0, 6);
        this.done = false;
    }

    render(ctx) {
        if(this.done) return;

        this.renderable._currentFrame += 0.2;
        if(this.renderable._currentFrame >= 6){
            this.done = true;
        }
        this.renderable.render(ctx);
    }
}
