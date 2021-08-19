hichart.prototype.plotStackedBarData = function(dataSet){
	var context = this.context;
	var sections = this.options.sections;
	var xScale = this.xScale;
    var yScale = this.yScale;
    var margin = this.options.margin;
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
	
	var sectionSum = [];
	for (i=0;i<sections;i++) {
		sectionSum.push(0);
	}
	
	for(var s = 0; s < series.length;s++){
		for (i=0;i<sections;i++) {
			var grd;
			if(series[s]['linearGradient']){
				grd = context.createLinearGradient(0, 0, 0, (sectionSum[i] + series[s]['data'][i]));
				for (g=0;g<series[s]['linearGradient'].length;g++) {
					grd.addColorStop(series[s]['linearGradient'][g]['position'], series[s]['linearGradient'][g]['color']);
				}
				//grd.addColorStop(0, "#000000");
				//grd.addColorStop(1, "#2dc4f6");
			} else if(series[s]['color']){
				grd = series[s]['color']
			} else {
				grd = this.options.colorList[s];
			}
			var tempRate = 0.5;
			var barWidth = tempRate;
			context.fillStyle = grd;
			context.fillRect(i, sectionSum[i], barWidth, series[s]['data'][i]);
			if(!isNaN(series[s]['data'][i])){
				sectionSum[i] += series[s]['data'][i];
			}
		}
	}

	context.scale((1 / scaleX),(1 / scaleY));
    context.translate(-1 * translateX, -1 * translateY);
	
	return this;
}
