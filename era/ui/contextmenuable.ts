namespace Ui {

    export interface ContextMenuWatcherInit {
        element: Ui.Element;
        press?: (watcher: ContextMenuWatcher) => void;
        lock?: boolean;
    }

    export class ContextMenuWatcher extends Core.Object {
        readonly element: Ui.Element;
        private press: (watcher: ContextMenuWatcher) => void;
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
            if (init.lock !== undefined)
                this.lock = init.lock;

            this.element.drawing.addEventListener('contextmenu', this.onContextMenu);
        }

        private onContextMenu = (e) => {            
            if (!this.lock && !this.element.isDisabled) {
                this.onPress(e.clientX, e.clientY, e.altKey, e.shiftKey, e.ctrlKey);
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }

        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
            if (this.press)
                this.press(this);
        }

        dispose() {
            this.element.drawing.removeEventListener('contextmenu', this.onContextMenu);
        }
    }
}
