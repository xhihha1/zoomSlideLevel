(function(){
    //hichart_PhaseSequence
    hichart.prototype.defaultPhaseSequenceOptions = function () {
        var phaseSequenceOption = {
            phaseSequence:{
                degreeStep: 30,
                startAngle: 0,
                endAngle: 360,
                counterclockwise: false,
                type: {
                    type: "twoLengthTriangleNeedle", //percentNeedle,twoLengthNeedle,twoLengthTriangleNeedle
                    color: "#CCCCCC",
                    secondColor: "#FF0000"
                },
                rangeContainer: {
                    offset: 0,
                    backgroundColor: "#64A3D8"
                },
                label: {
                    endable: false,
                    type: "textCloud", //marker, textCloud
                    font: {
                        color: "#808080",
                        size: 16
                    },
                    background: "rgba(80,80,80,0.8)",
                    customizeText: "function object input value object"
                }
            }
        }
        this.options = this.mergeDeep(phaseSequenceOption, this.options);
        return this;
    }
    
    hichart.prototype.plotPhaseSequenceData = function (dataSet) {
        var padding = 10;
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
        var outerRadius = Math.min(rect.width, rect.height) / 2 - 2 * margin;
        var Val_max = this.options.Val_max;
        var Val_min = this.options.Val_min;
        var stepSize = this.options.stepSize;
        var stickSize = this.options.stick.size;
        var options = this.options;

        this.defaultPhaseSequenceOptions()
        var phaseSequenceOption = this.options.phaseSequence;
        if (outerRadius < 0) {
            outerRadius = 0;
        }
    
        //context.fillRect(0,0, rect.width, rect.height);
        //******************
        context.translate(centerX, centerY);
        //******************
        for (var s = 0; s < series.length; s++) {
            var startAngle = 0;
            var endAngle = Math.PI * 2;
            var degrees = [];
            var color = [];
            var values = [];
            for(var d = 0; d < series[s]['data'].length; d++){
                // color
                var grd;
                if (series[s]['data'][d]['linearGradient']) {
                    var colorRadius = outerRadius;
                    if(series[s]['data'][d]['distance'] === 0){colorRadius = outerRadius/2;}
                    grd = context.createLinearGradient(0, 0, colorRadius * Math.cos(series[s]['data'][d]['degree'] / 180 * Math.PI), colorRadius * Math.sin(series[s]['data'][d]['degree'] / 180 * Math.PI));
                    for (g = 0; g < series[s]['data'][d]['linearGradient'].length; g++) {
                        grd.addColorStop(series[s]['data'][d]['linearGradient'][g]['position'], series[s]['data'][d]['linearGradient'][g]['color']);
                    }
                } else if(series[s]['data'][d]['radialGradient']){
                    var colorRadius = outerRadius;
                    if(series[s]['data'][d]['distance'] === 0){colorRadius = outerRadius/2;}
                    grd = context.createRadialGradient(0, 0, 0, 0, 0, colorRadius);
                    for (g = 0; g < series[s]['data'][d]['radialGradient'].length; g++) {
                        grd.addColorStop(series[s]['data'][d]['radialGradient'][g]['position'], series[s]['data'][d]['radialGradient'][g]['color']);
                    }
                } else if (series[s]['data'][d]['color']) {
                    grd = series[s]['data'][d]['color']
                } else {
                    grd = this.options.colorList[d];
                }
                color.push(grd);
                
                // degrees
                this.isNumeric
                var thita = this.isNumeric(series[s]['data'][d].degree) ? series[s]['data'][d].degree * 1 : undefined;
                if (typeof (thita) != undefined) {
                    thita = (thita % 360) >= 0 ? (thita % 360) : (thita % 360) + 360;
                }
                degrees.push(thita);

                // value
                var value = this.isNumeric(series[s]['data'][d].value) ? series[s]['data'][d].value * 1 : 0;
                values.push(value);
            }

            //Background 360 degree arc(outer)
            context.beginPath();
            context.strokeStyle = phaseSequenceOption.rangeContainer.backgroundColor;
            context.lineWidth = options.stick.lineWidth;
            context.arc(0, 0, outerRadius, startAngle, endAngle, phaseSequenceOption.counterclockwise);
            context.stroke();
            //Background 360 degree arc(inner)
            context.beginPath();
            context.strokeStyle = phaseSequenceOption.rangeContainer.backgroundColor;
            context.lineWidth = options.stick.lineWidth;
            context.arc(0, 0, outerRadius / 2, startAngle, endAngle, phaseSequenceOption.counterclockwise);
            context.stroke();

            //dash circle
            var dashDegree = 0;
            do {
                var thita = (startAngle + dashDegree * Math.PI / 180);
                var thitaEnd = (startAngle + (dashDegree + 2) * Math.PI / 180);
                //75%
                context.beginPath();
                context.strokeStyle = options.stick.color;
                context.lineWidth = 1;
                context.arc(0, 0, outerRadius * 0.75, thita, thitaEnd, phaseSequenceOption.counterclockwise);
                context.stroke();
                //25%
                context.beginPath();
                context.strokeStyle = options.stick.color;
                context.lineWidth = 1;
                context.arc(0, 0, outerRadius * 0.25, thita, thitaEnd, phaseSequenceOption.counterclockwise);
                context.stroke();

                dashDegree += 4;
            } while (dashDegree < phaseSequenceOption.endAngle);
            //tick
            var tickDegree = 0; //phaseSequenceOption.tick.tickDegree;
            do {
                var thita = (startAngle + tickDegree * Math.PI / 180) * -1;
                //outer tick
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = options.stick.color;
                context.moveTo(0 + (outerRadius + options.stick.size / 2) * Math.cos(thita), 0 + (outerRadius + options.stick.size / 2) * Math.sin(thita));
                context.lineTo(0 + (outerRadius - options.stick.size / 2) * Math.cos(thita), 0 + (outerRadius - options.stick.size / 2) * Math.sin(thita));
                context.stroke();
                //inner tick
                context.beginPath();
                context.lineWidth = 2;
                context.strokeStyle = options.stick.color;
                context.moveTo(0 + (outerRadius / 2 + options.stick.size / 2) * Math.cos(thita), 0 + (outerRadius / 2 + options.stick.size / 2) * Math.sin(thita));
                context.lineTo(0 + (outerRadius / 2 - options.stick.size / 2) * Math.cos(thita), 0 + (outerRadius / 2 - options.stick.size / 2) * Math.sin(thita));
                context.stroke();
                //long tick
                if (tickDegree % 90 == 0) {
                    context.beginPath();
                    context.lineWidth = 2;
                    context.strokeStyle = options.stick.color;
                    context.moveTo(0 + (outerRadius + options.stick.size / 2) * Math.cos(thita), 0 + (outerRadius + options.stick.size / 2) * Math.sin(thita));
                    context.lineTo(0, 0);
                    context.stroke();
                }
                //text
                if (tickDegree % 30 == 0) {
                    context.fillStyle = phaseSequenceOption.color;
                    // context.font = phaseSequenceOption.font.size + 'px Calibri';
                    var text_width = context.measureText(tickDegree).width;
                    context.fillText(tickDegree+'°', 0 + (outerRadius) * Math.cos(thita) - text_width / 2, 0 + (outerRadius) * Math.sin(thita));
                }

                thita = null;
                tickDegree += phaseSequenceOption.degreeStep;
            } while (tickDegree < phaseSequenceOption.endAngle);

            for(var d = 0; d < series[s]['data'].length; d++){
                var needleType = phaseSequenceOption.type.type;
                var radius;
                var radians;
                if (needleType == "twoLengthNeedle") {
                    radius = outerRadius;
                    if (!series[s]['data'][d].distance) {
                        radius = outerRadius * 0.5;
                    }
                    var thita = this.isNumeric(degrees[d]) ? degrees[d] : undefined;
                    if (typeof (thita) != undefined) {
                        thita = (thita % 360) >= 0 ? (thita % 360) : (thita % 360) + 360;
                        radians = Math.PI * 2 - thita * Math.PI / 180;
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = color[d];
                        // context.strokeStyle = '#F00';
                        context.moveTo(0, 0);
                        context.lineTo(0 + (radius) * Math.cos(radians), 0 + (radius) * Math.sin(radians));
                        context.stroke();
                    } else {

                    }
                }
                else if (needleType == "twoLengthTriangleNeedle") {

                    radius = outerRadius;
                    if (!series[s]['data'][d].distance) {
                        radius = outerRadius * 0.5;
                    }
                    var thita = this.isNumeric(degrees[d]) ? degrees[d] : undefined;
                    if (typeof (thita) != undefined) {
                        thita = (thita % 360) >= 0 ? (thita % 360) : (thita % 360) + 360;
                        radians = Math.PI * 2 - thita * Math.PI / 180;
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = color[d];
                        context.fillStyle = color[d];
                        context.moveTo(0 + (radius) * Math.cos(radians), 0 + (radius) * Math.sin(radians));
                        context.lineTo(0 + 2 * Math.cos(radians + Math.PI / 2), 0 + 2 * Math.sin(radians + Math.PI / 2));
                        context.lineTo(0 + 2 * Math.cos(radians - Math.PI / 2), 0 + 2 * Math.sin(radians - Math.PI / 2));
                        context.closePath();
                        context.fill();
                    }
                }
                else {
                    var max = this.isNumeric(series[s]['data'][d].max) ? series[s]['data'][d].max * 1 : Val_max;
                    var min = this.isNumeric(series[s]['data'][d].min) ? series[s]['data'][d].min * 1 : Val_min;
                    radius = outerRadius;
                    if (max - min > 0) {
                        radius = outerRadius * ((values[d] - min) / (max - min));
                        if (radius > outerRadius) { radius = outerRadius; }
                        if (radius < 0) {radius = 0; }
                    }
                    else { radius = outerRadius; }
                    var thita = this.isNumeric(degrees[d]) ? degrees[d] : undefined;
                    if (typeof (thita) != undefined) {
                        thita = (thita % 360) >= 0 ? (thita % 360) : (thita % 360) + 360;
                        radians = Math.PI * 2 - thita * Math.PI / 180;
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = color[d];
                        context.moveTo(0, 0);
                        context.lineTo(0 + (radius) * Math.cos(radians), 0 + (radius) * Math.sin(radians));
                        context.stroke();
                    }
                }
                //Lets add the text
                if (phaseSequenceOption.label.endable && phaseSequenceOption.label.type == "textCloud") {
                    var display_text, text_width;
                    if (typeof(phaseSequenceOption.label.customizeText) == 'function') {
                        display_text = phaseSequenceOption.label.customizeText(series[s]['data'][d], phaseSequenceOption);
                    } else {
                        if (!this.isNumeric(series[s]['data'][d].value)) {
                            display_text = series[s]['data'][d].value;
                        }
                        else if (Math.log(series[s]['data'][d].value) / Math.log(10) > 0) {
                            display_text = Math.round(series[s]['data'][d].value * 100) / 100;
                        }
                        else {
                            display_text = Math.round(series[s]['data'][d].value * Math.pow(10, Math.floor(Math.log(series[s]['data'][d].value) / Math.log(10)) * 1)) / Math.pow(10, Math.floor(Math.log(series[s]['data'][d].value) / Math.log(10)));
                        }
                    }
                    context.font = phaseSequenceOption.label.font.size + 'px Calibri';
                    text_width = context.measureText(display_text).width;
                    var diff_bound = 0;
                    if ((0 + radius * Math.cos(radians) - padding) + (text_width + 2 * padding) > rect.width) {
                        diff_bound = (0 + radius * Math.cos(radians) - padding) + (text_width + 2 * padding) - rect.width;
                    }
                    context.fillStyle = phaseSequenceOption.label.background;
                    context.fillRect(0 + radius * Math.cos(radians) - padding - diff_bound, 0 + radius * Math.sin(radians) - padding - phaseSequenceOption.label.font.size, text_width + 2 * padding, phaseSequenceOption.label.font.size + 2 * padding);
                    context.fillStyle = phaseSequenceOption.label.font.color;
                    context.font = phaseSequenceOption.label.font.size + 'px Calibri';
                    context.fillText(display_text, 0 + radius * Math.cos(radians) - diff_bound, 0 + radius * Math.sin(radians));
                }
                if (phaseSequenceOption.label.endable && phaseSequenceOption.label.type == "marker") {
                    radius = outerRadius;
                    var lineWidth = 5;
                    //first color
                    context.beginPath();
                    context.lineWidth = 2;
                    context.strokeStyle = phaseSequenceOption.type.color;
                    context.moveTo(0 + (radius) * Math.cos(radians), 0 + (radius) * Math.sin(radians));
                    var thita = Math.atan(5 / radius);
                    var r = (radius + 5 * 2) / Math.cos(thita);
                    context.lineTo(0 + r * Math.cos(radians + thita), 0 + r * Math.sin(radians + thita));
                    context.lineTo(0 + r * Math.cos(radians - thita), 0 + r * Math.sin(radians - thita));
                    context.closePath();
                    context.fillStyle = color[d];
                    context.fill();
                    context.stroke();
                }
            }//
        } // end series

        


        context.textBaseline = "alphabetic";
        context.textAlign = "start";
        //******************
        context.translate(-1*centerX, -1*centerY);
        //******************
        return this;
    }
})(this)