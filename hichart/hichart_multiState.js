(function (global) {
    hichart.prototype.defaultMultiStateOptions = function () {
        var defaultOption = {
            multiState:{
                center:{
                    radialGradient:[
                    ],
                    inner:{
                        line:{
                            background:{
                                color: "rgb(50,50,56)"
                            },
                            color:"rgb(0,150,150)"
                        }
                    },
                    outer:{
                        radialGradient:[
                            {position:0,color:"rgba(255,255,255,0.2)"},
                            {position:0.8,color:"rgba(236,219,155,0.4)"},
                            {position:1,color:"rgba(255,255,255,0.2)"}
                        ],
                        left:{
                            background:{
                                color: "#D19378"
                            },
                            color:"#D19378"
                        },
                        right:{
                            background:{
                                color: "#64A3D8"
                            },
                            color:"#64A3D8"
                        },
                        bottom:{
                            background:{
                                color: "#d9406f"
                            },
                            color:"#d9406f"
                        }
                    },
                    text:{
                        title:{
                            font:{
                                color:"rgb(50,50,56)"
                            }
                        },
                        number:{
                            font:{
                                color:"rgb(50,50,56)"
                            }
                        },
                        unit:{
                            font:{
                                color:"rgb(50,50,56)"
                            }
                        }
                    }
                },
                block:{
                    background:{
                        linearGradient:[
                            {position:0,color:"rgba(255,255,255,0.2)"},
                            {position:0.8,color:"rgba(194,187,205,0.6)"},
                            {position:1,color:"rgba(255,255,255,0.2)"}
                        ]
                    },
                    border:{
                        font:{
                            color:"rgb(50,50,56)"
                        },
                        color: "rgb(50,0,0)",
                        linewidth: ""
                    }
                }
            }
        }
        this.options = this.mergeDeep(defaultOption, this.options);
        return this;
    }
    hichart.prototype.plotMultiStateData = function (dataSet) {
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
        var radius = rect.width / 2 - 2 * margin;
        var Val_max = this.options.Val_max;
        var Val_min = this.options.Val_min;
        var stepSize = this.options.stepSize;
        var stickSize = this.options.stick.size;
        this.defaultMultiStateOptions()
        var multiStateOption = this.options.multiState;
        

        context.textBaseline = "middle";

        var w = rect.width;
        var h = rect.height;
        var unitDegToRad = Math.PI / 180;

        //center
        var c_max = 100;
        var c_min = 0;
        var c_number = 86;
        var c_radius = 0.3 * h;
        var c_partition = 18;
        var c_eachPartDegree = 2 * Math.PI / c_partition;
        var c_spaceDegree = c_eachPartDegree * 0.5;
        var c_numUnitDegree = 2 * Math.PI / (Math.abs(c_max - c_min));
        var c_numDegree = c_numUnitDegree * (c_number - Math.min(c_max, c_min));

        //outer circle
        var o_radius = 0.34 * h;
        var o_tick_in_r = 0.36 * h;
        var o_tick_out_rS = 0.39 * h;
        var o_tick_out_rL = 0.4 * h;
        var o_text_r = 0.42 * h;
        var o_lineWidth = 0.006 * h;
        var o_tickLineWidth = 0.002 * h;
        var o_blockText_r = 0.5 * h;

        

        if(multiStateOption && multiStateOption.center){
            var grd;
            // outer circle background
            if(multiStateOption.center['outer']){
                if(multiStateOption.center['outer']['radialGradient']){
                    grd = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, o_blockText_r);
                    for (g = 0; g < multiStateOption.center['outer']['radialGradient'].length; g++) {
                        grd.addColorStop(multiStateOption.center['outer']['radialGradient'][g]['position'], multiStateOption.center['outer']['radialGradient'][g]['color']);
                    }
                    
                }
                // Fill with gradient
                context.fillStyle=grd;
                context.beginPath();
                context.arc(centerX, centerY, o_blockText_r, 0, 2*Math.PI);
                context.fill();
            }
            

            if(multiStateOption.center['radialGradient']){
                grd = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, c_radius);
                for (g = 0; g < multiStateOption.center['radialGradient'].length; g++) {
                    grd.addColorStop(multiStateOption.center['radialGradient'][g]['position'], multiStateOption.center['radialGradient'][g]['color']);
                }
                
            }
            // Fill with gradient
            context.fillStyle=grd;
            context.beginPath();
            context.arc(centerX, centerY, c_radius, 0, 2*Math.PI);
            context.fill();
        }

        
        //multiStateOption.center['text']['title']['font']['color'];
        //center title
        context.fillStyle = multiStateOption.center['text']['title']['font']['color'];
        var c_title_h = 0.06 * h;
        context.font = c_title_h + "px Arial";
        var c_title = "Title";
        var c_title_w = context.measureText(c_title).width;
        context.fillText(c_title, centerX - c_title_w / 2, h * 1 / 3);

        //center number
        context.fillStyle = multiStateOption.center['text']['number']['font']['color'];
        var c_num_h = 0.08 * h;
        context.font = c_num_h + "px Arial";
        var c_num_w = context.measureText(c_number).width;
        context.fillText(c_number, centerX - c_num_w / 2, centerY);

        //center unit
        context.fillStyle = multiStateOption.center['text']['unit']['font']['color'];
        var c_unit_h = 0.032 * h;
        context.font = c_unit_h + "px Arial";
        var c_unit = "kg";
        var c_unit_w = context.measureText(c_unit).width;
        context.fillText(c_unit, centerX - c_unit_w / 2, h * 3 / 5);

        //center circle
        var c_bgColor = multiStateOption.center['inner']['line']['background']['color'];
        var c_frontColor = multiStateOption.center['inner']['line']['color'];
        var c_lineWidth = 0.01 * h;
        context.lineWidth = c_lineWidth;
        for (var i = 0; i < c_partition; i++) {
            context.beginPath();
            if (c_numDegree > i * c_eachPartDegree) {
                context.strokeStyle = c_frontColor;
            } else {
                context.strokeStyle = c_bgColor;
            }
            //context.strokeStyle = "rgb(" + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + "," + Math.round(Math.random() * 255) + ")"
            context.arc(centerX, centerY, c_radius, i * c_eachPartDegree - Math.PI / 2, (i + 1) * c_eachPartDegree - c_spaceDegree - Math.PI / 2);
            context.stroke();
        }

        // draw outer circle
        context.lineWidth = o_lineWidth;
        

        //bottom
        var ob_startDgr = Math.PI / 2 - Math.PI / 12;
        var ob_endDgr = Math.PI / 2 + Math.PI / 12;
        var ob_color = multiStateOption.center['outer']['bottom']['background']['color'];
        context.strokeStyle = ob_color;
        context.lineWidth = o_lineWidth;
        context.beginPath();
        context.arc(centerX, centerY, o_radius, ob_startDgr, ob_endDgr);
        context.stroke();

        //right
        var or_max = 100;
        var or_min = 0;
        var or_number = 86;
        var or_tick_textSize = 0.02 * h;
        var or_startDgr = Math.PI / 2 * (-1) + 2 * unitDegToRad;
        var or_endDgr = ob_startDgr - 4 * unitDegToRad;
        var or_color = multiStateOption.center['outer']['right']['background']['color'];
        var or_tick_bgcolor = "rgb(50,50,56)";
        context.strokeStyle = or_color;
        context.lineWidth = o_lineWidth;
        context.beginPath();
        context.arc(centerX, centerY, o_radius, or_startDgr, or_endDgr);
        context.stroke();

        //right tick
        // var o_tick_in_r = 180;
        // var o_tick_out_rS = 195;
        // var o_tick_out_rL = 200;
        //h+rcosθ, k+rsinθ
        var ort_min_y = centerY + Math.sin(ob_startDgr) * o_radius;
        var ort_max_y = centerY - Math.sin(ob_startDgr) * o_radius;
        var ort_partition = 100;
        var ort_unitPartH = Math.abs(ort_max_y - ort_min_y) / ort_partition;
        or_tick_textSize = 4 * ort_unitPartH;
        context.strokeStyle = or_color;
        context.lineWidth = o_tickLineWidth;
        var or_current_num = or_number / Math.abs(or_max - or_min) * ort_partition;
        for (var i = 0; i <= ort_partition; i++) {
            if (i % 2 == 0) {
                var ort_num = Math.abs(or_max - or_min) / ort_partition * i;
                context.strokeStyle = (ort_num <= or_current_num) ? or_color : or_tick_bgcolor;
                context.fillStyle = (ort_num <= or_current_num) ? or_color : or_tick_bgcolor;
                var ort_e_h = ort_min_y - ort_unitPartH * i;
                var theta_in = Math.asin((ort_e_h - centerY) / o_tick_in_r);
                var ort_e_in_x = centerX + o_tick_in_r * Math.cos(theta_in);
                var theta_text = Math.asin((ort_e_h - centerY) / o_text_r);
                var ort_text_x = centerX + o_text_r * Math.cos(theta_text);
                var theta_out;
                var ort_e_out_x;
                if (i % 5 == 0) {
                    theta_out = Math.asin((ort_e_h - centerY) / o_tick_out_rL);
                    ort_e_out_x = centerX + o_tick_out_rL * Math.cos(theta_out);
                } else {
                    theta_out = Math.asin((ort_e_h - centerY) / o_tick_out_rS);
                    ort_e_out_x = centerX + o_tick_out_rS * Math.cos(theta_out);
                }
                context.beginPath();
                context.moveTo(ort_e_in_x, ort_e_h);
                context.lineTo(ort_e_out_x, ort_e_h);
                context.stroke();
                //text

                if (i % 5 == 0) {
                    context.font = or_tick_textSize + "px Arial";
                    var ort_text_w = context.measureText(ort_num).width;
                    context.fillText(ort_num, ort_text_x, ort_e_h);
                }
            }

        }

        //left
        var ol_max = 100;
        var ol_min = 0;
        var ol_number = 86;
        var ol_tick_textSize = 0.02 * h;
        var ol_startDgr = ob_endDgr + 4 * unitDegToRad;
        var ol_endDgr = 2 * Math.PI - Math.PI / 2 - 2 * unitDegToRad;
        var ol_color = multiStateOption.center['outer']['left']['background']['color'];
        var ol_tick_bgcolor = "rgb(50,50,56)";
        context.strokeStyle = ol_color;
        context.lineWidth = o_lineWidth;
        context.beginPath();
        context.arc(centerX, centerY, o_radius, ol_startDgr, ol_endDgr);
        context.stroke();

        //left tick
        // var o_tick_in_r = 180;
        // var o_tick_out_rS = 195;
        // var o_tick_out_rL = 200;
        //h+rcosθ, k+rsinθ
        var olt_min_y = centerY + Math.sin(ob_startDgr) * o_radius;
        var olt_max_y = centerY - Math.sin(ob_startDgr) * o_radius;
        var olt_partition = 100;
        var olt_unitPartH = Math.abs(olt_max_y - olt_min_y) / olt_partition;
        ol_tick_textSize = 4 * olt_unitPartH;
        context.strokeStyle = ol_color;
        context.lineWidth = o_tickLineWidth;
        var ol_current_num = ol_number / Math.abs(ol_max - ol_min) * olt_partition;
        for (var i = 0; i <= ort_partition; i++) {
            if (i % 2 == 0) {
                var olt_num = Math.abs(ol_max - ol_min) / olt_partition * i;
                context.strokeStyle = (olt_num <= ol_current_num) ? ol_color : ol_tick_bgcolor;
                context.fillStyle = (olt_num <= ol_current_num) ? ol_color : ol_tick_bgcolor;
                var olt_e_h = olt_min_y - olt_unitPartH * i;
                var theta_in = Math.PI + Math.asin((olt_e_h - centerY) / o_tick_in_r);
                var olt_e_in_x = centerX + o_tick_in_r * Math.cos(theta_in);
                var theta_text = Math.PI + Math.asin((olt_e_h - centerY) / o_text_r);
                var olt_text_x = centerX + o_text_r * Math.cos(theta_text);
                var theta_out;
                var olt_e_out_x;
                if (i % 5 == 0) {
                    theta_out = Math.PI + Math.asin((olt_e_h - centerY) / o_tick_out_rL);
                    olt_e_out_x = centerX + o_tick_out_rL * Math.cos(theta_out);
                } else {
                    theta_out = Math.PI + Math.asin((olt_e_h - centerY) / o_tick_out_rS);
                    olt_e_out_x = centerX + o_tick_out_rS * Math.cos(theta_out);
                }
                context.beginPath();
                context.moveTo(olt_e_in_x, olt_e_h);
                context.lineTo(olt_e_out_x, olt_e_h);
                context.stroke();
                //text
                if (i % 5 == 0) {
                    context.font = ol_tick_textSize + "px Arial";
                    var ort_text_w = context.measureText(olt_num).width;
                    context.fillText(olt_num, olt_text_x - ort_text_w, olt_e_h);
                }
            }
        }

        //bottom text
        var bc_text = "Hello";
        var bc_text_size = 0.08 * h;
        var bc_text_style = "rgb(50,50,56)";
        context.fillStyle = bc_text_style;
        context.font = bc_text_size + "px Arial";
        var bc_text_w = context.measureText(bc_text).width;
        context.fillText(bc_text, centerX - w / 2 + w / 2 - bc_text_w / 2, centerY + o_text_r);

        var br_text = "right";
        var br_text_size = 0.04 * h;
        var br_text_style = "rgb(50,50,56)";
        context.fillStyle = br_text_style;
        context.font = br_text_size + "px Arial";
        var br_text_w = context.measureText(br_text).width;
        context.fillText(br_text, centerX - w / 2 + w * 2 / 3 - br_text_w / 2, centerY + o_text_r);

        var br_text = "right";
        var br_text_size = 0.04 * h;
        var br_text_style = "rgb(50,50,56)";
        context.fillStyle = br_text_style;
        context.font = br_text_size + "px Arial";
        var br_text_w = context.measureText(br_text).width;
        context.fillText(br_text, centerX - w / 2 + w * 5 / 6 - br_text_w / 2, centerY + o_text_r);

        var bl_text = "left";
        var bl_text_size = 0.04 * h;
        var bl_text_style = "rgb(50,50,56)";
        context.fillStyle = bl_text_style;
        context.font = bl_text_size + "px Arial";
        var bl_text_w = context.measureText(bl_text).width;
        context.fillText(bl_text, centerX - w / 2 + w / 3 - bl_text_w / 2, centerY + o_text_r);

        var bl_text = "left";
        var bl_text_size = 0.04 * h;
        var bl_text_style = "rgb(50,50,56)";
        context.fillStyle = bl_text_style;
        context.font = bl_text_size + "px Arial";
        var bl_text_w = context.measureText(bl_text).width;
        context.fillText(bl_text, centerX - w / 2 + w / 6 - bl_text_w / 2, centerY + o_text_r);

        //block text
        var blockTop = centerY - o_blockText_r;
        var blockBottom = centerY + o_blockText_r;
        var block_partition = 5;
        var blockUnitHeight = Math.abs(blockTop - blockBottom) / block_partition;
        var br_text = [25, 26, 27];
        var br_text_label = ["A", "B", "C"];
        var br_text_unit = ["kg", "m", "l"];
        var bl_text = [28, 29, 30];
        var bl_text_label = ["D", "E", "F"];
        var bl_text_unit = ["kg", "m", "l"];
        var block_linewidth = 0.004 * h;
        context.lineWidth = block_linewidth;
        if(this.isNumeric(multiStateOption.block['border']['linewidth'])){
            context.lineWidth = parseInt(multiStateOption.block['border']['linewidth']);
        }
        for (var i = 1; i < block_partition - 1; i++) {
            var topRight_y = blockTop + blockUnitHeight * i + 0.01 * h;
            var bottomRight_y = blockTop + blockUnitHeight * (i + 1) - 0.01 * h;
            var middle_y = (topRight_y + bottomRight_y) / 2;

            //right
            var theta_topLeft_x = Math.asin((topRight_y - centerY) / o_blockText_r);
            var topLeft_x = centerX + o_blockText_r * Math.cos(theta_topLeft_x);

            var theta_bottomLeft_x = Math.asin((bottomRight_y - centerY) / o_blockText_r);
            var bottomLeft_x = centerX + o_blockText_r * Math.cos(theta_bottomLeft_x);

            if(multiStateOption && multiStateOption.block){
                if(multiStateOption.block['background']){
                    var grd;
                    if(multiStateOption.block['background']['radialGradient']){
                        grd = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, w/2);
                        for (g = 0; g < multiStateOption.block['background']['radialGradient'].length; g++) {
                            grd.addColorStop(multiStateOption.block['background']['radialGradient'][g]['position'], multiStateOption.block['background']['radialGradient'][g]['color']);
                        }
                    } else if(multiStateOption.block['background']['linearGradient']){
                        grd = context.createLinearGradient(centerX, centerY - h/2,centerX, centerY + h/2);
                        for (g = 0; g < multiStateOption.block['background']['linearGradient'].length; g++) {
                            grd.addColorStop(multiStateOption.block['background']['linearGradient'][g]['position'], multiStateOption.block['background']['linearGradient'][g]['color']);
                        }
                    } else if(multiStateOption.block['background']['color']){
                        grd = multiStateOption.block['background']['color'];
                    } else {
                        grd = "rgba(0,0,0,0)";
                    }
                    // Fill with gradient
                    context.fillStyle=grd;
                }
            }
            context.strokeStyle = multiStateOption.block['border']['color'];
            context.beginPath();
            context.moveTo(topLeft_x, topRight_y);
            context.lineTo(centerX + w / 2, topRight_y);
            context.lineTo(centerX + w / 2, bottomRight_y);
            context.lineTo(bottomLeft_x, bottomRight_y);
            context.stroke();
            context.fill();
            
            context.beginPath();
            context.arc(centerX, centerY, o_blockText_r, Math.min(theta_bottomLeft_x, theta_topLeft_x), Math.max(theta_bottomLeft_x, theta_topLeft_x));
            context.stroke();

            //right text
            context.fillStyle = multiStateOption.block['border']['font']['color'];
            var br_textLeft_x = Math.max(topLeft_x, bottomLeft_x) + 0.02 * h;
            var br_textRight_x = w - block_linewidth - 0.02 * h;
            var br_text_size = 0.04 * h;
            context.font = br_text_size + "px Arial";
            var br_text_w = context.measureText(br_text_label[i - 1]).width;
            context.fillText(br_text_label[i - 1], br_textLeft_x, middle_y);
            var bl_text_w = context.measureText(br_text[i - 1] + br_text_unit[i - 1]).width;
            context.fillText(br_text[i - 1] + br_text_unit[i - 1], centerX - w / 2 + br_textRight_x - bl_text_w, middle_y);

            //Left
            var l_theta_topLeft_x = Math.PI + Math.asin((topRight_y - centerY) / o_blockText_r);
            var l_topRight_x = centerX + o_blockText_r * Math.cos(l_theta_topLeft_x);

            var l_theta_bottomLeft_x = Math.PI + Math.asin((bottomRight_y - centerY) / o_blockText_r);
            var l_bottomRight_x = centerX + o_blockText_r * Math.cos(l_theta_bottomLeft_x);

            if(multiStateOption && multiStateOption.block){
                if(multiStateOption.block['background']){
                    var grd;
                    if(multiStateOption.block['background']['radialGradient']){
                        grd = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, w/2);
                        for (g = 0; g < multiStateOption.block['background']['radialGradient'].length; g++) {
                            grd.addColorStop(multiStateOption.block['background']['radialGradient'][g]['position'], multiStateOption.block['background']['radialGradient'][g]['color']);
                        }
                    } else if(multiStateOption.block['background']['linearGradient']){
                        grd = context.createLinearGradient(centerX, centerY - h/2,centerX, centerY + h/2);
                        for (g = 0; g < multiStateOption.block['background']['linearGradient'].length; g++) {
                            grd.addColorStop(multiStateOption.block['background']['linearGradient'][g]['position'], multiStateOption.block['background']['linearGradient'][g]['color']);
                        }
                    } else if(multiStateOption.block['background']['color']){
                        grd = multiStateOption.block['background']['color'];
                    } else {
                        grd = "rgba(0,0,0,0)";
                    }
                    // Fill with gradient
                    context.fillStyle=grd;
                }
            }
            context.strokeStyle = multiStateOption.block['border']['color'];
            context.beginPath();
            context.moveTo(l_bottomRight_x, bottomRight_y);
            context.lineTo(centerX - w / 2, bottomRight_y);
            context.lineTo(centerX - w / 2, topRight_y);
            context.lineTo(l_topRight_x, topRight_y);
            context.stroke();
            context.fill();
            context.beginPath();
            context.arc(centerX, centerY, o_blockText_r, Math.min(l_theta_topLeft_x, l_theta_bottomLeft_x), Math.max(l_theta_topLeft_x, l_theta_bottomLeft_x));
            context.stroke();

            //left text
            context.fillStyle = multiStateOption.block['border']['font']['color'];
            var bl_textRight_x = Math.min(l_topRight_x, l_bottomRight_x) - 0.02 * h;
            var bl_textleft_x = 0.02 * h;
            var br_text_w = context.measureText(bl_text_label[i - 1]).width;
            context.fillText(bl_text_label[i - 1], centerX - w / 2 + bl_textleft_x, middle_y);
            var bl_text_w = context.measureText(bl_text[i - 1] + bl_text_unit[i - 1]).width;
            context.fillText(bl_text[i - 1] + bl_text_unit[i - 1], bl_textRight_x - bl_text_w, middle_y);
        }

        context.textBaseline = "alphabetic";
        context.textAlign = "start";
    }
})(this)