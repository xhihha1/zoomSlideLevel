hiDraw.prototype.Image = (function () {
    function Image(canvas, options) {
        this.canvas = canvas;
        this.options = options;
        this.className = 'Image';
        this.isDrawing = false;
        this.bindEvents();
    }

    Image.prototype.bindEvents = function () {
        var inst = this;
        inst.canvas.on('mouse:down', function (o) {
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function (o) {
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function (o) {
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function (o) {
            inst.disable();
        })
        // inst.canvas.on('mouse:down', inst.onMouseDown);
        // inst.canvas.on('mouse:move', inst.onMouseMove);
        // inst.canvas.on('mouse:up', inst.onMouseUp);
        // inst.canvas.on('object:moving', inst.disable)
    }

    Image.prototype.unbindEvents = function () {
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

    Image.prototype.onMouseUp = function (o) {
        var inst = this;
        inst.disable();
    };

    Image.prototype.onMouseMove = function (o) {
        var inst = this;
        if (!inst.isEnable()) {
            return;
        }

        var pointer = inst.canvas.getPointer(o.e);
        var activeObj = inst.canvas.getActiveObject();

        activeObj.stroke = 'red',
        activeObj.strokeWidth = 5;
        // activeObj.fill = 'transparent';

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

        // activeObj.set({
        //     width: Math.abs(origX - pointer.x)
        // });
        // activeObj.set({
        //     height: Math.abs(origY - pointer.y)
        // });
        activeObj.setCoords();
        inst.canvas.renderAll();
    };

    Image.prototype.onMouseDown = function (o) {
        var inst = this;
        inst.enable();

        var pointer = inst.canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        // var ellipse = new fabric.Ellipse({
        //     top: origY,
        //     left: origX,
        //     rx: 0,
        //     ry: 0,
        //     selectable: false,
        //     hasBorders: true,
        //     hasControls: true,
        //     strokeUniform: true
        // });

        // ellipse.on('selected', function () {
        //     console.log('selected a Image');
        //     inst.enable();
        // });
        // ellipse.on('mousedown', function () {
        //     console.log('mousedown a Image');
        // });

        // inst.canvas.add(ellipse).setActiveObject(ellipse);
        var imagePath = './assets/images.jpg'
        if(inst.options.imagePath){
            imagePath = inst.options.imagePath;
        }

        fabric.Image.fromURL(imagePath, function (img) {
            img.scale(0.5).set({
                // angle: -15,
                // clipPath: new fabric.Circle({
                //     radius: radius,
                //     originX: 'center',
                //     originY: 'center',
                // }),
                top: origY,
                left: origX,
                originX: 'left',
                originY: 'top',
                // width: pointer.x - origX,
                // height: pointer.y - origY,
                selectable: false,
                hasBorders: true,
                hasControls: true,
                strokeUniform: true
            });

            // (function animate() {
            //     fabric.util.animate({
            //         startValue: Math.round(radius) === 50 ? 50 : 300,
            //         endValue: Math.round(radius) === 50 ? 300 : 50,
            //         duration: 1000,
            //         onChange: function (value) {
            //             radius = value;
            //             img.clipPath.set('radius', value);
            //             img.set('dirty', true);
            //             canvas.renderAll();
            //         },
            //         onComplete: animate
            //     });
            // })();

            img.on('selected', function () {
                console.log('selected a Image');
                // console.log(img)
                inst.enable();
            });
            img.on('mousedown', function () {
                console.log('mousedown a Image');
            });

            inst.canvas.add(img).setActiveObject(img);
        });
    };

    Image.prototype.isEnable = function () {
        return this.isDrawing;
    }

    Image.prototype.enable = function () {
        this.isDrawing = true;
    }

    Image.prototype.disable = function () {
        this.isDrawing = false;
        this.unbindEvents();
        if (this.options && this.options.endDraw) {
            this.options.endDraw();
        }
    }

    return Image;
}(this));