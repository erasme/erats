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

	export class WheelManager extends Core.Object
	{
		app: App;

		constructor(app: App) {
			super();
			this.app = app;
			this.app.drawing.addEventListener('mousewheel', (e) => this.onMouseWheel(e));
			this.app.drawing.addEventListener('DOMMouseScroll', (e) => this.onMouseWheel(e));
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

			let target = App.current.elementFromPoint(new Point(event.clientX, event.clientY));

			if (target !== undefined) {
				let wheelEvent = new Ui.WheelEvent();
				wheelEvent.setClientX(event.clientX);
				wheelEvent.setClientY(event.clientY);
				wheelEvent.setDeltaX(deltaX);
				wheelEvent.setDeltaY(deltaY);
				wheelEvent.setCtrlKey(event.ctrlKey);
				wheelEvent.setAltKey(event.altKey);
				wheelEvent.setShiftKey(event.shiftKey);
				wheelEvent.setMetaKey(event.metaKey);
				wheelEvent.dispatchEvent(target);
				event.preventDefault();
			}
		}
	}
}	

