
hichart.prototype.defaultRadarOptions = function () {

}

hichart.prototype.plotRadarData = function () {
    var context = this.context;
    var xScale = this.xScale;
    var yScale = this.yScale;
    var series = this.options.series;
    var rect = this.rect;
    var context = this.context;
    var margin = this.options.margin;
    var centerX = rect.x + rect.width / 2;
    var centerY = rect.y + rect.height / 2;
    var radius = rect.width / 2 - 2 * margin;
    var radar = this.options.radar;

    //context.fillRect(0,0, rect.width, rect.height);
    //******************
    // context.scale((1 / this.scaleX), (1 / this.scaleY));
    // context.translate(-1 * this.translateX, -1 * this.translateY);
    //******************
    context.translate(centerX, centerY);


    var points = []
    var zeroDegree = -1 / 2 * Math.PI;
    var unitStep = 2 * Math.PI / radar.indicator.length;
    this.context.font = "10 px Arial"
    context.textAlign = "center";
    for (var s = 0; s < radar.indicator.length; s++) {
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(radius * Math.cos(zeroDegree + unitStep * s), radius * Math.sin(zeroDegree + unitStep * s));
        context.stroke();
        points.push([zeroDegree + unitStep * s]);
        if(radar.name['enable']){
            context.fillText(radar.indicator[s]['name'], radius * Math.cos(zeroDegree + unitStep * s), radius * Math.sin(zeroDegree + unitStep * s))
        }
    }
    
    for (var i = 0; i < 5; i++) {
        context.beginPath();
        context.moveTo(radius * (i+1)/5 * Math.cos(points[0]), radius * (i+1)/5 * Math.sin(points[0]));
        for (var s = 0; s < radar.indicator.length; s++) {
            context.lineTo(radius * (i+1)/5 * Math.cos(points[s]), radius * (i+1)/5 * Math.sin(points[s]));
        }
        context.lineTo(radius * (i+1)/5 * Math.cos(points[0]), radius * (i+1)/5 * Math.sin(points[0]));
        context.stroke();
    }
    
    context.strokeStyle = "#F00"
    for (var s = 0; s < series.length; s++) {
        if (series[s]['linearGradient']) {
            grd = context.createLinearGradient(0, radius, 0, -1*radius);
            for (g = 0; g < series[s]['linearGradient'].length; g++) {
                grd.addColorStop(series[s]['linearGradient'][g]['position'], series[s]['linearGradient'][g]['color']);
            }
        } else if (series[s]['color']) {
            grd = series[s]['color']
        } else {
            grd = this.options.colorList[d];
        }
        context.strokeStyle = grd;

        context.beginPath();
        context.moveTo(radius * (series[s]['data'][0] / radar.indicator[0]['max']) * Math.cos(points[0]), radius * (series[s]['data'][0] / radar.indicator[0]['max']) * Math.sin(points[0]));
        for(var d = 0; d < series[s]['data'].length; d++){
            var sp = series[s]['data'].length;
            // series[s]['data'][d]
            context.lineTo(radius * (series[s]['data'][d] / radar.indicator[d]['max']) * Math.cos(points[d]), radius * (series[s]['data'][d] / radar.indicator[d]['max']) * Math.sin(points[d]));
        }
        context.lineTo(radius * (series[s]['data'][0] / radar.indicator[0]['max']) * Math.cos(points[0]), radius * (series[s]['data'][0] / radar.indicator[0]['max']) * Math.sin(points[0]));
        context.stroke();
    }

    

    /*for (var s = 0; s < series.length; s++) {
        
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
    }*/
    context.textBaseline = "alphabetic";
    context.textAlign = "start";
    context.translate(-1*centerX, -1*centerY);
    //*********************
    // context.translate(this.translateX, this.translateY);
    // context.scale(this.scaleX, this.scaleY);
    //*********************
    return this;
}