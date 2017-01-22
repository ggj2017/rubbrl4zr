"use strict";

class Renderable {
    constructor(imgPath, pos, init_degree, frameCount){
        this._pos = pos;
        this._init_degree = init_degree;
        this._degree = 45;
        this._loaded = false;
        this._frameCount = frameCount || 1;
        this._renderWidth = 0;
        this._currentFrame = 0.0;


        this._img = new Image();
        this._img.onload = () => {
            this._loaded = true;
            this._renderWidth = this._img.width/this._frameCount;
        }
        if (imgPath) {
            this._img.src = imgPath;
        }
    }

    render(ctx) {
        if(!this._loaded) return;

        //this._degree += +1;
        // console.log("rendering", this._img, this._pos)
        ctx.save();
        ctx.translate( this._pos.x + this._renderWidth / 2,  this._pos.y + this._img.height / 2);
        ctx.rotate(( 90 +  this._init_degree + this._degree) % 360 * Math.PI / 180); // 90 damit es mit dem laser übereinstimmt.
        //ctx.rotate((90+ this._init_degree + this._degree) * Math.PI / 180); // 90 damit es mit dem laser übereinstimmt.


        ctx.drawImage(this._img,
                        (Math.floor(this._currentFrame))*this._renderWidth, // sx
                        0,                                                  // sy
                        this._renderWidth, this._img.height,                // swidth, sheight
                        -this._renderWidth / 2  ,  -this._img.height / 2,
                        this._renderWidth, this._img.height); // clipped

        ctx.restore();
    }
}
