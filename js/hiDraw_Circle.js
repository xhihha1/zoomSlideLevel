hiDraw.prototype.Circle = (function() {
    function Circle(canvas, options) {
        this.canvas = canvas;
        this.options = options;
        this.className = 'Circle';
        this.isDrawing = false;
        this.bindEvents();
    }

    Circle.prototype.bindEvents = function() {
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
        // inst.canvas.on('mouse:down', inst.onMouseDown);
        // inst.canvas.on('mouse:move', inst.onMouseMove);
        // inst.canvas.on('mouse:up', inst.onMouseUp);
        // inst.canvas.on('object:moving', inst.disable)
    }

    Circle.prototype.unbindEvents = function() {
        var inst = this;
        // inst.canvas.off('mouse:down', inst.onMouseDown);
        // inst.canvas.off('mouse:move', inst.onMouseMove);
        // inst.canvas.off('mouse:up', inst.onMouseUp);
        // inst.canvas.off('object:moving', inst.disable)
        inst.canvas.off('mouse:down');
        inst.canvas.off('mouse:move');
        inst.canvas.off('mouse:up');
        inst.canvas.off('object:moving');
    }

    Circle.prototype.onMouseUp = function(o) {
        var inst = this;
        inst.disable();
    };

    Circle.prototype.onMouseMove = function(o) {
        var inst = this;
        if (!inst.isEnable()) {
            return;
        }

        var pointer = inst.canvas.getPointer(o.e);
        var activeObj = inst.canvas.getActiveObject();

        activeObj.stroke = 'red',
            activeObj.strokeWidth = 5;
        activeObj.fill = 'red';

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
            rx: Math.abs(origX - pointer.x) / 2
        });
        activeObj.set({
            ry: Math.abs(origY - pointer.y) / 2
        });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Circle.prototype.onMouseDown = function(o) {
        var inst = this;
        inst.enable();

        var pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        var ellipse = new fabric.Ellipse({
            top: origY,
            left: origX,
            rx: 0,
            ry: 0,
            selectable: false,
            hasBorders: true,
            hasControls: true,
            strokeUniform: true
        });

        ellipse.on('selected', function() {
            console.log('selected a Circle');
            inst.enable();
        });
        ellipse.on('mousedown', function() {
            console.log('mousedown a Circle');
        });

        inst.canvas.add(ellipse).setActiveObject(ellipse);
    };

    Circle.prototype.isEnable = function() {
        return this.isDrawing;
    }

    Circle.prototype.enable = function() {
        this.isDrawing = true;
    }

    Circle.prototype.disable = function() {
        this.isDrawing = false;
        this.unbindEvents();
        if(this.options && this.options.endDraw){
            this.options.endDraw();
        }
    }

    return Circle;
}(this));