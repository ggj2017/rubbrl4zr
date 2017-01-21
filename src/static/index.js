

document.addEventListener("DOMContentLoaded", function(event) {
    //drawSinus();
    drawPreview();
    //drawGameSinus();
});

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

let Player1 = new Player(42, "Carsten", new Renderable("img/ship-red.png", new Vector(0,0),45),"#FF0000");
let Player2 = new Player(43, "Ötchen", new Renderable("img/ship-blue.png", new Vector(700,0),135),"#00FF00");

var game = new Game(document.getElementById("game"), []);
game.addPlayer(Player1);
game.addPlayer(Player2);

game.run();
// game.loopMusic("snd/music01.mp3");
