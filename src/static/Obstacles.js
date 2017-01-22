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
    constructor(id, pos) {
        super(id, new Renderable("/static/img/asteroid01.png", pos, 0));
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
