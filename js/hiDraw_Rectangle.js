hiDraw.prototype.Rectangle = (function() {
    function Rectangle(canvas, options) {
        this.canvas = canvas;
        this.options = options;
        this.className = 'Rectangle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Rectangle.prototype.bindEvents = function() {
        var inst = this;
        inst.canvas.on('mouse:down', function(o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function(o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function(o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function(o) {
            inst.disable();
        })
    }

    Rectangle.prototype.unbindEvents = function() {
        var inst = this;
        inst.canvas.off('mouse:down');
        inst.canvas.off('mouse:move');
        inst.canvas.off('mouse:up');
        inst.canvas.off('object:moving');
    }

    Rectangle.prototype.onMouseUp = function(o) {
        var inst = this;
        inst.disable();
    };

    Rectangle.prototype.onMouseMove = function(o) {
        var inst = this;


        if (!inst.isEnable()) {
            return;
        }
        console.log("mouse move rectange");
        var pointer = inst.canvas.getPointer(o.e);
        var activeObj = inst.canvas.getActiveObject();

        activeObj.stroke = 'red',
            activeObj.strokeWidth = 5;
        activeObj.fill = 'transparent';

        if (origX > pointer.x) {
            activeObj.set({
                left: Math.abs(pointer.x)
            });
        }
        if (origY > pointer.y) {
            activeObj.set({
                top: Math.abs(pointer.y)
            });
        }

        activeObj.set({
            width: Math.abs(origX - pointer.x)
        });
        activeObj.set({
            height: Math.abs(origY - pointer.y)
        });

        activeObj.setCoords();
        inst.canvas.renderAll();

    };

    Rectangle.prototype.onMouseDown = function(o) {
        var inst = this;
        inst.enable();

        var pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        var rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: 'left',
            originY: 'top',
            width: pointer.x - origX,
            height: pointer.y - origY,
            selectable: false,
            hasBorders: true,
            hasControls: true,
            strokeUniform: true
        });
        rect.on('selected', function(data) {
            console.log('selected a rect-----');
            inst.enable();
            rect.set('stroke','green').setCoords();
            inst.canvas.requestRenderAll();
            // inst.bindEvents();
            if(inst.options && inst.options.onSelected){
                inst.options.onSelected(rect);
            }
        });
        rect.on('mousedown', function() {
            console.log('mousedown a rect');
        });

        inst.canvas.add(rect).setActiveObject(rect);
    };

    Rectangle.prototype.isEnable = function() {
        return this.isDrawing;
    }

    Rectangle.prototype.enable = function() {
        this.isDrawing = true;
    }

    Rectangle.prototype.disable = function() {
        this.isDrawing = false;
        this.unbindEvents();
        if(this.options && this.options.endDraw){
            this.options.endDraw();
        }
    }

    return Rectangle;
}());