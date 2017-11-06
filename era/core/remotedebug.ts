namespace Core
{
	export class RemoteDebug extends Object
	{
		host: string = undefined;
		port: number = undefined;
		socket: Socket = undefined;
		socketAlive: boolean = false;
		retryTask: any = undefined;
		nativeConsole: any = undefined;
		buffer: Array<any> = [];

		/**
		*	@constructs
		*	@class
		*	@extends Core.Object
		*/
		constructor(config) {
			super();
			Core.RemoteDebug.current = this;

			this.host = config.host;
			delete (config.host);
			this.port = config.port;
			delete (config.port);

			this.nativeConsole = window.console;
			(window as any).console = {
				log: Core.RemoteDebug.onConsoleLog,
				error: Core.RemoteDebug.onConsoleError,
				warn: Core.RemoteDebug.onConsoleWarn
			};
			window.onerror = Core.RemoteDebug.onError;
			this.startSocket();
		}

		startSocket() {
			this.socket = new Core.Socket({ service: '/', host: this.host, port: this.port });
			this.connect(this.socket, 'open', this.onSocketOpen);
			this.connect(this.socket, 'message', this.onSocketMessage);
			this.connect(this.socket, 'error', this.onSocketError);
			this.connect(this.socket, 'close', this.onSocketClose);
		}

		onSocketOpen() {
			this.socketAlive = true;
			while (this.buffer.length > 0) {
				this.socket.send(this.buffer.shift());
			}
		}

		onSocketMessage(socket, message) {
			eval(message);
		}

		onSocketError() {
			this.socketAlive = false;
			this.socket.close();
		}

		onSocketClose() {
			this.socketAlive = false;
			this.disconnect(this.socket, 'error', this.onSocketError);
			this.disconnect(this.socket, 'close', this.onSocketClose);
			this.socket = undefined;
			this.retryTask = new Core.DelayedTask(this, 5, this.startSocket);
		}

		onConsoleLog(message) {
			if (this.socketAlive)
				this.socket.send(JSON.stringify({ type: 'log', message: message }));
			else
				this.buffer.push(JSON.stringify({ type: 'log', message: message }));
		}

		onConsoleError(message) {
			if (this.socketAlive)
				this.socket.send(JSON.stringify({ type: 'error', message: message }));
			else
				this.buffer.push(JSON.stringify({ type: 'error', message: message }));
		}

		onConsoleWarn(message) {
			if (this.socketAlive)
				this.socket.send(JSON.stringify({ type: 'warn', message: message }));
			else
				this.buffer.push(JSON.stringify({ type: 'warn', message: message }));
		}

		onError(message, url, line) {
			if (this.socketAlive)
				this.socket.send(JSON.stringify({ type: 'warn', message: message, url: url, line: line }));
			else
				this.buffer.push(JSON.stringify({ type: 'warn', message: message, url: url, line: line }));
		}

		static current: RemoteDebug = undefined;

		static onConsoleLog(message) {
			Core.RemoteDebug.current.onConsoleLog.call(Core.RemoteDebug.current, message);
		}

		static onConsoleError(message) {
			Core.RemoteDebug.current.onConsoleError.call(Core.RemoteDebug.current, message);
		}

		static onConsoleWarn(message) {
			Core.RemoteDebug.current.onConsoleWarn.call(Core.RemoteDebug.current, message);
		}

		static onError(message, url, line) {
			Core.RemoteDebug.current.onError.call(Core.RemoteDebug.current, message, url, line);
		}
	}
}
