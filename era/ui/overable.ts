namespace Ui {

    export class OverWatcher extends Core.Object {
        private element: Ui.Element;
        private enter?: (watcher: OverWatcher) => void;
        private leave?: (watcher: OverWatcher) => void;
        private _isOver: boolean = false;

        constructor(init: {
            element: Ui.Element,
            onentered?: (watcher: OverWatcher) => void,
            onleaved?: (watcher: OverWatcher) => void
        }) {
            super();
            if (init.onentered)
                this.enter = init.onentered;
            if (init.onleaved)
                this.leave = init.onleaved;

            this.element = init.element;
            if ('PointerEvent' in window)
                this.element.drawing.addEventListener('pointermove', this.onPointerMove, { passive: true });
        }

        private onPointerMove = (e: PointerEvent) => {
            if (this.element.isDisabled)
                return;
            if (e.pointerType == 'touch')
                return;
            if (!this._isOver) {
                this._isOver = true;
                if (this.enter)
                    this.enter(this);
                // watch for leave
                window.addEventListener('pointermove', this.onWindowPointerMove, { passive: true, capture: true });
            }
        }

        private onWindowPointerMove = (e: PointerEvent) => {
            let isInside = false;
            let currentNode: Node = e.target as Node;
            while(!isInside && currentNode) {
                isInside = (currentNode === this.element.drawing);
                currentNode = currentNode.parentNode;
            }
            if (!isInside) {
                this._isOver = false;
                window.removeEventListener('pointermove', this.onWindowPointerMove, { capture: true });
                if (this.leave)
                    this.leave(this);
            }
        }

        get isOver(): boolean {
            return this._isOver;
        }
    }

    export interface OverableInit extends LBoxInit {
        onentered?: (event: { target: Overable }) => void;
        onleaved?: (event: { target: Overable }) => void;
    }

    export class Overable extends LBox implements OverableInit {
        watcher: OverWatcher;
        readonly entered = new Core.Events<{ target: Overable }>();
        set onentered(value: (event: { target: Overable }) => void) { this.entered.connect(value); }
        readonly leaved = new Core.Events<{ target: Overable }>();
        set onleaved(value: (event: { target: Overable }) => void) { this.leaved.connect(value); }

        constructor(init?: OverableInit) {
            super(init);
            this.watcher = new OverWatcher({
                element: this,
                onentered: () => this.entered.fire({ target: this }),
                onleaved: () => this.leaved.fire({ target: this })
            });
            if (init) {
                if (init.onentered)
                    this.entered.connect(init.onentered);
                if (init.onleaved)
                    this.leaved.connect(init.onleaved);
            }
        }

        get isOver(): boolean {
            return this.watcher.isOver;
        }
    }
}
