

class PreviewSinus {


    constructor(props) {
        this.props = props;
        this.status = 0;
        this.init();
    }

    /**
     * Init function.
     *
     * Initialize variables and begin the animation.
     */
    init () {

        const {width, height, canvas} = this.props;

        canvas.width = width;
        canvas.height = height;

        this.context = canvas.getContext("2d");
        this.context.font = '18px sans-serif';
        this.context.strokeStyle = '#000';
        this.context.lineJoin = 'round';

        this.context.save();
        this.draw();
    }


    /**
     * Draw animation function.
     *
     * This function draws one frame of the animation, waits 20ms, and then calls
     * itself again.
     */
    draw () {

        let context = this.context;
        console.log(this.props)
        const {width,height} = this.props;

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        // Draw the axes in their own path
        context.beginPath();
        context.stroke();

        // Set styles for animated graphics
        context.save();
        context.strokeStyle = '#00f';
        context.fillStyle = '#fff';
        context.lineWidth = 2;

        // Draw the sine curve at time draw.t, as well as the circle.
        context.beginPath();
        this.status = (this.status + 20);
        if(this.status > width) {
            this.status = 0;
        }
        this.drawSine(0,this.status);

        context.stroke();

        // Restore original styles
        context.restore();

        setTimeout(()=>{this.draw();}, 55);
    }


    /**
     * Function to draw sine
     *
     * The sine curve is drawn in 10px segments starting at the origin.
     */
    drawSine (t,max) {

        const {yAxis,xAxis} = this.props;
        let unit = 60;
        // Set the initial x and y, starting at 0,0 and translating to the origin on
        // the canvas.
        var x = 0;
        var y = Math.sin(x);
        this.context.moveTo(xAxis, unit*y+yAxis);

        // Loop to draw segments
        for (let i = 0; i <= max; i += 10) {
            x = (i)/unit;
            y = Math.sin(x);
            this.context.lineTo(i, unit*y+yAxis);
            this.context.stroke();

        }
    }


}
