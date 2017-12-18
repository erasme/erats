namespace Core
{
	export interface SocketInit {
		host?: string;
		secure?: boolean;
		port?: number;
		service?: string;
		mode?: 'websocket' | 'poll';
	}

	export class Socket extends Object
	{
		host: string = undefined;
		service: string = '/';
		port: number = 80;
		mode: 'websocket' | 'poll';
		secure: boolean = false;
		websocket: any;
		websocketdelay: any;
		emuopenrequest: any;
		emupollrequest: any;
		emusendrequest: any;
		emuid: any;
		emumessages: any;
		lastPosition: number = 0;
		readSize: boolean = true;
		size: number = 0;
		data: any = '';
		isClosed: boolean = false;
		closeSent: boolean = false;
		sep: string = '?';
		lastPoll: any;
		delayPollTask: any;
		pollInterval: number = 2.5;

		static supportWebSocket: boolean = true;

		constructor(init: SocketInit) {
			super();
			this.addEvents('error', 'message', 'close', 'open');
			if (init.host !== undefined)
				this.host = init.host;
			else
				this.host = document.location.hostname;
			if (init.secure !== undefined)
				this.secure = init.secure;
			else
				this.secure = (document.location.protocol === 'https:');
			
			if (init.port !== undefined)
				this.port = init.port;
			else if ((document.location.port !== undefined) && (document.location.port !== ''))
				this.port = parseInt(document.location.port);
			else {
				if (this.secure)
					this.port = 443;
				else
					this.port = 80;
			}
			if (init.service !== undefined) {
				this.service = init.service;
				if (this.service.indexOf('?') == -1)
					this.sep = '?';
				else
					this.sep = '&';
			}
			if (init.mode !== undefined)
				this.mode = init.mode;
			else {
				if (Core.Socket.supportWebSocket)
					this.mode = 'websocket';
				else
					this.mode = 'poll';
			}
			if (this.mode == 'websocket') {
				this.websocket = new WebSocket((this.secure ? 'wss' : 'ws') + '://' + this.host + ':' + this.port + this.service);
				this.websocketdelay = new Core.DelayedTask(30, this.onWebSocketOpenTimeout);
				this.connect(this.websocket, 'open', this.onWebSocketOpen);
				this.connect(this.websocket, 'error', this.onWebSocketError);
				this.connect(this.websocket, 'message', this.onWebSocketMessage);
				this.connect(this.websocket, 'close', this.onWebSocketClose);
			}
			else {
				this.emumessages = [];
				var url = (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=poll&command=open';
				this.emuopenrequest = new Core.HttpRequest({ url: url });
				this.connect(this.emuopenrequest, 'done', this.onEmuSocketOpenDone);
				this.connect(this.emuopenrequest, 'error', this.onEmuSocketOpenError);
				this.emuopenrequest.send();
			}
		}

		send(msg) {
			if (this.websocket !== undefined) {
				this.websocket.send(msg);
			}
			else {
				if (this.emusendrequest === undefined) {
					var url = (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=' + this.mode + '&command=send&id=' + this.emuid + '&messages=' + encodeURIComponent(msg.toBase64());
					this.emusendrequest = new Core.HttpRequest({ url: url });
					this.connect(this.emusendrequest, 'done', this.onEmuSocketSendDone);
					this.connect(this.emusendrequest, 'error', this.onEmuSocketSendError);
					this.emusendrequest.send();
					//console.log(this+'.send delayPollTask: '+this.delayPollTask);
					// force a short delay (100ms) poll task if the server has a response to send
					if (this.delayPollTask !== undefined) {
						this.delayPollTask.abort();
						this.delayPollTask = new Core.DelayedTask(0.1, this.delayPollDone);
					}
				}
				else
					this.emumessages.push(msg.toBase64());
			}
		}

		close() {
			if (this.delayPollTask !== undefined) {
				this.delayPollTask.abort();
				this.delayPollTask = undefined;
			}
			if (this.websocket !== undefined) {
				this.isClosed = true;
				this.websocket.close();
			}
			else {
				if (!this.isClosed) {
					this.isClosed = true;
					if (this.emuopenrequest !== undefined) {
						this.emuopenrequest.abort();
						this.emuopenrequest = undefined;
					}
					else if (this.emuid !== undefined) {
						if (this.emusendrequest === undefined) {
							this.closeSent = true;
							this.emusendrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=' + this.mode + '&command=close&id=' + this.emuid });
							this.connect(this.emusendrequest, 'done', this.onEmuSocketSendDone);
							this.connect(this.emusendrequest, 'error', this.onEmuSocketSendError);
							this.emusendrequest.send();
						}
					}
				}
			}
		}

		private onWebSocketOpenTimeout() {
			this.websocketdelay = undefined;
			this.disconnect(this.websocket, 'open', this.onWebSocketOpen);
			this.disconnect(this.websocket, 'error', this.onWebSocketError);
			this.disconnect(this.websocket, 'message', this.onWebSocketMessage);
			this.disconnect(this.websocket, 'close', this.onWebSocketClose);
			this.websocket.close();
			this.websocket = undefined;

			// try emulated socket before giving up
			this.mode = 'poll';
			this.emumessages = [];
			this.emuopenrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=poll&command=open' });
			this.connect(this.emuopenrequest, 'done', this.onEmuSocketOpenDone);
			this.connect(this.emuopenrequest, 'error', this.onEmuSocketOpenError);
			this.emuopenrequest.send();
		}

		private onWebSocketOpen() {
			if (this.websocketdelay !== undefined) {
				this.websocketdelay.abort();
				this.websocketdelay = undefined;
			}
			this.fireEvent('open', this);
		}

		private onWebSocketError() {
			if (this.websocketdelay !== undefined) {
				this.websocketdelay.abort();
				this.websocketdelay = undefined;
			}
			this.fireEvent('error', this);
		}

		private onWebSocketMessage(msg) {
			if (msg.data === 'PING')
				this.websocket.send('PONG');
			else
				this.fireEvent('message', this, msg.data);
		}

		private onWebSocketClose(msg) {
			if (this.websocketdelay !== undefined) {
				this.websocketdelay.abort();
				this.websocketdelay = undefined;
			}
			this.fireEvent('close', this);
		}

		private emuSocketDataAvailable(data) {
			if (this.emuid === undefined) {
				this.emuid = data;
				this.fireEvent('open', this);
			}
			else {
				if (data !== 'keepalive')
					this.fireEvent('message', this, data.fromBase64());
			}
		}

		private emuSocketUpdate(delta) {
			for (var i = 0; i < delta.length; i++) {
				var character = delta[i];
				if (this.readSize) {
					if (character === ':') {
						this.readSize = false;
						this.size = parseInt('0x' + this.data);
						this.data = '';
					}
					else
						this.data += character;
				}
				else {
					this.data += character;
					if (this.data.length >= this.size + 2) {
						this.emuSocketDataAvailable(this.data.substring(0, this.data.length - 2));
						this.readSize = true;
						this.data = '';
					}
				}
			}
		}

		private onEmuSocketSendDone() {
			var response = this.emusendrequest.getResponseJSON();
			if (this.emumessages.length > 0) {
				var messages = '';
				for (var i = 0; i < this.emumessages.length; i++) {
					if (messages !== '')
						messages += ';';
					messages += this.emumessages[i];
				}
				this.emusendrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=' + this.mode + '&command=send&id=' + this.emuid + '&messages=' + encodeURIComponent(messages) });
				this.connect(this.emusendrequest, 'done', this.onEmuSocketSendDone);
				this.connect(this.emusendrequest, 'error', this.onEmuSocketSendError);
				this.emusendrequest.send();
				this.emumessages = [];
			}
			else if (this.isClosed && !this.closeSent) {
				this.emusendrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=' + this.mode + '&command=close&id=' + this.emuid });
				this.connect(this.emusendrequest, 'done', this.onEmuSocketSendDone);
				this.connect(this.emusendrequest, 'error', this.onEmuSocketSendError);
				this.emusendrequest.send();
			}
			else
				this.emusendrequest = undefined;
		}

		private onEmuSocketSendError() {
			this.emusendrequest = undefined;
		}

		private onEmuSocketOpenDone() {
			this.lastPoll = new Date();
			var response = this.emuopenrequest.getResponseJSON();
			this.emuopenrequest = undefined;
			if (response === undefined) {
				this.fireEvent('error', this);
				this.fireEvent('close', this);
			}
			else {
				this.emuid = response.id;
				// get the keep alive interval from the reponse if set
				if ('keepAliveInterval' in response)
					this.pollInterval = Math.min(response.keepAliveInterval, 2.5);
				if (response.status != 'open') {
					this.fireEvent('error', this);
					this.fireEvent('close', this);
				}
				else {
					this.fireEvent('open', this);
					this.emupollrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=poll&command=poll&id=' + this.emuid });
					this.connect(this.emupollrequest, 'done', this.onEmuSocketPollDone);
					this.connect(this.emupollrequest, 'error', this.onEmuSocketPollError);
					this.emupollrequest.send();
				}
			}
		}

		onEmuSocketOpenError(request, status) {
			this.emuopenrequest = undefined;
			this.fireEvent('error', this);
			this.fireEvent('close', this);
		}

		onEmuSocketPollDone() {
			var response = this.emupollrequest.getResponseJSON();
			this.emupollrequest = undefined;
			if (response === undefined) {
				this.close();
				this.fireEvent('close', this);
			}
			else {
				if (response.messages !== undefined) {
					for (var i = 0; i < response.messages.length; i++) {
						var msg = response.messages[i].fromBase64();
						this.fireEvent('message', this, msg);
					}
				}
				if (response.status !== 'open') {
					this.close();
					this.fireEvent('close', this);
				}
				else {
					var now = new Date();
					var deltaMs = Math.max(0, now.getTime() - this.lastPoll.getTime());
					this.lastPoll = now;
					//console.log('onEmuSocketPollDone delta: '+deltaMs+'ms');
					if (deltaMs >= this.pollInterval * 1000)
						this.sendPoll();
					else
						this.delayPollTask = new Core.DelayedTask(this.pollInterval, this.delayPollDone);
				}
			}
		}

		onEmuSocketPollError() {
			this.emupollrequest = undefined;
			this.fireEvent('error', this);
			this.close();
		}
	
		delayPollDone() {
			this.delayPollTask = undefined;
			if (this.emupollrequest === undefined)
				this.sendPoll();
		}
	
		sendPoll() {
			var now = new Date();
			this.lastPoll = now;
			this.emupollrequest = new Core.HttpRequest({ url: (this.secure ? 'https' : 'http') + '://' + this.host + ':' + this.port + this.service + this.sep + 'socket=poll&command=poll&id=' + this.emuid });
			this.connect(this.emupollrequest, 'done', this.onEmuSocketPollDone);
			this.connect(this.emupollrequest, 'error', this.onEmuSocketPollError);
			this.emupollrequest.send();
		}
	}
}	

Core.Socket.supportWebSocket = "WebSocket" in window;
