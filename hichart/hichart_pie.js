hichart.prototype.defaultPieOptions = function () {
    var pieOptions = {
        centerFontSize: 20,
        centerFontText: 100,
        borderColor: 2
    }
    //this.options = Object.assign({}, pieOptions, this.options);
    this.options = this.mergeDeep(pieOptions, this.options);
    return this;
}

hichart.prototype.plotPieData = function (dataSet) {
    this.defaultPieOptions();
    
    var series = this.options.series;
    var rect = this.rect;
    var context = this.context;
    var margin = this.options.margin;
    var font = this.options.centerFontSize + "px Georgia";
    var fontSize = this.options.centerFontSize;
    var fontText = this.options.centerFontText;
    var centerX = rect.x + rect.width / 2;
    var centerY = rect.y + rect.height / 2;
    var radius = rect.width / 2 - margin;
    var radius_margin = 5;
    var pieThin = 20;
    var pieOuterRdius = radius - radius_margin;
    var pieInnerRdius = radius - radius_margin - pieThin;
    var innerCircleRadius = pieInnerRdius - radius_margin;
    var unitDegree = 2 * Math.PI / 360;
    var shiftDegree = -90 * unitDegree;
    var valueList = [];
    // var colorList = ['#93AFC0', '#FCFCFE', '#6FC5D6', '#CDA07B', '#626063', '#93AFC0', '#FCFCFE', '#6FC5D6', '#CDA07B', '#626063'];
    var colorList = this.options.colorList
    var borderColor = this.options.borderColor;
    var valueRateList;
    //******************
    // context.scale((1 / this.scaleX), (1 / this.scaleY));
    // context.translate(this.translateX, -1 * this.translateY);
    //******************
    for (var s = 0; s < series.length; s++) {
        for(var d = 0; d < series[s]['data'].length; d++){
            valueList.push(series[s]['data'][d]['value']);
        }
    }
    //---------------------

    var valueSum = valueList.reduce((a, b) => a + b);
    valueRateList = valueList.map(function (x) {
        return Math.round(x / valueSum * 100) / 100
    });
    var valueGridList = valueRateList.map(x => Math.round(x * 36));
    // valueGridList = [15.5, 15.5, 5]
    // console.log(valueGridList)

    context.lineWidth = 1;
    context.fillStyle = borderColor;
    context.strokeStyle = borderColor;
    context.font = "20 pt Verdana"
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();

    var sumIndex = 0;
    var sum = 0;
    sum = valueGridList[sumIndex]; //check number
    for (var i = 0; i < 36; i++) {
        if (i < sum) {
            context.fillStyle = colorList[sumIndex]
        } else {
            sumIndex++;
            sum += valueGridList[sumIndex]
            context.fillStyle = colorList[sumIndex]
        }
        var thetaStart = i * 10 * unitDegree + shiftDegree;
        var thetaMiddle = i * 10 * unitDegree + 4 * unitDegree + shiftDegree;
        var thetaEnd = i * 10 * unitDegree + 8 * unitDegree + shiftDegree;
        context.beginPath();
        context.moveTo(centerX + pieInnerRdius * Math.cos(thetaStart), centerY + pieInnerRdius * Math.sin(thetaStart));
        context.lineTo(centerX + pieOuterRdius * Math.cos(thetaStart), centerY + pieOuterRdius * Math.sin(thetaStart));
        context.arc(centerX, centerY, pieOuterRdius, thetaStart, thetaMiddle);
        context.lineTo(centerX + pieInnerRdius * Math.cos(thetaMiddle), centerY + pieInnerRdius * Math.sin(thetaMiddle));
        context.arc(centerX, centerY, pieInnerRdius, thetaStart, thetaMiddle);
        context.closePath();
        context.fill();

        if (i + 0.5 == sum) {
            sumIndex++;
            sum += valueGridList[sumIndex]
            context.fillStyle = colorList[sumIndex]
        }
        context.beginPath();
        context.moveTo(centerX + pieInnerRdius * Math.cos(thetaMiddle), centerY + pieInnerRdius * Math.sin(thetaMiddle));
        context.lineTo(centerX + pieOuterRdius * Math.cos(thetaMiddle), centerY + pieOuterRdius * Math.sin(thetaMiddle));
        context.arc(centerX, centerY, pieOuterRdius, thetaMiddle, thetaEnd);
        context.lineTo(centerX + pieInnerRdius * Math.cos(thetaEnd), centerY + pieInnerRdius * Math.sin(thetaEnd));
        context.arc(centerX, centerY, pieInnerRdius, thetaMiddle, thetaEnd);
        context.closePath();
        context.fill();
    }

    context.fillStyle = borderColor;
    context.strokeStyle = borderColor;
    context.beginPath();
    context.arc(centerX, centerY, innerCircleRadius, 0, 2 * Math.PI);
    context.stroke();

    // upper triangle
    context.beginPath();
    context.moveTo(centerX, centerY - innerCircleRadius + 5);
    context.lineTo(centerX + innerCircleRadius * Math.cos(-93 * unitDegree), centerY + innerCircleRadius * Math.sin(-93 * unitDegree));
    context.arc(centerX, centerY, innerCircleRadius, -93 * unitDegree, -87 * unitDegree);
    context.lineTo(centerX, centerY - innerCircleRadius + 5);
    context.closePath();
    context.fill();

    // lower triangle
    context.beginPath();
    context.moveTo(centerX, centerY + innerCircleRadius - 5);
    context.lineTo(centerX + innerCircleRadius * Math.cos(87 * unitDegree), centerY + innerCircleRadius * Math.sin(87 * unitDegree));
    context.arc(centerX, centerY, innerCircleRadius, 87 * unitDegree, 93 * unitDegree);
    context.lineTo(centerX, centerY + innerCircleRadius - 5);
    context.closePath();
    context.fill();

    context.font = font;
    var textWidth = context.measureText(fontText).width;
    var textHeight = fontSize ? fontSize / 4 : 0;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(fontText, centerX, centerY);
    context.textBaseline = "alphabetic";
    context.textAlign = "start";
    //----------------------


    //*********************
    // context.translate(-1 * this.translateX, this.translateY);
    // context.scale(this.scaleX, this.scaleY);
    //*********************
    return this;
}