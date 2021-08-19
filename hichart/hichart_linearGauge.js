(function(global){
    hichart.prototype.defaultLinearGaugeOptions = function () {
        var defaultOption = {
            bar:{
                padding: 20
            },
            color: "#808080",
            font: {
                size: 16
            },
            tick: {
                tickInterval: 50,
                color: "#808080",
                length: 10,
                lineWidth: 2
            },
            lineWidth: 10,
            startAngle: -180,
            endAngle: 0,
            type: {
                type: "rangeBar", //circle,rhombus,rectangle,rangeBar
                color: "#CCCCCC",
                secondColor: "#FF0000"
            },
            animation: {
                enabled: false
            },
            rangeContainer: {
                offset: 0,
                backgroundColor: "#64A3D8",
                lineWidth:5,
                ranges: [
    //            { startValue: 0, endValue: 50, color: "#00FF00" },
    //            {startValue:70,endValue:100,color:"#FF0000"}
                        ]
            },
            tooltip: {
                enabled: true,
                background: "rgba(80,80,80,0.8)",
                font: {
                    color: "#ffffff",
                    size: 16
                },
                padding: 10,
                customizeText: "function object input value object"
            },
            label: {
                enabled: true,
                type: "marker", //marker, textCloud
                font: {
                    color: "#808080",
                    size: 16
                },
                padding: 10,
                background: "rgba(80,80,80,0.8)",
                customizeText: "function object input value object"
            },
            orientation:"horizontal",//vertical
            counterclockwise: false
        };
        var linearGaugeOption = {
            linearGauge: defaultOption
        }
        this.options = this.mergeDeep(linearGaugeOption, this.options);
        return this;
    }
    hichart.prototype.plotLinearGaugeData = function (dataSet) {
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
        this.defaultLinearGaugeOptions()
        var linearGaugeOption = this.options.linearGauge;
        //var defaultValue = series;
        var defaultOption = linearGaugeOption;
        var defaultColor = this.options.colorList;
        //-----------------------------------------------
        //dimensions
        var W = rect.width;
        var H = rect.height;

        //Variables
        var input_value = [];
        var value = [];
        var new_value = [];
        var difference = [];

        var color = [];

        if (!this.isNumeric(Val_max) || !this.isNumeric(Val_min)) {
            console.error("not number");
            return false;
        }
        var rangeValue = Val_max - Val_min;
        if (rangeValue <= 0) {
            error("range error");
            return false;
        }
        var animation_loop,redraw_loop;

        //******************
        context.translate(initX, initY);
        //******************

        defaultOption.max = Val_max;
        defaultOption.min = Val_min;
        this.options.linearGauge.tempSetting = {}
        this.options.linearGauge.tempSetting.color = color;


        for (var s = 0; s < series.length; s++) {
            for(var d = 0; d < series[s]['data'].length; d++){
                //color
                if (series[s]['data'][d].color) {
                    color.push(series[s]['data'][d].color);
                } else {
                    color.push(defaultColor[d]);
                }
                // input_value
                input_value.push(series[s]['data'][d].value);
                // value
                // value.push(Val_min);
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
            }

            var defaultValue = series[s]['data'];
            var gaugeType = defaultOption.type.type;
            //circle,rhombus,rectangle,rangeBar
            if (defaultValue.length > 1) {
                gaugeType = "rangeBar";
            }

            //------------------------------------------------------------------draw
            //Clear the canvas everytime a chart is drawn
            var padding = defaultOption.bar.padding;
            // context.clearRect(0, 0, W, H);
            var lineWidth = defaultOption.lineWidth;
            var max = Val_max;
            var min = Val_min;
            //axies
            context.beginPath();

            if (defaultOption.orientation == "vertical") {
                var end_top = padding;
                var start_top = H - padding;
                var start_left = W / 2;
                var end_left = W / 2;
                var meterLength = H - padding*2;
                if (gaugeType == "rangeBar") {
                    var numberOfBar = value.length;
                    start_left = start_left - (padding + lineWidth) * numberOfBar / 2;
                    end_left = end_left - (padding + lineWidth) * numberOfBar / 2;
                    axies(start_left, end_left, start_top, end_top, defaultOption.orientation, defaultOption, context);
                    for (var i = 0; i < defaultValue.length; i++) {
                        context.beginPath();
                        context.strokeStyle = color[i];
                        context.lineWidth = lineWidth;
                        context.moveTo(start_left + (padding + lineWidth)*(i+1), start_top);
                        var width = (value[i] - min)>0? meterLength * (value[i] - min) / rangeValue:0;
                        context.lineTo(start_left + (padding + lineWidth) * (i + 1), start_top - width);
                        context.stroke();
                        //marker
                        label(start_left - defaultOption.rangeContainer.lineWidth, start_top - width, i, defaultOption.orientation, defaultOption ,context, series[s]['data'])
                    }
                }
                else {
                    axies(start_left, end_left, start_top, end_top, defaultOption.orientation, defaultOption, context);
    
                    for (var i = 0; i < defaultValue.length; i++) {
                        context.beginPath();
                        
                        context.lineWidth = lineWidth;
                        var width = (value[i] - min) > 0 ? meterLength * (value[i] - min) / rangeValue : 0;
                        if (gaugeType == "circle") {
                            context.strokeStyle = color[i];
                            context.arc(start_left, start_top - width, 1, 0, 2 * Math.PI, linearGaugeOption.counterclockwise);
                            context.stroke();
                        }
                        else if (gaugeType == "rhombus") {
                            context.lineWidth = 1;
                            context.fillStyle = color[i];
                            context.moveTo(start_left, start_top - width - lineWidth/2);
                            context.lineTo(start_left - lineWidth/2, start_top - width);
                            context.lineTo(start_left, start_top - width + lineWidth/2);
                            context.lineTo(start_left + lineWidth/2, start_top - width);
                            context.closePath();
                            context.fill();
                        }
                        else {
                            //rectangle
                            context.lineWidth = 1;
                            context.fillStyle = color[i];
                            context.fillRect(start_left - lineWidth / 2, start_top - width - lineWidth / 2, lineWidth, lineWidth);
                        }
                        //marker
                        label(start_left - lineWidth, start_top - width, i, defaultOption.orientation, defaultOption ,context, series[s]['data']);
                    }
                }
            }
            else {
                var start_top = H / 2;
                var end_top = H / 2;
                var start_left = padding;
                var end_left = W - padding;
                var meterLength = W - padding * 2;
                if (gaugeType == "rangeBar") {
                    var numberOfBar = value.length;
                    start_top = start_top - (padding + lineWidth) * numberOfBar / 2;
                    end_top = end_top - (padding + lineWidth) * numberOfBar / 2;
                    axies(start_left, end_left, start_top, end_top, defaultOption.orientation, defaultOption, context);
    
                    for (var i = 0; i < defaultValue.length; i++) {
                        context.beginPath();
                        context.strokeStyle = color[i];
                        context.lineWidth = lineWidth;
                        context.moveTo(start_left, start_top + (padding + lineWidth) * (i + 1));
                        var width = (value[i] - min) > 0 ? meterLength * (value[i] - min) / rangeValue : 0;
                        context.lineTo(start_left + width, end_top + (padding + lineWidth) * (i + 1));
                        context.stroke();
                        //marker
                        label(start_left + width, start_top - defaultOption.rangeContainer.lineWidth, i, defaultOption.orientation, defaultOption ,context, series[s]['data']);
                    }
    
                }
                else {
                    axies(start_left, end_left, start_top, end_top, defaultOption.orientation, defaultOption, context);
    
                    for (var i = 0; i < defaultValue.length; i++) {
                        context.beginPath();
                        
                        context.lineWidth = lineWidth;
                        var width = (value[i] - min) > 0 ? meterLength * (value[i] - min) / rangeValue : 0;
                        if (gaugeType == "circle") {
                            context.strokeStyle = color[i];
                            context.arc(start_left + width, start_top, 1, 0, 2 * Math.PI, linearGaugeOption.counterclockwise);
                            context.stroke();
                        }
                        else if (gaugeType == "rhombus") {
                            context.lineWidth = 1;
                            context.fillStyle = color[i];
                            context.moveTo(start_left + width, start_top - lineWidth/2);
                            context.lineTo(start_left + width - lineWidth/2, start_top);
                            context.lineTo(start_left + width, start_top + lineWidth/2);
                            context.lineTo(start_left + width + lineWidth/2, start_top);
                            context.closePath();
                            context.fill();
                        }
                        else {
                            //rectangle
                            context.lineWidth = 1;
                            context.fillStyle = color[i];
                            context.fillRect(start_left - lineWidth / 2, start_top - width - lineWidth / 2, lineWidth, lineWidth);
                        }
                        //marker
                        label(start_left + width, start_top - lineWidth, i, defaultOption.orientation, defaultOption ,context, series[s]['data']);
                    }
                }
                
            }
            

        }
        context.textBaseline = "alphabetic";
        context.textAlign = "start";
        //******************
        context.translate(-1*initX, -1*initY);
        //******************

    }


    function axies(s_left, e_left, s_top, e_top, orientation, defaultOption ,context) {
        var max = defaultOption.max;
        var min = defaultOption.min;
        var axiesWidth = Math.abs(e_left - s_left);
        var axiesHeight = Math.abs(s_top - e_top);
        var text = "", text_width, text_height;
        //main range
        context.beginPath();
        context.strokeStyle = defaultOption.rangeContainer.backgroundColor;
        context.lineWidth = defaultOption.rangeContainer.lineWidth;
        context.moveTo(s_left, s_top);
        context.lineTo(e_left, e_top);
        context.stroke();
        //subrange
        var ranges = defaultOption.rangeContainer.ranges;
        for (var i = 0; i < ranges.length; i++) {
            context.beginPath();
            context.strokeStyle = ranges[i].color;
            context.lineWidth = defaultOption.rangeContainer.lineWidth;
            var sv = ranges[i].startValue;
            var ev = ranges[i].endValue;
            if (sv - min < 0) { sv = min; }
            else if (sv - max > 0) { sv = max; }
            if (ev - min < 0) { ev = min; }
            else if (ev - max > 0) { ev = max; }

            var start_widthScale = (sv - min) > 0 ? (sv - min) / (max - min) : 0;
            var end_widthScale = (ev - min) > 0 ? (ev - min) / (max - min) : 0;
            var subrangeSV_left = orientation == "vertical" ? s_left : s_left + start_widthScale * axiesWidth;
            var subrangeSV_top = orientation == "vertical" ? s_top - start_widthScale * axiesHeight : s_top;
            var subrangeEV_left = orientation == "vertical" ? s_left : s_left + end_widthScale * axiesWidth;
            var subrangeEV_top = orientation == "vertical" ? s_top - end_widthScale * axiesHeight : s_top;
            context.moveTo(subrangeSV_left, subrangeSV_top);
            context.lineTo(subrangeEV_left, subrangeEV_top);
            context.stroke();
        }
        //tick min
        var tickLength = defaultOption.tick.length;
        context.beginPath();
        context.strokeStyle = defaultOption.tick.color;
        context.lineWidth = defaultOption.tick.lineWidth;
        if (orientation == "vertical") {
            context.moveTo(s_left, s_top);
            context.lineTo(s_left - tickLength, s_top);
        }
        else {
            context.moveTo(s_left, s_top);
            context.lineTo(s_left, s_top - tickLength);
        }
        context.stroke();
        //tick max
        context.beginPath();
        context.strokeStyle = defaultOption.tick.color;
        context.lineWidth = defaultOption.tick.lineWidth;
        if (orientation == "vertical") {
            context.moveTo(e_left, e_top);
            context.lineTo(e_left - tickLength, e_top);
        }
        else {
            context.moveTo(e_left, e_top);
            context.lineTo(e_left, e_top - tickLength);
        }
        context.stroke();

        //tick
        var tickValue = min + defaultOption.tick.tickInterval;
        if (tickValue != 0) {
            do {
                context.beginPath();
                context.strokeStyle = defaultOption.tick.color;
                context.lineWidth = defaultOption.tick.lineWidth;

                var tickScale = (tickValue - min) / (max - min);
                if (orientation == "vertical") {
                    context.moveTo(s_left, s_top - axiesHeight * tickScale);
                    context.lineTo(s_left - tickLength, s_top - axiesHeight * tickScale);
                }
                else {
                    context.moveTo(s_left + axiesWidth * tickScale, s_top);
                    context.lineTo(s_left + axiesWidth * tickScale, s_top - tickLength);
                }
                context.stroke();

                //text
                context.fillStyle = defaultOption.color;
                context.font = defaultOption.font.size + 'px Calibri';
                text = tickValue;
                text_width = context.measureText(text).width;
                text_height = 10;
                if (orientation == "vertical") {
                    context.fillText(text, s_left - text_width - tickLength, s_top - axiesHeight * tickScale);
                }
                else {
                    context.fillText(text, s_left - text_width / 2 + axiesWidth * tickScale, s_top - tickLength);
                }

                tickValue += defaultOption.tick.tickInterval;
            } while (tickValue < max);
        }
        
        //text min
        context.fillStyle = defaultOption.color;
        // context.font = "10px";
        context.font = defaultOption.font.size + 'px Calibri';
        text = defaultOption.min;
        text_width = context.measureText(text).width;
        text_height = 10;
        if (orientation == "vertical") {
            context.fillText(text, s_left - text_width - tickLength, s_top);
        }
        else {
            context.fillText(text, s_left - text_width / 2, s_top - tickLength);
        }

        //text max
        context.fillStyle = defaultOption.color;
        context.font = defaultOption.font.size + 'px Calibri';
        // context.font = "10px";
        text = defaultOption.max;
        text_width = context.measureText(text).width;
        text_height = 10;
        if (orientation == "vertical") {
            context.fillText(text, e_left - text_width - tickLength, e_top);
        }
        else {
            context.fillText(text, e_left - text_width / 2, e_top - tickLength);
        }
    }

    function label(left, top, i, orientation, defaultOption ,context, defaultValue) {
        var color = defaultOption.tempSetting.color;
        var callHichart = new hichart();
        if (!defaultOption.label.enabled) { return; }
        var text = "", text_width, text_height, display_text;
        if (defaultOption.label.type == "marker") {
            context.beginPath();
            context.lineWidth = 2;
            var radius = 10;
            if (orientation == "vertical") {
                context.strokeStyle = "#fff";
                context.fillStyle = color[i];
                context.moveTo(left + radius * Math.cos(5 / 6 * Math.PI), top + radius * Math.sin(5 / 6 * Math.PI))
                context.lineTo(left, top);
                context.lineTo(left + radius * Math.cos(-5 / 6 * Math.PI), top + radius * Math.sin(-5 / 6 * Math.PI));
                context.closePath();
                context.stroke();
                context.fill();
            }
            else {
                context.strokeStyle = "#fff";
                context.fillStyle = color[i];
                context.moveTo(left + radius * Math.cos(-Math.PI/3), top + radius * Math.sin(-Math.PI/3))
                context.lineTo(left, top);
                context.lineTo(left + radius * Math.cos(-2 / 3 * Math.PI), top + radius * Math.sin(-2 / 3 * Math.PI));
                context.closePath();
                context.stroke();
                context.fill();
            }
        } else {
            //textCloud
            var display_text, text_width;
            if (typeof(defaultOption.label.customizeText) == 'function') {
                display_text = defaultOption.label.customizeText(defaultValue[i], defaultOption);
            } else {
                if (!callHichart.isNumeric(defaultValue[i].value)) {
                    display_text = defaultValue[i].value;
                }
                else if (Math.log(defaultValue[i].value) / Math.log(10) > 0) {
                    display_text = Math.round(defaultValue[i].value * 100) / 100;
                }
                else {
                    //display_text = Math.round(defaultValue[i].value * Math.pow(10, Math.floor(Math.log(defaultValue[i].value) / Math.log(10)) * 1)) / Math.pow(10, Math.floor(Math.log(defaultValue[i].value) / Math.log(10)));
                    display_text = defaultValue[i].value;
                }
            }
            var text_padding = defaultOption.label.padding;
            context.font = defaultOption.label.font.size + 'px Calibri';
            text_width = context.measureText(display_text).width;
            text_height = defaultOption.label.font.size;
            //context.fillStyle = defaultOption.label.font.color;
            var tickLength = defaultOption.tick.length;
            if (orientation == "vertical") {
                context.fillStyle = defaultOption.label.background;
                context.fillRect(left - text_width - text_padding - tickLength, top - text_height / 2 - text_padding, text_width + 2 * text_padding, text_height + 2 * text_padding);
                context.fillStyle = color[i];
                context.font = defaultOption.label.font.size + 'px Calibri';
                context.fillText(display_text, left - text_width - tickLength, top + text_height / 4); 
            }
            else {
                context.fillStyle = defaultOption.label.background;
                context.fillRect(left - text_width / 2 - text_padding, top - 3 * text_height / 4 - text_padding - tickLength, text_width + 2 * text_padding, text_height + 2 * text_padding);
                context.fillStyle = color[i];
                context.font = defaultOption.label.font.size + 'px Calibri';
                context.fillText(display_text, left - text_width / 2, top - tickLength); 
            }
            
        }
    }

})(this)