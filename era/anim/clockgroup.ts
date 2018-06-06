namespace Anim
{
    export class ClockGroup extends Clock
    {
        children: Clock[] = [];

        appendChild(child: Clock) {
            child.parent = this;
            this.children.push(child);
        }

        set content(content: Clock[]) {
            this.children = [];
            if (content !== undefined) {
                if (content instanceof Array) {
                    for (let i = 0; i < content.length; i++)
                        this.appendChild(content[i]);
                }
                else
                    this.appendChild(content);
            }
        }

        begin() {
            super.begin();
            for (var i = 0; i < this.children.length; i++)
                this.children[i].begin();
        }

        pause() {
            super.pause();
            for (let i = 0; i < this.children.length; i++)
                this.children[i].pause();
        }

        resume() {
            super.resume();
            for (let i = 0; i < this.children.length; i++)
                this.children[i].resume();
        }

        stop() {
            super.stop();
            for (let i = 0; i < this.children.length; i++)
                this.children[i].stop();
        }

        complete() {
            super.complete();
            for (let i = 0; i < this.children.length; i++)
                this.children[i].complete();
        }

        update(parentGlobalTime) {
            do {
                super.update(parentGlobalTime);
                // update children clock
                let childStopped = true;
                for (let i = 0; i < this.children.length; i++) {
                    let childClock = this.children[i];
                    childClock.update(this.globalTime);
                    if (childClock.isActive)
                        childStopped = false;
                }
                if (this.isActive && childStopped)
                    this.pendingState = 'stopped';
            } while (this.pendingState != 'none');
        }
    }
}
