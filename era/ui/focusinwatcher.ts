namespace Ui {
    export class FocusInWatcher extends Core.Object {
        private element: Ui.Element;
        private focusin?: (watcher: FocusInWatcher) => void;
        private focusout?: (watcher: FocusInWatcher) => void;
        private _isDelayFocusIn: boolean = false;
        private _isFocusIn: boolean = false;
        private delayTask?: Core.DelayedTask;

        constructor(init: {
            element: Ui.Element,
            onfocusin?: (watcher: FocusInWatcher) => void,
            onfocusout?: (watcher: FocusInWatcher) => void
        }) {
            super();
            if (init.onfocusin)
                this.focusin = init.onfocusin;
            if (init.onfocusout)
                this.focusout = init.onfocusout;

            this.element = init.element;
            this.element.drawing.addEventListener('focusin', (e) => {
                this._isFocusIn = true;
                if (this._isDelayFocusIn)
                    return;
                this._isDelayFocusIn = true;
                if (this.focusin)
                    this.focusin(this);
            });
            this.element.drawing.addEventListener('focusout', () => {
                this._isFocusIn = false;
                this.delayFocusOut();
            });
        }

        private delayFocusOut() {
            if (!this.delayTask)
                this.delayTask = new Core.DelayedTask(0, () => this.onDelayFocusOut());
        }

        private onDelayFocusOut() {
            this.delayTask = undefined;
            this._isDelayFocusIn = this._isFocusIn;
            if (!this._isDelayFocusIn) {
                if (this.focusout)
                    this.focusout(this);
            }
        }

        get isFocusIn(): boolean {
            return this._isDelayFocusIn;
        }
    }
}