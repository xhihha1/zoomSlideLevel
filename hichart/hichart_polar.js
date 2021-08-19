
hichart.prototype.defaultPolarOptions = function () {
    var polarOptions = {
        polar:{
            degreeStep: 30
        }
    }
    this.options = this.mergeDeep(polarOptions, this.options);
    return this;
}

hichart.prototype.plotPolarData = function (dataSet) {
    var context = this.context;
    var sections = this.options.sections;
    var xScale = this.xScale;
    var yScale = this.yScale;
    var series = this.options.series;
    var rect = this.rect;
    var context = this.context;
    var margin = this.options.margin;
    var centerX = rect.x + rect.width / 2;
    var centerY = rect.y + rect.height / 2;
    var radius = rect.width / 2 - 2 * margin;
    var Val_max = this.options.Val_max;
	var Val_min = this.options.Val_min;
    var stepSize = this.options.stepSize;
    var stickSize = this.options.stick.size;

    this.defaultPolarOptions();
    //context.fillRect(0,0, rect.width, rect.height);
    //******************
    // context.scale((1 / this.scaleX), (1 / this.scaleY));
    // context.translate(-1 * this.translateX, -1 * this.translateY);
    //******************

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
    context.lineWidth = 1;
    for(var i = 0;i< Math.floor( 360 / this.options.polar.degreeStep );i++){
        context.beginPath();
        var theta = this.options.polar.degreeStep * i / 360 * 2 * Math.PI;
        context.moveTo(centerX, centerY)
        context.lineTo(centerX + radius* Math.cos(theta), centerY + radius* Math.sin(theta));
        context.stroke();
        context.textAlign = "center";
        context.fillText(this.options.polar.degreeStep * i,centerX + (radius + stickSize*2)* Math.cos(theta), centerY + (radius + stickSize*2)* Math.sin(theta))

        if(i == 0){
            for(var j=0;j < Math.floor((Val_max - Val_min)/stepSize); j++){
                var r = radius / Math.floor((Val_max - Val_min)/stepSize) * j;
                context.beginPath();
                context.moveTo(centerX + r* Math.cos(theta), centerY + r* Math.sin(theta));
                context.lineTo(centerX + r* Math.cos(theta), centerY + r* Math.sin(theta) + stickSize)
                context.stroke();
                context.textBaseline = "top";
                var text = typeof(this.accAdd) == 'function'? this.accAdd(Val_min , this.accMul(stepSize , j)) : Val_min + stepSize * j;
                context.fillText(text, centerX + r* Math.cos(theta), centerY + r* Math.sin(theta) + stickSize*2);
            }
            context.textBaseline = "alphabetic";
        }
    }
    context.textAlign = "start";

    context.translate(centerX, centerY);
    for (var s = 0; s < series.length; s++) {
        var grd;
        if (series[s]['linearGradient']) {
            grd = context.createLinearGradient(0, radius, 0, -1*radius);
            for (g = 0; g < series[s]['linearGradient'].length; g++) {
                grd.addColorStop(series[s]['linearGradient'][g]['position'], series[s]['linearGradient'][g]['color']);
            }
        } else if (series[s]['color']) {
            grd = series[s]['color']
        } else {
            grd = this.options.colorList[s];
        }
        context.strokeStyle = grd;
        context.beginPath();
        for(var d = 0; d < series[s]['data'].length; d++){
            var r = (series[s]['data'][d][0] - Val_min) / (Val_max - Val_min) * radius;
            var the = series[s]['data'][d][1] / 360 * 2 * Math.PI;
            if (d == 0) {
                context.moveTo(r * Math.cos(the), r * Math.sin(the));
            } else {
                context.lineTo(r * Math.cos(the), r * Math.sin(the));
            }
        }
        context.stroke();
    }
    context.translate(-1*centerX, -1*centerY);
    //*********************
    // context.translate(this.translateX, this.translateY);
    // context.scale(this.scaleX, this.scaleY);
    //*********************
    return this;
}