(function(global){

    hichart.prototype.defaultBZLineOptions = function (dataSet) {}

    hichart.prototype.replotBZLineData = function (dataSet) {}
    
    
    hichart.prototype.plotBZLineData = function (dataSet) {
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
            //f = 0, will be straight line
            //t suppose to be 1, but changing the value can control the smoothness too
            if (typeof(f) == 'undefined') f = 0.3;
            if (typeof(t) == 'undefined') t = 0.6;
            var m = 0;
            var dx1 = 0;
            var dy1 = 0;

            context.beginPath();
            context.moveTo(0, series[s]['data'][0]);
            context.lineWidth = 1 / xScale;
            var preP = [0, series[s]['data'][0]];
            for (var i = 1; i < sections; i++) {
                var grd;
                if (series[s]['linearGradient']) {
                    grd = context.createLinearGradient(0, 0, 0, series[s]['data'][i] / 2);
                    for (g = 0; g < series[s]['linearGradient'].length; g++) {
                        grd.addColorStop(series[s]['linearGradient'][g]['position'], series[s]['linearGradient'][g]['color']);
                    }
                    //grd.addColorStop(0, "#000000");
                    //grd.addColorStop(1, "#2dc4f6");
                } else if (series[s]['color']) {
                    grd = series[s]['color']
                } else {
                    grd = this.options.colorList[s];
                }
                context.strokeStyle = grd;

                var curP = [i, series[s]['data'][i]];
                var nexP = [i+1, series[s]['data'][i+1]];

                if (nexP[1]) {
                    m = gradient(preP, nexP);
                    dx2 = (nexP[0] - curP[0]) * -f;
                    dy2 = dx2 * m * t;
                } else {
                    dx2 = 0;
                    dy2 = 0;
                }
                context.bezierCurveTo(preP[0] - dx1, preP[1] - dy1, curP[0] + dx2, curP[1] + dy2, curP[0], curP[1]);
                dx1 = dx2;
                dy1 = dy2;
                preP = curP;
                //context.lineTo(i, series[s]['data'][i]);
            }
            context.stroke();
        }
    
        context.scale((1 / scaleX),(1 / scaleY));
        context.translate(-1 * translateX, -1 * translateY);
        return this;
    }

    function gradient(a, b) {
        return (b[1]-a[1])/(b[0]-a[0]);
    }

    function bzCurve(points, f, t) {
        //f = 0, will be straight line
        //t suppose to be 1, but changing the value can control the smoothness too
        if (typeof(f) == 'undefined') f = 0.3;
        if (typeof(t) == 'undefined') t = 0.6;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        var m = 0;
        var dx1 = 0;
        var dy1 = 0;

        var preP = points[0];
        for (var i = 1; i < points.length; i++) {
            var curP = points[i];
            nexP = points[i + 1];
            if (nexP) {
                m = gradient(preP, nexP);
                dx2 = (nexP.x - curP.x) * -f;
                dy2 = dx2 * m * t;
            } else {
                dx2 = 0;
                dy2 = 0;
            }
            ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            ctx.fillText(curP.y,  curP.x - 30, curP.y);

            dx1 = dx2;
            dy1 = dy2;
            preP = curP;
        }
        ctx.stroke();
    }

})(this)
