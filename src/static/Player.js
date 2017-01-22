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

    get_degree() {
        return this.renderable._degree;
    }

    set_degree(degree) {
        this.renderable._degree = degree;
        console.log(this.renderable._degree );
    }

    _getNamePos(){
        let cw = _game._canvas.width/2;
        let ch = _game._canvas.height/2;

        let w = this.renderable._renderWidth;
        let h = this.renderable._img.height;

        var pos = new Vector();
        if(this.renderable._pos.x < cw)
        {
            pos.x = this.renderable._pos.x + w;
        }
        else{
            pos.x = this.renderable._pos.x - w;
        }

        if(this.renderable._pos.y < ch)
        {
            pos.y = this.renderable._pos.y + h;
        }
        else{
            pos.y = this.renderable._pos.y;
        }
        return pos;
    }

    update() {
        if (!this.laser.update()) {
            this.laser = null;
        }
    }

    render(ctx) {
        this.renderable.render(ctx);

        let pos = this._getNamePos();
        ctx.font = "16px forcedsquare";
        ctx.fillStyle = "white";
        ctx.fillText(this.name, pos.x, pos.y);

        //ctx.restore();
        if(this.laser) {
            this.laser.render(ctx);
        }
    }
}
