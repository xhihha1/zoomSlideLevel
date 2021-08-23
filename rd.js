
window.imgInfo 
window.imglevel
window.baselevel
window.sliceSize = 1024

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
    for(var i = 0 ; i < window.imgInfo.partition.length; i++) {
      loadImgByLevel (window.imgInfo.partition[i])
    }
  });
  oReq.open("GET", "./spliteImg/test/CMU-1_slice_info_simple.json");
  oReq.send();  
}

function loadImgByLevel (levelInfo){
  var count = levelInfo.count;
  var level = parseInt(levelInfo.level);
  if(level < 5 || level > 7) {return false}
  var row = parseInt(levelInfo.row);
  var column = parseInt(levelInfo.column);
  var imgAry = new Array(count);
  for(var i = 0; i < row; i++){
    for(var j = 0; j < column; j++){
  // for(var i = 0; i < column; i++){
  //   for(var j = 0; j < row; j++){
      img = new Image();
      img.comp = false;
      img.onload = function(){
          this.comp = true;
          // renderCanvas()
          drawTempCanvasByLevel(levelInfo)
      };
      img.n = level+'_'+i+'_'+j
      // img.src = "/spliteImg/test/CMU-1_"+level+'_'+i+'_'+j+".jpg";
      img.src = "/spliteImg/test/CMU-1_"+level+'_'+i+'_'+j+".jpg";
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

function drawTempCanvasByLevel(levelInfo, coord, zoom, changeView){
  // var ss = 4 * 6
  var level = parseInt(levelInfo.level);
  var count = parseInt(levelInfo.count);
  console.log('ll*', level, zoom)
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
  var ss = canvasTemplate.scaleRate * Math.round(window.sliceSize / canvasTemplate.width)
  // console.log('level:',level, 'ss:',ss)
  var imgAry = window.imglevel[parseInt(level)].imgAry
  var imgAryBaseWidth = window.imglevel[parseInt(window.baselevel.level)].imgAry[0].width
  var ctx = canvasTemplate.getContext("2d");
  for(var i = 0; i < imgAry.length; i++) {
    // var t = Math.floor(i/(row)) * 3000
    var t = Math.floor(i/(column)) * window.sliceSize
    if (imgAry[i] && imgAry[i].comp) {
      
      // 繪製暫時畫布
      // ctx.drawImage(圖片, left, top, width, height)
      if(level > 3) {
        console.log('****************************************')
        console.log(imgAry[i].n, '----', level, zoom,
        'i',i,' row:',row,' column:',column, ' ss:', ss,'scaleRate',canvasTemplate.scaleRate,
        'Math.round(window.sliceSize / canvasTemplate.width)', Math.round(window.sliceSize / canvasTemplate.width),
        ((i%(column)) * window.sliceSize)*zoom/ss - coord.x*zoom,
        (t)*zoom/ss - coord.y*zoom,
        window.sliceSize*zoom/ss,
        window.sliceSize*zoom/ss)
        console.log('****************************************79')
      }
      // ctx.drawImage(
      //   imgAry[i],
      //   ((i%(row)) * 3000)*zoom/ss - coord.x*zoom,
      //   (t)*zoom/ss - coord.y*zoom,
      //   3000*zoom/ss,
      //   3000*zoom/ss);
      if (count === 1) {
        var w, h, x, y
        // w = imgAry[i].width / 6
        // h = imgAry[i].height / 6
        // why 2?
        var rate = Math.ceil(imgAryBaseWidth / canvasTemplate.width);
        // var rate = Math.ceil((imgAry[i].width / scaleRate)/canvasTemplate.width);
        w = imgAry[i].width / scaleRate / rate *zoom; // why 2 ?
        h = imgAry[i].height / scaleRate / rate *zoom; // why 2 ?
        x = -1 * coord.x*zoom
        y = -1 * coord.y*zoom
        ctx.drawImage(imgAry[i], x, y, w, h);
        ctx.font = "10px Arial";
        ctx.fillStyle = '#F00';
        ctx.fillText(imgAry[i].n, 0, 10);
      } else {
        var rate = Math.ceil(imgAryBaseWidth / canvasTemplate.width);
        // var ss = canvasTemplate.scaleRate * Math.round(3000 / canvasTemplate.width)
        ctx.drawImage(
          imgAry[i],
          ((i%(column)) * window.sliceSize) / scaleRate / rate * zoom - coord.x * zoom,
          (t)*zoom / scaleRate /rate - coord.y*zoom,
          window.sliceSize / scaleRate/rate*zoom,
          window.sliceSize / scaleRate/rate*zoom );
        // ctx.drawImage(
        //   imgAry[i],
        //   ((i%(column)) * 3000)*zoom/ss - coord.x*zoom,
        //   (t)*zoom/ss - coord.y*zoom,
        //   3000*zoom/ss,
        //   3000*zoom/ss);
        ctx.font = "10px Arial";
        ctx.fillStyle = '#F00';
        // ctx.fillText(imgAry[i].n, ((i%(row)) * 3000)*zoom/ss - coord.x*zoom, (t)*zoom/ss - coord.y*zoom + 10);
        ctx.fillText(imgAry[i].n, ((i%(column)) * window.sliceSize)*zoom/ss - coord.x*zoom, (t)*zoom/ss - coord.y*zoom + 10);
      }
      if (level === parseInt(window.baselevel.level) || changeView) {
        console.log('ll', level, zoom)
        renderCanvasByLevel(levelInfo, coord, zoom)
      }
    }
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
    canvas.setBackgroundImage(dataURL, canvas.renderAll.bind(canvas), {
      originX: 'left',
      originY: 'top',
      left: coord.x,
      top: coord.y,
      scaleX: 1 / zoom,
      scaleY: 1 / zoom
    });
    canvas.renderAll();
  }
}

// loadInfo()