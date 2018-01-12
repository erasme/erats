namespace Ui {

    export interface ContextMenuWatcherInit {
        element: Ui.Element;
        press?: (watcher: ContextMenuWatcher) => void;
        down?: (watcher: ContextMenuWatcher) => void;
        up?: (watcher: ContextMenuWatcher) => void;
        lock?: boolean;
    }

    export class ContextMenuWatcher extends Core.Object {
        readonly element: Ui.Element;
        private press: (watcher: ContextMenuWatcher) => void;
        private down: (watcher: ContextMenuWatcher) => void;
        private up: (watcher: ContextMenuWatcher) => void;
        private _isDown: boolean = false;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        lock: boolean = false;
    
        constructor(init: ContextMenuWatcherInit) {
            super();
            this.element = init.element;
            if (init.press !== undefined)
                this.press = init.press;
            if (init.down !== undefined)
                this.down = init.down;
            if (init.up !== undefined)
                this.up = init.up;
            if (init.lock !== undefined)
                this.lock = init.lock;
    
            // disable native context menu
            this.element.drawing.addEventListener('contextmenu', (event) => event.preventDefault());

            // handle pointers
            this.element.ptrdowned.connect(e => this.onPointerDown(e));
    
            // handle keyboard
            this.element.drawing.addEventListener('keyup', e => this.onKeyUp(e));
        }
        
        get isDown(): boolean {
            return this._isDown;
        }
    
        protected onPointerDown(event: PointerEvent) {
            if (this.lock || this.element.isDisabled || this._isDown)
                return;
            if (event.pointer.type != 'mouse' || event.pointer.button != 2)
                return;
            
            let watcher = event.pointer.watch(this);
            watcher.moved.connect(() => {
                if (watcher.pointer.getIsMove())
                    watcher.cancel();
            });
            watcher.upped.connect(() => {
                this.onUp();
                let x = event.pointer.getX();
                let y = event.pointer.getY();
                let altKey = event.pointer.getAltKey();
                let shiftKey = event.pointer.getShiftKey();
                let ctrlKey = event.pointer.getCtrlKey();
                this.onPress(x, y, altKey, shiftKey, ctrlKey);
    
                watcher.capture();
                watcher.cancel();
            });
            watcher.cancelled.connect(() => this.onUp());
            this.onDown();
        }
    
        protected onKeyUp(event: KeyboardEvent) {
            // support Ctrl + M
            if (!this.lock && !this.element.isDisabled && event.ctrlKey && (event.which == 77)) {
                event.preventDefault();
                event.stopPropagation();
                this.onPress(undefined, undefined, event.altKey, event.shiftKey, event.ctrlKey);
            }
        }
    
        protected onDown() {
            this._isDown = true;
            if (this.down)
                this.down(this);
        }
    
        protected onUp() {
            this._isDown = false;
            if (this.up)
                this.up(this);
        }
    
        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
            if (this.press)
                this.press(this);    
        }
    }   
}
    