class SinusLaser extends Renderable {


    constructor(props) {
        super();
        this.props = props;
        this.counter = 0;
        this.lines = [];
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

        const {width,degree} = this.props;

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

            this.lines.push({x: x  , y:  y });
        }
    }



    /**
     * Function to draw sine
     *
     * The sine curve is drawn in 10px segments starting at the origin.
     */
    drawSine (context) {
        const {yAxis,xAxis,width,height,degree,color} = this.props;
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
                     context.moveTo( line.x  + xAxis, yAxis + line.y);
                } else {
                    //context.lineTo( line.x,  line.y);
                    context.lineTo( line.x + xAxis, yAxis + line.y);
                    //console.log(line.x,line.y);
                }
            }
            num ++;
        }



        context.stroke();

        this.counter+= laserLength/20 ;

    }


}
