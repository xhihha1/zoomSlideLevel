(function(global){

    hichart.prototype.defaultTimelineOptions = function () {
        var timelineOption = {
            timeline:{
                background: "rgba(80,80,80,0.8)",
                tick: {
                    enabled: true,
                    tickInterval: 10,
                    color: "#808080",
                    length: 5,
                    lineWidth: 2,
                    font: {
                        color: "#808080",
                        size: 16
                    }
                },
                lineWidth: 30,
                type: {
                    type: "simpleTimeLine"
                },
                label: {
                    endable: true,
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
        this.options = this.mergeDeep(timelineOption, this.options);
        return this;
    }
    
    hichart.prototype.plotTimelineData = function () {
        var context = this.context;
        var series = this.options.series;
        var rect = this.rect;
        var context = this.context;
        var margin = this.options.margin;
        var centerX = rect.x + rect.width / 2;
        var centerY = rect.y + rect.height / 2;
        var Val_max = this.options.Val_max;
        var Val_min = this.options.Val_min;
        var options = this.options;
        this.defaultTimelineOptions()
        var timelineOption = this.options.timeline;

        var cTop = rect.x,
        cLeft = rect.y;
        //dimensions
        var cW = rect.width;
        var cH = rect.height;
        //label width height top left
        var lW, lH, lT, lL;
        //tick width height top left
        var tW, tH, tT, tL;

        var drawX, drawY, drawW, drawH;

        var maxTime, minTime;
        var segmentsWidth = 0;

        //var tooltipObj = null;

        lT = cTop;
        lL = cLeft;

        if (timelineOption["tick"]["enabled"]) {
            tH = timelineOption["padding"]["width"] * 2 + timelineOption["tick"]["font"]["size"] + timelineOption["tick"]["lineWidth"];
        } else {
            tH = 0;
        }
    
        if (timelineOption["label"]["enabled"]) {
            lH = cH - tH;
            var maxLabelWidth = 0;
            if (Array.isArray(defaultValue)) {
                for (var i = 0; i < defaultValue.length; i++) {
                    if (defaultValue[i]["label"] && defaultValue[i]["label"].trim()) {
                        ctx.font = timelineOption["label"]["font"]["size"] + 'px ' + timelineOption["font"]["fontFamily"];
                        maxLabelWidth = Math.max(ctx.measureText(defaultValue[i]["label"]).width, maxLabelWidth);
                    }
                }
            }
            lW = timelineOption["padding"]["width"] * 2 + maxLabelWidth;
        } else {
            lW = 0;
            lH = cH - tH;
        }
    
        tW = cW - lW;
    
        lT = cTop;
        lL = cLeft;
    
        tT = lH;
        tL = lW;
    
        //drawing area 
        drawX = lW;
        drawY = cTop;
        drawW = cW - lW;
        drawH = cH - tH;
    
        //calculate max time & min time
        if (Array.isArray(defaultValue)) {
            for (var i = 0; i < defaultValue.length; i++) {
                for (var j = 0; Array.isArray(defaultValue[i]["times"]) && j < defaultValue[i]["times"].length; j++) {
                    maxTime = $.isNumeric(maxTime) ? Math.max(maxTime, defaultValue[i]["times"][j]["ending_time"]) : defaultValue[i]["times"][j]["ending_time"];
                    minTime = $.isNumeric(minTime) ? Math.min(minTime, defaultValue[i]["times"][j]["starting_time"]) : defaultValue[i]["times"][j]["starting_time"];
                }
            }
        } else {
            return false;
        }


    }

    function distanceX(value, max, min, interval) {
        return Math.round(((value - min) / (max - min)) * interval);
    }

    function drawRectLine(ctx, initX, initY, endX, endY, lineWidth) {
        //console.info(initX,initY - Math.round(lineWidth/2),endX - initX,lineWidth);
        ctx.rect(initX, initY - Math.round(lineWidth / 2), endX - initX, lineWidth);
    }

    //scale, tick
    function drawTick(ctx, maxTime, minTime, tickLength) {
        var tickInterval = defaultOption["tick"]["tickInterval"];
        var p = defaultOption["padding"]["width"];
        var totalTimeInterval = maxTime - minTime;
        var expectUnitTime = totalTimeInterval / tickInterval;
        var s1 = 1000; //1 second
        var s5 = s1 * 5; //5 second
        var s10 = s1 * 10; //10 second
        var s15 = s1 * 15; //15 second
        var s30 = s1 * 30; //30 second
        var m1 = 60000; //1 minute
        var m5 = m1 * 5; //5 minute
        var m10 = m1 * 10; //10 minute
        var m15 = m1 * 15; //15 minute
        var m30 = m1 * 30; //30 minute
        var h1 = 3600000; //1 hour
        var h12 = h1 * 12; //12 hour
        var d1 = 86400000; //1 day
        var d7 = d1 * 7; //7 day
        var d30 = d1 * 30;
        var d365 = d1 * 365;
        var y5 = d365 * 5;
        var y10 = d365 * 10;
        var dateFmt = 'MM/DD';
        ctx.font = defaultOption["tick"]["font"]["size"] + 'px ' + defaultOption["font"]["fontFamily"];
        ctx.fillStyle = defaultOption["tick"]["font"]["color"];
        ctx.textBaseline = "hanging";
        

        var unitNo = tickInterval;
        var unitTime = s1;
        var leftShiftTime = 0;
        if(expectUnitTime >= d7){
            unitNo = Math.floor(totalTimeInterval / d7);
            dateFmt = 'MM/DD';
            unitTime = d7;
            leftShiftTime = totalTimeInterval % d7;
        } else if(expectUnitTime >= d1){
            unitNo = Math.floor(totalTimeInterval / d1);
            dateFmt = 'MM/DD';
            unitTime = d1;
            leftShiftTime = totalTimeInterval % d1;
        } else if(expectUnitTime >= h12){
            unitNo = Math.floor(totalTimeInterval / h12);
            dateFmt = "hh:mm";
            unitTime = h12;
            leftShiftTime = totalTimeInterval % h12;
        } else if(expectUnitTime >= h1){
            unitNo = Math.floor(totalTimeInterval / h1);
            dateFmt = "hh:mm";
            unitTime = h1;
            leftShiftTime = totalTimeInterval % h1;
        } else if(expectUnitTime >= m30){
            unitNo = Math.floor(totalTimeInterval / m30);
            dateFmt = "hh:mm";
            unitTime = m30;
            leftShiftTime = totalTimeInterval % m30;
        } else if(expectUnitTime >= m15){
            unitNo = Math.floor(totalTimeInterval / m15);
            dateFmt = "hh:mm";
            unitTime = m15;
            leftShiftTime = totalTimeInterval % m15;
        } else if(expectUnitTime >= m10){
            unitNo = Math.floor(totalTimeInterval / m10);
            dateFmt = "hh:mm";
            unitTime = m10;
            leftShiftTime = totalTimeInterval % m10;
        } else if(expectUnitTime >= m1){
            unitNo = Math.floor(totalTimeInterval / m1);
            dateFmt = "hh:mm";
            unitTime = m1;
            leftShiftTime = totalTimeInterval % m1;
        } else if(expectUnitTime >= s30){
            unitNo = Math.floor(totalTimeInterval / s30);
            dateFmt = "mm:ss";
            unitTime = s30;
            leftShiftTime = totalTimeInterval % s30;
        } else if(expectUnitTime >= s15){
            unitNo = Math.floor(totalTimeInterval / s15);
            dateFmt = "mm:ss";
            unitTime = s15;
            leftShiftTime = totalTimeInterval % s15;
        } else if(expectUnitTime >= s10){
            unitNo = Math.floor(totalTimeInterval / s10);
            dateFmt = "mm:ss";
            unitTime = s10;
            leftShiftTime = totalTimeInterval % s10;
        } else if(expectUnitTime >= s5){
            unitNo = Math.floor(totalTimeInterval / s5);
            dateFmt = "mm:ss";
            unitTime = s5;
            leftShiftTime = totalTimeInterval % s5;
        } else if(expectUnitTime >= s1){
            unitNo = Math.floor(totalTimeInterval / s1);
            dateFmt = "mm:ss";
            unitTime = s1;
            leftShiftTime = totalTimeInterval % s1;
        } else {
            unitNo = Math.floor(totalTimeInterval / s1);
            dateFmt = "mm:ss";
            unitTime = s1;
            leftShiftTime = totalTimeInterval % s1;
        }
        var textlength = Math.max(ctx.measureText("99/99").width, ctx.measureText("99:99").width);

        var unitLength = (tickLength / totalTimeInterval) * unitTime;
        var leftShiftLength = (tickLength / totalTimeInterval) * leftShiftTime;
        var blankTextNo = Math.floor(textlength/unitLength)+1;
        for (var i = 0; i < unitNo; i++) {
            var dateTime = minTime + i * unitTime + leftShiftTime;
            var dateObj = new Date(dateTime);
            var dateStr = dateFormat(dateObj, dateFmt);
            var l = tL + p + Math.round(unitLength * i + leftShiftLength);
            var t = tT + p + defaultOption["tick"]["lineWidth"];
            
            //console.info(i,blankTextNo,i % blankTextNo,(i % blankTextNo) == 0);
            if((i % blankTextNo) == 0){
                ctx.beginPath();
                ctx.lineWidth = defaultOption["tick"]["lineWidth"];
                ctx.fillStyle = defaultOption["tick"]["font"]["color"];
                ctx.strokeStyle = defaultOption["tick"]["color"];
                ctx.textBaseline = "hanging";
                ctx.moveTo(l, tT + p);
                ctx.lineTo(l, t + 2);
                ctx.stroke();
                //ctx.fillText(dateStr, l, t + 2,unitLength);
                if(i==(unitNo - 1) && false){
                    //check final text length > right boundary
                }else{
                    ctx.fillText(dateStr, l, t + 2);
                }
                ctx.closePath(); 
            } 
        }


        //draw tick
        if (defaultOption["tick"]["enabled"]) {
            ctx.beginPath();
            ctx.lineWidth = defaultOption["tick"]["lineWidth"];
            ctx.strokeStyle = defaultOption["tick"]["color"];
            ctx.moveTo(tL + defaultOption["padding"]["width"], tT + defaultOption["padding"]["width"]);
            ctx.lineTo(tL + tW - defaultOption["padding"]["width"], tT + defaultOption["padding"]["width"]);
            ctx.stroke();
            //text
            ctx.textBaseline = "middle";
            //ctx.fillText();
            drawTick(ctx, maxTime, minTime, tW - 2 * defaultOption["padding"]["width"]);
        }

        if (defaultOption["label"]["enabled"]) {

        }

        if (Array.isArray(defaultValue)) {
            tooltipObj = null;
            var barInitX, barInitY, barEndX, noBar = 1,
                indexBar = 1;
            var barHSpace = Math.round((drawH - defaultOption["padding"]["width"] * 2) / noBar);
            var barTotalWidth = drawW - defaultOption["padding"]["width"] * 2;
            for (var i = 0; i < noBar; i++) {
                barInitX = drawX + defaultOption["padding"]["width"];
                barInitY = drawY + Math.round(barHSpace / 2) + barHSpace * i;
                barEndX = barInitX + barTotalWidth;
                ctx.beginPath();
                ctx.lineWidth = defaultOption["lineWidth"];
                ctx.strokeStyle = defaultOption["background"];
                ctx.moveTo(barInitX, barInitY);
                ctx.lineTo(barEndX, barInitY);
                ctx.stroke();

                //maxTime,minTime,maxTime, defaultValue[i]["times"][j]["ending_time"], defaultValue[i]["times"][j]["starting_time"]
                for (var j = 0; j < defaultValue.length; j++) {
                    for (var k = 0; Array.isArray(defaultValue[j]["times"]) && k < defaultValue[j]["times"].length; k++) {
                        //console.info('starting_time', defaultValue[j]["times"][k]["starting_time"], maxTime, minTime, barTotalWidth);
                        barInitX = drawX + defaultOption["padding"]["width"] + distanceX(defaultValue[j]["times"][k]["starting_time"], maxTime, minTime, barTotalWidth);
                        barInitY = drawY + Math.round(barHSpace / 2) + barHSpace * i;
                        barEndX = drawX + defaultOption["padding"]["width"] + distanceX(defaultValue[j]["times"][k]["ending_time"], maxTime, minTime, barTotalWidth);

                        ctx.beginPath();
                        // ctx.lineWidth = defaultOption["lineWidth"];
                        //ctx.strokeStyle = defaultOption["palette"][(j % 12)];
                        ctx.fillStyle = defaultOption["palette"][(j % 12)];
                        // ctx.moveTo(barInitX, barInitY);
                        // ctx.lineTo(barEndX, barInitY);
                        //console.info(barInitX, barEndX);
                        drawRectLine(ctx, barInitX, barInitY, barEndX, barInitY, defaultOption["lineWidth"]);

                        if (clientX && clientY && ctx.isPointInPath(clientX, clientY)) {
                            // ctx.font = 10 + 'px ' + defaultOption["font"]["fontFamily"];
                            // console.info('start',defaultValue[j]["times"][k]["starting_time"], defaultValue[j]["times"][k]["ending_time"]);
                            // var s = new Date(defaultValue[j]["times"][k]["starting_time"]).toLocaleString() + '---' + new Date(defaultValue[j]["times"][k]["ending_time"]).toLocaleString();
                            // ctx.fillText(s,10,10);
                            tooltipObj = {};
                            tooltipObj["starting_time"] = defaultValue[j]["times"][k]["starting_time"];
                            tooltipObj["ending_time"] = defaultValue[j]["times"][k]["ending_time"];
                            tooltipObj["backgroundColor"] = defaultOption["palette"][(j % 12)];
                        }
                        ctx.closePath();
                        ctx.fill();
                        //ctx.stroke();
                    }
                }

            }
            //draw tooltip
            drawTooltip(ctx, clientX, clientY);

        }

    }// end draw

    function dateFormat(date, format) {
        // Calculate date parts and replace instances in format string accordingly
        format = format.replace("ss", (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()); // Pad with '0' if needed
        format = format.replace("mm", (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()); // Pad with '0' if needed
        format = format.replace("hh", (date.getHours() < 10 ? '0' : '') + date.getHours()); // Pad with '0' if needed
        format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
        format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
        format = format.replace("YYYY", date.getFullYear());
        return format;
    };
})(this)