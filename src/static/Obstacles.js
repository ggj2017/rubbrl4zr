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
    }

    render(ctx) {
        this.renderable._degree += 0.3;
        this.renderable.render(ctx);
    }
}
