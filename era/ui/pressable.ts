namespace Ui {

    export class PressWatcher extends Core.Object {
        private element: Ui.Element;
        private press: (watcher: PressWatcher) => void;
        private down: (watcher: PressWatcher) => void;
        private up: (watcher: PressWatcher) => void;
        private activate: (watcher: PressWatcher) => void;
        private delayedpress: (watcher: PressWatcher) => void;
        private _pointerId?: number;
        private _isDown: boolean = false;
        private lastTime: number = undefined;
        private delayedTimer: Core.DelayedTask;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        middleButton?: boolean;
        lock: boolean = false;
        allowMiddleButton: boolean = false;

        constructor(init: {
            element: Ui.Element,
            onpressed?: (watcher: PressWatcher) => void,
            ondowned?: (watcher: PressWatcher) => void,
            onupped?: (watcher: PressWatcher) => void,
            onactivated?: (watcher: PressWatcher) => void,
            ondelayedpress?: (watcher: PressWatcher) => void
        }) {
            super();
            this.element = init.element;
            if (init.onpressed)
                this.press = init.onpressed;
            if (init.ondowned)
                this.down = init.ondowned;
            if (init.onupped)
                this.up = init.onupped;
            if (init.onactivated)
                this.activate = init.onactivated;
            if (init.ondelayedpress)
                this.delayedpress = init.ondelayedpress;

            // handle pointers
            if ('PointerEvent' in window)
                this.element.drawing.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: true });

            this.element.drawing.addEventListener('click', e => {
                if (this.lock || this.element.isDisabled)
                    return;
                e.stopImmediatePropagation();
                this.x = e.clientX;
                this.y = e.clientY;
                this.onPress(e.clientX, e.clientY, e.altKey, e.shiftKey, e.ctrlKey);
            });

            // handle keyboard
            this.element.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
            this.element.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
        }

        get isDown(): boolean {
            return this._isDown;
        }

        protected onPointerDown(event: PointerEvent) {
            if (this.lock || this.element.isDisabled || this._isDown)
                return;
            if (event.pointerType == 'touch')
                return;
            if (event.pointerType == 'mouse' && !(event.button == 0 || (this.allowMiddleButton && event.button == 1)))
                return;

            this._pointerId = event.pointerId;
            this.element.drawing.setPointerCapture(event.pointerId);
            this._isDown = true;
            this.x = event.clientX; this.y = event.clientY;

            let onPointerCancel = (e: PointerEvent) => {
                if (e.pointerId != this._pointerId)
                    return;
                this.element.drawing.removeEventListener('pointercancel', onPointerCancel);
                this.element.drawing.removeEventListener('pointerup', onPointerUp);
                this.element.drawing.releasePointerCapture(event.pointerId);
                this._pointerId = undefined;
                e.stopPropagation();
                this.onUp();
            }
            let onPointerUp = (e: PointerEvent) => {
                if (e.pointerId != this._pointerId)
                    return;
                this.element.drawing.removeEventListener('pointercancel', onPointerCancel);
                this.element.drawing.removeEventListener('pointerup', onPointerUp);
                this.element.drawing.releasePointerCapture(event.pointerId);
                this._pointerId = undefined;
                this.x = e.clientX; this.y = e.clientY;
                e.stopPropagation();
                this.onUp();

                // if the middle click is allow, generate press because the native "click"
                // event don't handle middle mouse click.
                if (e.pointerType == 'mouse' && event.button == 1 && this.allowMiddleButton)
                    this.onPress(e.clientX, e.clientY, e.altKey, e.shiftKey, e.ctrlKey, true);
            }
            this.element.drawing.addEventListener('pointercancel', onPointerCancel);
            this.element.drawing.addEventListener('pointerup', onPointerUp);
            event.stopPropagation();
            this.onDown();
        }

        protected onKeyDown(event: KeyboardEvent) {
            let key = event.which;
            // handle Enter and Space key
            if (!this.lock && !this.element.isDisabled && (key == 13 || key == 32)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onDown();
            }
        }

        protected onKeyUp(event: KeyboardEvent) {
            let key = event.which;
            // handle Enter and Space key
            if (!this.lock && !this.element.isDisabled && this._isDown && (key == 13 || key == 32)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.onUp();
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

        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
            this.middleButton = middleButton;
            if (this.press)
                this.press(this);

            // test for activate signal
            let currentTime = (new Date().getTime()) / 1000;
            if ((this.lastTime !== undefined) && (currentTime - this.lastTime < 0.30)) {
                this.onActivate(x, y);
                if (this.delayedTimer != undefined) {
                    this.delayedTimer.abort();
                    this.delayedTimer = undefined;
                }
            }
            else {
                this.delayedTimer = new Core.DelayedTask(0.30, () => {
                    this.onDelayedPress(x, y, altKey, shiftKey, ctrlKey, middleButton);
                });
            }
            this.lastTime = currentTime;
        }

        protected onActivate(x?: number, y?: number) {
            if (this.activate)
                this.activate(this);
        }

        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
            this.middleButton = middleButton;
            if (this.delayedTimer) {
                if (!this.delayedTimer.isDone)
                    this.delayedTimer.abort();
                this.delayedTimer = undefined;
            }
            if (this.delayedpress)
                this.delayedpress(this);
        }
    }


    export interface PressableInit extends OverableInit {
        lock?: boolean;
        allowMiddleButton?: boolean;
        onpressed?: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean }) => void;
        ondowned?: (event: { target: Pressable }) => void;
        onupped?: (event: { target: Pressable }) => void;
        onactivated?: (event: { target: Pressable, x?: number, y?: number }) => void;
        ondelayedpress?: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }) => void;
    }

    export class Pressable extends Overable implements PressableInit {
        private pressWatcher: PressWatcher;

        readonly downed = new Core.Events<{ target: Pressable, x?: number, y?: number }>();
        set ondowned(value: (event: { target: Pressable, x?: number, y?: number }) => void) { this.downed.connect(value); }
        readonly upped = new Core.Events<{ target: Pressable, x?: number, y?: number }>();
        set onupped(value: (event: { target: Pressable, x?: number, y?: number }) => void) { this.upped.connect(value); }
        readonly pressed = new Core.Events<{ target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean }>();
        set onpressed(value: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean }) => void) { this.pressed.connect(value); }
        readonly activated = new Core.Events<{ target: Pressable, x?: number, y?: number }>();
        set onactivated(value: (event: { target: Pressable, x?: number, y?: number }) => void) { this.activated.connect(value); }
        readonly delayedpress = new Core.Events<{ target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean }>();
        set ondelayedpress(value: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean }) => void) { this.delayedpress.connect(value); }

        constructor(init?: PressableInit) {
            super(init);
            this.drawing.style.cursor = 'pointer';

            this.focusable = true;
            this.role = 'button';

            this.pressWatcher = new PressWatcher({
                element: this,
                onpressed: (watcher) => this.onPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey, watcher.middleButton),
                ondowned: (watcher) => this.onDown(watcher.x, watcher.y),
                onupped: (watcher) => this.onUp(watcher.x, watcher.y),
                onactivated: (watcher) => this.onActivate(watcher.x, watcher.y),
                ondelayedpress: (watcher) => this.onDelayedPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey, watcher.middleButton)
            });

            if (init) {
                if (init.lock !== undefined)
                    this.lock = init.lock;
                if (init.onpressed !== undefined)
                    this.pressed.connect(init.onpressed);
                if (init.ondowned !== undefined)
                    this.downed.connect(init.ondowned);
                if (init.onupped !== undefined)
                    this.upped.connect(init.onupped);
                if (init.onactivated !== undefined)
                    this.activated.connect(init.onactivated);
                if (init.ondelayedpress !== undefined)
                    this.delayedpress.connect(init.ondelayedpress);
                if (init.allowMiddleButton !== undefined)
                    this.allowMiddleButton = init.allowMiddleButton;
            }
        }

        get isDown(): boolean {
            return this.pressWatcher.isDown;
        }

        set lock(lock: boolean) {
            this.pressWatcher.lock = lock;
            if (lock)
                this.drawing.style.cursor = '';
            else
                this.drawing.style.cursor = 'pointer';
        }

        get lock(): boolean {
            return this.pressWatcher.lock;
        }

        set allowMiddleButton(value: boolean) {
            this.pressWatcher.allowMiddleButton = value;
        }

        get allowMiddleButton(): boolean {
            return this.pressWatcher.allowMiddleButton;
        }

        protected onDown(x?: number, y?: number) {
            this.downed.fire({ target: this, x: x, y: y });
        }

        protected onUp(x?: number, y?: number) {
            this.upped.fire({ target: this, x: x, y: y });
        }

        press() {
            if (!this.isDisabled && !this.lock)
                this.onPress();
        }

        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean) {
            this.pressed.fire({ target: this, x: x, y: y, altKey: altKey, shiftKey: shiftKey, ctrlKey: ctrlKey, middleButton: middleButton });
        }

        protected onActivate(x?: number, y?: number) {
            this.activated.fire({ target: this, x: x, y: y });
        }

        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean, middleButton?: boolean) {
            this.delayedpress.fire({ target: this, x: x, y: y, altKey: altKey, shiftKey: shiftKey, ctrlKey: ctrlKey, middleButton: middleButton });
        }

        protected onDisable() {
            super.onDisable();
            this.drawing.style.cursor = '';
        }

        protected onEnable() {
            super.onEnable();
            if (this.lock)
                this.drawing.style.cursor = '';
            else
                this.drawing.style.cursor = 'pointer';
        }
    }
}
