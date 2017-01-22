class Player {
    constructor(id, name, renderable,color) {
        this.id = id;
        this.name = name;
        this.renderable = renderable;
        this.color = color;
        this.radius = 30;
        this.centerX = renderable._pos.x + this.radius;
        this.centerY = renderable._pos.y + this.radius;
        this.collision = new Circle(this.centerX, this.centerY, this.radius);
        this.dead = false;
    }

    shoot(laser) {
        if (this.dead) {
            return;
        }
        this.laser = laser;
    }

    get_degree() {
        return this.renderable._degree;
    }

    set_degree(degree) {
        this.renderable._degree = parseInt(degree);
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

    /// Gibt false zurück, sobald er fertig mit der Simulation ist
    update() {
        if (this.laser) {
            if (!this.laser.update()) {
                this.laser = null;
            }
            return true;
        }
        return false;
    }

    render(ctx) {
        if (!this.dead) {
            this.renderable.render(ctx);
        }

        let pos = this._getNamePos();
        ctx.font = "16px forcedsquare";
        ctx.fillStyle = "white";
        ctx.fillText(this.name, pos.x, pos.y);

        if(this.dead) {
            let nameSize = ctx.measureText(this.name);
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.moveTo(pos.x, pos.y - 4);
            ctx.lineTo(pos.x + nameSize.width, pos.y -4);
            ctx.stroke();
        }

        //ctx.restore();
        if(this.laser) {
            this.laser.render(ctx);
        }
    }

    contains(point) {
        if (this.dead) {
            return false;
        }
        return this.collision.contains(point);
    }

    die() {
        // An unserer Position eine Explosion hinzufügen:
        _game.makeExplosion(new Vector(this.centerX - 96, this.centerY - 64));
        this.dead = true;
        if (this == _game.getOwnPlayer()) { // Wenn wir selber gestorben sind ...
            _game.sendStateToServer(); // ... dies dem Server mitteilen.
        }
    }
}
