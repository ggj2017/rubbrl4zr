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

        this.context = context;

        console.log(context);

        // Set styles for animated graphics
        this.context.strokeStyle = color;
        this.context.fillStyle = '#fff';
        context.lineWidth = 2;
        context.lineJoin = 'round';

        if(this.counter > this.lines.length) this.counter = 0;

       // this.context.save();

        // Draw the sine curve at time draw.t, as well as the circle.
        //this.context.save();
        this.context.beginPath();

        this.drawSine();

        this.context.stroke();
        //this.context.restore();

    }

    addLines() {
        const {yAxis,xAxis,width} = this.props;

        var direction = 1;
        let unit = 20;

        // Set the initial x and y, starting at 0,0 and translating to the origin on
        // the canvas.
        var x = 0;
        var y = Math.sin(x);


        this.status += 10;
        for(let status = 0; status < width ; status+=10) {

            // Loop to draw segments
            x = (status) / unit;

            y = Math.sin(x);
            this.lines.push({x: direction * status + xAxis, y: unit * y + yAxis});
        }

    }



    /**
     * Function to draw sine
     *
     * The sine curve is drawn in 10px segments starting at the origin.
     */
    drawSine () {
        const {yAxis,xAxis,width,height,degree,color} = this.props;
        let laserLength = 10;

        this.context.translate(width/2,height/2);
        this.context.rotate(degree*Math.PI/180);
        this.context.translate(-width/2,-height/2);



        this.context.strokeStyle = color;
        let num = 0;
        for(let line of this.lines) {
            if(this.counter >= num && this.counter <= num + laserLength) {

                this.context.lineTo(line.x, line.y);
                this.context.moveTo(xAxis+line.x, yAxis+line.y);
            }
            num ++;
        }
        this.counter++;
        //this.context.restore();
        this.context.rotate(360-degree*Math.PI/180);

    }


}
