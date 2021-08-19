hichart.prototype.defaultBasicPieOptions = function () {
    var pieOptions = {
        pie:{
            degreeStep: 30
        }
    }
    this.options = this.mergeDeep(pieOptions, this.options);
    return this;
}

hichart.prototype.plotBasicPieData = function (dataSet) {
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

    this.defaultBasicPieOptions()

    //context.fillRect(0,0, rect.width, rect.height);
    //******************
    // context.scale((1 / this.scaleX), (1 / this.scaleY));
    // context.translate(-1 * this.translateX, -1 * this.translateY);
    //******************

    context.translate(centerX, centerY);
    for (var s = 0; s < series.length; s++) {
        
        var sumOfData = series[s]['data'].reduce(function(a, b){
            return a + b['value'];
        }, 0);
        var currentSum = 0;
        for(var d = 0; d < series[s]['data'].length; d++){
            var grd;
            if (series[s]['data'][d]['linearGradient']) {
                grd = context.createLinearGradient(0, radius, 0, -1*radius);
                for (g = 0; g < series[s]['data'][d]['linearGradient'].length; g++) {
                    grd.addColorStop(series[s]['data'][d]['linearGradient'][g]['position'], series[s]['data'][d]['linearGradient'][g]['color']);
                }
            } else if (series[s]['data'][d]['radialGradient']) {
                grd = context.createRadialGradient(0, 0, 0, 0, 0, radius);
                for (g = 0; g < series[s]['data'][d]['radialGradient'].length; g++) {
                    grd.addColorStop(series[s]['data'][d]['radialGradient'][g]['position'], series[s]['data'][d]['radialGradient'][g]['color']);
                }
            } else if (series[s]['data'][d]['color']) {
                grd = series[s]['data'][d]['color']
            } else {
                grd = this.options.colorList[d];
            }
            context.strokeStyle = grd;
            context.fillStyle = grd;
            context.beginPath();
            context.moveTo(0,0);
            //context.arc(0, 0, radius, 0, 2 * Math.PI);
            context.arc(0, 0, radius, currentSum/sumOfData * 2 * Math.PI, (currentSum+series[s]['data'][d]['value'])/sumOfData * 2 * Math.PI);
            context.lineTo(0,0);
            context.fill();
            if(series[s]['text'] && series[s]['text']['enable']){
                context.textAlign = "center";
                context.textBaseline = "top";
                context.fillStyle = series[s]['color'];
                var textDegree = (currentSum/sumOfData * 2 * Math.PI + (currentSum+series[s]['data'][d]['value'])/sumOfData * 2 * Math.PI) / 2;
                context.fillText(currentSum+series[s]['data'][d]['name'], radius/2*Math.cos(textDegree), radius/2*Math.sin(textDegree) );
            }
            currentSum += series[s]['data'][d]['value'];
        }
        context.stroke();
    }
    context.textBaseline = "alphabetic";
    context.textAlign = "start";
    context.translate(-1*centerX, -1*centerY);
    //*********************
    // context.translate(this.translateX, this.translateY);
    // context.scale(this.scaleX, this.scaleY);
    //*********************
    return this;
}