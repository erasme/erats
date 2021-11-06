namespace Core
{
    export interface RemoteDebugInit {
        host: string;
        port: number;
    }

    export class RemoteDebug extends Object
    {
        host: string | undefined;
        port: number | undefined;
        socket: Socket | undefined;
        socketAlive: boolean = false;
        retryTask: any = undefined;
        nativeConsole: any = undefined;
        buffer: Array<any> = [];

        /**
        *	@constructs
        *	@class
        *	@extends Core.Object
        */
        constructor(init: RemoteDebugInit) {
            super();
            Core.RemoteDebug.current = this;

            this.host = init.host;
            this.port = init.port;

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
            this.socket.opened.connect(this.onSocketOpen);
            this.socket.message.connect(this.onSocketMessage);
            this.socket.error.connect(this.onSocketError);
            this.socket.closed.connect(this.onSocketClose);
        }

        protected onSocketOpen = () => {
            this.socketAlive = true;
            while (this.buffer.length > 0) {
                this.socket!.send(this.buffer.shift());
            }
        }

        protected onSocketMessage = (e: { target: any, message: string }) => {
            eval(e.message);
        }

        protected onSocketError = () => {
            this.socketAlive = false;
            this.socket!.close();
        }

        protected onSocketClose = () => {
            this.socketAlive = false;
            this.socket!.error.disconnect(this.onSocketError);
            this.socket!.closed.disconnect(this.onSocketClose);
            this.socket = undefined;
            this.retryTask = new Core.DelayedTask(5, this.startSocket);
        }

        onConsoleLog(message: any) {
            if (this.socketAlive)
                this.socket!.send(JSON.stringify({ type: 'log', message: message }));
            else
                this.buffer.push(JSON.stringify({ type: 'log', message: message }));
        }

        onConsoleError(message: any) {
            if (this.socketAlive)
                this.socket!.send(JSON.stringify({ type: 'error', message: message }));
            else
                this.buffer!.push(JSON.stringify({ type: 'error', message: message }));
        }

        onConsoleWarn(message: any) {
            if (this.socketAlive)
                this.socket!.send(JSON.stringify({ type: 'warn', message: message }));
            else
                this.buffer.push(JSON.stringify({ type: 'warn', message: message }));
        }

        onError(message: any, url?: string, line?: number) {
            if (this.socketAlive)
                this.socket!.send(JSON.stringify({ type: 'warn', message: message, url: url, line: line }));
            else
                this.buffer.push(JSON.stringify({ type: 'warn', message: message, url: url, line: line }));
        }

        static current: RemoteDebug | undefined;

        static onConsoleLog(message: any) {
            Core.RemoteDebug.current?.onConsoleLog.call(Core.RemoteDebug.current, message);
        }

        static onConsoleError(message: any) {
            Core.RemoteDebug.current?.onConsoleError.call(Core.RemoteDebug.current, message);
        }

        static onConsoleWarn(message: any) {
            Core.RemoteDebug.current?.onConsoleWarn.call(Core.RemoteDebug.current, message);
        }

        static onError(message: any, url?: string, line?: number) {
            Core.RemoteDebug.current?.onError.call(Core.RemoteDebug.current, message, url, line);
        }
    }
}
