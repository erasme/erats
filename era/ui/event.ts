namespace Ui
{
	export class Event extends Core.Object
	{
		type: any = undefined;
		bubbles: boolean = true;
		cancelable: boolean = true;
		target: any = undefined;
		cancelBubble: boolean = false;
		stop: boolean = false;

		constructor() {
			super();
		}

		stopPropagation() {
			this.cancelBubble = true;
		}

		stopImmediatePropagation() {
			this.stop = true;
		}

		getIsPropagationStopped() {
			return this.stop || this.cancelBubble;
		}

		setType(type) {
			this.type = type;
		}

		setBubbles(bubbles) {
			this.bubbles = bubbles;
		}

		dispatchEvent(target) {
			this.target = target;

			if (this.bubbles) {
				let stack = [];

				let current = this.target;
				while (current != undefined) {
					stack.push(current);
					current = current.parent;
				}

				// mode capture
				for (let i = stack.length - 1; (i >= 0) && (!this.cancelBubble) && (!this.stop); i--) {
					current = stack[i];
					let handlers = current.getEventHandlers(this.type);
					for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
						let handler = handlers[i2];
						if (handler.capture)
							handler.method.apply(handler.scope, [this]);
					}
				}

				// bubble mode
				for (let i = 0; (i < stack.length) && (!this.cancelBubble) && (!this.stop); i++) {
					current = stack[i];
					let handlers = current.getEventHandlers(this.type);
					for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
						let handler = handlers[i2];
						if (!handler.capture)
							handler.method.apply(handler.scope, [this]);
					}
				}
			}
			else {
				// capture before
				let handlers = this.target.getEventHandlers(this.type);
				for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
					let handler = handlers[i2];
					if (handler.capture)
						handler.method.apply(handler.scope, [this]);
				}

				// normal mode
				for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
					let handler = handlers[i2];
					if (!handler.capture)
						handler.method.apply(handler.scope, [this]);
				}
			}
		}
	}
}	
