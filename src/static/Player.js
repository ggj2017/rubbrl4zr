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
