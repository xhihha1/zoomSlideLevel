hiDraw.prototype.DatGUI = (function () {
    function hiProperty(options, setting) {
        this.gui = new dat.gui.GUI();
        this.options = options;
        this.setting = setting;
        // this.gui.remember(options);
        this.items = [];
    }

    hiProperty.prototype.updateSetting = function (setting) {
        this.setting = setting;
    }

    hiProperty.prototype.updateOptions = function (options) {
        this.options = options;
        // console.log('options',this.options)
        // this.gui.remember(options);
        this.addProperty();
    }

    hiProperty.prototype.addItem = function (options, key) {
        var that = this;
        var item;
        if (true == 'color') {
            item = that.gui.addColor(options, 'color0');
        } else {

            item = that.gui.add(options, key);
        }
        that.items.push(item)
        item.onFinishChange(function (value) { // 結束操作數據
            console.log("controller onChange:" + value, arguments, this.property)
            if (that.setting && that.setting.onFinishChange) {
                that.setting.onFinishChange(item.property, value)
            }
        });
    }

    hiProperty.prototype.addProperty = function () {
        var that = this;
        var options = that.options;
        that.removeAllProperty()
        this.gui.destroy()
        this.gui = new dat.gui.GUI();
        if (typeof (options) === 'undefined') {
            return false;
        }
        for (var key in options) {
            if (options[key] != null && typeof (options[key]) != "undefined") {
                that.addItem(options, key);
            }
        }
        // gui.remove(item);
        // var f1 = gui.addFolder('Colors'); // folder
        // f1.addColor(obj, 'color0');
        // f1.add(obj, 'noiseStrength');
        // f1.remove(item);
        // item.onChange(function(value) { // 操作中數據
        //     console.log("controller onChange:" + value)
        // });
        // item.onFinishChange(function(value) { // 結束操作數據
        //     console.log("controller onChange:" + value)
        // });
    }

    hiProperty.prototype.removeAllProperty = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.gui.remove(this.items[i]);
        }
        this.items = [];
    }

    hiProperty.prototype.getOptions = function () {
        return this.options;
    }
    return hiProperty;
}());