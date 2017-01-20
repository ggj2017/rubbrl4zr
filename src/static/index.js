

document.addEventListener("DOMContentLoaded", function(event) {
    addSliderInput();
    //drawSinus();
    drawPreview();
    drawGameSinus();
});

const addSliderInput = () => {
    document.getElementById("slider").addEventListener("change", function(e) {
        let val = e.target.value;
        document.getElementById("slider-value").value = val;
    });
};

const drawSinus = () => {
    var c = document.getElementById("preview");
    var ctx = c.getContext("2d");
    var i;
    for(i=0; i<360; i+= 20){
        ctx.moveTo(i+5,180);
        ctx.lineTo(i,180);

    }
    ctx.stroke();

    var counter = 0, x=0,y=180;


    //100 iterations
    var increase = 90/180*Math.PI / 9;
    for(i=0; i<=360; i+=10){

        ctx.moveTo(x,y);
        x = i;
        y =  180 - Math.sin(counter) * 120;
        counter += increase;

        ctx.lineTo(x,y);
        ctx.stroke();
        //alert( " x : " + x + " y : " + y + " increase : " + counter ) ;

    }
}



const drawPreview = ()=> {
    let height = 200;
    let width = 400;
    let xAxis = 0;
    let yAxis = Math.floor(width/4);
    let canvas = document.getElementById("preview");
    let preview = new PreviewSinus({canvas,height,width,xAxis,yAxis});


}

const drawGameSinus = ()=> {
    let height = 600;
    let width = 900;
    let xAxis = 0;
    let yAxis = Math.floor(width/4);
    let canvas = document.getElementById("game");
    let preview = new PreviewSinus({canvas,height,width,xAxis,yAxis});
}

var game = new Game(document.getElementById("game"), []);
game.addPlayer(new Player(42, "Carsten", new Renderable("img/ship-red.png", new Vector(100,100))))
game.run();