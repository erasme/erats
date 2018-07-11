namespace Ui {

    export class PressWatcher extends Core.Object {
        private element: Ui.Element;
        private press: (watcher: PressWatcher) => void;
        private down: (watcher: PressWatcher) => void;
        private up: (watcher: PressWatcher) => void;
        private activate: (watcher: PressWatcher) => void;
        private delayedpress: (watcher: PressWatcher) => void;
        private _isDown: boolean = false;
        private lastTime: number = undefined;
        private delayedTimer: Core.DelayedTask;
        x?: number;
        y?: number;
        altKey?: boolean;
        shiftKey?: boolean;
        ctrlKey?: boolean;
        lock: boolean = false;

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
            this.element.ptrdowned.connect((e) => this.onPointerDown(e));

            // handle keyboard
            this.element.drawing.addEventListener('keydown', (e) => this.onKeyDown(e));
            this.element.drawing.addEventListener('keyup', (e) => this.onKeyUp(e));
        }
    
        get isDown(): boolean {
            return this._isDown;
        }

        protected onPointerDown(event: EmuPointerEvent) {
            if (this.lock || this.element.isDisabled || this._isDown)
                return;
            if (event.pointer.type == 'mouse' && event.pointer.button != 0)
                return;
        
            let watcher = event.pointer.watch(this);
            watcher.moved.connect(()  => {
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

        protected onKeyDown(event: KeyboardEvent) {
            let key = event.which;
            // handle Enter and Space key
            if (!this.lock && !this.element.isDisabled && (key == 13 || key == 32)) {
                event.preventDefault();
                event.stopPropagation();
                this.onDown();
            }
        }

        protected onKeyUp(event: KeyboardEvent) {
            let key = event.which;
            // handle Enter and Space key
            if (!this.lock && !this.element.isDisabled && this._isDown && (key == 13 || key == 32)) {
                event.preventDefault();
                event.stopPropagation();
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

        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
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
                    this.onDelayedPress(x, y, altKey, shiftKey, ctrlKey);
                });
            }
            this.lastTime = currentTime;
        }

        protected onActivate(x?: number, y?: number) {
            if (this.activate)
                this.activate(this);	
        }

        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.x = x; this.y = y;
            this.altKey = altKey; this.shiftKey = shiftKey; this.ctrlKey = ctrlKey;
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
        onpressed?: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }) => void;
        ondowned?: (event: { target: Pressable }) => void;
        onupped?: (event: { target: Pressable }) => void;
        onactivated?: (event: { target: Pressable, x?: number, y?: number }) => void;
        ondelayedpress?: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }) => void;
    }

    export class Pressable extends Overable implements PressableInit {
        private pressWatcher: PressWatcher;

        readonly downed = new Core.Events<{ target: Pressable }>();
        set ondowned(value: (event: { target: Pressable}) => void) { this.downed.connect(value); }
        readonly upped = new Core.Events<{ target: Pressable }>();
        set onupped(value: (event: { target: Pressable}) => void) { this.upped.connect(value); }
        readonly pressed = new Core.Events<{ target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }>();
        set onpressed(value: (event: { target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean}) => void) { this.pressed.connect(value); }
        readonly activated = new Core.Events<{ target: Pressable, x?: number, y?: number }>();
        set onactivated(value: (event: { target: Pressable, x?: number, y?: number }) => void) { this.activated.connect(value); }
        readonly delayedpress = new Core.Events<{ target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }>();
        set ondelayedpress(value: (event:{ target: Pressable, x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean }) => void) { this.delayedpress.connect(value); }

        constructor(init?: PressableInit) {
            super(init);
            this.drawing.style.cursor = 'pointer';

            this.focusable = true;
            this.role = 'button';

            this.pressWatcher = new PressWatcher({
                element: this,
                onpressed: (watcher) => this.onPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey),
                ondowned: (watcher) => this.onDown(),
                onupped: (watcher) => this.onUp(),
                onactivated: (watcher) => this.onActivate(watcher.x, watcher.y),
                ondelayedpress: (watcher) => this.onDelayedPress(watcher.x, watcher.y, watcher.altKey, watcher.shiftKey, watcher.ctrlKey)
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

        protected onDown() {
            this.downed.fire({ target: this });
        }

        protected onUp() {
            this.upped.fire({ target: this });
        }

        press() {
            if (!this.isDisabled && !this.lock)
                this.onPress();
        }

        protected onPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.pressed.fire({ target: this, x: x, y: y, altKey: altKey, shiftKey: shiftKey, ctrlKey: ctrlKey });
        }

        protected onActivate(x?: number, y?: number) {
            this.activated.fire({ target: this, x: x, y: y });
        }

        protected onDelayedPress(x?: number, y?: number, altKey?: boolean, shiftKey?: boolean, ctrlKey?: boolean) {
            this.delayedpress.fire({ target: this, x: x, y: y, altKey: altKey, shiftKey: shiftKey, ctrlKey: ctrlKey });
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
