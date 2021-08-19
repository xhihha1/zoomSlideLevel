(function (global) {
    hichart.prototype.defaultTimelineMultiOptions = function () {
        var timelineOption = {
            timeline: {
                background: "rgba(80,80,80,0.8)",
                padding: {
                    width: 2
                },
                font: {
                    autoFit: true,
                    size: 16,
                    fontFamily: 'Calibri'
                },
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
                    type: "simpleTimeLine" //simpleTimeLine, multiTimeLine
                },
                palette: ['#A7CC61', '#64A3D8', '#ED4853', '#FFDD5C', '#FF834D', '#C4B7DA', '#AEC18B', '#7D9DB7', '#B46267', '#ECDB9B', '#D19378', '#C2BBCD'],
                tooltip: {
                    enabled: true,
                    background: "rgba(80,80,80,0.8)",
                    font: {
                        color: "#ff0000",
                        size: 16
                    },
                    padding: 10,
                    customizeText: "function object input value object"
                },
                label: {
                    enabled: true,
                    type: "textCloud", //marker, textCloud
                    font: {
                        color: "#808080",
                        size: 16
                    },
                    background: "rgba(80,80,80,0.8)",
                    customizeText: "function object input value object"
                },
                aimingLine: {
                    enabled: false,
                    color: "#808080"
                }
            }
        }
        
        this.options = this.mergeDeep(timelineOption, this.options);
        return this;
    }

    hichart.prototype.plotTimelineMultiData = function () {
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
        this.defaultTimelineMultiOptions()
        var timelineOption = this.options.timeline;
        //-----------------------------------------------
        var defaultValue = series;

        var cTop = 0,
            cLeft = 0;
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

        var tooltipObj = null;

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
                        context.font = timelineOption["label"]["font"]["size"] + 'px ' + timelineOption["font"]["fontFamily"];
                        maxLabelWidth = Math.max(context.measureText(defaultValue[i]["label"]).width, maxLabelWidth);
                    }
                }
            }
            lW = Math.ceil(timelineOption["padding"]["width"] * 2 + maxLabelWidth);
        } else {
            lW = 0;
            lH = cH - tH;
        }

        tW = cW - lW;

        lT = cTop;
        lL = cLeft;

        

        //drawing area 
        drawX = lW;
        drawY = cTop;
        drawW = cW - lW;
        drawH = cH - tH;

        this.options.timeline.tempSetting = {}
        this.options.timeline.tempSetting.tT = tT = lH;
        this.options.timeline.tempSetting.tL = tL = lW;
        this.options.timeline.tempSetting.cTop = cTop;
        this.options.timeline.tempSetting.cLeft = cLeft;
        this.options.timeline.tempSetting.cW = cW;
        this.options.timeline.tempSetting.cH = cH;
        this.options.timeline.tempSetting.lT = lT;
        this.options.timeline.tempSetting.lL = lL;
        this.options.timeline.tempSetting.drawW = drawW;
        this.options.timeline.tempSetting.drawH = drawH;
        this.options.timeline.tempSetting.rect = rect;


        //calculate max time & min time
        if (Array.isArray(defaultValue)) {
            for (var mi = 0; mi < defaultValue.length; mi++) {
                if (Array.isArray(defaultValue[mi]["data"])) {
                    for (var i = 0; i < defaultValue[mi]["data"].length; i++) {
                        for (var j = 0; Array.isArray(defaultValue[mi]["data"][i]["times"]) && j < defaultValue[mi]["data"][i]["times"].length; j++) {
                            maxTime = this.isNumeric(maxTime) ? Math.max(maxTime, defaultValue[mi]["data"][i]["times"][j]["ending_time"]) : defaultValue[mi]["data"][i]["times"][j]["ending_time"];
                            minTime = this.isNumeric(minTime) ? Math.min(minTime, defaultValue[mi]["data"][i]["times"][j]["starting_time"]) : defaultValue[mi]["data"][i]["times"][j]["starting_time"];
                        }
                    }
                }
            }
        } else {
            return false;
        }


        //draw tick
        if (timelineOption["tick"]["enabled"]) {
            context.beginPath();
            context.lineWidth = timelineOption["tick"]["lineWidth"];
            context.strokeStyle = timelineOption["tick"]["color"];
            context.moveTo( rect.x + tL + timelineOption["padding"]["width"], rect.y + tT + timelineOption["padding"]["width"]);
            context.lineTo( rect.x + tL + tW - timelineOption["padding"]["width"], rect.y + tT + timelineOption["padding"]["width"]);
            context.stroke();
            //text
            context.textBaseline = "middle";
            //context.fillText();
            drawTick(context, maxTime, minTime, tW - 2 * timelineOption["padding"]["width"], this.options);
        }

        if (timelineOption["label"]["enabled"]) {
            drawlabel(context, this.options);
        }

        if (Array.isArray(defaultValue) && defaultValue.length > 0) {
            tooltipObj = null;
            var barInitX, barInitY, barEndX, noBar = defaultValue.length,
                indexBar = 1,
                barHSpace, barTotalWidth;


            if (timelineOption["type"]["type"] == "simpleTimeLine") {
                noBar = defaultValue.length;
            } else if (timelineOption["type"]["type"] == "multiTimeLine") {
                noBar = 0;
                for (var i = 0; i < defaultValue.length; i++) {
                    noBar += defaultValue[i]["data"].length;
                }
            }

            barHSpace = Math.round((drawH - timelineOption["padding"]["width"] * 2) / noBar);
            barTotalWidth = drawW - timelineOption["padding"]["width"] * 2;

            //draw background
            for (var i = 0; i < noBar; i++) {
                barInitX = rect.x + drawX + timelineOption["padding"]["width"];
                barInitY = rect.y + drawY + Math.round(barHSpace / 2) + barHSpace * i;
                barEndX = barInitX + barTotalWidth;
                context.beginPath();
                context.lineWidth = timelineOption["lineWidth"];
                context.strokeStyle = timelineOption["background"];
                context.moveTo(barInitX, barInitY);
                context.lineTo(barEndX, barInitY);
                context.stroke();
            }

            var indexOfBar = -1;
            for (var i = 0; i < defaultValue.length; i++) {

                //maxTime,minTime,maxTime, defaultValue[i]["times"][j]["ending_time"], defaultValue[i]["times"][j]["starting_time"]
                for (var j = 0; j < defaultValue[i]["data"].length; j++) {
                    if (timelineOption["type"]["type"] == "simpleTimeLine") {
                        indexOfBar = i;
                    } else if (timelineOption["type"]["type"] == "multiTimeLine") {
                        indexOfBar += 1;
                    }
                    for (var k = 0; Array.isArray(defaultValue[i]["data"][j]["times"]) && k < defaultValue[i]["data"][j]["times"].length; k++) {
                        //console.info('starting_time', defaultValue[j]["times"][k]["starting_time"], maxTime, minTime, barTotalWidth);
                        barInitX = rect.x + drawX + timelineOption["padding"]["width"] + distanceX(defaultValue[i]["data"][j]["times"][k]["starting_time"], maxTime, minTime, barTotalWidth);
                        barInitY = rect.y + drawY + Math.round(barHSpace / 2) + barHSpace * indexOfBar;
                        barEndX = rect.x + drawX + timelineOption["padding"]["width"] + distanceX(defaultValue[i]["data"][j]["times"][k]["ending_time"], maxTime, minTime, barTotalWidth);

                        context.beginPath();
                        // context.lineWidth = timelineOption["lineWidth"];
                        //context.strokeStyle = timelineOption["palette"][(j % 12)];
                        context.fillStyle = timelineOption["palette"][(j % 12)];
                        // context.moveTo(barInitX, barInitY);
                        // context.lineTo(barEndX, barInitY);
                        // console.info(barInitX, barEndX);
                        drawRectLine(context, barInitX, barInitY, barEndX, barInitY, timelineOption["lineWidth"]);
                        context.closePath();
                        context.fill();



                        /*if (clientX && clientY && context.isPointInPath(clientX, clientY)) {
                            // context.font = 10 + 'px ' + timelineOption["font"]["fontFamily"];
                            // console.info('start',defaultValue[j]["times"][k]["starting_time"], defaultValue[j]["times"][k]["ending_time"]);
                            // var s = new Date(defaultValue[j]["times"][k]["starting_time"]).toLocaleString() + '---' + new Date(defaultValue[j]["times"][k]["ending_time"]).toLocaleString();
                            // context.fillText(s,10,10);
                            tooltipObj = {};
                            tooltipObj["starting_time"] = defaultValue[i]["data"][j]["times"][k]["starting_time"];
                            tooltipObj["ending_time"] = defaultValue[i]["data"][j]["times"][k]["ending_time"];
                            tooltipObj["backgroundColor"] = timelineOption["palette"][(j % 12)];

                            context.save();
                            context.clip();
                            context.strokeStyle = 'rgba(0,0,0,0.5)';
                            context.lineWidth = 1;
                            var slicenNo = Math.round((barEndX - barInitX) / 3);
                            for (var sn = 0; sn < slicenNo; sn++) {

                                context.beginPath();
                                context.moveTo(barInitX + sn * 3, barInitY - timelineOption["lineWidth"]);
                                context.lineTo(barInitX + sn * 3, barInitY + timelineOption["lineWidth"]);
                                context.stroke();
                            }

                            context.restore();
                        }*/

                        //context.stroke();
                    }
                }

            }
            //draw tooltip
            //drawTooltip(context, clientX, clientY);

        }


    } // end


    function distanceX(value, max, min, interval) {
        return Math.round(((value - min) / (max - min)) * interval);
    }

    function drawRectLine(context, initX, initY, endX, endY, lineWidth) {
        //console.info(initX,initY - Math.round(lineWidth/2),endX - initX,lineWidth);
        context.rect(initX, initY - Math.round(lineWidth / 2), endX - initX, lineWidth);
    }

    //scale, tick
    function drawTick(context, maxTime, minTime, tickLength, options) {
        var timelineOption = options.timeline;
        var tT = options.timeline.tempSetting.tT;
        var tL = options.timeline.tempSetting.tL;
        var cTop = options.timeline.tempSetting.cTop;
        var cLeft = options.timeline.tempSetting.cLeft;
        var cW = options.timeline.tempSetting.cW;
        var rect = options.timeline.tempSetting.rect;
        var tickInterval = timelineOption["tick"]["tickInterval"];
        var p = timelineOption["padding"]["width"];
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
        context.font = timelineOption["tick"]["font"]["size"] + 'px ' + timelineOption["font"]["fontFamily"];
        context.fillStyle = timelineOption["tick"]["font"]["color"];
        context.textBaseline = "hanging";


        var unitNo = tickInterval;
        var unitTime = s1;
        var leftShiftTime = 0;
        if (expectUnitTime >= d7) {
            unitNo = Math.floor(totalTimeInterval / d7);
            dateFmt = 'MM/DD';
            unitTime = d7;
            leftShiftTime = totalTimeInterval % d7;
        } else if (expectUnitTime >= d1) {
            unitNo = Math.floor(totalTimeInterval / d1);
            dateFmt = 'MM/DD';
            unitTime = d1;
            leftShiftTime = totalTimeInterval % d1;
        } else if (expectUnitTime >= h12) {
            unitNo = Math.floor(totalTimeInterval / h12);
            dateFmt = "hh:mm";
            unitTime = h12;
            leftShiftTime = totalTimeInterval % h12;
        } else if (expectUnitTime >= h1) {
            unitNo = Math.floor(totalTimeInterval / h1);
            dateFmt = "hh:mm";
            unitTime = h1;
            leftShiftTime = totalTimeInterval % h1;
        } else if (expectUnitTime >= m30) {
            unitNo = Math.floor(totalTimeInterval / m30);
            dateFmt = "hh:mm";
            unitTime = m30;
            leftShiftTime = totalTimeInterval % m30;
        } else if (expectUnitTime >= m15) {
            unitNo = Math.floor(totalTimeInterval / m15);
            dateFmt = "hh:mm";
            unitTime = m15;
            leftShiftTime = totalTimeInterval % m15;
        } else if (expectUnitTime >= m10) {
            unitNo = Math.floor(totalTimeInterval / m10);
            dateFmt = "hh:mm";
            unitTime = m10;
            leftShiftTime = totalTimeInterval % m10;
        } else if (expectUnitTime >= m1) {
            unitNo = Math.floor(totalTimeInterval / m1);
            dateFmt = "hh:mm";
            unitTime = m1;
            leftShiftTime = totalTimeInterval % m1;
        } else if (expectUnitTime >= s30) {
            unitNo = Math.floor(totalTimeInterval / s30);
            dateFmt = "mm:ss";
            unitTime = s30;
            leftShiftTime = totalTimeInterval % s30;
        } else if (expectUnitTime >= s15) {
            unitNo = Math.floor(totalTimeInterval / s15);
            dateFmt = "mm:ss";
            unitTime = s15;
            leftShiftTime = totalTimeInterval % s15;
        } else if (expectUnitTime >= s10) {
            unitNo = Math.floor(totalTimeInterval / s10);
            dateFmt = "mm:ss";
            unitTime = s10;
            leftShiftTime = totalTimeInterval % s10;
        } else if (expectUnitTime >= s5) {
            unitNo = Math.floor(totalTimeInterval / s5);
            dateFmt = "mm:ss";
            unitTime = s5;
            leftShiftTime = totalTimeInterval % s5;
        } else if (expectUnitTime >= s1) {
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
        var textlength = Math.max(context.measureText("99/99").width, context.measureText("99:99").width);

        var unitLength = (tickLength / totalTimeInterval) * unitTime;
        var leftShiftLength = (tickLength / totalTimeInterval) * leftShiftTime;
        var blankTextNo = Math.floor(textlength / unitLength) + 1;
        for (var i = 0; i < unitNo; i++) {
            var dateTime = minTime + i * unitTime + leftShiftTime;
            var dateObj = new Date(dateTime);
            var dateStr = dateFormat(dateObj, dateFmt);
            var l = tL + p + Math.round(unitLength * i + leftShiftLength);
            var t = tT + p + timelineOption["tick"]["lineWidth"];

            //console.info(i,blankTextNo,i % blankTextNo,(i % blankTextNo) == 0);
            if ((i % blankTextNo) == 0) {
                context.beginPath();
                context.lineWidth = timelineOption["tick"]["lineWidth"];
                context.fillStyle = timelineOption["tick"]["font"]["color"];
                context.strokeStyle = timelineOption["tick"]["color"];
                context.textBaseline = "hanging";
                context.moveTo(rect.x + l, rect.y + tT + p);
                context.lineTo(rect.x + l, rect.y + t + 2);
                context.stroke();
                //context.fillText(dateStr, l, t + 2,unitLength);
                if ((l + textlength) > (cLeft + cW)) {
                    //check final text length > right boundary
                } else {
                    context.fillText(dateStr, rect.x + l, rect.y + t + 2);
                }
                context.closePath();
            }

        }

    }

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

    function drawlabel(context, options) {
        var defaultValue = options.series;
        var timelineOption = options.timeline;
        var drawW = options.timeline.tempSetting.drawW;
        var drawH = options.timeline.tempSetting.drawH;
        var lT = options.timeline.tempSetting.lT;
        var lL = options.timeline.tempSetting.lL;
        var rect = options.timeline.tempSetting.rect;
        if (Array.isArray(defaultValue) && defaultValue.length > 0) {
            var barInitX, barInitY, barEndX, noBar = defaultValue.length,
                indexBar = 1;

            if (timelineOption["type"]["type"] == "simpleTimeLine") {
                noBar = defaultValue.length;
            } else if (timelineOption["type"]["type"] == "multiTimeLine") {
                noBar = 0;
                for (var i = 0; i < defaultValue.length; i++) {
                    noBar += defaultValue[i]["data"].length;
                }
            }
            var barHSpace = Math.round((drawH - timelineOption["padding"]["width"] * 2) / noBar);
            var barTotalWidth = drawW - timelineOption["padding"]["width"] * 2;
            var indexOfBar = 0;
            for (var i = 0; i < defaultValue.length; i++) {
                if (timelineOption["type"]["type"] == "simpleTimeLine") {
                    indexOfBar = i;
                }

                barInitX = rect.x + lL + timelineOption["padding"]["width"];
                barInitY = rect.y + lT + Math.round(barHSpace / 2) + barHSpace * indexOfBar;
                barEndX = barInitX + barTotalWidth;

                context.font = timelineOption["label"]["font"]["size"] + 'px ' + timelineOption["font"]["fontFamily"];
                context.textBaseline = "middle";
                context.fillStyle = timelineOption["label"]["font"]["color"];
                if (defaultValue[i]["label"]) {
                    context.fillText(defaultValue[i]["label"], barInitX, barInitY);
                }

                if (timelineOption["type"]["type"] == "multiTimeLine") {
                    for (var j = 0; j < defaultValue[i]["data"].length; j++) {
                        indexOfBar += 1;
                    }
                }
            }
        }
    }


})(this)