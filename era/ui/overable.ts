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

            this.element.drawing.addEventListener('mouseenter', (e) => {
                if (this._isOver)
                    return;
                this._isOver = true;
                if (this.enter)
                    this.enter(this);
            });
            this.element.drawing.addEventListener('mouseleave', (e) => {
                if (e.target != this.element.drawing || !this._isOver)
                    return;
                this._isOver = false;
                if (this.leave)
                    this.leave(this);
            });
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
