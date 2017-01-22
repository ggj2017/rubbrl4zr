"use strict";

class Renderable {
    constructor(imgPath, center, init_degree, frameCount){
        this._center = center;
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
        ctx.save();
        ctx.translate(this._center.x,  this._center.y);
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
