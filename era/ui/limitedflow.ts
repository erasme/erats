namespace Ui {
    export class LimitedFlow extends Flow {
        private _maxLines: number | undefined;
    
        constructor() {
            super();
            this.clipToBounds = true;
        }
    
        get maxLines(): number | undefined {
            return this._maxLines;
        }
    
        set maxLines(value: number | undefined) {
            this._maxLines = value;
            this.invalidateMeasure();
        }
    
        protected measureCore(width: number, height: number) {
            let res = super.measureCore(width, height);
            if (this._maxLines == undefined)
                return res;
            if (!this.uniform) {
                let pos = Math.min(this._maxLines, this.lines.length) - 1;
                return { width: res.width, height: this.lines[pos].y + this.lines[pos].height };
            }
            else {
                let countPerLine = Math.max(Math.floor((width + this.spacing) / (this.uniformWidth + this.spacing)), 1);
                let nbLine = Math.ceil(this.children.length / countPerLine);
                nbLine = Math.min(nbLine, this._maxLines);
                return {
                    width: res.width,
                    height: nbLine * this.uniformHeight + (nbLine - 1) * this.spacing
                };
            }
        }
    }
}