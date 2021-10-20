namespace Ui {
    export class DragEffectIcon extends DualIcon {
        protected onStyleChange() {
            let size = this.getStyleProperty('size');
            this.width = size;
            this.height = size;
        }

        static style: object = {
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 4,
            size: 16
        }
    }

    export class DragEvent extends Event {
        clientX: number = 0;
        clientY: number = 0;
        ctrlKey: boolean = false;
        altKey: boolean = false;
        shiftKey: boolean = false;
        metaKey: boolean = false;
        dataTransfer: DragDataTransfer = undefined;
        effectAllowed: string = undefined;

        private deltaX: number = 0;
        private deltaY: number = 0;

        constructor() {
            super();
        }

        preventDefault() {
        }
    }

    export class DragNativeData extends Core.Object {
        dataTransfer: any = undefined;

        constructor(dataTransfer) {
            super();
            this.dataTransfer = dataTransfer;
        }

        getTypes() {
            return this.dataTransfer.dataTransfer.types;
        }

        hasTypes(...args) {
            let types = this.getTypes();
            for (let i = 0; i < types.length; i++) {
                for (let i2 = 0; i2 < args.length; i2++)
                    if (types[i].toLowerCase() === args[i2].toLowerCase())
                        return true;
            }
            return false;
        }

        hasType(type) {
            return this.hasTypes(type);
        }

        hasFiles() {
            return this.hasType('files');
        }

        getFiles(): FileList {
            return (this.dataTransfer.dataTransfer as DataTransfer).files;
        }

        getData(type) {
            return this.dataTransfer.dataTransfer.getData(type);
        }
    }

    export class DragWatcher extends Core.Object {
        effectAllowed: any = undefined;
        dataTransfer: DragDataTransfer = undefined;
        element: Element;
        x: number = 0;
        y: number = 0;
        readonly dropped = new Core.Events<{ target: DragWatcher, effect: string, x: number, y: number }>();
        readonly leaved = new Core.Events<{ target: DragWatcher }>();
        readonly moved = new Core.Events<{ target: DragWatcher, x: number, y: number }>();

        constructor(element: Element, dataTransfer: DragDataTransfer) {
            super();
            this.dataTransfer = dataTransfer;
            this.element = element;
        }

        getPosition() {
            return new Point(this.x, this.y);
        }

        getElement() {
            return this.element;
        }

        getDataTransfer() {
            return this.dataTransfer;
        }

        getEffectAllowed() {
            return this.effectAllowed;
        }

        setEffectAllowed(effect) {
            this.effectAllowed = effect;
        }

        move(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.moved.fire({ target: this, x: x, y: y });
        }

        leave() {
            this.leaved.fire({ target: this });
        }

        drop(dropEffect: string) {
            this.dropped.fire({ target: this, effect: dropEffect, x: this.x, y: this.y });
        }

        release() {
            this.dataTransfer.releaseDragWatcher(this);
        }
    }

    export interface DragDataTransfer {
        getPosition(): Point;
        getData(): any;
        capture(element: Element, effect): DragWatcher;
        releaseDragWatcher(dragWatcher: DragWatcher): void;
    }

    export class DragEmuDataTransfer extends Core.Object implements DragDataTransfer {
        draggable: Element;
        imageElement: Element;
        image: HTMLElement;
        imageEffect: DragEffectIcon;
        // catcher: HTMLElement;
        startX: number = 0;
        startY: number = 0;
        dropX: number = 0;
        dropY: number = 0;
        x: number = 0;
        y: number = 0;
        startImagePoint: Point;
        overElement: Element;
        hasStarted: boolean = false;
        dragDelta: Point;

        effectAllowed: any;
        watcher: PointerWatcher;
        pointer: Pointer;
        dropEffect: any;
        dropEffectIcon: any;
        private _data: any;
        timer?: Core.DelayedTask;
        dropFailsTimer: Anim.Clock;
        delayed: boolean = false;
        scrollControlTimer?: Anim.Clock;

        dragWatcher: DragWatcher;
        readonly started = new Core.Events<{ target: DragEmuDataTransfer }>();
        readonly ended = new Core.Events<{ target: DragEmuDataTransfer }>();

        constructor(draggable: Element, imageElement: Element, x: number, y: number, delayed: boolean, pointerEvent?: PointerEvent, touchEvent?: TouchEvent, mouseEvent?: MouseEvent) {
            super();
            this.dropEffect = [];
            this.effectAllowed = [];
            this.draggable = draggable;
            this.imageElement = imageElement;
            this.startX = x;
            this.startY = y;
            this.delayed = delayed;

            this.dragDelta = this.draggable.pointFromWindow(new Point(this.startX, this.startY));
            let onContextMenu = (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
            };

            if (pointerEvent) {
                if (pointerEvent.type == 'touch')
                    this.draggable.drawing.addEventListener('contextmenu', onContextMenu, { capture: true });
                this.pointer = new Pointer(pointerEvent.pointerType, pointerEvent.pointerId);
                this.pointer.setInitialPosition(pointerEvent.clientX, pointerEvent.clientY);
                this.pointer.ctrlKey = pointerEvent.ctrlKey;
                this.pointer.altKey = pointerEvent.altKey;
                this.pointer.shiftKey = pointerEvent.shiftKey;
                this.pointer.down(pointerEvent.clientX, pointerEvent.clientY, pointerEvent.buttons, pointerEvent.button);

                let onPointerMove = (e: PointerEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.move(e.clientX, e.clientY);
                };
                let onPointerUp = (e: PointerEvent) => {
                    if (this.pointer.getIsCaptured()) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.up();
                    window.removeEventListener('pointermove', onPointerMove, { capture: true });
                    window.removeEventListener('pointerup', onPointerUp, { capture: true });
                    window.removeEventListener('pointercancel', onPointerCancel, { capture: true });
                    if (pointerEvent.type == 'touch')
                        this.draggable.drawing.removeEventListener('contextmenu', onContextMenu, { capture: true });
                };
                let onPointerCancel = (e: PointerEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.cancel();
                    window.removeEventListener('pointermove', onPointerMove, { capture: true });
                    window.removeEventListener('pointerup', onPointerUp, { capture: true });
                    window.removeEventListener('pointercancel', onPointerCancel, { capture: true });
                    if (pointerEvent.type == 'touch')
                        this.draggable.drawing.removeEventListener('contextmenu', onContextMenu, { capture: true });
                };
                window.addEventListener('pointermove', onPointerMove, { capture: true, passive: false });
                window.addEventListener('pointerup', onPointerUp, { capture: true, passive: false });
                window.addEventListener('pointercancel', onPointerCancel, { capture: true, passive: false });
            }
            else if (touchEvent) {
                this.draggable.drawing.addEventListener('contextmenu', onContextMenu, { capture: true });
                let touch = touchEvent.targetTouches[0];
                this.pointer = new Pointer('touch', touch.identifier);
                this.pointer.setInitialPosition(touch.clientX, touch.clientY);
                this.pointer.ctrlKey = touchEvent.ctrlKey;
                this.pointer.altKey = touchEvent.altKey;
                this.pointer.shiftKey = touchEvent.shiftKey;
                this.pointer.down(touch.clientX, touch.clientY, 1, 1);

                let onTouchMove = (e: TouchEvent) => {
                    let touch: Touch | undefined;
                    for (let i = 0; touch == undefined && i < e.touches.length; i++)
                        if (e.touches[i].identifier == this.pointer.id)
                            touch = e.touches[i];
                    if (!touch)
                        return;

                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.move(touch.clientX, touch.clientY);
                    e.stopImmediatePropagation();
                    if (this.pointer.getIsCaptured())
                        e.preventDefault();
                };
                let onTouchEnd = (e: TouchEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.up();
                    window.removeEventListener('touchmove', onTouchMove, { capture: true });
                    window.removeEventListener('touchend', onTouchEnd, { capture: true });
                    window.removeEventListener('touchcancel', onTouchCancel, { capture: true });
                    this.draggable.drawing.removeEventListener('contextmenu', onContextMenu, { capture: true });
                    e.stopImmediatePropagation();
                    if (this.pointer.getIsCaptured())
                        e.preventDefault();
                };
                let onTouchCancel = (e: TouchEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    this.pointer.cancel();
                    window.removeEventListener('touchmove', onTouchMove, { capture: true });
                    window.removeEventListener('touchend', onTouchEnd, { capture: true });
                    window.removeEventListener('touchcancel', onTouchCancel, { capture: true });
                    this.draggable.drawing.removeEventListener('contextmenu', onContextMenu, { capture: true });
                };
                window.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
                window.addEventListener('touchend', onTouchEnd, { capture: true, passive: false });
                window.addEventListener('touchcancel', onTouchCancel, { capture: true, passive: false });
            }
            else if (mouseEvent) {
                this.pointer = new Pointer(mouseEvent.type, 0);
                this.pointer.setInitialPosition(mouseEvent.clientX, mouseEvent.clientY);
                this.pointer.ctrlKey = mouseEvent.ctrlKey;
                this.pointer.altKey = mouseEvent.altKey;
                this.pointer.shiftKey = mouseEvent.shiftKey;
                this.pointer.down(mouseEvent.clientX, mouseEvent.clientY, mouseEvent.buttons, mouseEvent.button);

                let onMouseMove = (e: MouseEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    if (e.button == 0)
                        this.pointer.move(e.clientX, e.clientY);
                };
                let onMouseUp = (e: MouseEvent) => {
                    this.pointer.ctrlKey = e.ctrlKey;
                    this.pointer.altKey = e.altKey;
                    this.pointer.shiftKey = e.shiftKey;
                    if (e.button == 0) {
                        if (this.pointer.getIsCaptured()) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }
                        this.pointer.up();
                        window.removeEventListener('mousemove', onMouseMove, true);
                        window.removeEventListener('mouseup', onMouseUp, true);
                    }
                };
                window.addEventListener('mousemove', onMouseMove, true);
                window.addEventListener('mouseup', onMouseUp, true);
            }

            this.watcher = this.pointer.watch(App.current);
            this.watcher.moved.connect(this.onPointerMove);
            this.watcher.upped.connect(this.onPointerUp);
            this.watcher.cancelled.connect(this.onPointerCancel);

            window.addEventListener('keydown', this.onKeyUpDown, true);
            window.addEventListener('keyup', this.onKeyUpDown, true);

            if (this.delayed)
                this.timer = new Core.DelayedTask(0.5, () => this.onTimer());
        }

        setData(data): void {
            this._data = data;
        }

        getData(): any {
            return this._data;
        }

        hasData(): boolean {
            return this._data !== undefined;
        }

        getPosition(): Point {
            return new Point(this.x, this.y);
        }

        getDragDelta(): Point {
            return this.dragDelta;
        }

        protected generateImage(element): HTMLElement {
            let res; let child;

            if (('tagName' in element) && (element.tagName.toUpperCase() == 'IMG')) {
                res = element.cloneNode(false);
                res.oncontextmenu = function (e) { e.preventDefault(); };
            }
            else if (('tagName' in element) && (element.tagName.toUpperCase() == 'CANVAS')) {
                res = document.createElement('img');
                res.oncontextmenu = function (e) { e.preventDefault(); };
                // copy styles (position)
                res.style.cssText = element.style.cssText;
                res.setAttribute('src', (element as HTMLCanvasElement).toDataURL('image/png'));
            }
            else if (!Core.Navigator.isFirefox && (element.toDataURL !== undefined)) {
                res = document.createElement('img');
                res.oncontextmenu = function (e) { e.preventDefault(); };
                // copy styles (position)
                res.style.cssText = element.style.cssText;
                res.setAttribute('src', element.toDataURL('image/png'));
            }
            else {
                res = element.cloneNode(false);
                if ('style' in res) {
                    res.style.webkitUserSelect = 'none';
                    // to disable the magnifier in iOS WebApp mode
                    res.style.webkitUserCallout = 'none';
                }
                for (let i = 0; i < element.childNodes.length; i++) {
                    child = element.childNodes[i];
                    res.appendChild(this.generateImage(child));
                }
            }
            if ('setAttribute' in res)
                res.setAttribute('draggable', false);

            res.onselectstart = function (e) {
                e.preventDefault();
                return false;
            };
            if ('style' in res)
                res.style.touchAction = 'none';
            return res;
        }

        protected onTimer() {
            this.timer = undefined;

            this.started.fire({ target: this });

            if (this.hasData()) {
                this.hasStarted = true;

                this.image = document.createElement('div');
                this.image.style.touchAction = 'none';
                this.image.style.zIndex = '100000';
                this.image.style.position = 'absolute';

                let generateImage = (el: Element): HTMLElement => {
                    let image = this.generateImage(el.drawing);
                    // remove possible matrix transform
                    if ('removeProperty' in image.style)
                        image.style.removeProperty('transform');
                    else if (Core.Navigator.isGecko)
                        image.style.removeProperty('-moz-transform');
                    else if (Core.Navigator.isWebkit)
                        image.style.removeProperty('-webkit-transform');
                    image.style.left = '0px';
                    image.style.top = '0px';
                    image.style.touchAction = 'none';
                    image.oncontextmenu = e => e.preventDefault();
                    return image;
                };

                if (this._data instanceof Selection) {
                    let sel = this._data as Selection;
                    let els = sel.elements;
                    for (let i = Math.max(0, els.length - 6); i < els.length; i++) {
                        let invPos = els.length - (i + 1);
                        let op = 0.1;
                        if (invPos == 0)
                            op = 1;
                        else if (invPos == 1)
                            op = 0.95;
                        else if (invPos == 2)
                            op = 0.7;
                        else if (invPos == 3)
                            op = 0.5;
                        else if (invPos == 4)
                            op = 0.2;
                        let image = generateImage(els[i]);
                        image.style.left = `${invPos * 5}px`;
                        image.style.top = `${invPos * 5}px`;
                        image.style.opacity = op.toString();
                        this.image.appendChild(image);
                    }
                }
                else {
                    let image = generateImage(this.imageElement);
                    this.image.appendChild(image);
                }

                this.image.style.opacity = '0.8';

                let ofs = this.delayed ? -10 : 0;

                this.startImagePoint = this.imageElement.pointToWindow(new Point());

                this.image.style.left = (this.startImagePoint.x + ofs) + 'px';
                this.image.style.top = (this.startImagePoint.y + ofs) + 'px';

                // avoid IFrame problems for mouse
                /*                if (this.watcher.pointer.getType() === 'mouse') {
                                    this.catcher = document.createElement('div');
                                    this.catcher.style.position = 'absolute';
                                    this.catcher.style.left = '0px';
                                    this.catcher.style.right = '0px';
                                    this.catcher.style.top = '0px';
                                    this.catcher.style.bottom = '0px';
                                    this.catcher.style.zIndex = '1000';
                                    document.body.appendChild(this.catcher);
                                }*/

                document.body.appendChild(this.image);

                this.watcher.capture();
                this.scrollControlTimer = new Anim.Clock({
                    duration: 'forever',
                    ontimeupdate: (e) => this.onScrollClockTick(e.target, e.deltaTick)
                });
                this.scrollControlTimer.begin();
                this.watcher.upped.connect(() => {
                    if (this.scrollControlTimer) {
                        this.scrollControlTimer.stop();
                        this.scrollControlTimer = undefined;
                    }
                })
            }
            else {
                this.watcher.cancel();
            }
        }

        capture(element: Element, effect): DragWatcher {

            if ((this.dragWatcher !== undefined) && (this.dragWatcher.getElement() === element))
                throw ('Drag already captured by the given element');

            if (this.dragWatcher !== undefined)
                this.dragWatcher.leave();

            this.dragWatcher = new DragWatcher(element, this);
            this.dragWatcher.setEffectAllowed(effect);
            return this.dragWatcher;
        }

        releaseDragWatcher(dragWatcher: DragWatcher) {
            if (this.dragWatcher === dragWatcher) {
                this.dragWatcher.leave();
                this.dragWatcher = undefined;
            }
        }

        protected onScrollClockTick(clock: Anim.Clock, delta: number) {
            let speed = this.watcher.getSpeed();
            let speedVal = Math.sqrt(speed.x * speed.x + speed.y * speed.y);
            if (speedVal < 2 && this.overElement) {
                let div = this.overElement.drawing;
                while (div) {
                    let horizontalAllowed = div.style.overflowX == 'auto' || div.style.overflowX == 'scroll';
                    let verticalAllowed = div.style.overflowY == 'auto' || div.style.overflowY == 'scroll';
                    if (horizontalAllowed || verticalAllowed) {
                        let rect = div.getBoundingClientRect();
                        let x = this.watcher.pointer.getX();
                        let y = this.watcher.pointer.getY();
                        let activeWidth = this.watcher.pointer.type == 'touch' ? 40 : 20;
                        let leftAllowed = horizontalAllowed && (x - rect.left < activeWidth) && (x - rect.left > 0);
                        let rightAllowed = horizontalAllowed && (x - rect.right > -(activeWidth+NativeScrollableContent.nativeScrollBarWidth)) && (x - rect.right < 0);
                        let topAllowed = verticalAllowed && (y - rect.top < activeWidth) && (y - rect.top > 0);
                        let bottomAllowed = verticalAllowed && (y - rect.bottom > -(activeWidth+NativeScrollableContent.nativeScrollBarHeight)) && (y - rect.bottom < 0);
                        leftAllowed = leftAllowed && div.scrollLeft > 0;
                        topAllowed = topAllowed && div.scrollTop > 0;
                        bottomAllowed = bottomAllowed && (div.scrollHeight - (div.clientHeight + div.scrollTop) > 0);
                        rightAllowed = rightAllowed && (div.scrollWidth - (div.clientWidth + div.scrollLeft) > 0);
                        delta = delta * 200;
                        if (leftAllowed)
                            div.scrollLeft -= delta;
                        else if (rightAllowed)
                            div.scrollLeft += delta;
                        if (topAllowed)
                            div.scrollTop -= delta;
                        else if (bottomAllowed)
                            div.scrollTop += delta;

                        if (leftAllowed || topAllowed || bottomAllowed || rightAllowed)
                            break;
                    }
                    div = div.parentElement;
                }
            }
        }

        protected onKeyUpDown = (e: KeyboardEvent) => {
            // to handle Ctrl or Alt or Shift changes
            this.pointer.ctrlKey = e.ctrlKey;
            this.pointer.altKey = e.altKey;
            this.pointer.shiftKey = e.shiftKey;
            this.pointer.move(this.pointer.x, this.pointer.y);
        }

        protected onPointerMove = (e: { target: PointerWatcher }) => {
            let deltaX; let deltaY; let delta; let dragEvent; let ofs;
            let watcher = e.target;

            if (watcher.getIsCaptured()) {
                let clientX = watcher.pointer.getX();
                let clientY = watcher.pointer.getY();

                this.x = clientX;
                this.y = clientY;

                document.body.removeChild(this.image);
                //                if (this.catcher !== undefined)
                //                    document.body.removeChild(this.catcher);

                let overElement = Element.elementFromPoint(new Point(clientX, clientY));

                //                if (this.catcher !== undefined)
                //                    document.body.appendChild(this.catcher);
                document.body.appendChild(this.image);

                deltaX = clientX - this.startX;
                deltaY = clientY - this.startY;
                ofs = this.delayed ? -10 : 0;

                this.image.style.left = (this.startImagePoint.x + deltaX + ofs) + 'px';
                this.image.style.top = (this.startImagePoint.y + deltaY + ofs) + 'px';

                if (overElement != undefined) {
                    let oldDropEffectIcon = this.dropEffectIcon;
                    //this.dropEffect = 'none';
                    let dragEvent = new DragEvent();
                    dragEvent.setType('dragover');
                    dragEvent.clientX = clientX;
                    dragEvent.clientY = clientY;
                    dragEvent.dataTransfer = this;

                    let effectAllowed = [];
                    dragEvent.dispatchEvent(overElement);
                    if (this.dragWatcher !== undefined)
                        effectAllowed = this.dragWatcher.getEffectAllowed();

                    if ((this.dragWatcher !== undefined) && !overElement.getIsChildOf(this.dragWatcher.getElement())) {
                        this.dragWatcher.leave();
                        this.dragWatcher = undefined;
                    }

                    if (this.dragWatcher !== undefined)
                        this.dragWatcher.move(clientX, clientY);

                    this.dropEffect = DragEmuDataTransfer.getMatchingDropEffect(this.effectAllowed, effectAllowed,
                        watcher.pointer.getType(), watcher.pointer.getCtrlKey(), watcher.pointer.getAltKey(),
                        watcher.pointer.getShiftKey());

                    if (this.dropEffect.length > 1)
                        this.dropEffectIcon = 'dragchoose';
                    else if (this.dropEffect.length > 0)
                        this.dropEffectIcon = this.dropEffect[0].dragicon;
                    else
                        this.dropEffectIcon = undefined;

                    // handle the drop effect icon feedback
                    if (this.dropEffectIcon !== oldDropEffectIcon) {
                        if (this.imageEffect !== undefined) {
                            this.imageEffect.isLoaded = false;
                            this.image.removeChild(this.imageEffect.drawing);
                            this.imageEffect = undefined;
                        }
                        if (this.dropEffectIcon !== undefined) {
                            this.imageEffect = new DragEffectIcon();
                            this.imageEffect.icon = this.dropEffectIcon;
                            this.imageEffect.parent = App.current;
                            this.imageEffect.isLoaded = true;
                            this.imageEffect.parentVisible = true;
                            this.imageEffect.style = Ui.App.style;
                            this.imageEffect.setParentDisabled(false);

                            let size = this.imageEffect.measure(0, 0);
                            this.imageEffect.arrange(
                                -size.width + (this.startX - this.startImagePoint.x - ofs),
                                -size.height + (this.startY - this.startImagePoint.y - ofs), size.width, size.height);
                            this.image.appendChild(this.imageEffect.drawing);
                        }
                    }
                    this.overElement = overElement;
                }
                else
                    this.overElement = undefined;

            }
            else {
                //	this.onTimer();

                if (watcher.pointer.getIsMove()) {
                    if (this.delayed)
                        watcher.cancel();
                    else
                        this.onTimer();
                }
            }
        }

        protected onPointerUp = (e: { target: PointerWatcher }) => {
            if (this.timer !== undefined) {
                this.timer.abort();
                this.timer = undefined;
            }

            let watcher = e.target;
            //console.log('onPointerUp isCaptured: ' + watcher.getIsCaptured());
            this.watcher.moved.disconnect(this.onPointerMove);
            this.watcher.upped.disconnect(this.onPointerUp);
            this.watcher.cancelled.disconnect(this.onPointerCancel);
            window.removeEventListener('keydown', this.onKeyUpDown, true);
            window.removeEventListener('keyup', this.onKeyUpDown, true);

            if (!watcher.getIsCaptured())
                watcher.cancel();
            else {
                // a dragWatcher is present, drop is possible
                if (this.dragWatcher !== undefined) {
                    this.removeImage();
                    this.dragWatcher.leave();

                    if (this.dropEffect.length === 1) {
                        this.dragWatcher.drop(this.dropEffect[0].action);
                        this.ended.fire({ target: this });
                    }
                    // handle the choice if needed
                    else if (this.dropEffect.length > 1) {
                        let popup = new Popup();
                        popup.onclosed = () => this.ended.fire({ target: this });
                        let vbox = new VBox();
                        popup.content = vbox;
                        for (let i = 0; i < this.dropEffect.length; i++) {
                            let button = new FlatButton();
                            button.text = this.dropEffect[i].text;
                            button['Ui.DragEvent.dropEffect'] = this.dropEffect[i];
                            button.pressed.connect((e) => {
                                this.dragWatcher.drop(e.target['Ui.DragEvent.dropEffect'].action);
                                popup.close();
                            });
                            vbox.append(button);
                        }
                        popup.openAt(this.x, this.y);
                    }
                }
                else {
                    // start an animation to return the dragged element to its origin
                    this.dropX = watcher.pointer.getX();
                    this.dropY = watcher.pointer.getY();
                    this.dropFailsTimer = new Anim.Clock({
                        duration: 0.25, ease: new Anim.PowerEase({ mode: 'out' }),
                        ontimeupdate: e => this.onDropFailsTimerUpdate(e.target, e.progress)
                    });
                    this.dropFailsTimer.begin();
                    this.ended.fire({ target: this });
                }
            }
        }

        protected onPointerCancel = (e: { target: PointerWatcher }) => {
            if (this.timer !== undefined) {
                this.timer.abort();
                this.timer = undefined;
            }
        }

        protected removeImage() {
            document.body.removeChild(this.image);
            //            if (this.catcher !== undefined) {
            //                document.body.removeChild(this.catcher);
            //                this.catcher = undefined;
            //            }
        }

        protected onDropFailsTimerUpdate(clock, progress) {
            if (progress >= 1)
                this.removeImage();
            else {
                let deltaX = (this.dropX - this.startX) * (1 - progress);
                let deltaY = (this.dropY - this.startY) * (1 - progress);

                this.image.style.left = (this.startImagePoint.x + deltaX) + 'px';
                this.image.style.top = (this.startImagePoint.y + deltaY) + 'px';
            }
        }

        static getMergedEffectAllowed(effectAllowed1, effectAllowed2) {
            if ((effectAllowed1 === undefined) || (effectAllowed1 === 'all'))
                return effectAllowed2;
            else {
                let effectAllowed = [];

                for (let i = 0; i < effectAllowed1.length; i++) {
                    for (let i2 = 0; i2 < effectAllowed2.length; i2++) {
                        if (effectAllowed1[i] === effectAllowed2[i2].action)
                            effectAllowed.push(effectAllowed2[i2]);
                    }
                }
                return effectAllowed;
            }
        }

        static getMatchingDropEffect(srcEffectAllowed, dstEffectAllowed, pointerType, ctrlKey, altKey, shiftKey) {
            // filter with what the source support
            let effectAllowed = DragEmuDataTransfer.getMergedEffectAllowed(srcEffectAllowed, dstEffectAllowed);
            let dropEffect = effectAllowed;

            if (effectAllowed.length > 1) {
                // if the mouse is used let the choice using de keyboard controls
                if (pointerType === 'mouse') {
                    if (!altKey) {
                        // find the secondary choice if any
                        if (ctrlKey) {
                            for (let i = 0; i < effectAllowed.length; i++) {
                                if (effectAllowed[i].secondary === true)
                                    dropEffect = [effectAllowed[i]];
                            }
                            // else if possible take the second
                            if ((dropEffect === effectAllowed) && (effectAllowed.length > 1))
                                dropEffect = [effectAllowed[1]];
                        }
                        // else find the primary
                        else {
                            for (let i = 0; i < effectAllowed.length; i++) {
                                if (effectAllowed[i].primary === true)
                                    dropEffect = [effectAllowed[i]];
                            }
                            // else find take the first one
                            if (dropEffect === effectAllowed)
                                dropEffect = [effectAllowed[0]];
                        }
                    }
                }
            }
            return dropEffect;
        }
    }

    export class DragNativeDataTransfer extends Core.Object implements DragDataTransfer {
        dataTransfer: any = undefined;
        dragWatcher: DragWatcher = undefined;
        nativeData: any = undefined;
        dropEffect: any = 'none';
        position: Point = undefined;

        constructor() {
            super();
            this.nativeData = new DragNativeData(this);
        }

        getPosition(): Point {
            return this.position;
        }

        setPosition(position: Point) {
            this.position = position;
        }

        getData() {
            return this.nativeData;
        }

        setDataTransfer(dataTransfer) {
            this.dataTransfer = dataTransfer;
        }

        capture(element: Element, effect) {
            if ((this.dragWatcher !== undefined) && (this.dragWatcher.getElement() === element))
                throw ('Drag already captured by the given element');

            if (this.dragWatcher !== undefined)
                this.dragWatcher.leave();

            this.dragWatcher = new DragWatcher(element, this);
            this.dragWatcher.setEffectAllowed(effect);
            return this.dragWatcher;
        }

        releaseDragWatcher(dragWatcher: DragWatcher) {
            if (this.dragWatcher === dragWatcher) {
                this.dragWatcher.leave();
                this.dragWatcher = undefined;
            }
        }
    }

    export class DragNativeManager extends Core.Object {
        dataTransfer: DragNativeDataTransfer;
        nativeTarget: any = undefined;

        constructor() {
            super();
            this.dataTransfer = new DragNativeDataTransfer();

            window.addEventListener('dragover', (e) => this.onDragOver(e));
            window.addEventListener('dragenter', (e) => this.onDragEnter(e));
            window.addEventListener('dragleave', (e) => this.onDragLeave(e));
            window.addEventListener('drop', (e) => this.onDrop(e));
        }

        protected onDragOver(event) {
            this.dataTransfer.setDataTransfer(event.dataTransfer);
            let point = new Point(event.clientX, event.clientY);
            this.dataTransfer.setPosition(point);

            let overElement = Element.elementFromPoint(point);

            if (overElement !== undefined) {
                let dragEvent = new DragEvent();
                dragEvent.setType('dragover');
                dragEvent.clientX = event.clientX;
                dragEvent.clientY = event.clientY;
                dragEvent.dataTransfer = this.dataTransfer;

                dragEvent.dispatchEvent(overElement);

                if ((this.dataTransfer.dragWatcher !== undefined) &&
                    !overElement.getIsChildOf(this.dataTransfer.dragWatcher.getElement())) {
                    this.dataTransfer.dragWatcher.leave();
                    this.dataTransfer.dragWatcher = undefined;
                }
            }

            if (this.dataTransfer.dragWatcher !== undefined) {
                let dropEffect = DragEmuDataTransfer.getMergedEffectAllowed(
                    this.nativeToCustom(event.dataTransfer.effectAllowed), this.dataTransfer.dragWatcher.effectAllowed);
                this.dataTransfer.dragWatcher.move(event.clientX, event.clientY);
                event.dataTransfer.dropEffect = this.customToNative(dropEffect);
            }
            else
                event.dataTransfer.dropEffect = 'none';
            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        }

        protected onDragEnter(e) {
            this.nativeTarget = e.target;
        }

        protected onDragLeave(e) {
            if (this.nativeTarget !== e.target)
                return;
            this.nativeTarget = undefined;

            if (this.dataTransfer.dragWatcher !== undefined) {
                this.dataTransfer.dragWatcher.leave();
                this.dataTransfer.dragWatcher = undefined;
            }
        }

        protected onDrop(event) {
            this.dataTransfer.setDataTransfer(event.dataTransfer);
            if (this.dataTransfer.dragWatcher !== undefined) {
                this.dataTransfer.dragWatcher.leave();
                let dropEffect = DragEmuDataTransfer.getMergedEffectAllowed(
                    this.nativeToCustom(event.dataTransfer.effectAllowed), this.dataTransfer.dragWatcher.effectAllowed);
                event.dataTransfer.dropEffect = this.customToNative(dropEffect);
                if (dropEffect.length > 0)
                    this.dataTransfer.dragWatcher.drop(dropEffect[0].action);
                this.dataTransfer.dragWatcher = undefined;
            }
            event.stopImmediatePropagation();
            event.preventDefault();
        }

        nativeToCustom(effectAllowed: string): string[] {
            if (effectAllowed === 'copy')
                return ['copy'];
            else if (effectAllowed === 'link')
                return ['link'];
            else if (effectAllowed === 'move')
                return ['move'];
            else if (effectAllowed === 'copyLink')
                return ['copy', 'link'];
            else if (effectAllowed === 'copyMove')
                return ['move', 'copy'];
            else if (effectAllowed === 'linkMove')
                return ['move', 'link'];
            else if (effectAllowed === 'all')
                return ['move', 'copy', 'link'];
        }

        customToNative(effectAllowed): string {
            let containsLink = false;
            let containsCopy = false;
            let containsMove = false;
            for (let i = 0; i < effectAllowed.length; i++) {
                if (effectAllowed[i].action === 'link')
                    containsLink = true;
                else if (effectAllowed[i].action === 'move')
                    containsMove = true;
                else if (effectAllowed[i].action === 'copy')
                    containsCopy = true;
            }
            if (containsLink && containsCopy && containsMove)
                return 'all';
            else if (containsLink && containsCopy)
                return 'copyLink';
            else if (containsLink && containsMove)
                return 'linkMove';
            else if (containsMove && containsCopy)
                return 'copyMove';
            else if (containsLink)
                return 'link';
            else if (containsMove)
                return 'move';
            else if (containsCopy)
                return 'copy';
            else
                return 'none';
        }
    }
}
