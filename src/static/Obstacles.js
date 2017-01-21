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
        console.log(pos);
        this.collision = new Circle(pos.x + 75/2, pos.y + 75/2, 75/2);
    }

    render(ctx) {
        this.renderable._degree += 0.3;
        this.renderable.render(ctx);
    }
}


class Explosion {
    constructor(id, pos) {
        this.id = id
        this.renderable = new Renderable("/static/img/explosion.png", pos, 0, 6);
    }

    render(ctx) {
        this.renderable._currentFrame += 0.2;
        if(this.renderable._currentFrame >= 6) this.renderable._currentFrame = 0;
        this.renderable.render(ctx);
    }
}
