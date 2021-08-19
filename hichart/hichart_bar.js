
hichart.prototype.plotBarData = function(dataSet){
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

	// single dataSet
	/*
    // context.textBaseline="bottom";
	// for (var i=0; i<sections; i++) {
    //     var y = this.canvasHeight - dataSet[i] * yScale ;
	// 	context.fillText(dataSet[i], xScale * (i+1), y - margin);
    // }
    // shadow for graph's bar lines with color and offset
    context.fillStyle="#9933FF;";
    // context.shadowColor = 'rgba(128,128,128, 0.5)';
    // //shadow offset along X and Y direction 
	// context.shadowOffsetX = 9;
    // context.shadowOffsetY = 3;
    // // draw each graph bars	
    context.fillStyle="#00FF00;";
    // console.log(Math.max(...dataSet))
	for (i=0;i<sections;i++) {
        var grd = context.createLinearGradient(0, 0, 0, dataSet[i]/2);
        grd.addColorStop(0, "#000000");
        grd.addColorStop(1, "#2dc4f6");
        context.fillStyle = grd;
        context.fillRect(i, 0, 0.3, dataSet[i]);
		// context.fillRect(i+1, 0, 0.3, dataSet[i]);
	}*/
	
	var translateX = this.translateX = rowSize + this.rect.x;
	var translateY = this.translateY = this.canvasHeight + Val_min * yScale - columnSize +  + this.rect.y;
	var scaleX = this.scaleX = xScale;
	var scaleY = this.scaleY = -1 * yScale;
	// console.log(this.chartType, 'translateX',translateX, 'translateY',translateY, 'scaleX',scaleX, 'scaleY',scaleY)
	context.translate(translateX, translateY);
    context.scale(scaleX, scaleY);
	
	for(var s = 0; s < series.length;s++){
		for (i=0;i<sections;i++) {
			var grd;
			if(series[s]['linearGradient']){
				grd = context.createLinearGradient(0, 0, 0, series[s]['data'][i]/2);
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
			var barWidth = tempRate / series.length;
			context.fillStyle = grd;
			context.fillRect(i + barWidth*s, 0, barWidth, series[s]['data'][i]);
		}
	}

	context.scale((1 / scaleX),(1 / scaleY));
	context.translate(-1 * translateX, -1 * translateY);
	return this;
}