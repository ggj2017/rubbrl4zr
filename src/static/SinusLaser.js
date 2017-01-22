class SinusLaser extends Renderable {


    constructor(props) {
        super();
        this.props = props;
        this.counter = 0;
        this.lines = [];
        this.reflec = 0;
        this.status = 1;
        this.insideObject = false;
        this.timeout = 0;
    }

    /// Gibt false zurück, wenn er gelöscht werden möchte
    update() {
        if (this.timeout > 10000) {
            return false;
        }
        this.timeout += 1;

        const {
            maxReflections = 9,
            collisionCallback,
            width,
            degree,
            xAxis,
            yAxis,
            height,
            amplitude = 30,
            frequency  = 30
        } = this.props;

        let rad = degree * Math.PI /180;
        let x = this.status;
        let y = Math.sin(x / frequency) * amplitude;

        let tempX = (Math.cos(rad) * x) + (-Math.sin(rad) * y);
        y = Math.sin(rad) * x + Math.cos(rad) * y;
        x = tempX;

        x = x + xAxis;
        y = y + yAxis;

        if(_game) {
            for (let obstac of _game._obstacles) {
                if (obstac.collision && obstac.collision.contains({x, y})) {
                    this.collidedObstacle = obstac;
                    return false;
                }
            }
            for (let player of _game._players) {
                if (player.contains({x, y})) {
                    player.die();
                }
            }
        }


        if(this.reflec < maxReflections+1) {

            if (this.edgeWidthReached(x)) {
                if (!this.insideObject) {
                    this.props.xAxis = x;
                    this.props.yAxis = y;
                    this.props.degree = 180 - degree;

                    this.reflec++;
                    this.status = 0;
                    this.insideObject = true;

                    return true;
                }
            } else if (this.edgeHeightReached(y)) {
                if (!this.insideObject) {
                    this.props.xAxis = x;
                    this.props.yAxis = y;
                    this.props.degree = 360 - degree;

                    this.reflec++;
                    this.status = 0;
                    this.insideObject = true;

                    return true;
                }
            } else {
                this.insideObject = false;
            }
        } else {
            return false;
        }

        this.lines.push({x: x  , y:  y });

        this.status += 1;
        return true;
    }

    render (context) {

        const {collisionCallback, color = '#00f', lineWidth = 2} = this.props;


        // Set styles for animated graphics
        context.strokeStyle = color;
        context.fillStyle = '#fff';
        context.lineWidth = lineWidth;
        context.lineJoin = 'round';

        if(this.counter > this.lines.length) {
            this.counter = 0;
            if(this.collidedObstacle && collisionCallback) {
                collisionCallback({
                    'laser': this,
                    'obstacle': this.collidedObstacle,
                });
            }
            this.collidedObstacle = null;
        }

        this.drawSine(context);
    }

    edgeWidthReached(x) {
        const {width} = this.props;

        if(x >= width || x <= 0) {
            return true;
        }
        return false;
    }

    edgeHeightReached(y) {
        const {height} = this.props;
        if (y >= height || y <= 0) {
            return true;
        }
        return false;
    }



    /**
     * Function to draw sine
     *
     * The sine curve is drawn in 10px segments starting at the origin.
     */
    drawSine (context) {
        const {color} = this.props;
        let laserLength = 200;


        context.strokeStyle = color;
        context.beginPath();


        let num = 0;
        for(let line of this.lines) {

            if ((this.counter >= num && this.counter <= num + laserLength) || true) {
                if(this.counter == num) {
                    //context.moveTo( line.x,  line.y);
                     context.moveTo( line.x  , line.y);
                } else {
                    //context.lineTo( line.x,  line.y);
                    context.lineTo( line.x , line.y);
                    //console.log(line.x,line.y);
                }
            }
            num ++;
        }



        context.stroke();

        this.counter+= laserLength/20 ;

    }
}
