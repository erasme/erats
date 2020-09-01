"use strict";
var Graph;
(function (Graph) {
    class DonutGraph extends Ui.CanvasElement {
        constructor(init) {
            super(init);
            this.data = init.data;
        }
        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let r = Math.min(w, h) / 2;
            let total = 0;
            for (let d of this.data)
                total += d.value;
            let startAngle = -Math.PI / 2;
            for (let d of this.data) {
                let angle = (d.value / total) * Math.PI * 2;
                let endAngle = startAngle + angle;
                ctx.fillStyle = Ui.Color.create(d.color).getCssRgba();
                ctx.beginPath();
                let x1 = w / 2 + Math.cos(startAngle) * r;
                let y1 = h / 2 + Math.sin(startAngle) * r;
                ctx.moveTo(x1, y1);
                ctx.arc(w / 2, h / 2, r - 0.5, startAngle, endAngle, false);
                ctx.arc(w / 2, h / 2, r * 0.6 - 0.5, endAngle, startAngle, true);
                ctx.closePath();
                ctx.fill();
                startAngle = endAngle;
            }
        }
    }
    Graph.DonutGraph = DonutGraph;
    class BarGraph extends Ui.CanvasElement {
        constructor(init) {
            super(init);
            this.minY = 0;
            this.maxY = 0;
            this.data = init.data;
            this.xAxis = init.xAxis;
            for (let i = 0; i < this.data.length; i++) {
                let c = this.data[i];
                if ((this.minY === undefined) || (c < this.minY))
                    this.minY = c;
                if ((this.maxY === undefined) || (c > this.maxY))
                    this.maxY = c;
            }
        }
        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let colW = (w - (40)) / this.xAxis.length;
            let tmp = this.maxY;
            let powerLevel = 0;
            while (tmp > 10) {
                tmp /= 10;
                powerLevel++;
            }
            let topY = Math.pow(10, powerLevel + 1);
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
            for (let i = 0; i < this.xAxis.length; i++) {
                let text = this.xAxis[i];
                ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
                if (i > 0)
                    ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
            }
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (let i = 0; i < 5; i++) {
                let text = (topY * i) / 5;
                ctx.fillText(text.toString(), 40 - 4, (h - 20) - (((h - 40) * i) / 5));
                ctx.globalAlpha = 0.2;
                ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            // draw values
            let barColor = Ui.Color.create(this.getStyleProperty('barColor'));
            let hsl = barColor.getHsl();
            let borderColor = Ui.Color.createFromHsl(hsl.h, Math.min(1, hsl.s + 0.8), Math.max(0, hsl.l - 0.2));
            ctx.fillStyle = barColor.getCssRgba();
            ctx.lineWidth = 1;
            ctx.strokeStyle = borderColor.getCssRgba();
            for (let i = 0; i < this.data.length; i++) {
                ctx.fillStyle = barColor.getCssRgba();
                let cX = Math.round(40 + (colW * i) + colW / 2);
                let cH = Math.round((h - 40) * this.data[i] / topY);
                let cW2 = Math.round(colW / 4);
                let cW = cW2 * 2;
                ctx.fillRect(cX - cW2, 20 + (h - 40) - cH, cW, cH);
                ctx.fillStyle = borderColor.getCssRgba();
                ctx.beginPath();
                ctx.moveTo(cX - cW2, 20 + (h - 40));
                ctx.lineTo(cX - cW2, 20 + (h - 40) - cH);
                ctx.lineTo(cX - cW2 + cW, 20 + (h - 40) - cH);
                ctx.lineTo(cX - cW2 + cW, 20 + (h - 40));
                ctx.lineTo(cX - cW2 + cW - 1, 20 + (h - 40));
                ctx.lineTo(cX - cW2 + cW - 1, 20 + (h - 40) - cH + 1);
                ctx.lineTo(cX - cW2 + 1, 20 + (h - 40) - cH + 1);
                ctx.lineTo(cX - cW2 + 1, 20 + (h - 40));
                ctx.fill();
            }
        }
        onStyleChange() {
            this.invalidateDraw();
        }
    }
    BarGraph.style = {
        foreground: '#444444',
        barColor: '#6aa5db'
    };
    Graph.BarGraph = BarGraph;
    class LineGraph extends Ui.CanvasElement {
        constructor(init) {
            super(init);
            this.minY = 0;
            this.maxY = 0;
            this.data = init.data;
            this.xAxis = init.xAxis;
            for (let i = 0; i < this.data.length; i++) {
                let c = this.data[i];
                if ((this.minY === undefined) || (c < this.minY))
                    this.minY = c;
                if ((this.maxY === undefined) || (c > this.maxY))
                    this.maxY = c;
            }
        }
        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let colW = (w - (40)) / this.xAxis.length;
            let tmp = this.maxY;
            let powerLevel = 0;
            while (tmp > 10) {
                tmp /= 10;
                powerLevel++;
            }
            let topY = Math.pow(10, powerLevel + 1);
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
            for (let i = 0; i < this.xAxis.length; i++) {
                let text = this.xAxis[i];
                ctx.fillText(text, 40 + (i * colW) + colW / 2, h - 20 + 4, colW);
                if (i > 0)
                    ctx.fillRect(40 + (i * colW), h - 20, 1, 4);
            }
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (let i = 0; i < 5; i++) {
                let text = (topY * i) / 5;
                ctx.fillText(text.toString(), 40 - 4, (h - 20) - (((h - 40) * i) / 5));
                ctx.globalAlpha = 0.2;
                ctx.fillRect(40, (h - 20) - (((h - 40) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            // draw values
            ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
            ctx.lineWidth = 2;
            ctx.beginPath();
            let lastX = 0;
            let lastY = 0;
            for (let i = 0; i < this.data.length; i++) {
                let cX = 40 + (colW * i) + colW / 2;
                let cY = h - 20 - (h - 40) * this.data[i] / topY;
                if (i === 0)
                    ctx.moveTo(cX, cY);
                else
                    ctx.bezierCurveTo(lastX + colW / 2, lastY, cX - colW / 2, cY, cX, cY);
                //ctx.lineTo(cX, cY);
                lastX = cX;
                lastY = cY;
            }
            ctx.stroke();
        }
        onStyleChange() {
            this.invalidateDraw();
        }
    }
    LineGraph.style = {
        foreground: '#444444',
        lineColor: '#317fc8'
    };
    Graph.LineGraph = LineGraph;
})(Graph || (Graph = {}));
var Graph;
(function (Graph) {
    class TimeLineGraph extends Ui.CanvasElement {
        constructor(init) {
            super(init);
            this.data = new Array();
            this.minY = 0;
            this.maxY = 0;
            this.unit = 'none';
            this.mode = 'normal';
            if (init.data != undefined)
                this.data = init.data;
            if (init.startTime != undefined)
                this.startTime = init.startTime;
            else
                this.startTime = new Date();
            if (init.endTime != undefined)
                this.endTime = init.endTime;
            else
                this.endTime = new Date();
            if (init.unit != undefined)
                this.unit = init.unit;
            if (init.mode != undefined)
                this.mode = init.mode;
            if (this.mode === 'diff') {
                for (let d = 0; d < this.data.length; d++) {
                    let data = this.data[d].data;
                    let lastV = data[0].value;
                    let lastT = data[0].time;
                    for (let i = 1; i < data.length; i++) {
                        let c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
                        if ((this.minY === undefined) || (c < this.minY))
                            this.minY = c;
                        if ((this.maxY === undefined) || (c > this.maxY))
                            this.maxY = c;
                        lastV = data[i].value;
                        lastT = data[i].time;
                    }
                }
            }
            else {
                for (let d = 0; d < this.data.length; d++) {
                    let data = this.data[d].data;
                    for (let i = 0; i < data.length; i++) {
                        let c = data[i].value;
                        if ((this.minY === undefined) || (c < this.minY))
                            this.minY = c;
                        if ((this.maxY === undefined) || (c > this.maxY))
                            this.maxY = c;
                    }
                }
            }
            this.minY = 0;
            if (init.maxY != undefined)
                this.maxY = init.maxY;
            if (this.maxY === 0)
                this.maxY = 1;
            this.transformWatcher = new Ui.TransformableWatcher({
                element: this,
                allowTranslate: true,
                allowRotate: false,
                minScale: 0.0001,
                maxScale: 100,
                inertia: true,
                transform: () => this.onContentTransform()
            });
            this.setTransformOrigin(1, 0);
        }
        zeroPad(val, size = 2) {
            let s = val.toString();
            while (s.length < size) {
                s = "0" + s;
            }
            return s;
        }
        formatBps(value) {
            let res;
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
        }
        formatSeconds(value) {
            let res;
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
        }
        formatPercent(value) {
            let res;
            return Math.round(value * 100) + ' %';
        }
        formatUnit(value) {
            if (this.unit === 'bps')
                return this.formatBps(value);
            else if (this.unit === 'percent')
                return this.formatPercent(value);
            else if (this.unit === 'seconds')
                return this.formatSeconds(value);
            else
                return value;
        }
        formatMonth(month) {
            return ['jan', 'fev', 'mars', 'avril', 'mai', 'juin', 'juil',
                'aout', 'sept', 'oct', 'nov', 'dec'][month];
        }
        formatFullMonth(month) {
            return ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'aout', 'septembre', 'octobre', 'novembre', 'décembre'][month];
        }
        formatWeekDay(day) {
            return ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'][day];
        }
        yearRound(date) {
            return new Date(date.getFullYear(), 0, 1, 0);
        }
        monthRound(date) {
            return new Date(date.getFullYear(), date.getMonth(), 1, 0);
        }
        dayRound(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
        }
        hourRound(date, hours) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(date.getHours() / hours) * hours);
        }
        onContentTransform() {
            let scale = this.transformWatcher.scale;
            this.transformWatcher.translateY = 0;
            //console.log(this + '.onContentTransform scale: ' + scale + ', translateX: ' + this.translateX);
            this.invalidateDraw();
        }
        updateCanvas(ctx) {
            let w = this.layoutWidth;
            let h = this.layoutHeight;
            let powerLevel = Math.ceil(Math.log10(this.maxY));
            let topY = Math.pow(10, powerLevel);
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            if (topY > this.maxY * 2)
                topY /= 2;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            // draw y axis
            for (let i = 0; i <= 5; i++) {
                let text = this.formatUnit((topY * i) / 5);
                ctx.fillText(text.toString(), 60 - 4, (h - 25) - (((h - 45) * i) / 5));
                ctx.globalAlpha = (i === 0) ? 1 : 0.2;
                ctx.fillRect(60, (h - 25) - (((h - 45) * i) / 5), w - (40), 1);
                ctx.globalAlpha = 1;
            }
            let deltaTime = (this.endTime.getTime() - this.startTime.getTime()) / this.transformWatcher.scale;
            let endTime = new Date(this.endTime.getTime() - (this.transformWatcher.translateX * (deltaTime / (w - 60))));
            //		console.log('this.endTime: '+this.endTime+', endTime: '+endTime+', ms/pix: '+(deltaTime / (w - 60)));
            let startTime = new Date(endTime.getTime() - deltaTime);
            ctx.fillStyle = Ui.Color.create(this.getStyleProperty('foreground')).getCssRgba();
            ctx.font = 'normal 10px Sans-Serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            // draw x axis
            deltaTime = endTime.getTime() - startTime.getTime();
            let nbXMarks = Math.round((w - 60) / 50);
            let deltaMarkTime = deltaTime / nbXMarks;
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
                let currentTime = this.monthRound(new Date(startTime.getTime() + 15 * 24 * 60 * 60 * 1000));
                let centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        let text = this.formatMonth(currentTime.getMonth());
                        ctx.fillText(text, x + centerX, h - 25 + 4);
                    }
                    currentTime = this.monthRound(new Date(currentTime.getTime() + deltaMarkTime + 15 * 24 * 60 * 60 * 1000));
                }
                // level 2: year
                ctx.font = 'bold 10px Sans-Serif';
                currentTime = this.yearRound(new Date(startTime.getTime() - 182 * 24 * 60 * 60 * 1000));
                centerX = (182 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    let text = currentTime.getFullYear().toString();
                    let textSize = ctx.measureText(text).width;
                    currentTime = this.yearRound(new Date(currentTime.getTime() + 547 * 24 * 60 * 60 * 1000));
                    let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            // day
            else if (deltaMarkTime >= 24 * 60 * 60 * 1000) {
                let currentTime = this.dayRound(new Date(startTime.getTime() + 12 * 60 * 60 * 1000));
                let centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        let text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate();
                        ctx.fillText(text, x + centerX, h - 25 + 4);
                    }
                    currentTime = this.dayRound(new Date(currentTime.getTime() + deltaMarkTime + 12 * 60 * 60 * 1000));
                }
                // level 2: month
                ctx.font = 'bold 10px Sans-Serif';
                currentTime = this.monthRound(new Date(startTime.getTime() - 15 * 24 * 60 * 60 * 1000));
                centerX = (15 * 24 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    let text = this.formatFullMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
                    let textSize = ctx.measureText(text).width;
                    currentTime = this.monthRound(new Date(currentTime.getTime() + 45 * 24 * 60 * 60 * 1000));
                    let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            // hour
            else {
                let currentTime;
                //		currentTime = (Math.floor(currentTime / 60000) + 1) * 60000;
                if (deltaMarkTime > 60 * 60 * 1000)
                    currentTime = this.hourRound(startTime, Math.floor(deltaMarkTime / (60 * 60 * 1000)));
                else
                    currentTime = new Date(Math.ceil(startTime.getTime() / deltaMarkTime) * deltaMarkTime);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60) {
                        ctx.fillRect(x, h - 25, 1, 4);
                        let text = this.zeroPad(currentTime.getHours()) + ':' + this.zeroPad(currentTime.getMinutes());
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
                let centerX = (12 * 60 * 60 * 1000 / deltaTime) * (w - 60);
                while (currentTime.getTime() < endTime.getTime()) {
                    let x = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    if (x >= 60)
                        ctx.fillRect(x - 1, h - 25, 2, 4);
                    let text = this.formatWeekDay(currentTime.getDay()) + ' ' + currentTime.getDate() + ' ' + this.formatMonth(currentTime.getMonth()) + ' ' + currentTime.getFullYear();
                    let textSize = ctx.measureText(text).width;
                    currentTime = this.dayRound(new Date(currentTime.getTime() + 36 * 60 * 60 * 1000));
                    let xEnd = 60 + ((currentTime.getTime() - startTime.getTime()) / deltaTime) * (w - 60);
                    ctx.fillText(text, Math.max(x + 5 + textSize / 2, Math.min(xEnd - 5 - textSize / 2, Math.max(60 + textSize / 2, Math.min(x + centerX, w - textSize / 2)))), h - 10);
                }
                ctx.font = 'normal 10px Sans-Serif';
            }
            // draw values
            for (let d = 0; d < this.data.length; d++) {
                let item = this.data[d];
                let data = item.data;
                if (item.color)
                    ctx.strokeStyle = Ui.Color.create(item.color).getCssRgba();
                else
                    ctx.strokeStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
                ctx.lineWidth = 2;
                ctx.beginPath();
                let lastX;
                let lastY;
                let lastV = data[0].value;
                let lastT = data[0].time;
                for (let i = 1; i < data.length; i++) {
                    let cX = 60 + (data[i].time.getTime() - startTime.getTime()) /
                        (endTime.getTime() - startTime.getTime()) * (w - 60);
                    let c;
                    if (this.mode === 'diff') {
                        if (data[i].value < lastV)
                            c = 0;
                        else
                            c = (data[i].value - lastV) / ((data[i].time.getTime() - lastT.getTime()) / 1000);
                    }
                    else
                        c = data[i].value;
                    let cY = h - 25 - (h - 45) * c / topY;
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
            let xDelta = 0;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'right';
            for (let d = this.data.length - 1; d >= 0; d--) {
                let def = this.data[d];
                if (def.color !== undefined)
                    ctx.fillStyle = Ui.Color.create(def.color).getCssRgba();
                else
                    ctx.fillStyle = Ui.Color.create(this.getStyleProperty('lineColor')).getCssRgba();
                ctx.fillText(def.name, w - xDelta, 5);
                xDelta += ctx.measureText(def.name).width + 5;
                ctx.fillRect(w - xDelta - 5, 3, 5, 5);
                xDelta += 20;
            }
        }
        onStyleChange() {
            this.invalidateDraw();
        }
    }
    TimeLineGraph.style = {
        foreground: '#444444',
        lineColor: '#627DF7'
    };
    Graph.TimeLineGraph = TimeLineGraph;
})(Graph || (Graph = {}));
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let scroll = new Ui.ScrollingArea();
        this.content = scroll;
        this.vbox = new Ui.VBox({ spacing: 20 });
        scroll.content = this.vbox;
        let xAxis = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
        let data = [12, 45, 22, 36, 65, 43, 12];
        let barGraph = new Graph.BarGraph({
            xAxis: xAxis, data: data, height: 300,
            margin: 40
        });
        this.vbox.append(barGraph);
        let lineGraph = new Graph.LineGraph({
            xAxis: xAxis, data: data, height: 300,
            margin: 40
        });
        this.vbox.append(lineGraph);
        let donutData = [
            { value: 15, color: '#69a6dd', text: 'Poivre' },
            { value: 45, color: '#ee939e', text: 'Piment' },
            { value: 24, color: '#68dda2', text: 'Sel' },
            { value: 9, color: '#fdc102', text: 'Moutarde' }
        ];
        let donutGraph = new Graph.DonutGraph({
            width: 150, height: 150,
            data: donutData
        });
        let hbox = new Ui.HBox({ spacing: 40, horizontalAlign: 'center' });
        this.vbox.append(hbox);
        hbox.append(donutGraph);
        let vbox = new Ui.VBox({ spacing: 10, verticalAlign: 'center' });
        hbox.append(vbox);
        for (let d of donutData) {
            vbox.append(new Ui.HBox({
                spacing: 10,
                content: [
                    new Ui.Rectangle({ fill: d.color, width: 14, height: 14, verticalAlign: 'center' }),
                    new Ui.Label({ text: d.text })
                ]
            }));
        }
        this.onDataLoaded();
    }
    onDataLoaded() {
        // graph sur 10 min (1 valeure 10s = 60 valeures)
        var endTime = new Date(1449400783000);
        var startTime = new Date(endTime.getTime() - (6 * 60 * 60) * 1000);
        let cpuData = [];
        let cpuData2 = [];
        let currentTime = startTime.getTime();
        while (currentTime < endTime.getTime()) {
            currentTime += 5 * 1000;
            let progress = (currentTime - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
            let coef = (1 - Math.pow((progress * 2 - 1), 2));
            let coef2 = Math.sin(progress * Math.PI * 2);
            let coef3 = coef2 * (1 - Math.pow((progress * 2 - 1), 2));
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
                { name: 'CPU1', data: cpuData, color: '#69a6dd' },
                { name: 'CPU2', data: cpuData2, color: '#ee939e' }
            ],
            maxY: 1, unit: 'percent',
            startTime: startTime, endTime: endTime
        });
        this.vbox.append(graph);
    }
}
new App();
//# sourceMappingURL=main.js.map