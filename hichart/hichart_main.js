
function hichart(chartType, g, rect, options){
	if(!g || !rect){
		return this;
	}
	this.context = g;
	this.chartType = chartType;
	this.rect = rect;
	this.options = {
		sections:12,
		Val_max:14,
		Val_min: 0,
		stepSize:1,
		columnSize:20,
		rowSize:40,
		margin:10,
		label:{
			fontSize: 10
		},
		stick:{
			size:3,
			color: '#999999',
			lineWidth: 1
		},
        xAxis:{
			label:{
				enableRotate: false,
				rotate: 0,
				textBaseline: 'alphabetic',
				textAlign: 'start'
			},
			showGrid: true,
			gridLineWidth: 1,
			categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		},
        yAxis:{
			label:{
				enableRotate: false,
				rotate: 0,
				textBaseline: 'alphabetic',
				textAlign: 'start'
			},
			showGrid: true,
			gridLineWidth: 1,
			data:[14, 7, 4.2, 4, 3.5]
		},
		series:[
			{
				data:[30, 50, 70, 80, 90, 100, 95, 91, 85, 92, 99, 130],
				color: "#d9406f",
				linearGradient:[{position:0,color:"#000000"},{position:1,color:"#2dc4f6"}]
			},
			{
				data:[20, -10, -20, -25, -40, 5, 10, 28, 30, 43, 65, 80],
				color: "#4e94ab"
			}
		],
        colorList:['#edc214', '#d9406f', '#4e94ab', '#5bd1d7','#348498','#004d61','#ff502f', "#A7CC61", "#64A3D8", "#ED4853", "#FFDD5C", "#FF834D", "#C4B7DA", "#AEC18B", "#7D9DB7", "#B46267", "#ECDB9B", "#D19378", "#C2BBCD"] 
    }
	//this.options = Object.assign({}, this.options, options);
	
	if(options){
		this.options = this.mergeDeep(this.options, options);
		this.options = this.mergeSeriesData(this.options, options);
	}
	
    this.context.font = "19 pt Arial;"
	if(!this.context){
		return false;
	}
	if(typeof this.rect.x == 'undefined'){
		this.rect.x = 0;
	}
	if(typeof this.rect.y == 'undefined'){
		this.rect.y = 0;
	}
	this.canvasHeight = rect.height;
	this.canvasWidth = rect.width;
	this.yScale = (this.canvasHeight - this.options.columnSize - this.options.margin) / (this.options.Val_max - this.options.Val_min);
	this.xScale = (this.canvasWidth - this.options.rowSize) / this.options.sections;
	//this.context.fillStyle="#00ff00";
    //this.context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

    this.context.fillStyle="#85969B";
	this.context.strokeStyle="#85969B";

	// this.drawAxis();

	if(this.chartType && typeof this['plot'+this.chartType+'Data'] === 'function') {
		this['plot'+this.chartType+'Data']();
	} else {
		console.error(chartType + ' not exist');
	}
	
	return this;
}
hichart.prototype.mergeSeriesData = function(target, source){
	if(source && source['series']){
		target['series'] = JSON.parse(JSON.stringify(source['series']));
	}
	return target;
	
}
hichart.prototype.mergeDeep = function(target, source) {
    if(typeof target !== 'object' || typeof source !== 'object') return target;
    for(var prop in source) {
    if(!source.hasOwnProperty(prop)) continue;
      if(prop in target) {
        if(typeof target[prop] !== 'object') {
          target[prop] = source[prop];
        } else {
          if(typeof source[prop] !== 'object') {
            target[prop] = source[prop];
          } else {
            // if(target[prop].concat && source[prop].concat) {
            //   target[prop] = target[prop].concat(source[prop]);
            // } else {
            //   target[prop] = this.mergeDeep(target[prop], source[prop]); 
			// } 
			target[prop] = this.mergeDeep(target[prop], source[prop]); 
          }  
        }
      } else {
        target[prop] = source[prop]; 
      }
    }
  return target;
}

