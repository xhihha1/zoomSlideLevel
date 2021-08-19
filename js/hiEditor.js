(function(global){

    
    var elem = document.getElementById('parentCanvas');
    var edit = new hiDraw(
        {
            canvasViewId: 'mainEditor',
            viewJsonTextId: 'hiJsonArea',
            activeJsonTextId: 'hiActiveJsonArea',
            canvasWidth: elem.offsetWidth
        }
    ).createView().viewEvent();

    var objOption = {
        activeJsonTextId: 'hiActiveJsonArea',
        endDraw: function(){
            console.log('**');
            edit.changeCanvasProperty(true, false);
            edit.changeSelectableStatus(true);
            edit.viewEvent();
        },
        onSelected: function(opt){
            // if(opt){
            //     edit.DatGUI.updateOptions({
            //         type: opt.get('type'),
            //         stroke: opt.get('stroke'),
            //         fill: opt.get('fill'),
            //         message: 'hello'
            //     })
            // }
        }
    };

    const circle = new fabric.Circle({
        radius: 30,
        fill: 'red', // 填色,
        top: 10,
        left: 0
      })
    edit.canvasView.add(circle)//加入到canvas中

    $("#circle").click(function() {
        edit.removeCanvasEvents();
        edit.changeSelectableStatus(false);
        edit.changeCanvasProperty(false, false);
        var circle = new edit.Circle(edit.canvasView, objOption);
    });

    $("#squrect").click(function() {
        edit.removeCanvasEvents();
        edit.changeSelectableStatus(false);
        edit.changeCanvasProperty(false, false);
        var squrect = new edit.Rectangle(edit.canvasView, objOption);
    });

    $("#arrow").click(function() {
        edit.removeCanvasEvents();
        edit.changeSelectableStatus(false);
        edit.changeCanvasProperty(false, false);
        var arrow = new edit.Arrow(edit.canvasView, objOption);
    });

    $("#polygon").click(function() {
        edit.removeCanvasEvents();
        edit.changeSelectableStatus(false);
        edit.changeCanvasProperty(false, false);
        var polygon = new edit.Polygon(edit.canvasView, objOption);
    });

    $("#image").click(function() {
        edit.removeCanvasEvents();
        edit.changeSelectableStatus(false);
        edit.changeCanvasProperty(false, false);
        var image = new edit.Image(edit.canvasView, objOption);
    });


    $("#select").click(function() {
        // this.isDrawing = false;
        var canvas = edit.canvasView;
        var val = canvas.selection,
            val2 = canvas.isDrawingMode;
        val = !val;
        edit.changeCanvasProperty(val, false);
        edit.removeCanvasEvents();
        if (canvas.selection) {
            edit.changeSelectableStatus(true);
            $("#select").html('Turn Off Selection');
            if (val2) {
                // drawingModeEl.innerHTML = 'Turn On Free Draw';
                canvas.isDrawingMode = false;
                // drawingOptionsEl.style.display = 'none';
            }
        } else {
            // drawingModeEl.innerHTML = 'Turn Off Free Draw';
            edit.changeSelectableStatus(false);
            $("#select").html('Turn On Selection');
            // drawingOptionsEl.style.display = 'none';
        }
    });

    $("#render").click(function() {
        edit.canvasView.renderAll();
    });

    window.addEventListener('resize', function(){
        
        var elem = document.getElementById('parentCanvas');
        // var elem = document.getElementById(edit.defaultOptions.canvasViewId);
        // console.log('resize',elem.offsetWidth)
        // that.canvasView.setDimensions({width:elem.offsetWidth, height:elem.offsetHeight});
        setTimeout(function(){
            edit.canvasView.setWidth( parseInt(elem.offsetWidth) )
            // edit.canvasView.setHeight( parseInt(elem.offsetHeight) )
            edit.canvasView.renderAll()
        },300)
        // that.canvasView.renderAll()
    });

    
    window.edit = edit;
})(this)
