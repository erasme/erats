namespace Ui
{
	export class Event extends Core.Object
	{
		type: string;
		bubbles: boolean = true;
		cancelable: boolean = true;
		target: Ui.Element;
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

		setType(type: string) {
			this.type = type;
		}

		setBubbles(bubbles: boolean) {
			this.bubbles = bubbles;
		}

		dispatchEvent(target: Ui.Element) {
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
					if (this.type in current && current[this.type] instanceof Core.Events) {
						let handlers = (current[this.type] as Core.Events<any>).list;
						for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
							let handler = handlers[i2];
							if (handler.capture)
								handler.handler(this);
						}
					}	
				}

				// bubble mode
				for (let i = 0; (i < stack.length) && (!this.cancelBubble) && (!this.stop); i++) {
					current = stack[i];
					if (this.type in current && current[this.type] instanceof Core.Events) {
						let handlers = (current[this.type] as Core.Events<any>).list;
						//let handlers = current.getEventHandlers(this.type);
						for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
							let handler = handlers[i2];
							if (!handler.capture)
								handler.handler(this);
						}
					}	
				}
			}
			else {
				if (this.type in this.target && this.target[this.type] instanceof Core.Events) {
					// capture before
					let handlers = (this.target[this.type] as Core.Events<any>).list;
					for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
						let handler = handlers[i2];
						if (handler.capture)
							handler.handler(this);
					}

					// normal mode
					for (let i2 = 0; (i2 < handlers.length) && (!this.stop); i2++) {
						let handler = handlers[i2];
						if (!handler.capture)
							handler.handler(this);
					}
				}	
			}
		}
	}
}	
