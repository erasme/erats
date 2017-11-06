namespace Ui
{
	export interface OverableInit extends LBoxInit {
	}

	export class Overable extends LBox implements OverableInit
	{
		watcher: PointerWatcher = undefined;

		constructor(init?: Partial<OverableInit>) {
			super();
			this.addEvents('enter', 'leave', 'move');

			this.connect(this, 'ptrmove', (event: PointerEvent) => {
				if (!this.isDisabled && (this.watcher == undefined)) {
					this.watcher = event.pointer.watch(this);
					this.fireEvent('enter', this);
					this.connect(this.watcher, 'move', () => {
						if (!this.watcher.getIsInside())
							this.watcher.cancel();
					});
					this.connect(this.watcher, 'cancel', () => {
						this.watcher = undefined;
						this.fireEvent('leave', this);
					});
				}
			});
			if (init)
				this.assign(init);
		}

		get isOver(): boolean {
			return (this.watcher !== undefined);
		}
	}
}	
