"use strict";

class Renderable {
    constructor(imgPath, pos, degree){
        this._pos = pos;
        this._degree = degree;
        this._loaded = false;
        this._img = new Image();
        this._img.onload = () => {
            this._loaded = true;
        }
        if (imgPath) {
            this._img.src = imgPath;
        }
    }

    render(ctx) {
        if(!this._loaded) return;
        // console.log("rendering", this._img, this._pos)
        ctx.save();
        ctx.translate(this._pos.x + this._img.width / 2, this._pos.y + this._img.height / 2);
        ctx.rotate(this._degree * Math.PI / 180);
        ctx.drawImage(this._img, -this._img.width / 2, -this._img.height / 2);
        ctx.restore();
    }
}
