class SinusLaser extends Renderable {


    constructor(props) {
        super();
        this.props = props;
        this.counter = 0;
        this.lines = [];
        this.reflec = 0;
        this.addLines();
    }

    /**
     * Draw animation function.
     *
     * This function draws one frame of the animation, waits 20ms, and then calls
     * itself again.
     */
    render (context) {

        const {color = '#00f'} = this.props;


        // Set styles for animated graphics
        context.strokeStyle = color;
        context.fillStyle = '#fff';
        context.lineWidth = 2;
        context.lineJoin = 'round';

        if(this.counter > this.lines.length) this.counter = 0;

        this.drawSine(context);
    }

    addLines() {

        const {width,degree,xAxis,yAxis} = this.props;



        let amplitude = 30;

        let rad = degree * Math.PI /180;
        let x = 0;
        let y = 0;

        for(let status = 0; status < width ; status++) {

            x = status ;
            y = Math.sin(x/amplitude) *amplitude;
            let tempX = (Math.cos(rad) * x) + (-Math.sin(rad) * y);
            y = Math.sin(rad) * x + Math.cos(rad) * y;
            x = tempX;

            x += xAxis;
            y += yAxis;

            if(this.edgeReached(x,y) && this.reflec < 3)
            {
                this.props.xAxis = x;
                this.props.yAxis = y;
                this.props.degree = 360-(2 * (90 - degree));
                this.reflec++;
                this.addLines();

                return;
            }

            this.lines.push({x: x  , y:  y });
        }
    }

    edgeReached(x,y) {
        const {width,height} = this.props;
        if(x >= width || x <= 0) {
            return true;
        }
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
        const {yAxis,xAxis,color} = this.props;
        let laserLength = 200;


        //context.translate( width/2, s +  height/2);
       // context.rotate(45*Math.PI/180);
      // context.translate( -width/2,-height/2);

        context.strokeStyle = color;
        context.beginPath();


        let num = 0;
        for(let line of this.lines) {

            if(this.counter >= num && this.counter <= num + laserLength) {
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
