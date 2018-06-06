namespace Core
{
    export class DelayedTask extends Object
    {
        delay: number;
        callback: (task: DelayedTask) => void;
        isDone: boolean = false;
        handle?: number;

        constructor(delay: number, callback: (task: DelayedTask) => void) {
            super();
            this.delay = delay;
            this.callback = callback;
            this.handle = setTimeout(() => {
                this.handle = undefined;
                this.isDone = true;
                this.callback(this);
            }, this.delay * 1000);
        }

        abort() {
            if (this.handle !== undefined) {
                clearTimeout(this.handle);
                this.handle = undefined;
            }
        }
    }
}

