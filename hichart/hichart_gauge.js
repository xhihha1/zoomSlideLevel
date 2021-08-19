(function (global) {
    hichart.prototype.defaultGaugeOptions = function () {
        var defaultOption = {
            max: 1000,
            min: 0,
            color: "#808080",
            font: {
                size: 16
            },
            tick: {
                enable:true,
                tickInterval: 100,
                color: "#808080",
                length: 5,
                lineWidth: 5
            },
            lineWidth: 10,
            startAngle: -180,
            endAngle: 0,
            type: {
                type: "rangeBar",
                color: "#CCCCCC",
                secondColor: "#FF0000"
            },
            animation: {
                enabled: false
            },
            rangeContainer: {
                offset: 0,
                backgroundColor: "#64A3D8",
                ranges: [
                    //{startValue:0,endValue:100,color:"#00FF00"}
                ]
            },
            tooltip: {
                enable: true,
                background: "rgba(80,80,80,0.8)",
                font: {
                    color: "#808080",
                    size: 16
                },
                padding: 10,
                customizeText: "function object input value object"
            },
            label: {
                endable: true,
                type: "textCloud", //marker, textCloud
                font: {
                    color: "#808080",
                    size: 16
                },
                padding: 5,
                background: "rgba(80,80,80,0.8)",
                customizeText: "function object input value object"
            }
        }
        var gaugeOption = {
            gauge: defaultOption
        }
        this.options = this.mergeDeep(gaugeOption, this.options);
        return this;
    }

    hichart.prototype.plotGaugeData = function (dataSet) {
        var context = this.context;
        var series = this.options.series;
        var rect = this.rect;
        var context = this.context;
        var margin = this.options.margin;
        var centerX = rect.x + rect.width / 2;
        var centerY = rect.y + rect.height / 2;
        var initX = rect.x;
        var initY = rect.y;
        var Val_max = this.options.Val_max;
        var Val_min = this.options.Val_min;
        var options = this.options;
        this.defaultGaugeOptions();
        var gaugeOption = this.options.gauge;
        //var defaultValue = series;
        var defaultOption = gaugeOption;
        var defaultColor = this.options.colorList;

        //******************
        context.translate(initX, initY);
        //******************
        defaultOption.max = Val_max;
        defaultOption.min = Val_min;
        //dimensions
        var W = rect.width;
        var H = rect.height;
        //Variables
        var input_value = [];
        var value = [];
        var new_value = [];
        var difference = [];

        var degrees = [],
            new_degrees = [];
        var diff_degrees = [];
        //var color = option.color;
        var color = [];
        if (!this.isNumeric(defaultOption.max) || !this.isNumeric(defaultOption.min)) {
            console.error("not number");
            return false;
        }

        context.font = defaultOption.font.size + 'px Calibri';
        var lengthOfTickText_1 = context.measureText(defaultOption.max).width;
        var lengthOfTickText_2 = context.measureText(defaultOption.min).width;
        var maxLengthOfTickText = Math.ceil(Math.max(lengthOfTickText_1, lengthOfTickText_2));

        var rangeValue = defaultOption.max - defaultOption.min;
        if (rangeValue <= 0) {
            console.error("range error");
            return false;
        }

        var startAngle = 0 * Math.PI / 180;
        var endAngle = Math.PI * 2;
        var counterclockwise = false;

        //green looks better to me
        var bgcolor = defaultOption.rangeContainer.backgroundColor;
        var animation_loop, redraw_loop;

        //start end angle
        if (!this.isNumeric(defaultOption.startAngle) || !this.isNumeric(defaultOption.endAngle)) {
            console.error("not number");
            return false;
        }
        if (defaultOption.startAngle % 360 >= defaultOption.endAngle % 360) {
            startAngle = (defaultOption.startAngle % 360) * Math.PI / 180;
            endAngle = (defaultOption.endAngle % 360 + 360) * Math.PI / 180;
            defaultOption.startAngle = defaultOption.startAngle % 360;
            defaultOption.endAngle = defaultOption.endAngle % 360 + 360;
        } else {
            startAngle = (defaultOption.startAngle % 360) * Math.PI / 180;
            endAngle = (defaultOption.endAngle % 360) * Math.PI / 180;
            defaultOption.startAngle = defaultOption.startAngle % 360;
            defaultOption.endAngle = defaultOption.endAngle % 360;
        }
        var rangeDegree = defaultOption.endAngle - defaultOption.startAngle;
        /*startAngle = defaultOption.startAngle * Math.PI / 180;
        endAngle = defaultOption.endAngle * Math.PI / 180;*/
        counterclockwise = defaultOption.counterclockwise;

        for (var s = 0; s < series.length; s++) {
            var defaultValue = series[s]['data'];
            for (var d = 0; d < series[s]['data'].length; d++) {
                //color
                if (series[s]['data'][d].color) {
                    color.push(series[s]['data'][d].color);
                } else {
                    color.push(defaultColor[d]);
                }
                // input_value
                input_value.push(series[s]['data'][d].value);
                // new_value
                if (this.isNumeric(series[s]['data'][d].value)) {
                    if (series[s]['data'][d].value > Val_max) {
                        value.push(Val_max);
                    } else if (series[s]['data'][d].value < Val_min) {
                        value.push(Val_min);
                    } else {
                        value.push(series[s]['data'][d].value);
                    }
                } else {
                    value.push(Val_min);
                }
                // degree
                if (this.isNumeric(value[d])) {
                    if (counterclockwise) {
                        degrees.push(Math.round(((value[d] - defaultOption.min) / (rangeValue)) * rangeDegree * (-1)) + defaultOption.startAngle);
                        //new_degrees.push(Math.round(((new_value[i] - defaultOption.min) / (rangeValue)) * rangeDegree * (-1)) + defaultOption.startAngle);
                    } else {
                        degrees.push(Math.round(((value[d] - defaultOption.min) / (rangeValue)) * rangeDegree) + defaultOption.startAngle);
                        // new_degrees.push(Math.round(((new_value[i] - defaultOption.min) / (rangeValue)) * rangeDegree) + defaultOption.startAngle);
                    }
                } else {
                    degrees.push(defaultOption.startAngle);
                }
            }
        }
        for (var s = 0; s < series.length; s++) {
            var defaultValue = series[s]['data'];
            for (var d = 0; d < series[s]['data'].length; d++) {        
                var gaugeType = defaultOption.type.type;
                //twoColorNeedle, rectangleNeedle, triangleNeedle, rangeBar
                if (defaultValue.length > 1) {
                    gaugeType = "rangeBar";
                }

                //Clear the canvas everytime a chart is drawn
                var padding = maxLengthOfTickText > 10 ? maxLengthOfTickText : 10;
                var centerX = W / 2;
                var centerY = H / 2;
                var outerRadius = Math.min(W, H) / 2 - defaultOption.lineWidth - defaultOption.tick.length - defaultOption.font.size;

                var delta1, delta2;
                delta1 = (defaultOption.startAngle % 360) >= 0 ? (defaultOption.startAngle % 360) : (defaultOption.startAngle % 360) + 360;
                delta2 = (defaultOption.endAngle % 360) >= 0 ? (defaultOption.endAngle % 360) : (defaultOption.endAngle % 360) + 360;
                //I
                if ((delta1 >= 90 && delta1 < delta2 || delta2 == 0) && (delta1 >= 270 || delta1 == 0) && (delta1 <= 360 || delta1 == 0) && (delta2 >= 270 || delta2 == 0) && (delta2 <= 360 || delta2 == 0) && !(delta1 == 0 && delta2 == 0)) {
                    if (W > H) {
                        centerX = W / 2 - (H / 2 - padding);
                        centerY = H / 2 + (H / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("1_1");
                    } else {
                        centerX = W / 2 - (W / 2 - padding);
                        centerY = H / 2 + (W / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("1_2");
                    }
                }
                //II
                else if ((delta1 < delta2) && (delta1 >= 180) && (delta1 <= 270) && (delta2 >= 180) && (delta2 <= 270)) {
                    if (W > H) {
                        centerX = W / 2 + (H / 2 - padding);
                        centerY = H / 2 + (H / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("2_1");
                    } else {
                        centerX = W / 2 + (W / 2 - padding);
                        centerY = H / 2 + (W / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("2_2");
                    }
                }
                //III
                else if ((delta1 < delta2) && (delta1 >= 90) && (delta1 <= 180) && (delta2 >= 90) && (delta2 <= 180)) {
                    if (W > H) {
                        centerX = W / 2 + (H / 2 - padding);
                        centerY = H / 2 - (H / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("3_1");
                    } else {
                        centerX = W / 2 + (W / 2 - padding);
                        centerY = H / 2 - (W / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("3_2");
                    }
                }
                //IV
                else if ((delta1 < delta2) && (delta1 >= 0 || delta1 == 360) && (delta1 <= 90 || delta1 == 360) && (delta2 >= 0 || delta2 == 360) && (delta2 <= 90 || delta2 == 360)) {
                    if (W > H) {
                        centerX = W / 2 - (H / 2 - padding);
                        centerY = H / 2 - (H / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("4_1");
                    } else {
                        centerX = W / 2 - (W / 2 - padding);
                        centerY = H / 2 - (W / 2 - padding);
                        outerRadius = 2 * outerRadius - 2 * padding;
                        //console.log("4_2");
                    }
                }
                //top
                else if ((delta1 < delta2 || delta2 == 0) && (delta1 >= 180) && (delta1 <= 360 || delta1 == 0) && (delta2 >= 180 || delta2 == 0) && (delta2 <= 360 || delta2 == 0)) {
                    if (W > H) {
                        if (W > 2 * H) {
                            centerX = W / 2;
                            centerY = H / 2 + (H / 2 - padding);
                            outerRadius = 2 * outerRadius - 2 * padding;
                            //console.log("t_1");
                        } else {
                            centerX = W / 2;
                            centerY = H / 2 + (W / 4 - padding);
                            outerRadius = W / 2 - defaultOption.lineWidth - defaultOption.tick.length - 2 * padding;
                            //console.log("t_2");
                        }
                    } else {
                        centerX = W / 2;
                        centerY = H / 2 + W / 4;
                        outerRadius = outerRadius - 2 * padding;
                        //console.log("t_3");
                    }
                }
                //left
                else if ((delta1 < delta2) && (delta1 >= 90) && (delta1 <= 270) && (delta2 >= 90) && (delta2 <= 270)) {
                    if (W > H) {
                        centerX = W / 2 + W / 4;
                        centerY = H / 2;
                        outerRadius = outerRadius - 2 * padding;
                        //console.log("L_1");
                    } else {
                        if (2 * W > H) {
                            centerX = W / 2 + (H / 4 - padding);
                            centerY = H / 2;
                            outerRadius = H / 2 - defaultOption.lineWidth - defaultOption.tick.length - 2 * padding;
                            //console.log("L_2");
                        } else {
                            centerX = W / 2 + (W / 2 - padding);
                            centerY = H / 2;
                            outerRadius = 2 * outerRadius - 2 * padding;
                            //console.log("L_3");
                        }
                    }
                }
                //bottom
                else if ((delta1 < delta2) && (delta1 >= 0 || delta1 == 360) && (delta1 <= 180 || delta1 == 360) && (delta2 >= 0 || delta2 == 360) && (delta2 <= 180 || delta2 == 360)) {
                    if (W > H) {
                        if (W > 2 * H) {
                            centerX = W / 2;
                            centerY = H / 2 - (H / 2 - padding);
                            outerRadius = 2 * outerRadius - 2 * padding;
                            //console.log("b_1");
                        } else {
                            centerX = W / 2;
                            centerY = H / 2 - (W / 4 - padding);
                            outerRadius = W / 2 - defaultOption.lineWidth - defaultOption.tick.length - 2 * padding;
                            //console.log("b_2");
                        }
                    } else {
                        centerX = W / 2;
                        centerY = H / 2 - W / 4;
                        outerRadius = outerRadius - 2 * padding;
                        //console.log("b_3");
                    }
                }
                //right
                else if ((delta1 >= 270 || delta1 == 0) && (delta1 <= 360 || delta1 == 0) && (delta2 >= 0) && (delta2 <= 90) && !(delta1 == 0 && delta2 == 0)) {
                    if (W > H) {
                        centerX = W / 2 - H / 4;
                        centerY = H / 2
                        outerRadius = outerRadius - 2 * padding;
                        //console.log("r_1");
                    } else {
                        if (2 * W > H) {
                            centerX = W / 2 - (H / 4 - padding);
                            centerY = H / 2;
                            outerRadius = H / 2 - defaultOption.lineWidth - defaultOption.tick.length - padding;
                            //console.log("r_2");
                        } else {
                            centerX = W / 2 - (W / 2 - padding);
                            centerY = H / 2;
                            outerRadius = 2 * outerRadius - 2 * padding;
                            //console.log("r_3");
                        }
                    }
                }
                //all
                else {
                    centerX = W / 2;
                    centerY = H / 2;
                    outerRadius = Math.min(W, H) / 2 - defaultOption.lineWidth - defaultOption.tick.length - defaultOption.font.size - 2 * padding;
                    //console.log("all_1");
                }
                if (outerRadius < 0) {
                    outerRadius = 0;
                }
                delta1 = null;
                delta2 = null;

                //Background 360 degree arc
                context.beginPath();
                context.strokeStyle = defaultOption.rangeContainer.backgroundColor;
                context.lineWidth = defaultOption.tick.lineWidth;
                context.arc(centerX, centerY, outerRadius, startAngle, endAngle, defaultOption.counterclockwise);
                context.stroke();

                //range Value color
                for (var i = 0; i < defaultOption.rangeContainer.ranges.length; i++) {
                    var rangeStartAngle;
                    var rangeEndAngle;
                    var rangeStartAngle = startAngle + ((defaultOption.rangeContainer.ranges[i].startValue - defaultOption.min) / rangeValue) * rangeDegree * Math.PI / 180;
                    var rangeEndAngle = startAngle + ((defaultOption.rangeContainer.ranges[i].endValue - defaultOption.min) / rangeValue) * rangeDegree * Math.PI / 180;
                    if (rangeStartAngle > rangeEndAngle) {
                        var temp = rangeStartAngle;
                        rangeEndAngle = rangeEndAngle;
                        rangeEndAngle = rangeStartAngle;
                        temp = null;
                    }
                    if (rangeStartAngle > endAngle) {
                        rangeStartAngle = endAngle;
                    }
                    if (rangeStartAngle < startAngle) {
                        rangeStartAngle = startAngle;
                    }
                    if (rangeEndAngle > endAngle) {
                        rangeEndAngle = endAngle;
                    }
                    if (rangeEndAngle < startAngle) {
                        rangeEndAngle = startAngle;
                    }
                    context.beginPath();
                    context.strokeStyle = defaultOption.rangeContainer.ranges[i].color ? defaultOption.rangeContainer.ranges[i].color : defaultOption.rangeContainer.backgroundColor;
                    context.lineWidth = defaultOption.tick.lineWidth;
                    context.arc(centerX, centerY, outerRadius, rangeStartAngle, rangeEndAngle, defaultOption.counterclockwise);
                    context.stroke();
                    rangeStartAngle = null;
                    rangeEndAngle = null;
                }

                //tick
                var tickValue = defaultOption.min;
                var tickInterval = defaultOption.tick.tickInterval;
                var tickMinTheta = (defaultOption.font.size * 2 / outerRadius);
                var tickThetaPrime = (tickInterval / rangeValue) * rangeDegree * Math.PI / 180;
                var tickStep = 1;
                if (tickMinTheta < 1) {
                    if (tickInterval != 0) {
                        if (tickMinTheta / tickThetaPrime <= 1) {
                            tickStep = 1;
                        } else {
                            tickStep = Math.ceil(tickMinTheta / tickThetaPrime);
                        }
                    } else {
                        var tickInterval_temp = 0;
                        tickInterval_temp = defaultOption.font.size * rangeValue / (outerRadius * rangeDegree);
                        var a;
                        if (Math.floor(Math.log(tickInterval_temp) / Math.log(10)) > 0) {
                            a = Math.floor(Math.log(tickInterval_temp) / Math.log(10));
                        } else {
                            a = Math.abs(Math.floor(Math.log(tickInterval_temp) / Math.log(10))) + 1;
                        }
                        tickInterval = Math.round(tickInterval_temp * Math.pow(10, a)) / Math.pow(10, a);
                        tickThetaPrime = (tickInterval / rangeValue) * rangeDegree * Math.PI / 180;

                        if (tickMinTheta / tickThetaPrime <= 1) {
                            tickStep = 1;
                        } else {
                            tickStep = Math.ceil(tickMinTheta / tickThetaPrime);
                        }
                        tickInterval_temp = a = null;
                    }
                    var tick_i = 0;
                    do {

                        var thita = startAngle + ((tickValue - defaultOption.min) / rangeValue) * rangeDegree * Math.PI / 180;

                        if (tick_i % tickStep == 0) {
                            context.beginPath();
                            context.lineWidth = 2;
                            context.strokeStyle = defaultOption.tick.color;
                            context.moveTo(centerX + (outerRadius + defaultOption.tick.length / 2) * Math.cos(thita), centerY + (outerRadius + defaultOption.tick.length / 2) * Math.sin(thita));
                            context.lineTo(centerX + (outerRadius - defaultOption.tick.length / 2) * Math.cos(thita), centerY + (outerRadius - defaultOption.tick.length / 2) * Math.sin(thita));
                            context.stroke();

                            //text
                            context.fillStyle = defaultOption.color;
                            context.font = defaultOption.font.size + 'px Calibri';
                            var text_width = context.measureText(tickValue).width;
                            if(defaultOption.tick.enable){
                                context.fillText(tickValue, centerX + (outerRadius + defaultOption.tick.length + padding / 2 + text_width / 2) * Math.cos(thita) - text_width / 2, centerY + (outerRadius + defaultOption.tick.length + text_width / 2) * Math.sin(thita) + text_width / 4);
                            }
                        }
                        if (tickInterval != 0) {
                            //if (tickValue == 0) {console.log(tickValue); }
                            //tickValue += tickInterval;
                            tickValue = defaultOption.min + this.accMul((tick_i + 1), tickInterval);
                            //if (tick_i < 200) { console.log(tickInterval); console.log((tick_i + 1) * tickInterval); console.log(tickValue); }

                        } else {
                            tickValue = defaultOption.max
                        }
                        tick_i++;

                        thita = null;
                        text_width = null;
                    } while (tickValue <= defaultOption.max);
                    /*debugger;*/
                    tickValue = tickInterval = tick_i = null;
                }

                if (gaugeType == "twoColorNeedle" || gaugeType == "rectangleNeedle" || gaugeType == "triangleNeedle") {
                    if (gaugeType == "twoColorNeedle") {
                        for (var i = 0; i < defaultValue.length; i++) {
                            var radians = degrees[i] * Math.PI / 180;
                            var radius = outerRadius - defaultOption.lineWidth * 2;
                            var lineWidth = defaultOption.lineWidth;
                            //first color
                            context.beginPath();
                            context.lineWidth = 2;
                            context.strokeStyle = defaultOption.type.color;
                            context.moveTo(centerX, centerY);
                            context.lineTo(centerX + (radius - 10) * Math.cos(radians), centerY + (radius - 10) * Math.sin(radians));
                            context.stroke();
                            //second color
                            context.beginPath();
                            context.strokeStyle = defaultOption.type.secondColor;
                            context.moveTo(centerX + (radius - 10) / 2 * Math.cos(radians), centerY + (radius - 10) / 2 * Math.sin(radians));
                            context.lineTo(centerX + (radius - 10) * Math.cos(radians), centerY + (radius - 10) * Math.sin(radians));
                            context.stroke();
                        }
                    } else if (gaugeType == "rectangleNeedle") {
                        for (var i = 0; i < defaultValue.length; i++) {
                            var radians = degrees[i] * Math.PI / 180;
                            var radius = outerRadius - defaultOption.lineWidth * 2;
                            var lineWidth = defaultOption.lineWidth;
                            //first color
                            context.beginPath();
                            context.lineWidth = 2;
                            context.strokeStyle = defaultOption.type.color;
                            context.moveTo(centerX, centerY);
                            context.lineTo(centerX + (radius - 10) * Math.cos(radians), centerY + (radius - 10) * Math.sin(radians));
                            context.stroke();
                        }
                    } else if (gaugeType == "triangleNeedle") {
                        for (var i = 0; i < defaultValue.length; i++) {
                            var radians = degrees[i] * Math.PI / 180;
                            var radius = outerRadius - defaultOption.lineWidth * 2;
                            var lineWidth = defaultOption.lineWidth;
                            //first color
                            context.beginPath();
                            context.lineWidth = 2;
                            context.strokeStyle = defaultOption.type.color;
                            context.fillStyle = defaultOption.type.color;
                            context.moveTo(centerX + (radius - 10) * Math.cos(radians), centerY + (radius - 10) * Math.sin(radians));
                            context.lineTo(centerX + 2 * Math.cos(radians + Math.PI / 2), centerY + 2 * Math.sin(radians + Math.PI / 2));
                            context.lineTo(centerX + 2 * Math.cos(radians - Math.PI / 2), centerY + 2 * Math.sin(radians - Math.PI / 2));
                            context.closePath();
                            context.fill();
                        }
                    }

                    //Lets add the text
                    if (defaultOption.label.endable && defaultOption.label.type == "textCloud") {
                        var textCloud_padding = defaultOption.label.padding;
                        for (var i = 0; i < defaultValue.length; i++) {
                            var display_text;
                            var backgroundRadius = outerRadius - defaultOption.lineWidth * 2;
                            if (backgroundRadius < 0) {
                                backgroundRadius = 0;
                            }
                            var radians = degrees[i] * Math.PI / 180;
                            var radius = backgroundRadius;
                            //context.fillStyle = color[i];

                            /*if (counterclockwise) {
                            display_text = ((-1) * Math.floor(degrees[i] - defaultOption.startAngle / rangeDegree * 100)) + "%";
                            } else {
                            display_text = Math.floor((degrees[i] - defaultOption.startAngle) / rangeDegree * 100) + "%";
                            }*/
                            if (typeof(defaultOption.label.customizeText) === 'function') {
                                display_text = defaultOption.label.customizeText(defaultValue[i], defaultOption);
                            } else {
                                if (Math.log(rangeValue) / Math.log(10) > 0) {
                                    display_text = Math.round(value[i] * 100) / 100;
                                } else {
                                    display_text = Math.round(value[i] * Math.pow(10, Math.floor(Math.log(rangeValue) / Math.log(10)) * 1)) / Math.pow(10, Math.floor(Math.log(rangeValue) / Math.log(10)));
                                }
                                if (!this.isNumeric(input_value[i])) {
                                    display_text = input_value[i];
                                }
                            }
                            context.font = defaultOption.label.font.size + 'px Calibri';
                            text_width = context.measureText(display_text).width;
                            //adding manual value to position y since the height of the text cannot
                            //be measured easily. There are hacks but we will keep it manual for now.
                            var diff_bound = 0;
                            if ((centerX + radius * Math.cos(radians) - textCloud_padding) + (text_width + 2 * textCloud_padding) > W) {
                                diff_bound = (centerX + radius * Math.cos(radians) - textCloud_padding) + (text_width + 2 * textCloud_padding) - W;
                            }
                            context.fillStyle = defaultOption.label.background;
                            context.fillRect(centerX + radius * Math.cos(radians) - textCloud_padding - diff_bound, centerY + radius * Math.sin(radians) - textCloud_padding - defaultOption.label.font.size, text_width + 2 * textCloud_padding, defaultOption.label.font.size + 2 * textCloud_padding);
                            context.fillStyle = defaultOption.label.font.color;
                            context.font = defaultOption.label.font.size + 'px Calibri';
                            context.fillText(display_text, centerX + radius * Math.cos(radians) - diff_bound, centerY + radius * Math.sin(radians));
                            backgroundRadius = null;
                            radians = null;
                            radius = null;
                            display_text = diff_bound = null;
                        }
                    }

                    //center dot
                    context.beginPath();
                    context.strokeStyle = defaultOption.type.color;
                    context.lineWidth = 5;
                    context.arc(centerX, centerY, 2, 0, Math.PI * 2, defaultOption.counterclockwise);
                    context.stroke();

                } else {
                    for (var i = 0; i < defaultValue.length; i++) {
                        //Background 360 degree arc

                        var backgroundRadius = outerRadius - defaultOption.lineWidth * (i + 1) * 2;
                        if (backgroundRadius < 0) {
                            backgroundRadius = 0;
                        }
                        /*context.beginPath();
                        context.strokeStyle = bgcolor;
                        context.lineWidth = defaultOption.lineWidth;
                        context.arc(W / 2, H / 2, backgroundRadius, startAngle, endAngle, defaultOption.counterclockwise);
                        //you can see the arc now
                        context.stroke();*/

                        //gauge will be a simple arc
                        var radians = degrees[i] * Math.PI / 180;
                        var radius = backgroundRadius;
                        var lineWidth = defaultOption.lineWidth;
                        context.beginPath();
                        context.strokeStyle = color[i];
                        context.lineWidth = lineWidth;
                        context.arc(centerX, centerY, radius, startAngle, radians, defaultOption.counterclockwise);
                        context.stroke();
                        backgroundRadius = null;
                        radians = null;
                        radius = null;
                        lineWidth = null;
                    }

                    //Lets add the text
                    if (defaultOption.label.endable && defaultOption.label.type == "textCloud") {
                        var textCloud_padding = defaultOption.label.padding;
                        for (var i = 0; i < defaultValue.length; i++) {
                            var display_text;
                            var backgroundRadius = outerRadius - defaultOption.lineWidth * (i + 1) * 2;
                            if (backgroundRadius < 0) {
                                backgroundRadius = 0;
                            }
                            var radians = degrees[i] * Math.PI / 180;
                            var radius = backgroundRadius;
                            //context.fillStyle = color[i];

                            /*if (counterclockwise) {
                            display_text = ((-1) * Math.floor(degrees[i] - defaultOption.startAngle / rangeDegree * 100)) + "%";
                            } else {
                            display_text = Math.floor((degrees[i] - defaultOption.startAngle) / rangeDegree * 100) + "%";
                            }*/
                            if (typeof(defaultOption.label.customizeText) === 'function') {
                                display_text = defaultOption.label.customizeText(defaultValue[i], defaultOption);
                            } else {
                                if (Math.log(rangeValue) / Math.log(10) > 0) {
                                    display_text = Math.round(value[i] * 100) / 100;
                                } else {
                                    display_text = Math.round(value[i] * Math.pow(10, Math.floor(Math.log(rangeValue) / Math.log(10)) * 1)) / Math.pow(10, Math.floor(Math.log(rangeValue) / Math.log(10)));
                                }
                                if (!this.isNumeric(input_value[i])) {
                                    display_text = input_value[i];
                                }
                            }
                            context.font = defaultOption.label.font.size + 'px Calibri';
                            text_width = context.measureText(display_text).width;
                            //adding manual value to position y since the height of the text cannot
                            //be measured easily. There are hacks but we will keep it manual for now.
                            var diff_bound = 0;
                            if ((centerX + radius * Math.cos(radians) - textCloud_padding) + (text_width + 2 * textCloud_padding) > W) {
                                diff_bound = (centerX + radius * Math.cos(radians) - textCloud_padding) + (text_width + 2 * textCloud_padding) - W;
                            }
                            context.fillStyle = defaultOption.label.background;
                            context.fillRect(centerX + radius * Math.cos(radians) - textCloud_padding - diff_bound, centerY + radius * Math.sin(radians) - textCloud_padding - defaultOption.label.font.size, text_width + 2 * textCloud_padding, defaultOption.label.font.size + 2 * textCloud_padding);
                            context.fillStyle = defaultOption.label.font.color;
                            context.font = defaultOption.label.font.size + 'px Calibri';
                            context.fillText(display_text, centerX + radius * Math.cos(radians) - diff_bound, centerY + radius * Math.sin(radians));
                            backgroundRadius = null;
                            radians = null;
                            radius = null;
                            display_text = diff_bound = null;
                        }
                    }
                }

                if (defaultOption.label.endable && defaultOption.label.type == "marker") {
                    for (var i = 0; i < defaultValue.length; i++) {
                        var radians = degrees[i] * Math.PI / 180;
                        var radius = outerRadius;
                        var lineWidth = 5;
                        //first color
                        context.beginPath();
                        context.lineWidth = 2;
                        context.strokeStyle = defaultOption.type.color;
                        context.moveTo(centerX + (radius) * Math.cos(radians), centerY + (radius) * Math.sin(radians));
                        var thita = Math.atan(5 / radius);
                        var r = (radius + 5 * 2) / Math.cos(thita);
                        //console.log(thita);
                        //console.log("r" + r);
                        //context.lineTo(W / 2, H / 2)
                        context.lineTo(centerX + r * Math.cos(radians + thita), centerY + r * Math.sin(radians + thita));
                        context.lineTo(centerX + r * Math.cos(radians - thita), centerY + r * Math.sin(radians - thita));
                        context.closePath();
                        context.fillStyle = color[i];
                        context.fill();
                        context.stroke();
                    }
                }

                //Angle in radians = angle in degrees * PI / 180
                outerRadius = null;

            } // end data
        } // end series


        defaultColor = null;
        for (var i = 0; i < defaultValue.length; i++) {

        }
        //value






        context.textBaseline = "alphabetic";
        context.textAlign = "start";
        //******************
        context.translate(-1 * initX, -1 * initY);
        //******************
    }
})(this)