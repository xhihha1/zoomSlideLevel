(function () {
    var design = edit.canvasView
    var minimap = new fabric.Canvas('minimap', {
        containerClass: 'minimap',
        selection: false
    });

    function createCanvasEl() {
        var designSize = {
            width: 800,
            height: 600
        };
        var originalVPT = design.viewportTransform;
        // zoom to fit the design in the display canvas
        var designRatio = fabric.util.findScaleToFit(designSize, design);

        // zoom to fit the display the design in the minimap.
        var minimapRatio = fabric.util.findScaleToFit(design, minimap);

        var scaling = minimap.getRetinaScaling();

        var finalWidth = designSize.width * designRatio;
        var finalHeight = designSize.height * designRatio;

        design.viewportTransform = [
            designRatio, 0, 0, designRatio,
            (design.getWidth() - finalWidth) / 2,
            (design.getHeight() - finalHeight) / 2
        ];
        var canvas = design.toCanvasElement(minimapRatio * scaling);
        design.viewportTransform = originalVPT;
        return canvas;
    }

    function updateMiniMap() {
        var canvas = createCanvasEl();
        minimap.backgroundImage._element = canvas;
        minimap.requestRenderAll();
    }

    function updateMiniMapVP() {
        var designSize = {
            width: 800,
            height: 600
        };
        var rect = minimap.getObjects()[0];
        var designRatio = fabric.util.findScaleToFit(designSize, design);
        var totalRatio = fabric.util.findScaleToFit(designSize, minimap);
        var finalRatio = designRatio / design.getZoom();
        rect.scaleX = finalRatio;
        rect.scaleY = finalRatio;
        rect.top = minimap.backgroundImage.top - design.viewportTransform[5] * totalRatio / design.getZoom();
        rect.left = minimap.backgroundImage.left - design.viewportTransform[4] * totalRatio / design.getZoom();
        minimap.requestRenderAll();
    }

    function initMinimap() {
        var canvas = createCanvasEl();
        var backgroundImage = new fabric.Image(canvas);
        backgroundImage.scaleX = 1 / design.getRetinaScaling();
        backgroundImage.scaleY = 1 / design.getRetinaScaling();
        minimap.centerObject(backgroundImage);
        minimap.backgroundColor = 'white';
        minimap.backgroundImage = backgroundImage;
        minimap.requestRenderAll();
        var minimapView = new fabric.Rect({
            top: backgroundImage.top,
            left: backgroundImage.left,
            width: backgroundImage.width / design.getRetinaScaling(),
            height: backgroundImage.height / design.getRetinaScaling(),
            fill: 'rgba(0, 0, 255, 0.3)',
            cornerSize: 6,
            transparentCorners: false,
            cornerColor: 'blue',
            strokeWidth: 0,
        });
        minimapView.controls = {
            br: fabric.Object.prototype.controls.br,
        };
        minimap.add(minimapView);
    }
})()