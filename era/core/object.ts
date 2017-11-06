
namespace Core
{
	//
	// @class Object class from which every Era classes derives.
	// It handles inheritance, serialization, dump function, manages events connections.
	//
	export class Object
	{
		events: any = undefined;

		addEvents(...args: string[]) {
			if(this.events === undefined)
				this.events = [];
			for(let i = 0; i < args.length; i++)
				this.events[args[i]] = [];
		}

		//
		// Test is an event is supported on this class
		// @param {string} event
		// @example this.hasEvent('press');
		//
		hasEvent(eventName: string): boolean {
			return (this.events !== undefined) && (eventName in this.events);
		}

		fireEvent(eventName, ...args: any[]) {
			let handled = false;
			let eventListeners = this.events[eventName];
			if (eventListeners !== undefined) {
				// copy the listeners because the events handlers might
				// change the connected events
				eventListeners = eventListeners.slice();
				// send capture events first
				for (let i = 0; (i < eventListeners.length) && !handled; i++) {
					if (eventListeners[i].capture === true) {
						handled = eventListeners[i].method.apply(eventListeners[i].scope, args);
						if (handled === undefined)
							handled = false;
					}
				}
				for (let i = 0; (i < eventListeners.length) && !handled; i++) {
					if (eventListeners[i].capture !== true) {
						handled = eventListeners[i].method.apply(eventListeners[i].scope, args);
						if (handled === undefined)
							handled = false;
					}
				}
			}
			else if (DEBUG)
				throw ('Event \'' + eventName + '\' not found on ' + this);
			return handled;
		}

		//
		// Connect a method to the eventName event of the obj object. The method will
		// be called in the current element scope.
		//	@param {mixed} obj
		//	@param {string} eventName
		//	@param {function} method
		//	@param capture
		//
		connect(obj, eventName: string, method: Function, capture: boolean = false) {
			var wrapper;
			if (capture === undefined)
				capture = false;
			if (DEBUG && (typeof (method) !== 'function'))
				throw ('Invalid method to connect on event \'' + eventName + '\'');
	
			if ('addEventListener' in obj) {
				wrapper = function () {
					return wrapper.callback.apply(wrapper.scope, arguments);
					//return arguments.callee.callback.apply(arguments.callee.scope, arguments);
				};
				wrapper.scope = this;
				wrapper.callback = method;
				wrapper.eventName = eventName;
				wrapper.capture = capture;
				obj.addEventListener(eventName, wrapper, capture);
				if (obj.events === undefined)
					obj.events = [];
				obj.events.push(wrapper);
			}
			else {
				var signal = { scope: this, method: method, capture: capture };
				var eventListeners = obj.events[eventName];
				if (eventListeners !== undefined)
					eventListeners.push(signal);
				else if (DEBUG)
					throw ('Event \'' + eventName + '\' not found on ' + obj);
			}
		}

		getEventHandlers(eventName: string) {
			let eventListeners = this.events[eventName];
			if(eventListeners !== undefined)
				return eventListeners.slice();
			else
				return [];
		}

		disconnect(obj, eventName: string, method: Function) {
			let wrapper; let signal;
			if ('removeEventListener' in obj) {
				for (let i = 0; (obj.events !== undefined) && (i < obj.events.length); i++) {
					wrapper = obj.events[i];
					if ((wrapper.scope === this) && (wrapper.eventName === eventName)) {
						if ((method !== undefined) && (wrapper.callback !== method))
							continue;
						obj.removeEventListener(wrapper.eventName, wrapper, wrapper.capture);
						obj.events.splice(i, 1);
						i--;
					}
				}
			}
			else {
				for (let i = 0; (obj.events !== undefined) && (i < obj.events[eventName].length); i++) {
					signal = obj.events[eventName][i];
					if (signal.scope == this) {
						if ((method !== undefined) && (signal.method !== method))
							continue;
						obj.events[eventName].splice(i, 1);
						i--;
					}
				}
			}
		}

		//
		// Serialize a javascript object into a string
		// to deserialize, just use JSON.parse
		//
		serialize()
		{
			return JSON.stringify(this);
		}

		getClassName(): string {
			if ('name' in this.constructor)
				return this.constructor['name'];
			else
				return /function (.{1,})\(/.exec(this.constructor.toString())[0];
		}

		protected assign(init?: object) {
			if (!init)
				return;
			for (var prop in init)
				this[prop] = init[prop];
		}

		toString(): string {
			return `[object ${this.getClassName()}]`;
		}
	}
}
