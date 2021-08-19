function hiDraw(options) {
    if (!fabric) {
        console.log('lib fabric not exist');
        return false;
    }
    this.defaultOptions = {
        canvasViewId: 'mainEditor',
        viewJsonTextId: 'hiJsonArea',
        activeJsonTextId: 'hiActiveJsonArea',
        canvasWidth: 500,
        canvasHeight: 500
    }
    if (options) {
        this.defaultOptions = this.mergeDeep(this.defaultOptions, options);
    }

    var that = this;
    if (typeof(this.DatGUI) !== 'undefined') {
        this.DatGUI = new this.DatGUI()
        this.DatGUI.updateSetting({
            onFinishChange:function(propertyName, value){
                console.log(propertyName, value)
                if (that.canvasView.getActiveObject()) {
                    that.canvasView.getActiveObject().set(propertyName, value)
                    that.canvasView.renderAll()
                }
            }
        })
    }

    return this;
}

hiDraw.prototype.mergeDeep = function (target, source) {
    if (typeof target !== 'object' || typeof source !== 'object') return target;
    for (var prop in source) {
        if (!source.hasOwnProperty(prop)) continue;
        if (prop in target) {
            if (typeof target[prop] !== 'object') {
                target[prop] = source[prop];
            } else {
                if (typeof source[prop] !== 'object') {
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


hiDraw.prototype.createView = function () {
    var that = this;
    var elem = document.getElementById(this.defaultOptions.canvasViewId);
    this.canvasView = new fabric.Canvas(this.defaultOptions.canvasViewId, {
        // height: window.innerHeight - 50, // 讓畫布同視窗大小
        // width: window.innerWidth - 50, // 讓畫布同視窗大小
        // height: elem.offsetHeight, // 讓畫布同視窗大小
        // width: elem.offsetWidth, // 讓畫布同視窗大小
        height: that.defaultOptions.canvasHeight, // 讓畫布同視窗大小
        width: that.defaultOptions.canvasWidth, // 讓畫布同視窗大小
        isDrawingMode: false, // 設置成 true 一秒變身小畫家
        hoverCursor: 'progress', // 移動時鼠標顯示
        freeDrawingCursor: 'all-scroll', // 畫畫模式時鼠標模式
        //backgroundColor: 'rgb(255,255,255)' // 背景色,
    }); //声明画布

    //this.canvasView.setDimensions({width:800, height:200});

    return this;
}

hiDraw.prototype.viewEvent = function () {
    // object:modified
    var that = this;
    this.canvasView.on('object:modified', function (opt) {
        // console.log('***', opt, opt.target, opt.target.get('type'))
        document.getElementById(that.defaultOptions.viewJsonTextId).value = JSON.stringify(that.canvasView.toJSON());
        if(that.DatGUI){
            that.DatGUI.updateOptions({
                type: opt.target.get('type'),
                stroke: opt.target.get('stroke'),
                fill: opt.target.get('fill'),
                message: 'hello'
            })
        }
        
        // that.canvasView.loadFromJSON()
    });
    // this.canvasView.on('selection:updated', function (event) {
    //     //activeObject = canvas.getActiveObject()
    // });
    this.canvasView.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY;
        var zoom = that.canvasView.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.setZoom(zoom);
        // updateMiniMapVP();
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });

    this.canvasView.on('mouse:down', function (opt) {
        var evt = opt.e;
        if (evt.altKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        }
    });
    this.canvasView.on('mouse:move', function (opt) {
        if (this.isDragging) {
            var e = opt.e;
            var vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX;
            vpt[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            // updateMiniMapVP();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    });
    this.canvasView.on('mouse:up', function (opt) {
        this.isDragging = false;
        this.selection = true;
    });
    this.canvasView.on('selection:created', function (opt) {
        // console.log('selection:created',opt.target? opt.target.get('type'): opt)
        if(that.DatGUI){
            that.DatGUI.updateOptions({
                type: opt.target.get('type'),
                stroke: opt.target.get('stroke'),
                fill: opt.target.get('fill'),
                message: 'hello'
            })
        }
    });
    this.canvasView.on('selection:updated', function (opt) {

    });
    this.canvasView.on('selection:cleared', function (opt) {

    });

    

    return this;
}

hiDraw.prototype.changeCanvasProperty = function (selValue, drawingVal) {
    this.canvasView.selection = selValue;
    this.canvasView.isDrawingMode = drawingVal;
}

hiDraw.prototype.changeSelectableStatus = function (val) {
    this.canvasView.forEachObject(function (obj) {
        obj.selectable = val;
    })
    this.canvasView.renderAll();
}

hiDraw.prototype.removeCanvasEvents = function () {
    this.canvasView.off('mouse:down');
    this.canvasView.off('mouse:move');
    this.canvasView.off('mouse:up');
    this.canvasView.off('object:moving');
}