function Target(){
    this.canvas, this.ctx;
    this.lineWidth = 0.5;
    this.hue = Math.random()*360;
    this.offset = 100;
    this.saturation = 100;
    this.lightness = 50;
    this.alpha = 1.0;
    this.colors = [];
    this.init = function(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        // this.ctx.fillStyle = "white";
        // this.sampleColors();
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // for(var i = 0; i < this.canvas.width; i++){
            // this.drawCircle(i*2, this.centerX, this.centerY);
        // }
    }
    this.drawCircle = function(radius, x, y){
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      this.ctx.lineWidth = this.lineWidth;

      this.gradient = this.ctx.createLinearGradient(0,0,0,this.canvas.height);
      this.gradient.addColorStop(0, this.colors[0]);
      this.gradient.addColorStop(1, this.colors[1]);

      this.ctx.strokeStyle = this.gradient;
      // this.ctx.strokeStyle = hslaColor(radius/3, 100, 50, this.alpha);
      // this.ctx.strokeStyle = 'rgba(' + Math.random()*255 + ',' + Math.random()*255 + ',' + Math.random()*255 + ',1.0);';
      this.ctx.stroke();
    }
    this.update = function(){
        this.hue += 0.5;
        this.sampleColors();
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for(var i = 0; i < this.canvas.width; i++){
            this.drawCircle(i*2, this.centerX, this.centerY);
        }
    }
    this.sampleColors = function(){
        this.colors[0] = hslaColor(this.hue, this.saturation, this.lightness, this.alpha)
        this.colors[1] = hslaColor(this.hue + this.offset, this.saturation, this.lightness, this.alpha)
    }
}