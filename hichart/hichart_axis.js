hichart.prototype.plotAxisData = function(){
	var chartType = this.chartType;
	var context = this.context;
    var xAxis = this.options.xAxis;
    var yAxis = this.options.yAxis;
	var sections = this.options.sections;
	var xScale = this.xScale;
	var yScale = this.yScale;
	var columnSize = this.options.columnSize;
	var margin = this.options.margin;
	var Val_max = this.options.Val_max;
	var Val_min = this.options.Val_min;
	var stepSize = this.options.stepSize;
	var rowSize = this.options.rowSize;
	context.strokeStyle="#85969B"; // color of grid lines
	
	var font = this.options.label.fontSize + "px Georgia";
    context.font = font;
	
	context.beginPath();
	var endVirticalX;
	context.lineWidth = xAxis['gridLineWidth'];
	for (i=0;i<sections;i++) {
		var x = rowSize + i * xScale + this.rect.x;
        var y = this.canvasHeight + margin - columnSize + this.rect.y;
		if(xAxis['showGrid']){
			if(xAxis.label && xAxis.label.enableRotate){
				context.translate(x, y);
				context.rotate(-1* xAxis.label['rotate'] * Math.PI/180);
				context.textBaseline = xAxis.label['textBaseline'];
				context.textAlign = xAxis.label['textAlign'];
				context.fillText(xAxis['categories'][i], 0, 0);
				context.rotate( xAxis.label['rotate'] *Math.PI/180);
				context.translate(-1*x, -1*y);
			} else {
				context.textBaseline = xAxis.label['textBaseline'];
				context.textAlign = xAxis.label['textAlign'];
				context.fillText(xAxis['categories'][i], x, y);
			}
			context.moveTo(x, margin + this.rect.y);
			context.lineTo(x, this.canvasHeight - columnSize + this.rect.y);
		}
		endVirticalX = x;
	}
	context.textBaseline = "alphabetic";
    context.textAlign = "start";

    var count =  0;
	context.lineWidth = yAxis['gridLineWidth'];
	for (scale=Val_max;scale>=Val_min;scale = scale - stepSize) {
        var x = margin + this.rect.x;
		var y = (yScale * count * stepSize) + margin + this.rect.y; 
		if(yAxis['showGrid']){
			if(yAxis.label && yAxis.label.enableRotate){
				context.translate(x, y);
				context.rotate(-1* yAxis.label['rotate'] * Math.PI/180);
				context.textBaseline = yAxis.label['textBaseline'];
				context.textAlign = yAxis.label['textAlign'];
				context.fillText(yAxis['categories'][i], 0, 0);
				context.rotate( yAxis.label['rotate'] *Math.PI/180);
				context.translate(-1*x, -1*y);
			} else {
				context.textBaseline = yAxis.label['textBaseline'];
				context.textAlign = yAxis.label['textAlign'];
				context.fillText(scale, x, y);
			}
			context.moveTo(rowSize + this.rect.x,y)
			context.lineTo(endVirticalX,y)
		}
		count++;
	}
    context.stroke();
    //******************************
    var translateX = this.translateX = rowSize + this.rect.x;
	var translateY = this.translateY = this.canvasHeight + Val_min * yScale - columnSize +  + this.rect.y;
	var scaleX = this.scaleX = xScale;
	var scaleY = this.scaleY = -1 * yScale;
	// console.log(this.chartType, 'translateX',translateX, 'translateY',translateY, 'scaleX',scaleX, 'scaleY',scaleY)
	context.translate(translateX, translateY);
    context.scale(scaleX, scaleY);
    //**********************************


	/*context.strokeStyle="#FF0000";
	context.beginPath();
	context.arc(0, 0, 1, 0, 2 * Math.PI);
    context.stroke();*/
    //*********************************
	context.scale((1 / scaleX),(1 / scaleY));
    context.translate(-1 * translateX, -1 * translateY);
    //********************************
	//context.translate(-1 * 0, -1 * 0);
	//context.scale(Math.abs(1 / scaleX), Math.abs(1 / scaleY));
	
	// context.lineWidth = 3;
	// context.strokeStyle="#00FF00";
	// context.beginPath();
	// context.arc(0, 0, 20, 0, 2 * Math.PI);
	// context.stroke();
	// console.log(this.chartType)
	return this;
}