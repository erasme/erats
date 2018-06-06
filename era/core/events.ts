namespace Core {
    export class Events<T> {
        private static handlerGenerator: number = 0;
        readonly list = new Array<{ handler: (event: T) => void, capture: boolean, id: number }>();

        connect(handler: (event: T) => void, capture: boolean = false) {
            let id = ++Events.handlerGenerator;
            this.list.push({ handler: handler, capture: capture, id: id });
            return id;
        }

        disconnect(handler: ((event: T) => void) | number) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].handler === handler || this.list[i].id === handler) {
                    this.list.splice(i, 1);
                    break;
                }
            }
        }

        fire(event: T) {
            for (let handler of this.list)
                handler.handler(event);
        }
    }
}