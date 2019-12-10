namespace Ui
{
    export class WheelEvent extends Event
    {
        deltaX: number = 0;
        deltaY: number = 0;
        clientX: number = 0;
        clientY: number = 0;
        ctrlKey: boolean = false;
        altKey: boolean = false;
        shiftKey: boolean = false;
        metaKey: boolean = false;

        constructor() {
            super();
            this.setType('wheelchanged')
        }

        setClientX(clientX) {
            this.clientX = clientX;
        }

        setClientY(clientY) {
            this.clientY = clientY;
        }

        setDeltaX(deltaX) {
            this.deltaX = deltaX;
        }

        setDeltaY(deltaY) {
            this.deltaY = deltaY;
        }

        setCtrlKey(ctrlKey) {
            this.ctrlKey = ctrlKey;
        }

        setAltKey(altKey) {
            this.altKey = altKey;
        }

        setShiftKey(shiftKey) {
            this.shiftKey = shiftKey;
        }

        setMetaKey(metaKey) {
            this.metaKey = metaKey;
        }
    }

    export class WheelWatcher extends Core.Object
    {
        element: Element;
        onchanged: (e: WheelEvent) => void;

        constructor(init: {
            element: Element,
            onchanged: (e: WheelEvent) => void
        }) {
            super();
            this.element = init.element;
            this.onchanged = init.onchanged;
            this.element.drawing.addEventListener('mousewheel', (e) => this.onMouseWheel(e));
            this.element.drawing.addEventListener('DOMMouseScroll', (e) => this.onMouseWheel(e));
        }

        onMouseWheel(event) {
            let deltaX = 0;
            let deltaY = 0;

            if ((event.wheelDeltaX != undefined) && (event.wheelDeltaY != undefined)) {
                deltaX = -event.wheelDeltaX / 5;
                deltaY = -event.wheelDeltaY / 5;
            }
            // Opera, Chrome, IE
            else if (event.wheelDelta != undefined)
                deltaY = -event.wheelDelta / 2;
            // Firefox
            else if (event.detail != undefined)
                deltaY = event.detail * 20;

            let wheelEvent = new Ui.WheelEvent();
            wheelEvent.setClientX(event.clientX);
            wheelEvent.setClientY(event.clientY);
            wheelEvent.setDeltaX(deltaX);
            wheelEvent.setDeltaY(deltaY);
            wheelEvent.setCtrlKey(event.ctrlKey);
            wheelEvent.setAltKey(event.altKey);
            wheelEvent.setShiftKey(event.shiftKey);
            wheelEvent.setMetaKey(event.metaKey);
                
            this.onchanged(wheelEvent);
            if (wheelEvent.getIsPropagationStopped())
                event.preventDefault();
        }
    }
}	

