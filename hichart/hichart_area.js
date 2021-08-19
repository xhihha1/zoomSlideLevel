hichart.prototype.plotAreaData = function (dataSet) {
    var context = this.context;
    var sections = this.options.sections;
    var xScale = this.xScale;
    var yScale = this.yScale;
    var series = this.options.series;

    var xAxis = this.options.xAxis;
    var yAxis = this.options.yAxis;
	var columnSize = this.options.columnSize;
	var Val_max = this.options.Val_max;
	var Val_min = this.options.Val_min;
	var stepSize = this.options.stepSize;
	var rowSize = this.options.rowSize;

    this.plotAxisData();

    var translateX = this.translateX = rowSize + this.rect.x;
	var translateY = this.translateY = this.canvasHeight + Val_min * yScale - columnSize +  + this.rect.y;
	var scaleX = this.scaleX = xScale;
	var scaleY = this.scaleY = -1 * yScale;
	// console.log(this.chartType, 'translateX',translateX, 'translateY',translateY, 'scaleX',scaleX, 'scaleY',scaleY)
	context.translate(translateX, translateY);
    context.scale(scaleX, scaleY);

    for (var s = 0; s < series.length; s++) {
        context.beginPath();
        context.moveTo(0, series[s]['data'][0]);
        context.lineWidth = 1 / xScale;
        var grd;
        var maxVal = Math.max.apply(null, series[s]['data']); 
        var minVal = Math.max.apply(null, series[s]['data']); 
        if (series[s]['linearGradient']) {
                grd = context.createLinearGradient(0, Math.min(0, minVal), 0, maxVal / 2);
                for (g = 0; g < series[s]['linearGradient'].length; g++) {
                    grd.addColorStop(series[s]['linearGradient'][g]['position'], series[s]['linearGradient'][g]['color']);
                }
        } else if (series[s]['color']) {
                grd = series[s]['color']
        } else {
                grd = this.options.colorList[s];
        }
        context.strokeStyle = grd;
        context.fillStyle = grd;
        for (var i = 1; i < sections; i++) {
            
            
            context.lineTo(i, series[s]['data'][i]);
        }

        context.lineTo((sections - 1), 0);
        context.lineTo(0, 0);
        context.lineTo(0, series[s]['data'][0]);
        context.fill();
        // context.stroke();
    }

    context.scale((1 / scaleX),(1 / scaleY));
    context.translate(-1 * translateX, -1 * translateY);
    return this;
}