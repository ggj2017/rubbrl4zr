class GameSinus extends Renderable {


    constructor(props) {
        super();
        this.props = props;
        this.status = 0;
        this.lines = [];
    }

    /**
     * Draw animation function.
     *
     * This function draws one frame of the animation, waits 20ms, and then calls
     * itself again.
     */
    render (context) {


        const {width,height} = this.props;
        this.context = context;

        // Set styles for animated graphics
        context.strokeStyle = '#00f';
        context.fillStyle = '#fff';
        context.lineWidth = 2;
        context.lineJoin = 'round';


        context.save();

        // Draw the sine curve at time draw.t, as well as the circle.
        context.beginPath();

        this.drawSine();

        context.stroke();

    }


    /**
     * Function to draw sine
     *
     * The sine curve is drawn in 10px segments starting at the origin.
     */
    drawSine () {
        const {yAxis,xAxis,width,height,degree} = this.props;



        var direction = 1;
        
        this.context.translate(width/2,height/2);
        this.context.rotate(degree*Math.PI/180);
        this.context.translate(-width/2,-height/2);
        let unit = 60;
        // Set the initial x and y, starting at 0,0 and translating to the origin on
        // the canvas.
        var x = 0;
        var y = Math.sin(x);

        this.context.moveTo(xAxis, unit*y+yAxis);

        this.status = (this.status + 10);
        if(this.status > width) {
            this.status = 0;
        }

        // Loop to draw segments
        x = (this.status)/unit;

        y = Math.sin(x);
        this.lines.push({x:direction*this.status + xAxis,y:unit*y+yAxis});

        for(let line of this.lines) {
            this.context.lineTo(line.x, line.y);
        }
        this.context.stroke();
        this.context.restore();
    }


}
