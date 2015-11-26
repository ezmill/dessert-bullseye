function LineGrid(){
    this.canvas, this.ctx;
    this.lineWidth = 0.5;
    this.distX = 2.0;
    this.distY = 2.0;
    this.hue;
    this.init = function(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
    }
    this.bezierX = function(x1, y1, x2, y2, hue){
        this.ctx.beginPath();
        this.ctx.moveTo(x1/*+Math.cos(time/50)*this.canvas.width*/, y1);
        this.ctx.lineTo(x2/*-Math.sin(time/50)*this.canvas.width*/, y2);

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = hue;
        this.ctx.stroke();   
    }
    this.bezierY = function(x1, y1, x2, y2, hue){
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1/*-Math.cos(time/40)*this.canvas.height*/);
        this.ctx.lineTo(x2, y2/*+Math.sin(time/40)*this.canvas.height*/);
        this.ctx.lineWidth = this.lineWidth;        
        this.ctx.strokeStyle = hue;
        this.ctx.stroke();  
    }
    this.update = function(){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        var wy = this.canvas.width;
        var hy = 50;
        var wx = 50;
        var hx = this.canvas.height;
        var amp = 75;
        var distX = 3;
        var distY = 3;
        var alpha = 1.0;
          for(var j = -this.canvas.height; j < this.canvas.height*2; j+=this.distY){
            this.bezierY(0,j, this.canvas.width, j,  hslaColor(j*0.5, 100, 50, alpha));  
        }
        for(var i = -this.canvas.width; i < this.canvas.width*2; i+=this.distX){
            this.bezierX(i, 0, i, this.canvas.height, hslaColor(i*0.5, 100, 50, alpha));  

        }
    }
}