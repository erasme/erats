namespace Ui {
    export class LimitedFlow extends Flow {
        private _maxLines: number | undefined;
        private _canExpand: boolean = false;
        readonly canexpandchanged = new Core.Events<{ target: LimitedFlow, value: boolean }>();
        set oncanexpandchanged(value: (event: { target: LimitedFlow, value: boolean }) => void) { this.canexpandchanged.connect(value); }
    
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

        get linesCount(): number {
            if (!this.uniform)
                return this.lines.length;
            let countPerLine = Math.max(Math.floor((this.layoutWidth + this.spacing) / (this.uniformWidth + this.spacing)), 1);
            return Math.ceil(this.children.length / countPerLine);
        }

        get canExpand(): boolean {
            return this._canExpand;
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

        protected arrangeCore(width: number, height: number) {
            super.arrangeCore(width, height);
            let canExpand = this._maxLines != undefined && this.linesCount > this._maxLines;
            if (canExpand != this._canExpand) {
                this._canExpand = canExpand;
                this.canexpandchanged.fire({ target: this, value: this._canExpand });
            }
        }
    }
}