
window.imgInfo 
window.imglevel
window.baselevel
window.sliceSize = 3000

window.beforeRotate = [];
window.theta = 0;
window.originalCenter = {};
window.viewWidth = 500
window.tempCanvasWidth = window.viewWidth * 2.0

function loadInfo (){
 
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", function(){
    console.log('response', JSON.parse(this.response))
    window.imgInfo = JSON.parse(this.response)
    window.imglevel = new Array(window.imgInfo.partition.length)
    var base = window.imgInfo.partition.find(function(item){
      return item.count == 1
    })
    if(!base) {
      base = window.imgInfo.partition[window.imgInfo.partition.length - 1]
    }
    window.baselevel = base;
    window.imgInfo.partition.forEach(function(item){
      // if(parseInt(item.level) === 8) {
        // console.log('Why?', item.level, window.baselevel.downsample, item.downsample, ' scaleRate:',(window.baselevel.downsample/item.downsample))
      // }
      // item.scaleRate = Math.round(window.baselevel.downsample/item.downsample)
      item.scaleRate = window.baselevel.downsample/item.downsample
    })
    // for(var i = 0 ; i < window.imgInfo.partition.length; i++) {
    //   loadImgByLevel (window.imgInfo.partition[i])
    // }
    // var zoom = canvas.getZoom();
    var zoom = realZoom();
    var area = { x: shiftDrawArea(), y: shiftDrawArea(), w: window.tempCanvasWidth, h: window.tempCanvasWidth}
    var coordinate = leftTopCoord()
    if (window.theta !== 0) {
      var tempAngle = window.theta
      rotateSwitch(0)
      coordinate = leftTopCoord()
      rotateSwitch(tempAngle)
    }
    loadImgByLevelAndCanvasArea(window.baselevel, coordinate, zoom, area)
    // for(var i = 0 ; i < window.imgInfo.partition.length; i++) {
    //   // loadImgByLevel (window.imgInfo.partition[i])
    //   if(window.imgInfo.partition[i].level > 1) {
    //     loadImgByLevelAndCanvasArea(window.imgInfo.partition[i], leftTopCoord(), zoom, area)
    //   }
    // }
  });
  // oReq.open("GET", "./spliteImg/test/CMU-1_slice_info_simple.json");
  oReq.open("GET", "./spliteImg/1622/CMU-1_slice_info_simple.json");
  // oReq.open("GET", "./spliteImg/test2/2021-01-26 16.08.13_slice_info_simple.json");
  oReq.send();  
}

// load all
function loadImgByLevel (levelInfo){
  var count = levelInfo.count;
  var level = parseInt(levelInfo.level);
  // if(level < 3) {return false}
  var row = parseInt(levelInfo.row);
  var column = parseInt(levelInfo.column);
  var imgAry = new Array(count);
  for(var i = 0; i < row; i++){
    for(var j = 0; j < column; j++){
  // for(var i = 0; i < column; i++){
  //   for(var j = 0; j < row; j++){
      var img = new Image();
      img.comp = false;
      img.onload = function(){
          this.comp = true;
          // renderCanvas()
          // drawTempCanvasByLevel(levelInfo)
      };
      img.n = level+'_'+i+'_'+j
      // img.src = "/spliteImg/test/CMU-1_"+level+'_'+i+'_'+j+".jpg";
      // img.src = "/spliteImg/test/CMU-1_"+level+'_'+i+'_'+j+".jpg";
      // img.src = "/spliteImg/test2/2021-01-26 16.08.13_"+level+'_'+i+'_'+j+".jpg";
      img.src = "/spliteImg/1622/CMU-1_"+level+'_'+i+'_'+j+".jpg";
      // highResolution
      // imgAry.push(img)
      // imgAry[i * (row) + j] = img
      imgAry[i * (column) + j] = img
      if(level == 8) {
        // console.log(level+'_'+i+'_'+j, '****', i * column + j, '**row', row,'**column', column)
        // document.getElementById('imgSplite').appendChild(img)
      }
      
    }
  }
  window.imglevel[parseInt(levelInfo.level)] = {}
  window.imglevel[parseInt(levelInfo.level)].imgAry = imgAry
}

function loadImgByLevelAndCanvasArea (levelInfo, coord, zoom, canvasArea){
  var count = levelInfo.count;
  var level = parseInt(levelInfo.level);
  // console.log('level**', level)
  var scaleRate = levelInfo.scaleRate;
  // if(level < 3) {return false}
  var row = parseInt(levelInfo.row);
  var column = parseInt(levelInfo.column);
  if (!window.imglevel[parseInt(levelInfo.level)]) {
    window.imglevel[parseInt(levelInfo.level)] = {}
  }
  if (!window.imglevel[parseInt(levelInfo.level)].imgAry) {
    window.imglevel[parseInt(levelInfo.level)].imgAry = new Array(count);
  }
  var imgAry = window.imglevel[parseInt(levelInfo.level)].imgAry;
  // var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  const imgBaseInfo = window.imgInfo.partition.find(function (item) {
    return item.level === window.baselevel.level
  })
  const imgAryBaseWidth = imgBaseInfo.slice_size[0]
  // -----------------
  var canvasTemplate
  if (document.getElementById('level_' + level)) {
    canvasTemplate = document.getElementById('level_' + level)
  } else {
    canvasTemplate = document.createElement('canvas')
    canvasTemplate.id = 'level_' + level
    document.getElementById('tempDiv').appendChild(canvasTemplate)
  }
  canvasTemplate.level = level
  canvasTemplate.scaleRate = scaleRate
  canvasTemplate.width = window.tempCanvasWidth
  canvasTemplate.height = window.tempCanvasWidth
  var rate = Math.ceil(imgAryBaseWidth / window.viewWidth);
  // -------------------
  // if(level <= 4) {console.log('A')}
  for(var i = 0; i < row; i++){
    for(var j = 0; j < column; j++){
      var idx = i * (column) + j;
      // var t = Math.floor(idx/(column)) * window.sliceSize
      var w = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
      var h = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
      var t = Math.floor(idx/column) * window.sliceSize
      var x = ((idx%(column)) * window.sliceSize) / scaleRate / rate * zoom - coord.x * zoom
      var y = (t)*zoom / scaleRate /rate - coord.y*zoom
      var areaB = { 
        x: x,
        y: y,
        w: w,
        h: h
      }
      if (boundaryIntersect(areaB, canvasArea)) {
        if (imgAry[idx]) {
          // 已下載過
          // drawTempCanvasByLevel(levelInfo, coord, zoom, true)
          // console.log('downloaded', level+'_'+i+'_'+j)
        } else {
          // 需下載圖片
          var img = new Image();
          img.comp = false;
          img.onload = function(){
            this.comp = true;
            drawTempCanvasByLevel(levelInfo, coord, zoom, true)
            // console.log('download compelete', this.n)
          };
          img.n = level+'_'+i+'_'+j
          // img.src = "/spliteImg/test/CMU-1_"+level+'_'+i+'_'+j+".jpg";
          // img.src = "/spliteImg/test2/2021-01-26 16.08.13_"+level+'_'+i+'_'+j+".jpg";
          img.src = "/spliteImg/1622/CMU-1_"+level+'_'+i+'_'+j+".jpg";
          imgAry[i * (column) + j] = img
          // console.log('downloading...', level+'_'+i+'_'+j)
        }
      }
    }
  }
  drawTempCanvasByLevel(levelInfo, coord, zoom, true)
}

function drawTempCanvasByLevel(levelInfo, coord, zoom, changeView){
  // var ss = 4 * 6
  var level = parseInt(levelInfo.level);
  var count = parseInt(levelInfo.count);
  // console.log('ll*', level, zoom)
  // console.log(level)
  var row = parseInt(levelInfo.row);
  var column = parseInt(levelInfo.column);
  var scaleRate = levelInfo.scaleRate;
  if (!zoom) {zoom = 1}
  if (!coord) {coord = {x:0,y:0}}
  var canvasTemplate
  if (document.getElementById('level_' + level)) {
    canvasTemplate = document.getElementById('level_' + level)
  } else {
    canvasTemplate = document.createElement('canvas')
    canvasTemplate.id = 'level_' + level
    document.getElementById('tempDiv').appendChild(canvasTemplate)
  }
  canvasTemplate.level = level
  canvasTemplate.scaleRate = scaleRate
  canvasTemplate.width = window.tempCanvasWidth
  canvasTemplate.height = window.tempCanvasWidth
  var imgAry = window.imglevel[parseInt(level)].imgAry
  // var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  var imgAryBaseWidth = window.baselevel.slice_size[0]
  var ctx = canvasTemplate.getContext("2d");
  for(var i = 0; i < imgAry.length; i++) {
    var t = Math.floor(i/(column)) * window.sliceSize
    if (imgAry[i] && imgAry[i].comp) {
      // 繪製暫時畫布
      // ctx.drawImage(圖片, left, top, width, height)
      if (count === 1) {
        var w, h, x, y
        // why 2?
        var rate = Math.ceil(imgAryBaseWidth / window.viewWidth);
        w = imgAry[i].width / scaleRate / rate *zoom; // why 2 ?
        h = imgAry[i].height / scaleRate / rate *zoom; // why 2 ?
        // x = -1 * coord.x*zoom
        // y = -1 * coord.y*zoom
        x = (shiftByViewWidth(0,0,0,0,0,zoom) -1 * coord.x)*zoom
        y = (shiftByViewWidth(0,0,0,0,0,zoom) -1 * coord.y)*zoom
        // console.log('x:', x, coord.x, ' y:', y, coord.y, 'zoom', zoom)
        ctx.drawImage(imgAry[i], x, y, w, h);
        ctx.font = "10px Arial";
        ctx.fillStyle = '#F00';
        ctx.fillText(imgAry[i].n, 0, 10);
      } else {
        var rate = Math.ceil(imgAryBaseWidth / window.viewWidth);
        w = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
        h = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
        t = Math.floor(i/column) * window.sliceSize
        x = ((i%(column)) * window.sliceSize) / scaleRate / rate * zoom + (shiftByViewWidth(0,0,0,0,0,zoom) -1 * coord.x)*zoom
        y = (t)*zoom / scaleRate /rate + (shiftByViewWidth(0,0,0,0,0,zoom) -1 * coord.y)*zoom
        var area = { x: shiftDrawArea(), y: shiftDrawArea(), w: window.tempCanvasWidth, h: window.tempCanvasWidth}
        // window.area = area
        var areaB = { 
          x: x,
          y: y,
          w: w,
          h: h
        }
        if (boundaryIntersect(areaB, area)) {
          ctx.drawImage(
            imgAry[i],
            x,
            y,
            w,
            h
          );
        }
        ctx.font = "10px Arial";
        ctx.fillStyle = '#F00';
        // ctx.fillText(imgAry[i].n, ((i%(row)) * window.sliceSize)*zoom/ss - coord.x*zoom, (t)*zoom/ss - coord.y*zoom + 10);
        ctx.fillText(imgAry[i].n,
          x,
          y + 10);
      }
      // if (level === parseInt(window.baselevel.level) || changeView) {
      //   // console.log('ll', level, zoom)
      //   renderCanvasByLevel(levelInfo, coord, zoom)
      // }
    }
  }
  if (level === parseInt(window.baselevel.level) || changeView) {
    // console.log('ll', level, zoom)
    renderCanvasByLevel(levelInfo, coord, zoom)
  }
}

function renderCanvasByLevel(levelInfo, coord, zoom){
  var level = parseInt(levelInfo.level);
  var row = parseInt(levelInfo.row);
  var scaleRate = parseInt(levelInfo.scaleRate)
  if (!zoom) {zoom = scaleRate}
  if (!coord) {coord = {x:0,y:0}}
  var canvasTemplate = document.getElementById('level_' + level);
  if (canvasTemplate) {
    dataURL=canvasTemplate.toDataURL('image/jpeg');
    // 將圖繪製到 真實畫布
    // if (zoom < scaleRate) { return false}
    // if (level != 4) {return false}
    console.log()
    // function(){
    //   // canvas.backgroundImage.rotate(window.theta);
    //   canvas.renderAll.bind(canvas)
    // }
    canvas.setBackgroundImage(dataURL, function(){
      // canvas.renderAll.bind(canvas)
      // canvas.backgroundImage.rotate(window.theta);
      canvas.renderAll();
    }, {
      originX: 'left',
      originY: 'top',
      // angle: 45, // theta window.theta
      left: coord.x - shiftByViewWidth(0,0,0,0,0,zoom),
      top: coord.y - shiftByViewWidth(0,0,0,0,0,zoom),
      scaleX: 1 / zoom,
      scaleY: 1 / zoom
    });
    canvas.renderAll();
    drawMiniMap();
  }
}

function boundaryIntersect(areaA, areaB) {
  console.log('areaB', areaB)
    // area: {x,y,w,h}
  // 確認 A x 兩端點 交集 B
  var ax1 = areaA.x, ax2 = areaA.x + areaA.w;
  var ay1 = areaA.y, ay2 = areaA.y + areaA.h;
  var bx1 = areaB.x, bx2 = areaB.x + areaB.w;
  var by1 = areaB.y, by2 = areaB.y + areaB.h;
  var xIntersect = false, yIntersect = false;
  
  if (ax1 >= bx1 && ax1 <= bx2) {
    xIntersect = true
  } else if (ax2 >= bx1 && ax2 <= bx2) {
    xIntersect = true
  } else if (ax2 >= bx1 && ax1 <= bx1) {
    xIntersect = true
  }
  if (ay1 >= by1 && ay1 <= by2) {
    yIntersect = true
  } else if (ay2 >= by1 && ay2 <= by2) {
    yIntersect = true
  } else if (ay2 >= by1 && ay1 <= by1) {
    yIntersect = true
  }
  return xIntersect & yIntersect
  // return true

}


function drawMiniMap () {
  const that = this
  // that.ndpi.baselevel

  const canvasMinimap = document.getElementById('minimapCanvas')
  const ctx = canvasMinimap.getContext('2d')
  canvasMinimap.width = 500
  canvasMinimap.height = 500
  const level = window.baselevel.level
  
  const scaleRate = 1
  // const zoom = canvas.getZoom() ? canvas.getZoom() : 1
  const zoom = realZoom() ? realZoom() : 1
  // var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  var imgAryBaseWidth = window.baselevel.slice_size[0]
  // const rate = Math.ceil((imgAry[0].width / scaleRate) / canvasMinimap.width)
  const rate = Math.ceil((imgAryBaseWidth / scaleRate) / canvasMinimap.width)
  
  ctx.clearRect(0, 0, canvasMinimap.width, canvasMinimap.height)
  ctx.strokeStyle = '#FF0000'
  ctx.lineWidth = 1
  
  // ----------------------
  // var rtheta = parseInt(window.theta) * Math.PI / 180
  // ctx.rotate(rtheta);
  // ----------------------
  if(window.imglevel[parseInt(level)]){
    const imgAry = window.imglevel[parseInt(level)].imgAry
    ctx.drawImage(
      imgAry[0],
      0,
      0,
      imgAry[0].width / scaleRate / rate,
      imgAry[0].height / scaleRate / rate
    )
  }
  // ----------------------
  // ctx.rotate(rtheta * -1);
  // ----------------------
  var coordinate = leftTopCoord()
  if (window.theta !== 0) {
      var tempAngle = window.theta
      rotateSwitch(0)
      coordinate = leftTopCoord()
      rotateSwitch(tempAngle)
  }
  // -----------------------
  ctx.strokeStyle = 'red'
  ctx.beginPath()
  var x = coordinate.x
  var y = coordinate.y
  var w = canvasMinimap.width / zoom
  var h = canvasMinimap.height / zoom
  // console.log('x:', x, that.leftTopCoord().x, ' y:', y, that.leftTopCoord().y, 'zoom', zoom, 'minimap')
  ctx.rect(x, y, w, h)
  ctx.stroke()
  // ------------------------
  ctx.strokeStyle = 'green'
  ctx.beginPath()
  x = coordinate.x - shiftByViewWidth(0,0,0,0,0,zoom)
  y = coordinate.y - shiftByViewWidth(0,0,0,0,0,zoom)
  // const w = canvasMinimap.width / zoom
  // const h = canvasMinimap.height / zoom
  w = window.tempCanvasWidth / zoom
  h = window.tempCanvasWidth / zoom
  // console.log('x:', x, that.leftTopCoord().x, ' y:', y, that.leftTopCoord().y, 'zoom', zoom, 'minimap')
  ctx.rect(x, y, w, h)
  ctx.stroke()
  // ----------------------
  // 使用旋轉後四個角座標畫線
  var lt = fabric.util.transformPoint({ x: 0, y: 0 }, fabric.util.invertTransform(canvas.viewportTransform))
  var rt = fabric.util.transformPoint({ x: canvas.width, y: 0 }, fabric.util.invertTransform(canvas.viewportTransform))
  var rb = fabric.util.transformPoint({ x: canvas.width, y: canvas.height }, fabric.util.invertTransform(canvas.viewportTransform))
  var lb = fabric.util.transformPoint({ x: 0, y: canvas.height }, fabric.util.invertTransform(canvas.viewportTransform))
  ctx.strokeStyle = 'blue'
  ctx.beginPath()
  ctx.moveTo(lt.x, lt.y);
  ctx.lineTo(rt.x, rt.y);
  ctx.lineTo(rb.x, rb.y);
  ctx.lineTo(lb.x, lb.y);
  ctx.closePath();
  ctx.stroke()
}


function rotate(rotateValue){
  if(window.theta === 0) {
      window.beforeRotate = canvas.viewportTransform
      window.originalCenter = CenterCoord();
  }
  
  // var curAngle = canvas.angle;
  // canvas.angle = (curAngle+15);
  console.log('zoom', canvas.getZoom(), realZoom(), rotateValue)
  // canvas.backgroundImage.setAngle(canvas.angle);
  // canvas.backgroundImage.rotate(45);
  // update the canvas viewport
  // window.theta = typeof window.theta == 'undefined' ? 0 : window.theta + 15 * Math.PI / 180
  window.theta = rotateValue
  var rtheta = parseInt(window.theta) * Math.PI / 180
  
  console.log('coor', leftTopCoord().x, leftTopCoord().y)
  var ary = new Array(6)
  var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]

  var rotateOrigianlCenter = pointRotate(rotateMatrix, window.originalCenter)
  var centerMoveMatirx = [1,0,0,1, window.originalCenter.x - rotateOrigianlCenter.x, window.originalCenter.y - rotateOrigianlCenter.y ]
  ary = window.beforeRotate
  ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  ary = matrixProduct(ary, rotateMatrix) // 再旋轉

  canvas.setViewportTransform(ary);
  canvas.renderAll();
  document.getElementById('rotateNum').innerHTML = window.theta
}

function rotatePoint(rotateValue, pointer){
  console.log('----------: ',rotateValue, pointer)
  if (!pointer) {
    pointer = leftTopCoord()
  }
  console.log('----------: ',rotateValue, pointer)
  // if(window.theta === 0) {
  //   window.beforeRotate = canvas.viewportTransform
  //   window.theta = rotateValue
  //   var rtheta = parseInt(window.theta) * Math.PI / 180
  //   var ary = new Array(6)
  //   var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
  //   var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
  //   var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
  //   ary = window.beforeRotate
  //   ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  //   ary = matrixProduct(ary, rotateMatrix) // 再旋轉
  //   canvas.setViewportTransform(ary);
  //   canvas.renderAll();
  // } else {
    // 先反轉到 0度
    // var rtheta = -1 * parseInt(window.theta) * Math.PI / 180
    var rtheta = parseInt(360 - window.theta) * Math.PI / 180
    var ary = new Array(6)
    var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
    var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
    var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
    ary = canvas.viewportTransform
    ary = matrixProduct(ary, centerMoveMatirx) // 先平移
    ary = matrixProduct(ary, rotateMatrix) // 再旋轉
    canvas.setViewportTransform(ary);
    canvas.renderAll();
    // 縮放
    var zoom = canvas.viewportTransform[0] // 轉正後可用來取代縮放倍率
    // console.log('**** zoom---------', zoom)
    // newZoomToPoint(pointer, zoom) // 不需要重新縮放
    // 再正轉到 rotateValue 角度
    // setTimeout(function(){
      window.theta = rotateValue
      var rtheta = parseInt(window.theta) * Math.PI / 180
      var ary = new Array(6)
      var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
      var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
      var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
      ary = canvas.viewportTransform
      ary = matrixProduct(ary, centerMoveMatirx) // 先平移
      ary = matrixProduct(ary, rotateMatrix) // 再旋轉
      canvas.setViewportTransform(ary);
      canvas.renderAll();
    // },2000)
    clearTimeout(window.dmini)
    window.dmini = setTimeout(function(){
      drawMiniMap()
    },100)
  // }
}

function newZoomToPoint (pointer, value) {
  window.pointer = pointer
  // 補 1. 先以point，反轉theta轉正
  // var rtheta = -1 * parseInt(window.theta) * Math.PI / 180
  var rtheta = parseInt(360 - window.theta) * Math.PI / 180
  var ary = new Array(6)
  var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
  var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
  var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
  ary = canvas.viewportTransform
  ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  ary = matrixProduct(ary, rotateMatrix) // 再旋轉
  canvas.setViewportTransform(ary);
  // ------------------------------------------------
  var zoomOrigianlCenter = pointer
  var zoomOrigianlRate = canvas.viewportTransform[0]
  // 1. 找出當前座標點，轉回螢幕點的座標
  var screenPoint = {
    x: zoomOrigianlCenter.x * zoomOrigianlRate + canvas.viewportTransform[4],
    y: zoomOrigianlCenter.y * zoomOrigianlRate + canvas.viewportTransform[5]
  }
  console.log(zoomOrigianlCenter, screenPoint, value)
  canvas.zoomToPoint(screenPoint, value);
  canvas.renderAll();
  // ------------------------------------------------
  // 補 2. 轉 theta
  var rtheta = parseInt(window.theta) * Math.PI / 180
  var ary = new Array(6)
  var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
  var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
  var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
  ary = canvas.viewportTransform
  ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  ary = matrixProduct(ary, rotateMatrix) // 再旋轉
  canvas.setViewportTransform(ary);
  canvas.renderAll();

  document.getElementById('angle').value = window.theta
  document.getElementById('myRange').value = window.theta
  document.getElementById('zoomNum').innerHTML = realZoom()
}

function newZoomToPoint_1 (pointer, value) {
  pointer = window.pointer
  // 補 1. 先以point，反轉theta轉正
  // var rtheta = -1 * parseInt(window.theta) * Math.PI / 180
  var rtheta = parseInt(360 - window.theta) * Math.PI / 180
  var ary = new Array(6)
  var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
  var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
  var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
  ary = canvas.viewportTransform
  ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  ary = matrixProduct(ary, rotateMatrix) // 再旋轉
  canvas.setViewportTransform(ary);
  // ------------------------------------------------
  var zoomOrigianlCenter = pointer
  var zoomOrigianlRate = canvas.viewportTransform[0]
  // 1. 找出當前座標點，轉回螢幕點的座標
  var screenPoint = {
    x: zoomOrigianlCenter.x * zoomOrigianlRate + canvas.viewportTransform[4],
    y: zoomOrigianlCenter.y * zoomOrigianlRate + canvas.viewportTransform[5]
  }
  console.log(zoomOrigianlCenter, screenPoint, value)
  canvas.zoomToPoint(screenPoint, value);
  canvas.renderAll();
  // ------------------------------------------------
  // 補 2. 轉 theta
  var rtheta = parseInt(window.theta) * Math.PI / 180
  var ary = new Array(6)
  var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
  var rotateOrigianlCenter = pointRotate(rotateMatrix, pointer)
  var centerMoveMatirx = [1,0,0,1, pointer.x - rotateOrigianlCenter.x, pointer.y - rotateOrigianlCenter.y ]
  ary = canvas.viewportTransform
  ary = matrixProduct(ary, centerMoveMatirx) // 先平移
  ary = matrixProduct(ary, rotateMatrix) // 再旋轉
  canvas.setViewportTransform(ary);
  canvas.renderAll();
}

function shiftByViewWidth (w, h, tempCanvasWidth, tempCanvasHeight, rate, zoom) {
  w = window.viewWidth
  tempCanvasWidth = window.tempCanvasWidth
  if (!rate) { rate = 1.5; }
  if (!h) { h = w }
  if (!tempCanvasHeight) { tempCanvasHeight = tempCanvasWidth }
  return (tempCanvasWidth - w) / zoom / 2
}

function shiftDrawArea (w, h, tempCanvasWidth, tempCanvasHeight, rate) {
  w = window.viewWidth
  tempCanvasWidth = window.tempCanvasWidth
  if (!rate) { rate = 1.5; }
  if (!h) { h = w }
  if (!tempCanvasHeight) { tempCanvasHeight = tempCanvasWidth }
  return (tempCanvasWidth - w) / 2 * -1
  // return 0
}

function realZoom () {
  var zoom = 0
  if (window.theta !== 0) {
    var rtheta = -1 * parseInt(window.theta) * Math.PI / 180
    var rotateMatrix = [Math.cos(rtheta), Math.sin(rtheta), -1*Math.sin(rtheta), Math.cos(rtheta), 0, 0]
    var ary = canvas.viewportTransform
    ary = matrixProduct(ary, rotateMatrix) // 再旋轉
    zoom = ary[0];
  } else {
    zoom = canvas.getZoom();
  }
  return zoom
}

function shift(x, y) {
  var vpt = canvas.viewportTransform;
  vpt[4] += x;
  vpt[5] += y;
  canvas.setViewportTransform(vpt);
  canvas.renderAll();
}

function pan (x,y) {
  // canvas.absolutePan({ x: x, y: y })
  // canvas.absolutePan({ x: 0, y: 0 })
  // newZoomToPoint ({ x: 0, y: 0 }, 1)
  // circle(50,50,50,'red')
  // circle(300,300,50,'green')
  // circle(500,-500,50,'blue')
  // newZoomToPoint ({ x: 259, y: 162 }, 2.4)
  rotateSwitch(60)
  console.log('**************',shiftDrawArea(), realZoom())
  // rotateSwitch(0)
  // newZoomToPoint_1('', 3.8)
  var zoom = realZoom()
  var levelInfo = window.imgInfo.partition.find(function(item){
    return item.scaleRate < zoom || item.scaleRate === 1
  })
  var area = { x: shiftDrawArea(), y: shiftDrawArea(), w: window.tempCanvasWidth, h: window.tempCanvasWidth}
  var coordinate = leftTopCoord()
  if (window.theta !== 0) {
    var tempAngle = window.theta
    rotateSwitch(0)
    coordinate = leftTopCoord()
    rotateSwitch(tempAngle)
  }
  loadImgByLevelAndCanvasArea(levelInfo, coordinate, zoom, area)
}

function rotateBg(rotateValue){
  console.log('????')
  canvas.backgroundImage.rotate(rotateValue);
  canvas.renderAll();
  window.theta = rotateValue
  document.getElementById('rotateNum').innerHTML = window.theta
}

function rotateSwitch(rotateValue) {
  // rotateBg(rotateValue)
  // rotate(rotateValue)
  document.getElementById('angle').value = rotateValue
  document.getElementById('myRange').value = rotateValue
  document.getElementById('zoomNum').innerHTML = realZoom()
  console.log('before rotate zoom: ',realZoom())
  // rotatePoint(rotateValue, leftTopCoord())
  rotatePoint(rotateValue, CenterCoord())
  console.log(' after rotate zoom: ',realZoom())
}

function circle (x,y,r, color){
  if(!r){ r = 1 }
  if(!color){ color = 'red' }
  var ellipse = new fabric.Ellipse({
    strokeWidth: 14,
    fill: color,
    stroke: color,
    originX: 'left',
    originY: 'top',
    top: y,
    left: x,
    rx: r,
    ry: r,
    selectable: true,
    hasBorders: true,
    hasControls: true,
    strokeUniform: true
  });
  canvas.add(ellipse)
}
// loadInfo()