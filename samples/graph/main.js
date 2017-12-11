"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Graph;
(function (Graph) {
    var BarGraph = (function (_super) {
        __extends(BarGraph, _super);
        function BarGraph(config) {
            var _this = _super.call(this, config) || this;
            _this.data = config.data;
            delete (config.data);
            _this.xAxis = config.xAxis;
            delete (config.xAxis);
            _this.xAxisLabel = config.xAxisLabel;
            delete (config.xAxisLabel);
            _this.yAxisLabel = config.yAxisLabel;
            delete (config.yAxisLabel);
            for (var i = 0; i < _this.data.length; i++) {
                var c = _this.data[i];
                if ((_this.minY === undefined) || (c < _this.minY))
                    _this.minY = c;
                if ((_this.maxY === undefined) || (c > _this.maxY))
                    _this.maxY = c;
            }
            return _this;
        }
        BarGraph.prototype.updateCanvas = function (ctx) {
            var w = this.layoutWidth;
            var h = this.layoutHeight;
            var colW = (w - (40)) / this.xAxis.length;
            var tmp = this.maxY;
            var powerLevel = 0;
            while (tmp > 10) {
                tmp /= 10;
                powerLevel++;
            }
            var topY = Math.pow(10, powerLevel + 1);
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
            ctx.font = 'normal 10px Sans-Serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            // draw x axis
            ctx.fillRect(40, h - 20, w - (40), 1);
            for (var i = 0; i < this.xAxis.length; i++) {
                var text = this.xAxis[i];
                ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
                if (i > 0)
                    ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
            }
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (var i = 0; i < 5; i++) {
                var text = (topY * i) / 5;
                ctx.fillText(text, 40 - 4, (h - 20) - (((h - 40) * i) / 5));
                ctx.globalAlpha = 0.2;
                ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            // draw values
            ctx.fillStyle = Ui.Color.create(this.getStyleProperty('barColor')).getCssRgba();
            for (var i = 0; i < this.data.length; i++) {
                var cX = 40 + (colW * i) + colW / 2;
                var cH = (h - 40) * this.data[i] / topY;
                var cW = colW / 2;
                ctx.fillRect(cX - (cW / 2), 20 + (h - 40) - cH, cW, cH);
            }
        };
        BarGraph.prototype.onStyleChange = function () {
            this.invalidateDraw();
        };
        BarGraph.style = {
            foreground: 'black',
            barColor: '#3665ce'
        };
        return BarGraph;
    }(Ui.CanvasElement));
    Graph.BarGraph = BarGraph;
    var LineGraph = (function (_super) {
        __extends(LineGraph, _super);
        function LineGraph(config) {
            var _this = _super.call(this, config) || this;
            _this.data = config.data;
            delete (config.data);
            _this.xAxis = config.xAxis;
            delete (config.xAxis);
            _this.xAxisLabel = config.xAxisLabel;
            delete (config.xAxisLabel);
            _this.yAxisLabel = config.yAxisLabel;
            delete (config.yAxisLabel);
            for (var i = 0; i < _this.data.length; i++) {
                var c = _this.data[i];
                if ((_this.minY === undefined) || (c < _this.minY))
                    _this.minY = c;
                if ((_this.maxY === undefined) || (c > _this.maxY))
                    _this.maxY = c;
            }
            return _this;
        }
        LineGraph.prototype.updateCanvas = function (ctx) {
            var w = this.layoutWidth;
            var h = this.layoutHeight;
            var colW = (w - (40)) / this.xAxis.length;
            var tmp = this.maxY;
            var powerLevel = 0;
            while (tmp > 10) {
                tmp /= 10;
                powerLevel++;
            }
            var topY = Math.pow(10, powerLevel + 1);
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
            ctx.font = 'normal 10px Sans-Serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            // draw x axis
            ctx.fillRect(40, h - 20, w - (40), 1);
            for (var i = 0; i < this.xAxis.length; i++) {
                var text = this.xAxis[i];
                ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
                if (i > 0)
                    ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
            }
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (var i = 0; i < 5; i++) {
                var text = (topY * i) / 5;
                ctx.fillText(text, 40 - 4, (h - 20) - (((h - 40) * i) / 5));
                ctx.globalAlpha = 0.2;
                ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            // draw values
            ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
            ctx.lineWidth = 2;
            ctx.beginPath();
            var lastX = 0;
            var lastY;
            for (var i = 0; i < this.data.length; i++) {
                var cX = 40 + (colW * i) + colW / 2;
                var cY = h - 20 - (h - 40) * this.data[i] / topY;
                if (i === 0)
                    ctx.moveTo(cX, cY);
                else
                    ctx.bezierCurveTo(lastX + colW / 2, lastY, cX - colW / 2, cY, cX, cY);
                //ctx.lineTo(cX, cY);
                lastX = cX;
                lastY = cY;
            }
            ctx.stroke();
        };
        LineGraph.prototype.onStyleChange = function () {
            this.invalidateDraw();
        };
        LineGraph.style = {
            foreground: 'black',
            lineColor: '#3665ce'
        };
        return LineGraph;
    }(Ui.CanvasElement));
    Graph.LineGraph = LineGraph;
})(Graph || (Graph = {}));
var Graph;
(function (Graph) {
    var TimeLineGraph = (function (_super) {
        __extends(TimeLineGraph, _super);
        function TimeLineGraph(init) {
            var _this = _super.call(this, init) || this;
            if (init.data != undefined)
                _this.data = init.data;
            if (init.startTime != undefined)
                _this.startTime = init.startTime;
            if (init.endTime != undefined)
                _this.endTime = init.endTime;
            if (init.unit != undefined)
                _this.unit = init.unit;
            if (init.mode != undefined)
                _this.mode = init.mode;
            if (_this.mode === 'diff') {
                for (var d = 0; d < _this.data.length; d++) {
                    var data = _this.data[d].data;
                    var lastV = data[0].value;
                    var lastT = data[0].time;
                    for (var i = 1; i < data.length; i++) {
                        var c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
                        if ((_this.minY === undefined) || (c < _this.minY))
                            _this.minY = c;
                        if ((_this.maxY === undefined) || (c > _this.maxY))
                            _this.maxY = c;
                        lastV = data[i].value;
                        lastT = data[i].time;
                    }
                }
            }
            else {
                for (var d = 0; d < _this.data.length; d++) {
                    var data = _this.data[d].data;
                    for (var i = 0; i < data.length; i++) {
                        var c = data[i].value;
                        if ((_this.minY === undefined) || (c < _this.minY))
                            _this.minY = c;
                        if ((_this.maxY === undefined) || (c > _this.maxY))
                            _this.maxY = c;
                    }
                }
            }
            _this.minY = 0;
            if (init.maxY != undefined)
                _this.maxY = init.maxY;
            if (_this.maxY === 0)
                _this.maxY = 1;
            _this.transformWatcher = new Ui.TransformableWatcher({
                element: _this,
                allowTranslate: true,
                allowRotate: false,
                minScale: 0.0001,
                maxScale: 100,
                inertia: true,
                transform: function () { return _this.onContentTransform(); }
            });
            _this.setTransformOrigin(1, 0);
            return _this;
        }
        TimeLineGraph.prototype.zeroPad = function (val, size) {
            if (size === void 0) { size = 2; }
            var s = val.toString();
            while (s.length < size) {
                s = "0" + s;
            }
            return s;
        };
        TimeLineGraph.prototype.formatBps = function (value) {
            var res;
            if (value === 0)
                res = '0';
            else if (value > 1000000000)
                res = Math.round(value / 1000000000) + ' Gb/s';
            else if (value > 1000000)
                res = Math.round(value / 1000000) + ' Mb/s';
            else if (value > 1000)
                res = Math.round(value / 1000) + ' kb/s';
            else
                res = value + ' b/s';
            return res;
        };
        TimeLineGraph.prototype.formatSeconds = function (value) {
            var res;
            if (value === 0)
                res = '0';
            else if (value > 3600 * 24)
                res = Math.round(value / 3600 * 24) + ' d';
            else if (value > 3600)
                res = Math.round(value / 3600) + ' h';
            else if (value > 60)
                res = Math.round(value / 60) + ' min';
            else if (value > 1)
                res = value + ' s';
            else if (value > 0.001)
                res = Math.round(value * 1000) + ' ms';
            else
                res = Math.round(value * 1000000) + ' μs';
            return res;
        };
        TimeLineGraph.prototype.formatPercent = function (value) {
            var res;
            return Math.round(value * 100) + ' %';
        };
        TimeLineGraph.prototype.formatUnit = function (value) {
            if (this.unit === 'bps')
                return this.formatBps(value);
            else if (this.unit === 'percent')
                return this.formatPercent(value);
            else if (this.unit === 'seconds')
                return this.formatSeconds(value);
            else
                return value;
        };
        TimeLineGraph.prototype.formatMonth = function (month) {
            return ['jan', 'fev', 'mars', 'avril', 'mai', 'juin', 'juil',
                'aout', 'sept', 'oct', 'nov', 'dec'][month];
        };
        TimeLineGraph.prototype.formatFullMonth = function (month) {
            return ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'aout', 'septembre', 'octobre', 'novembre', 'décembre'][month];
        };
        TimeLineGraph.prototype.formatWeekDay = function (day) {
            return ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'][day];
        };
        TimeLineGraph.prototype.yearRound = function (date) {
            return new Date(date.getFullYear(), 0, 1, 0);
        };
        TimeLineGraph.prototype.monthRound = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1, 0);
        };
        TimeLineGraph.prototype.dayRound = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
        };
        TimeLineGraph.prototype.hourRound = function (date, hours) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / hours) * hours);
        };
        TimeLineGraph.prototype.onContentTransform = function () {
            var scale = this.transformWatcher.scale;
            this.transformWatcher.translateY = 0;
            //console.log(this + '.onContentTransform scale: ' + scale + ', translateX: ' + this.translateX);
            this.invalidateDraw();
        };
        TimeLineGraph.prototype.updateCanvas = function (ctx) {
            var w = this.layoutWidth;
            var h = this.layoutHeight;
            var powerLevel = Math.ceil(Math.log10(this.maxY));
            var topY = Math.pow(10, powerLevel);
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (var i = 0; i <= 5; i++) {
                var text = this.formatUnit((topY * i) / 5);
                ctx.fillText(text.toString(), 60 - 4, (h - 25) - (((h - 45) * i) / 5));
                ctx.globalAlpha = (i === 0) ? 1 : 0.2;
                ctx.fillRect(60, (h - 25) - (((h - 45) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            var deltaTime = (this.endTime.getTime() - this.startTime.getTime()) / this.transformWatcher.scale;
            var endTime = new Date(this.endTime.getTime() - (this.transformWatcher.translateX * (deltaTime / (w - 60))));
            //		console.log('this.endTime: '+this.endTime+', endTime: '+endTime+', ms/pix: '+(deltaTime / (w - 60)));
            var startTime = new Date(endTime.getTime() - deltaTime);
            ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
            ctx.font = 'normal 10px Sans-Serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            // draw x axis
            deltaTime = endTime.getTime() - startTime.getTime();
            var nbXMarks = Math.round((w - 60) / 50);
            var deltaMarkTime = deltaTime / nbXMarks;
            if (deltaMarkTime <= 60 * 1000)
                deltaMarkTime = 60 * 1000;
            else if (deltaMarkTime <= 2 * 60 * 1000)
                deltaMarkTime = 2 * 60 * 1000;
            else if (deltaMarkTime <= 5 * 60 * 1000)
                deltaMarkTime = 5 * 60 * 1000;
            else if (deltaMarkTime <= 10 * 60 * 1000)
                deltaMarkTime = 10 * 60 * 1000;
            else if (deltaMarkTime <= 30 * 60 * 1000)
                deltaMarkTime = 30 * 60 * 1000;
            else if (deltaMarkTime <= 60 * 60 * 1000)
                deltaMarkTime = 60 * 60 * 1000;
            else if (deltaMarkTime <= 2 * 60 * 60 * 1000)
                deltaMarkTime = 2 * 60 * 60 * 1000;
            else if (deltaMarkTime <= 6 * 60 * 60 * 1000)
                deltaMarkTime = 6 * 60 * 60 * 1000;
            else if (deltaMarkTime <= 12 * 60 * 60 * 1000)
                deltaMarkTime = 12 * 60 * 60 * 1000;
            else if (deltaMarkTime <= 24 * 60 * 60 * 1000)
                deltaMarkTime = 24 * 60 * 60 * 1000;
            else if (deltaMarkTime <= 30 * 24 * 60 * 60 * 1000)
                deltaMarkTime = 30 * 24 * 60 * 60 * 1000;
            //		console.log('deltaMarkTime: '+deltaMarkTime+', nbXMarks: '+(deltaTime / deltaMarkTime)+', '+nbXMarks);
            ctx.textAlign = 'center';
            //		deltaMarkTime = (Math.floor(deltaMarkTime / 60000) + 1) * 60000;
            // month
            if (deltaMarkTime >= 30 * 24 * 60 * 60 * 1000) {
                var currentTime = this.monthRound(new Date(startTime.getTime() + 15 * 24 * 60 * 60 * 1000));
                var centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        var text = this.formatMonth(currentTime.getMonth());
                        ctx.fillText(text, x + centerX, h - 25 + 4);
                    }
                    currentTime = this.monthRound(new Date(currentTime.getTime() + deltaMarkTime + 15 * 24 * 60 * 60 * 1000));
                }
                // level 2: year
                ctx.font = 'bold 10px Sans-Serif';
                currentTime = this.yearRound(new Date(startTime.getTime() - 182 * 24 * 60 * 60 * 1000));
                centerX = (182 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    var text = currentTime.getFullYear().toString();
                    var textSize = ctx.measureText(text).width;
                    currentTime = this.yearRound(new Date(currentTime.getTime() + 547 * 24 * 60 * 60 * 1000));
                    var xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            else if (deltaMarkTime >= 24 * 60 * 60 * 1000) {
                var currentTime = this.dayRound(new Date(startTime.getTime() + 12 * 60 * 60 * 1000));
                var centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        var text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate();
                        ctx.fillText(text, x + centerX, h - 25 + 4);
                    }
                    currentTime = this.dayRound(new Date(currentTime.getTime() + deltaMarkTime + 12 * 60 * 60 * 1000));
                }
                // level 2: month
                ctx.font = 'bold 10px Sans-Serif';
                currentTime = this.monthRound(new Date(startTime.getTime() - 15 * 24 * 60 * 60 * 1000));
                centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    var text = this.formatFullMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
                    var textSize = ctx.measureText(text).width;
                    currentTime = this.monthRound(new Date(currentTime.getTime() + 45 * 24 * 60 * 60 * 1000));
                    var xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            else {
                var currentTime = void 0;
                //		currentTime = (Math.floor(currentTime / 60000) + 1) * 60000;
                if (deltaMarkTime > 60 * 60 * 1000)
                    currentTime = this.hourRound(startTime, Math.floor(deltaMarkTime / (60 * 60 * 1000)));
                else
                    currentTime = new Date(Math.ceil(startTime.getTime() / deltaMarkTime) * deltaMarkTime);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        var text = this.zeroPad(currentTime.getHours()) + ':' + this.zeroPad(currentTime.getMinutes());
                        ctx.fillText(text, x, h - 25 + 4);
                    }
                    if (deltaMarkTime > 60 * 60 * 1000)
                        currentTime = this.hourRound(new Date(currentTime.getTime() + deltaMarkTime + 30 * 60 * 1000), Math.floor(deltaMarkTime / (60 * 60 * 1000)));
                    else
                        currentTime = new Date(currentTime.getTime() + deltaMarkTime);
                }
                // level 2: day
                ctx.font = 'bold 10px Sans-Serif';
                currentTime = this.dayRound(new Date(startTime.getTime() - 12 * 60 * 60 * 1000));
                var centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    var x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    var text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate() + ' ' + this.formatMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
                    var textSize = ctx.measureText(text).width;
                    currentTime = this.dayRound(new Date(currentTime.getTime() + 36 * 60 * 60 * 1000));
                    var xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            // draw values
            for (var d = 0; d < this.data.length; d++) {
                var item = this.data[d];
                var data = item.data;
                if (item.color)
                    ctx.strokeStyle = Ui.Color.create(item.color).getCssRgba();
                else
                    ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
                ctx.lineWidth = 2;
                ctx.beginPath();
                var lastX = void 0;
                var lastY = void 0;
                var lastV = data[0].value;
                var lastT = data[0].time;
                for (var i = 1; i < data.length; i++) {
                    var cX = 60 + (data[i].time.getTime() - startTime.getTime()) /
                        (endTime.getTime() - startTime.getTime()) * (w - 60);
                    var c = void 0;
                    if (this.mode === 'diff') {
                        if (data[i].value < lastV)
                            c = 0;
                        else
                            c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
                    }
                    else
                        c = data[i].value;
                    var cY = h - 25 - (h - 45) * c / topY;
                    if (cX >= 60) {
                        if ((lastX !== undefined) && (lastX >= 60))
                            ctx.lineTo(lastX, cY);
                        else
                            ctx.moveTo((lastX !== undefined) ? 60 : cX, cY);
                        ctx.lineTo(cX, cY);
                    }
                    lastX = cX;
                    lastY = cY;
                    lastV = data[i].value;
                    lastT = data[i].time;
                }
                ctx.stroke();
            }
            // draw legend
            var xDelta = 0;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            for (var d = this.data.length - 1; d >= 0; d--) {
                var def = this.data[d];
                if (def.color !== undefined)
                    ctx.fillStyle = Ui.Color.create(def.color).getCssRgba();
                else
                    ctx.fillStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
                ctx.fillText(def.name, w - xDelta, 5);
                xDelta += ctx.measureText(def.name).width + 5;
                ctx.fillRect(w - xDelta - 5, 3, 5, 5);
                xDelta += 20;
            }
        };
        TimeLineGraph.prototype.onStyleChange = function () {
            this.invalidateDraw();
        };
        TimeLineGraph.style = {
            foreground: 'black',
            lineColor: '#627DF7'
        };
        return TimeLineGraph;
    }(Ui.CanvasElement));
    Graph.TimeLineGraph = TimeLineGraph;
})(Graph || (Graph = {}));
/// <reference path="../../era/era.d.ts" />
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this) || this;
        var scroll = new Ui.ScrollingArea();
        _this.setContent(scroll);
        _this.vbox = new Ui.VBox({ spacing: 20 });
        scroll.content = _this.vbox;
        var xAxis = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
        var data = [12, 45, 22, 36, 65, 43, 12];
        var barGraph = new Graph.BarGraph({
            xAxis: xAxis, data: data, height: 300,
            margin: 40
        });
        _this.vbox.append(barGraph);
        var lineGraph = new Graph.LineGraph({
            xAxis: xAxis, data: data, height: 300,
            margin: 40
        });
        _this.vbox.append(lineGraph);
        _this.onDataLoaded();
        return _this;
    }
    App.prototype.onDataLoaded = function () {
        // graph sur 10 min (1 valeure 10s = 60 valeures)
        var endTime = new Date(1449400783000);
        var startTime = new Date(endTime.getTime() - (6 * 60 * 60) * 1000);
        var cpuData = [];
        var cpuData2 = [];
        var currentTime = startTime.getTime();
        while (currentTime < endTime.getTime()) {
            currentTime += 5 * 1000;
            var progress = (currentTime - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
            var coef = (1 - Math.pow((progress * 2 - 1), 2));
            var coef2 = Math.sin(progress * Math.PI * 2);
            var coef3 = coef2 * (1 - Math.pow((progress * 2 - 1), 2));
            cpuData.push({ time: new Date(currentTime), value: coef / 2 + Math.random() * coef2 / 4 });
            cpuData2.push({ time: new Date(currentTime), value: Math.abs(coef3 / 3 + Math.random() * coef2 / 4) });
        }
        /*		var rxData = []; var txData = [];
                for(var i = 0; i < graphData.length; i++) {
                    rxData.push({ time: new Date(graphData[i].timestamp * 1000), value: graphData[i].rxBytes * 8 });
                    txData.push({ time: new Date(graphData[i].timestamp * 1000), value: graphData[i].txBytes * 8 });
                }
                var graph = new Graph.TimeLineGraph({
                    height: 300, margin: 0, data: [ { name: 'RX', data: rxData }, { name: 'TX', data: txData, color: '#40E060' } ],
                    maxY: 100000000, unit: 'bps',
                    startTime: startTime, endTime: endTime
                });
                this.vbox.append(graph);*/
        /*var graph = new Graph.TimeLineGraph({
            height: 300, margin: 0, data: txData,
            maxY: 1000000, unit: 'bps',
            startTime: startTime, endTime: endTime
        });
        this.vbox.append(graph);*/
        var graph = new Graph.TimeLineGraph({
            height: 300, margin: 40, data: [
                { name: 'CPU1', data: cpuData },
                { name: 'CPU2', data: cpuData2, color: 'red' }
            ],
            maxY: 1, unit: 'percent',
            startTime: startTime, endTime: endTime
        });
        this.vbox.append(graph);
    };
    return App;
}(Ui.App));
new App();
//# sourceMappingURL=main.js.map