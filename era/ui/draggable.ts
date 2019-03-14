namespace Ui {

    export class DraggableWatcher extends Core.Object {
        allowedMode: string | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | Array<string> = 'all';
        // the data that we drag & drop
        data: any;
        private _dragDelta: Point;
        dataTransfer?: DragEmuDataTransfer;
        private element: Element;
        private start: (watcher: DraggableWatcher) => void;
        private end: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void;

        constructor(init: {
            element: Element,
            data: any,
            start?: (watcher: DraggableWatcher) => void,
            end?: (watcher: DraggableWatcher, effect: 'none' | 'copy' | 'link' | 'move' | string) => void
        }) {
            super();
            this.element = init.element;
            this.data = init.data;
            if (init.start !== undefined)
                this.start = init.start;
            if (init.end !== undefined)
                this.end = init.end;
            //this.element.ptrdowned.connect(e => this.onDraggablePointerDown(e));

            if ('PointerEvent' in window)
                this.element.drawing.addEventListener('pointerdown', this.onDraggablePointerDown, { passive: false });
            if ('TouchEvent' in window)
                this.element.drawing.addEventListener('touchstart', this.onDraggableTouchStart, { passive: false });
            if (!('PointerEvent' in window) && !('TouchEvent' in window))
                this.element.drawing.addEventListener('mousedown', this.onDraggableMouseDown);
        }

        get dragDelta(): Point {
            return this._dragDelta;
        }

        dispose() {
            if ('PointerEvent' in window)
                this.element.drawing.removeEventListener('pointerdown', this.onDraggablePointerDown);
            if ('TouchEvent' in window)
                this.element.drawing.removeEventListener('touchstart', this.onDraggableTouchStart);
            if (!('PointerEvent' in window) && !('TouchEvent' in window))
                this.element.drawing.removeEventListener('mousedown', this.onDraggableMouseDown);
        }

        private onDraggablePointerDown = (event: PointerEvent) => {
            // left and middle mouse button only
            //if (event.pointerType == 'mouse' && event.pointer.button != 0 && event.pointer.button != 1)
            //    return;	
            if (this.element.isDisabled || (this.data === undefined))
                return;
            // PointerEvent dont allow to handle long hold interaction. Let TouchEvent do the job
            if (event.pointerType == 'touch')
                return;
            event.stopImmediatePropagation();
            let delayed = false;            
            let dataTransfer = new DragEmuDataTransfer(
                this.element, event.clientX, event.clientY, delayed, event);
            this.dataTransfer = dataTransfer;
            this._dragDelta = this.element.pointFromWindow(new Point(event.clientX, event.clientY));
            dataTransfer.started.connect(e => this.onDragStart(dataTransfer));
            dataTransfer.ended.connect(e => this.onDragEnd(dataTransfer));
        }

        private onDraggableMouseDown = (event: MouseEvent) => {
            // left mouse button only
            if (this.element.isDisabled || (this.data === undefined) || event.button != 0)
                return;
            event.stopImmediatePropagation();
            let delayed = false;
            let dataTransfer = new DragEmuDataTransfer(
                this.element, event.clientX, event.clientY, delayed, undefined, undefined, event);
            this.dataTransfer = dataTransfer;
            this._dragDelta = this.element.pointFromWindow(new Point(event.clientX, event.clientY));
            dataTransfer.started.connect(e => this.onDragStart(dataTransfer));
            dataTransfer.ended.connect(e => this.onDragEnd(dataTransfer));
        }

        private onDraggableTouchStart = (event: TouchEvent) => {
            if (this.element.isDisabled || (this.data === undefined) || (event.targetTouches.length != 1))
                return;

            let delayed = true;            
            let dataTransfer = new DragEmuDataTransfer(
                this.element, event.targetTouches[0].clientX, event.targetTouches[0].clientY, delayed, undefined, event);
            this.dataTransfer = dataTransfer;
            this._dragDelta = this.element.pointFromWindow(new Point(event.targetTouches[0].clientX, event.targetTouches[0].clientY));
            dataTransfer.started.connect(e => this.onDragStart(dataTransfer));
            dataTransfer.ended.connect(e => this.onDragEnd(dataTransfer));
        }


        private onDragStart(dataTransfer: DragEmuDataTransfer): void {
            let selection = Selectionable.getParentSelectionHandler(this.element);
            if (selection && (selection.elements.indexOf(this.element as any) != -1))
                dataTransfer.setData(selection);
            else
                dataTransfer.setData(this.data);
            dataTransfer.effectAllowed = this.allowedMode;
            if (this.start)
                this.start(this);
        }

        private onDragEnd(dataTransfer: DragEmuDataTransfer): void {
            let action = 'none';
            if (dataTransfer.dropEffect && dataTransfer.dropEffect.length > 0)
                action = dataTransfer.dropEffect[0].action;
            // dropEffect give the operation done: [none|copy|link|move]
            if (this.end)
                this.end(this, action);
            
        }
    }

    export interface DraggableInit extends PressableInit {
        ondragstarted?: (event: { target: Draggable, dataTransfer: DragEmuDataTransfer }) => void;
        ondragended?: (event: { target: Draggable, effect: string }) => void;
    }

    export class Draggable extends Pressable implements DraggableInit {
        allowedMode: any = 'all';
        draggableWatcher: DraggableWatcher;
        // the data that we drag & drop
        private _dragDelta: Point;
        readonly dragstarted = new Core.Events<{ target: Draggable, dataTransfer: DragEmuDataTransfer }>();
        set ondragstarted(value: (event: { target: Draggable, dataTransfer: DragEmuDataTransfer }) => void) { this.dragstarted.connect(value); }
        readonly dragended = new Core.Events<{ target: Draggable, effect: string }>();
        set ondragended(value: (event: { target: Draggable, effect: string }) => void) { this.dragended.connect(value); }

        constructor(init?: DraggableInit) {
            super(init);
            this.drawing.oncontextmenu = (e) => e.preventDefault();

            this.draggableWatcher = new DraggableWatcher({
                element: this,
                data: this.draggableData,
                start: (watcher) => this.onDragStart(watcher.dataTransfer),
                end: (watcher) => this.onDragEnd(watcher.dataTransfer)
            });

            if (init) {
                if (init.ondragstarted)
                    this.dragstarted.connect(init.ondragstarted);	
                if (init.ondragended)
                    this.dragended.connect(init.ondragended);	
            }
        }

        get draggableData(): any {
            return this.draggableWatcher ? this.draggableWatcher.data : undefined;
        }

        set draggableData(data: any) {
            this.draggableWatcher.data = data;
        }

        //
        // Set the allowed operation. Possible values are:
        // [copy|copyLink|copyMove|link|linkMove|move|all]
        //
        setAllowedMode(allowedMode): void {
            this.allowedMode = allowedMode;
        }

        get dragDelta(): Point {
            return this._dragDelta;
        }

        protected onDragStart(dataTransfer: DragEmuDataTransfer): void {
            this.dragstarted.fire({ target: this, dataTransfer: dataTransfer });
        }

        protected onDragEnd(dataTransfer: DragEmuDataTransfer): void {
            // dropEffect give the operation done: [none|copy|link|move]
            this.dragended.fire({ target: this, effect: dataTransfer.dropEffect });
        }
    }
}	

