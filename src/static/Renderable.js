class Renderable {
    constructor(imgPath, pos, degree){
        var self = this;
        self._pos = pos;
        self._degree = degree;
        self._loaded = false;
        self._img = new Image();
        self._img.onload = function() {
            self._loaded = true;
        }
        self._img.src = imgPath;
    }

    render(ctx) {
        if(!this._loaded) return;
        // console.log("rendering", this._img, this._pos)
        ctx.drawImage(this._img, this._pos.x, this._pos.y);
    }
}
