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
            this.element.drawing.addEventListener('focusin', () => {
                this._isFocusIn = true;
                this.delayFocus();
            });
            this.element.drawing.addEventListener('focusout', () => {
                this._isFocusIn = false;
                this.delayFocus();
            });
        }

        private delayFocus() {
            if (!this.delayTask)
                this.delayTask = new Core.DelayedTask(0, () => this.onDelayFocus());
        }

        private onDelayFocus() {
            this.delayTask = undefined;
            if (this._isDelayFocusIn != this._isFocusIn) {
                this._isDelayFocusIn = this._isFocusIn;
                if (this.focusout && !this._isDelayFocusIn)
                    this.focusout(this);
                if (this.focusin && this._isDelayFocusIn)
                    this.focusin(this);
            }
        }

        get isFocusIn(): boolean {
            return this._isDelayFocusIn;
        }
    }
}