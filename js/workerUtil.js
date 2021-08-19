var workerUtil = {}
workerUtil.buildWorker = function(foo){
	var str = foo.toString()
			  .match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
	return  new Worker(window.URL.createObjectURL(
					   new Blob([str],{type:'text/javascript'})));
 }

 workerUtil.worker = workerUtil.buildWorker(function(){
	//first line of worker
	var eventFuncObj = {}
	function eventPost(workerCbid, result){
		var msg = {workerCbid: workerCbid, result: result};
		self.postMessage(msg);
	}
	eventFuncObj.httpPost = function (workerCbid, postURL, requestObj){
		//start send
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				eventPost(workerCbid, this.response)
			}
			return true;
		}
		var async = true;
		if(typeof requestObj.async != 'undefined'){
			async = requestObj.async;
		}
		xhttp.open("POST", postURL, async);
		if (requestObj && requestObj.header) {
			for(var item in requestObj.header)
			{
				if(requestObj.header.hasOwnProperty(item)){
					xhttp.setRequestHeader(item, requestObj.header[item])
				}
			}
		}
		if (requestObj.withCredentials){
			xhttp.withCredentials = requestObj.withCredentials;
		}
		
		xhttp.send(requestObj.body)
	}
	eventFuncObj.httpGet = function (workerCbid){
		eventPost(workerCbid, res)
	}

	eventFuncObj.setCurResCollect = function(workerCbid, old_resCollect, resCollect){
		if (old_resCollect.length == 0) {
			old_resCollect = resCollect;
		} else {
			
			for (var j = 0; j < resCollect.length; j++) {
				var resColSourceTargetExist = false;
				for (var k = 0; k < old_resCollect.length; k++) {
					//merge by target_id or target_target
					if (resCollect[j]['target'] == old_resCollect[k]['target'] &&
						resCollect[j]['sourceType'] == old_resCollect[k]['sourceType'] &&
						typeof(resCollect[j]['datapoints']) != "undefined" && typeof(old_resCollect[k]['datapoints']) != "undefined") {
						resColSourceTargetExist = true;
						old_resCollect[k] = resCollect[j];
					}
					if (resCollect[j]['target'] == old_resCollect['target'] &&
						resCollect[j]['sourceType'] == old_resCollect['sourceType'] &&
						typeof(resCollect[j]['columns']) != "undefined" && typeof(old_resCollect[k]['columns']) != "undefined") {
						resColSourceTargetExist = true;
						old_resCollect[k] = resCollect[j];
						//break;
					}
				}
				if (!resColSourceTargetExist) {
					old_resCollect.push(resCollect[j]);
				}
			}
		}
		eventPost(workerCbid, old_resCollect)
	}
	eventFuncObj.simulationValue = function(workerCbid, targets, oldValueList, options){
		var maxDataPoints = 120;
        var randomRange;
		var randomMin;
		if(options) {
			if(options.maxDataPoints){maxDataPoints = options.maxDataPoints;}
		}
		var resAry = [];
		for (var i = 0; i < targets.length; i++) {
			var obj = {};
			obj = targets[i];
			var oldValueObj = oldValueList[targets[i]['target']]['oldValueObj'];
			if (oldValueObj && oldValueList[targets[i]['target']]['replaceWithText'] == targets[i]['target']) {
				obj = oldValueObj;
			}
			if (targets[i]['fixConst'] && oldValueObj) {
                resAry.push(oldValueObj);
            } else {
				if (obj.type == 'timeseries') {
					if (!Array.isArray(obj.datapoints)) {
                        obj.datapoints = [];
                    }
                    if (obj.dataType == 'random') {
                        randomMin = Number(obj.minimum);
                        randomRange = Number(obj.maximum) - Number(obj.minimum);
                        if (obj.datapoints.length == maxDataPoints) {
                            obj.datapoints.shift()
                            obj.datapoints.push([randomMin + Math.round(Math.random() * randomRange), new Date().getTime()])
                        } else {
                            var tempTime = new Date().getTime();
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                obj.datapoints.push([randomMin + Math.round(Math.random() * randomRange), (tempTime + 1000 * m)]);
                            }
                        }
                    } else if (obj.dataType == 'increment') {
                        // 将自增功能看做多次循环，首先获取一次循环所走的步数值，并对步数进行稍微扩大来保证可以获取到端点值
                        var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
                        // // 计算当前已进行循环次数
                        // var floorNum = Math.floor(index/num);
                        // // 当前值为 最小值 + 步进值 * （总步数值 - 循环次数 * 一次循环步数）
                        // incrementValue = Number(obj.minimum)*100 + Math.abs(Number(obj.scaling)*100)*(index - num*floorNum);

                        // datapoint = incrementValue/100;
                        // obj.datapoints = [
                        //     [datapoint + 1,1522381359088],
                        //     [datapoint,1522381360088]
                        // ];
                        var upperBound = Number(obj.minimum) + num * Math.abs(Number(obj.scaling));
						if (obj.datapoints.length == maxDataPoints) {
							var lastIndex = obj.datapoints.length - 1;
                            var lastValue = obj.datapoints[lastIndex][0];
							obj.datapoints.shift()
                            if (lastValue + Math.abs(Number(obj.scaling)) < upperBound) {
                                obj.datapoints.push([lastValue + Math.abs(Number(obj.scaling)), new Date().getTime()])
                            } else {
                                obj.datapoints.push([Number(obj.minimum), new Date().getTime()])
                            }
                        } else {
                            var tempTime = new Date().getTime();
                            var lastIndex;
                            var lastValue;
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                if (obj.datapoints.length > 0) {
                                    lastIndex = obj.datapoints.length - 1;
                                    lastValue = obj.datapoints[lastIndex][0];
                                }
                                if (typeof (lastIndex) != 'undefined' && (lastValue + Math.abs(Number(obj.scaling))) < upperBound) {
                                    obj.datapoints.push([lastValue + Math.abs(Number(obj.scaling)), new Date().getTime()])
                                } else {
                                    obj.datapoints.push([Number(obj.minimum), new Date().getTime()])
                                }
                            }
                        }
                    } else if (obj.dataType == 'decrement') {
                        var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
                        // var floorNum = Math.floor(index/num);                    
                        // decrementValue = Number(obj.maximum)*100 - Math.abs(Number(obj.scaling)*100)*(index - num*floorNum);
                        // datapoint = decrementValue/100;
                        // obj.datapoints = [
                        //     [datapoint - 1,1522381359088],
                        //     [datapoint,1522381360088]
                        // ];
                        var lowerBound = Number(obj.maximum) - num * Math.abs(Number(obj.scaling));
                        if (obj.datapoints.length == maxDataPoints) {
							var lastIndex = obj.datapoints.length - 1;
                            var lastValue = obj.datapoints[lastIndex][0];
							obj.datapoints.shift()
                            if (lastValue - Math.abs(Number(obj.scaling)) > lowerBound) {
                                obj.datapoints.push([lastValue - Math.abs(Number(obj.scaling)), new Date().getTime()])
                            } else {
                                obj.datapoints.push([Number(obj.maximum), new Date().getTime()])
                            }
                        } else {
                            var tempTime = new Date().getTime();
                            var lastIndex;
                            var lastValue;
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                if (obj.datapoints.length > 0) {
                                    lastIndex = obj.datapoints.length - 1;
                                    lastValue = obj.datapoints[lastIndex][0];
                                }
                                if (typeof (lastIndex) != 'undefined' && (lastValue - Math.abs(Number(obj.scaling))) > lowerBound) {
                                    obj.datapoints.push([lastValue - Math.abs(Number(obj.scaling)), new Date().getTime()])
                                } else {
                                    obj.datapoints.push([Number(obj.maximum), new Date().getTime()])
                                }
                            }
                        }
                    } else {
                        var tempTime = new Date().getTime();
                        var loopNumber = maxDataPoints - obj.datapoints.length;
                        for (var m = 0; m < (loopNumber); m++) {
                            obj.datapoints.push([Math.round(Math.random() * 100), (tempTime + 1000 * m)]);
                        }
                    }
				} else if (obj.type == 'table') {
					obj.columns = [{
						'text': 'name',
						'type': 'text'
					},
					{
						'text': 'value',
						'type': 'int32'
					}];
					if (!Array.isArray(obj.rows)) {
						obj.rows = [];
					}
					if (obj.dataType == 'random') {
						randomMin = Number(obj.minimum);
						randomRange = Number(obj.maximum) - Number(obj.minimum);
						if (obj.rows.length == maxDataPoints) {
							obj.rows.shift()
							obj.rows.push([randomMin + Math.round(Math.random() * randomRange), randomMin + Math.round(Math.random() * randomRange)])
						} else {
							var tempTime = new Date().getTime();
							var loopNumber = maxDataPoints - obj.rows.length;
							for (var m = 0; m < (loopNumber); m++) {
								obj.rows.push([randomMin + Math.round(Math.random() * randomRange), randomMin + Math.round(Math.random() * randomRange)]);
							}
						}
					} else if (obj.dataType == 'increment') {
						var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
						// var floorNum = Math.floor(index/num);
						// incrementValue = Number(obj.minimum)*100 + Math.abs(Number(obj.scaling)*100)*(index - num*floorNum);
						// datapoint = incrementValue/100;
						// obj.rows = [
						//     [datapoint + 1,datapoint + 1],
						//     [datapoint,datapoint]
						// ];
						var upperBound = Number(obj.minimum) + num * Math.abs(Number(obj.scaling));
						if (obj.rows.length == maxDataPoints) {
							var lastIndex = obj.rows.length - 1;
							var lastValue = obj.rows[lastIndex][0];
							obj.rows.shift()
							if (lastValue + Math.abs(Number(obj.scaling)) < upperBound) {
								obj.rows.push([lastValue + Math.abs(Number(obj.scaling)), lastValue + Math.abs(Number(obj.scaling))])
							} else {
								obj.rows.push([Number(obj.minimum), Number(obj.minimum)])
							}
						} else {
							var lastIndex;
							var lastValue;
							var loopNumber = maxDataPoints - obj.rows.length;
							for (var m = 0; m < (loopNumber); m++) {
								if (obj.rows.length > 0) {
									lastIndex = obj.rows.length - 1;
									lastValue = obj.rows[lastIndex][0];
								}
								if (typeof (lastIndex) != 'undefined' && lastValue + Math.abs(Number(obj.scaling)) < upperBound) {
									obj.rows.push([lastValue + Math.abs(Number(obj.scaling)), lastValue + Math.abs(Number(obj.scaling))])
								} else {
									obj.rows.push([Number(obj.minimum), Number(obj.minimum)])
								}
							}
						}
					} else if (obj.dataType == 'decrement') {
						var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
						// var floorNum = Math.floor(index/num);                    
						// decrementValue = Number(obj.maximum)*100 - Math.abs(Number(obj.scaling)*100)*(index - num*floorNum);
						// datapoint = decrementValue/100;
						// obj.rows = [
						//     [datapoint + 1,datapoint + 1],
						//     [datapoint,datapoint]
						// ];
						var lowerBound = Number(obj.maximum) - num * Math.abs(Number(obj.scaling));
						if (obj.rows.length == maxDataPoints) {
							var lastIndex = obj.rows.length - 1;
							var lastValue = obj.rows[lastIndex][0];
							obj.rows.shift()
							if (lastValue - Math.abs(Number(obj.scaling)) > lowerBound) {
								obj.rows.push([lastValue - Math.abs(Number(obj.scaling)), lastValue - Math.abs(Number(obj.scaling))])
							} else {
								obj.rows.push([Number(obj.maximum), Number(obj.maximum)])
							}
						} else {
							var lastIndex;
							var lastValue;
							var loopNumber = maxDataPoints - obj.rows.length;
							for (var m = 0; m < (loopNumber); m++) {
								if (obj.rows.length > 0) {
									lastIndex = obj.rows.length - 1;
									lastValue = obj.rows[lastIndex][0];
								}
								if (typeof (lastIndex) != 'undefined' && (lastValue - Math.abs(Number(obj.scaling))) > lowerBound) {
									obj.rows.push([lastValue - Math.abs(Number(obj.scaling)), lastValue - Math.abs(Number(obj.scaling))])
								} else {
									obj.rows.push([Number(obj.maximum), Number(obj.maximum)])
								}
							}
						}
					} else {
						// obj.rows = [
						//     [Math.round(Math.random()*100),Math.round(Math.random()*100)],
						//     [Math.round(Math.random()*100),Math.round(Math.random()*100)]
						// ];
						var tempTime = new Date().getTime();
						var loopNumber = maxDataPoints - obj.rows.length;
						for (var m = 0; m < (loopNumber); m++) {
							obj.rows.push([Math.round(Math.random() * 100), Math.round(Math.random() * 100)]);
						}
					}
				} else {
					if (!Array.isArray(obj.datapoints)) {
                        obj.datapoints = [];
                    }
                    if (obj.dataType == 'random') {
                        randomMin = Number(obj.minimum);
                        randomRange = Number(obj.maximum) - Number(obj.minimum);
                        if (obj.datapoints.length == maxDataPoints) {
                            obj.datapoints.shift()
                            obj.datapoints.push([randomMin + Math.round(Math.random() * randomRange), new Date().getTime()])
                        } else {
                            var tempTime = new Date().getTime();
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                obj.datapoints.push([randomMin + Math.round(Math.random() * randomRange), (tempTime + 1000 * m)]);
                            }
                        }
                    } else if (obj.dataType == 'increment') {
                        // 将自增功能看做多次循环，首先获取一次循环所走的步数值，并对步数进行稍微扩大来保证可以获取到端点值
                        var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
                        var upperBound = Number(obj.minimum) + num * Math.abs(Number(obj.scaling));
                        if (obj.datapoints.length == maxDataPoints) {
                            obj.datapoints.shift()
                            var lastIndex = oldValueObj.datapoints.length - 1;
                            var lastValue = oldValueObj.datapoints[lastIndex][0];
                            if (lastValue + Math.abs(Number(obj.scaling)) < upperBound) {
                                obj.datapoints.push([lastValue + Math.abs(Number(obj.scaling)), new Date().getTime()])
                            } else {
                                obj.datapoints.push([Number(obj.minimum), new Date().getTime()])
                            }
                        } else {
                            var tempTime = new Date().getTime();
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                var lastIndex = oldValueObj.datapoints.length - 1;
                                var lastValue = oldValueObj.datapoints[lastIndex][0];
                                if (lastValue + Math.abs(Number(obj.scaling)) < upperBound) {
                                    obj.datapoints.push([lastValue + Math.abs(Number(obj.scaling)), new Date().getTime()])
                                } else {
                                    obj.datapoints.push([Number(obj.minimum), new Date().getTime()])
                                }
                            }
                        }
                    } else if (obj.dataType == 'decrement') {
                        var num = Math.floor(((Number(obj.maximum) - Number(obj.minimum)) * 100) / Math.abs(Number(obj.scaling) * 100)) + 1;
                        var lowerBound = Number(obj.maximum) - num * Math.abs(Number(obj.scaling));
                        if (obj.datapoints.length == maxDataPoints) {
                            obj.datapoints.shift()
                            var lastIndex = oldValueObj.datapoints.length - 1;
                            var lastValue = oldValueObj.datapoints[lastIndex][0];
                            if (lastValue - Math.abs(Number(obj.scaling)) > lowerBound) {
                                obj.datapoints.push([lastValue - Math.abs(Number(obj.scaling)), new Date().getTime()])
                            } else {
                                obj.datapoints.push([Number(obj.maximum), new Date().getTime()])
                            }
                        } else {
                            var tempTime = new Date().getTime();
                            var loopNumber = maxDataPoints - obj.datapoints.length;
                            for (var m = 0; m < (loopNumber); m++) {
                                var lastIndex = oldValueObj.datapoints.length - 1;
                                var lastValue = oldValueObj.datapoints[lastIndex][0];
                                if (lastValue - Math.abs(Number(obj.scaling)) > lowerBound) {
                                    obj.datapoints.push([lastValue - Math.abs(Number(obj.scaling)), new Date().getTime()])
                                } else {
                                    obj.datapoints.push([Number(obj.maximum), new Date().getTime()])
                                }
                            }
                        }
                    } else {
                        var tempTime = new Date().getTime();
                        var loopNumber = maxDataPoints - obj.datapoints.length;
                        for (var m = 0; m < (loopNumber); m++) {
                            obj.datapoints.push([Math.round(Math.random() * 100), (tempTime + 1000 * m)]);
                        }
                    }
				}
				resAry.push(obj);
			}
		}
		eventPost(workerCbid, resAry)
	}
	
	self.onmessage = function (e) {
		// {method, arguments}
		if(e.data){
			var data = e.data;
			if(data.method && typeof(eventFuncObj[data.method]) == 'function') {
				var arguments = []
				arguments.push(data.workerCbid)
				if(Array.isArray(data.arguments)){
					arguments = arguments.concat(data.arguments)
				}
				eventFuncObj[data.method].apply(null, arguments)
			}
		}
		// console.log(e);
		return true;
	};
	//last line of worker
});
workerUtil.callbacks = {};
workerUtil.workerCbid = 0;
workerUtil.postmessage = function(params, callback){
	workerUtil.workerCbid++;
	if(workerUtil.workerCbid > 5000) {
		workerUtil.workerCbid = 0;
	}
	const workerCbid = workerUtil.workerCbid
    // this.worker.postMessage(Object.assign({ id, }, action));
	if(callback){
		workerUtil.callbacks[workerCbid] = callback;
	}
	workerUtil.worker.postMessage(Object.assign({workerCbid:workerCbid}, params))
}
workerUtil.worker.onmessage = function(event) {
	if(event.data){
		var data = event.data;
		if(typeof data.workerCbid == 'number'){
			var workerCbid = data.workerCbid;
			if(workerUtil.callbacks && typeof(workerUtil.callbacks[workerCbid]) == 'function') {
				workerUtil.callbacks[workerCbid].apply(this, [data.result]);
			}
            delete workerUtil.callbacks[workerCbid];
		}
	}
};
