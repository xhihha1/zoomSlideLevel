
window.imgInfo 
window.imglevel
window.baselevel
window.sliceSize = 3000

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
    var zoom = canvas.getZoom();
    var area = { x: 0, y: 0, w: 500, h: 500}
    loadImgByLevelAndCanvasArea(window.baselevel, leftTopCoord(), zoom, area)
    // for(var i = 0 ; i < window.imgInfo.partition.length; i++) {
    //   // loadImgByLevel (window.imgInfo.partition[i])
    //   if(window.imgInfo.partition[i].level >3) {
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
  canvasTemplate.width = 500
  canvasTemplate.height = 500
  var ss = canvasTemplate.scaleRate * Math.round(window.sliceSize / canvasTemplate.width)
  var rate = Math.ceil(imgAryBaseWidth / canvasTemplate.width);
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
            console.log('download compelete', this.n)
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
  canvasTemplate.width = 500
  canvasTemplate.height = 500
  var imgAry = window.imglevel[parseInt(level)].imgAry
  var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  var ctx = canvasTemplate.getContext("2d");
  for(var i = 0; i < imgAry.length; i++) {
    var t = Math.floor(i/(column)) * window.sliceSize
    if (imgAry[i] && imgAry[i].comp) {
      // 繪製暫時畫布
      // ctx.drawImage(圖片, left, top, width, height)
      if (count === 1) {
        var w, h, x, y
        // why 2?
        var rate = Math.ceil(imgAryBaseWidth / canvasTemplate.width);
        // var rate = Math.ceil(imgAry[i].width / scaleRate)/canvasTemplate.width;
        w = imgAry[i].width / scaleRate / rate *zoom; // why 2 ?
        h = imgAry[i].height / scaleRate / rate *zoom; // why 2 ?
        x = -1 * coord.x*zoom
        y = -1 * coord.y*zoom
        // console.log('x:', x, coord.x, ' y:', y, coord.y, 'zoom', zoom)
        ctx.drawImage(imgAry[i], x, y, w, h);
        ctx.font = "10px Arial";
        ctx.fillStyle = '#F00';
        ctx.fillText(imgAry[i].n, 0, 10);
      } else {
        // var area = { x: coord.x, y: coord.y, w: canvasTemplate.width*zoom, h: canvasTemplate.height*zoom, zoom:zoom}
        var rate = Math.ceil(imgAryBaseWidth / canvasTemplate.width);
        w = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
        h = window.sliceSize / scaleRate/rate*zoom; // why 2 ?
        t = Math.floor(i/column) * window.sliceSize
        x = ((i%(column)) * window.sliceSize) / scaleRate / rate * zoom - coord.x * zoom
        y = (t)*zoom / scaleRate /rate - coord.y*zoom
        var area = { x: 0, y: 0, w: 500, h: 500}
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
  var ss = scaleRate * Math.round(window.sliceSize / canvasTemplate.width)
  if (canvasTemplate) {
    dataURL=canvasTemplate.toDataURL('image/jpeg');
    // 將圖繪製到 真實畫布
    // if (zoom < scaleRate) { return false}
    // if (level != 4) {return false}
    canvas.setBackgroundImage(dataURL, canvas.renderAll.bind(canvas), {
      originX: 'left',
      originY: 'top',
      left: coord.x,
      top: coord.y,
      scaleX: 1 / zoom,
      scaleY: 1 / zoom
    });
    canvas.renderAll();
    drawMiniMap();
  }
}

function boundaryIntersect(areaA, areaB) {
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
}

function drawMiniMap () {
  const that = this
  // that.ndpi.baselevel

  const canvasMinimap = document.getElementById('minimapCanvas')
  const ctx = canvasMinimap.getContext('2d')
  canvasMinimap.width = 500
  canvasMinimap.height = 500
  const level = window.baselevel.level
  const imgAry = window.imglevel[parseInt(level)].imgAry
  const scaleRate = 1
  const zoom = canvas.getZoom() ? canvas.getZoom() : 1
  // const rate = Math.ceil((imgAry[0].width / scaleRate) / canvasMinimap.width)
  const rate = Math.ceil((imgAry[0].width / scaleRate) / canvasMinimap.width)
  var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  ctx.clearRect(0, 0, canvasMinimap.width, canvasMinimap.height)
  ctx.strokeStyle = '#FF0000'
  ctx.lineWidth = 1
  console.log('****************************************456')
  console.log(imgAry[0].width / scaleRate / rate, imgAry[0].height / scaleRate / rate)
  console.log('****************************************789')
  ctx.drawImage(
    imgAry[0],
    0,
    0,
    imgAry[0].width / scaleRate / rate,
    imgAry[0].height / scaleRate / rate
  )
  ctx.beginPath()
  const x = that.leftTopCoord().x
  // const x = 0 - edit.canvasView.viewportTransform[5] * totalRatio / edit.canvasView.getZoom()
  const y = that.leftTopCoord().y
  // const y = 0 - edit.canvasView.viewportTransform[4] * totalRatio / edit.canvasView.getZoom()
  // const w = canvasMinimap.width / scaleRate / zoom
  // const h = canvasMinimap.height / scaleRate / zoom
  const w = canvasMinimap.width / zoom
  const h = canvasMinimap.height / zoom
  console.log('x:', x, that.leftTopCoord().x, ' y:', y, that.leftTopCoord().y, 'zoom', zoom, 'minimap')
  ctx.rect(x, y, w, h)
  ctx.stroke()
}

// loadInfo()