namespace Ui
{
	export interface DraggableInit extends PressableInit {
	}

	export class Draggable extends Pressable implements DraggableInit
	{
		//
		// Fires when object start to be dragged
		// @name Ui.Draggable#dragstart
		// @event
		// @param {Ui.Draggable} draggable The draggable itself
		//

		//
		// Fires when object stop to be dragged
		// @name Ui.Draggable#dragend
		// @event
		// @param {Ui.Draggable} draggable The draggable itself
		// @param {string} dropEffect Give the operation done: [none|copy|link|move]
		//

		allowedMode: any = 'all';
		// the data that we drag & drop
		draggableData: any = undefined;
		private _dragDelta: Point = undefined;
		private dataTransfer: DragDataTransfer = undefined;

		constructor(init?: Partial<DraggableInit>) {
			super();
			this.addEvents('dragstart', 'dragend');
			this.connect(this, 'ptrdown', this.onDraggablePointerDown);
			if (init)
				this.assign(init);
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

		private onDraggablePointerDown(event: PointerEvent): void {
			if (this.lock || this.isDisabled || (this.draggableData === undefined))
				return;

			this.dataTransfer = new DragEmuDataTransfer(
				this, event.clientX, event.clientY, true, event.pointer);
			this._dragDelta = this.pointFromWindow(new Point(event.clientX, event.clientY));
			this.connect(this.dataTransfer, 'start', this.onDragStart);
			this.connect(this.dataTransfer, 'end', this.onDragEnd);
		}

		private onDragStart(dataTransfer: DragEmuDataTransfer): void {
			dataTransfer.effectAllowed = this.allowedMode;
			dataTransfer.setData(this.draggableData);
			this.fireEvent('dragstart', this, dataTransfer);
		}

		private onDragEnd(dataTransfer: DragEmuDataTransfer): void {
			// dropEffect give the operation done: [none|copy|link|move]
			this.fireEvent('dragend', this, dataTransfer.dropEffect);
		}
	}
}	

