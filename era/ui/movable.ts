namespace Ui {
    export interface MovableInit extends MovableBaseInit {
        cursor?: string;
        content?: Element;
    }

    export class Movable extends MovableBase implements MovableInit {
        private _content?: Element;
        private _cursor: string = 'inherit';

        constructor(init?: MovableInit) {
            super(init);
            this.focusable = true;
            this.drawing.style.touchAction = 'none';
            this.drawing.style.cursor = this._cursor;
            this.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
            if (init) {
                if (init.cursor !== undefined)
                    this.cursor = init.cursor;	
                if (init.content)
                    this.content = init.content; 	
            }
        }

        set cursor(cursor: string) {
            if (this._cursor != cursor && !this.isDisabled) {
                this._cursor = cursor;
                this.drawing.style.cursor = this._cursor;
            }
        }

        protected onKeyDown(event) {
            if (this.isDisabled)
                return;
            let key = event.which;
            // horizontal move
            if (((key == 37) || (key == 39)) && this.moveHorizontal) {
                event.preventDefault();
                event.stopPropagation();
                if (key == 37)
                    this.setPosition(this.posX - 10, undefined);
                if (key == 39)
                    this.setPosition(this.posX + 10, undefined);
            }
            // vertical move
            if (((key == 38) || (key == 40)) && this.moveVertical) {
                event.preventDefault();
                event.stopPropagation();
                if (key == 38)
                    this.setPosition(undefined, this.posY - 10);
                if (key == 40)
                    this.setPosition(undefined, this.posY + 10);
            }
        }

        protected onMove(x: number, y: number) {
            this.transform = Ui.Matrix.createTranslate(this.posX, this.posY);
        }

        protected measureCore(width: number, height: number) {
            if (this._content)
                return this._content.measure(width, height);
            else
                return { width: 0, height: 0 };
        }

        protected arrangeCore(width: number, height: number) {
            if (this._content)
                this._content.arrange(0, 0, width, height);	
        }

        get content(): Element | undefined {
            return this._content;
        }

        set content(content: Element | undefined) {
            if (this._content)
                this.removeChild(this._content);	
            this._content = content;
            if (this._content)
                this.appendChild(this._content);
        }
    
        protected onDisable() {
            this.drawing.style.cursor = 'inherit';
        }
    
        protected onEnable() {
            this.drawing.style.cursor = this._cursor;
        }
    }
}	
