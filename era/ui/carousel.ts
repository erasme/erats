namespace Ui {
    export interface CarouselInit extends ContainerInit {
        autoPlay?: number;
        bufferingSize?: number;
        content?: Element[];
        alwaysShowArrows?: boolean;
        onchanged?: (event: { target: Carousel, position: number }) => void;
    }

    export class Carousel extends Container {
        private carouselable: Carouselable;
        private buttonNext: Pressable;
        private buttonNextIcon: Icon;
        private buttonPrevious: Pressable;
        private buttonPreviousIcon: Icon;
        private showClock?: Anim.Clock;
        private hideTimeout?: Core.DelayedTask;
        private showNext: boolean = false;
        private showPrevious: boolean = false;
        private _alwaysShowArrows: boolean = false;
        readonly changed = new Core.Events<{ target: Carousel, position: number }>();
        set onchanged(value: (event: { target: Carousel, position: number }) => void) { this.changed.connect(value); }

        constructor(init?: CarouselInit) {
            super(init);
            this.focusable = true;

            new Ui.OverWatcher({
                element: this,
                onentered: () => this.onMouseEnter(),
                onleaved: () => this.onMouseLeave()
            });

            //this.entered.connect(() => this.onMouseEnter());
            //this.leaved.connect(() => this.onMouseLeave());
            //this.moved.connect(() => this.onMouseOverMove());

            this.carouselable = new Ui.Carouselable();
            this.appendChild(this.carouselable);
            this.focused.connect(() => this.onCarouselableFocus());
            this.blurred.connect(() => this.onCarouselableBlur());
            this.carouselable.changed.connect(e => this.onCarouselableChange(e.target, e.position));

            this.buttonPrevious = new Ui.Pressable({
                horizontalAlign: 'left', verticalAlign: 'center', opacity: 0, focusable: false,
                onpressed: () => this.onPreviousPress()
            });
            this.buttonPreviousIcon = new Ui.Icon({ icon: 'arrowleft', width: 48, height: 48 });
            this.buttonPrevious.append(this.buttonPreviousIcon);
            this.appendChild(this.buttonPrevious);

            this.buttonNext = new Ui.Pressable({
                horizontalAlign: 'right', verticalAlign: 'center', opacity: 0, focusable: false,
                onpressed: () => this.onNextPress()
            });
            this.buttonNextIcon = new Ui.Icon({ icon: 'arrowright', width: 48, height: 48 });
            this.buttonNext.append(this.buttonNextIcon);
            this.appendChild(this.buttonNext);

            this.drawing.addEventListener('keydown', e => this.onKeyDown(e));

            if (init) {
                if (init.autoPlay)
                    this.autoPlay = init.autoPlay;
                if (init.bufferingSize)
                    this.bufferingSize = init.bufferingSize;
                if (init.content)
                    this.content = init.content;
                if (init.alwaysShowArrows)
                    this.alwaysShowArrows = init.alwaysShowArrows;
                if (init.onchanged)
                    this.changed.connect(init.onchanged);
            }
        }

        set autoPlay(delay: number) {
            this.carouselable.autoPlay = delay;
        }

        get alwaysShowArrows(): boolean {
            return this._alwaysShowArrows;
        }

        set alwaysShowArrows(value: boolean) {
            this._alwaysShowArrows = value;
            if (value)
                this.showArrows();
            else
                this.hideArrows();
        }

        next() {
            this.carouselable.next();
        }

        previous() {
            this.carouselable.previous();
        }

        get logicalChildren(): Element[] {
            return this.carouselable.logicalChildren;
        }

        get currentPosition(): number {
            return this.carouselable.currentPosition;
        }

        get current(): Element {
            return this.carouselable.current;
        }

        set current(value: Element) {
            this.setCurrent(value);
        }

        setCurrentAt(position: number, noAnimation: boolean = false) {
            this.carouselable.setCurrentAt(position, noAnimation);
        }

        setCurrent(current: Element, noAnimation: boolean = false) {
            this.carouselable.setCurrent(current, noAnimation);
        }

        get bufferingSize() {
            return this.carouselable.bufferingSize;
        }

        set bufferingSize(size: number) {
            this.carouselable.bufferingSize = size;
        }

        append(child: Element) {
            this.carouselable.append(child);
        }

        remove(child: Element) {
            this.carouselable.remove(child);
        }

        insertAt(child: Element, pos: number) {
            this.carouselable.insertAt(child, pos);
        }

        moveAt(child: Element, pos: number) {
            this.carouselable.moveAt(child, pos);
        }

        set content(content: Element[]) {
            this.carouselable.content = content;
        }

        //
        // @private
        //

        private onCarouselableChange(carouselable: Carouselable, position: number) {
            this.showArrows();
            this.changed.fire({ target: this, position: position });
        }

        private onCarouselableFocus() {
            this.showArrows();
        }

        private onCarouselableBlur() {
            this.hideArrows();
        }

        private onPreviousPress() {
            this.focus();
            this.previous();
        }

        private onNextPress() {
            this.focus();
            this.next();
        }

        private onMouseEnter() {
            this.showArrows();
            this.carouselable.stopAutoPlay();
        }

        private onMouseOverMove() {
            this.showArrows();
        }

        private onMouseLeave() {
            this.hideArrows();
            this.carouselable.startAutoPlay();
        }

        private showArrows() {
            var pos = this.carouselable.currentPosition;
            var children = this.carouselable.logicalChildren;

            if (children.length > 0) {
                this.showPrevious = (pos > 0);
                this.showNext = (pos < children.length - 1);
            }
            else {
                this.showPrevious = false;
                this.showNext = false;
            }

            if (this.showClock === undefined) {
                this.showClock = new Anim.Clock({
                    duration: 'forever', target: this,
                    ontimeupdate: e => this.onShowTick(e.target, e.progress, e.deltaTick)
                });
                this.showClock.begin();
            }
        }

        private hideArrows() {
            if (this.hideTimeout !== undefined) {
                this.hideTimeout.abort();
                this.hideTimeout = undefined;
            }
            if (this._alwaysShowArrows)
                return;

            this.showPrevious = false;
            this.showNext = false;
            if (this.showClock === undefined) {
                this.showClock = new Anim.Clock({
                    duration: 'forever', target: this,
                    ontimeupdate: e => this.onShowTick(e.target, e.progress, e.deltaTick)
                });
                this.showClock.begin();
            }
        }

        private onShowTick(clock, progress, delta) {
            if (delta === 0)
                return;
            var opacity;
            var previousDone = false;
            if (this.showPrevious) {
                opacity = this.buttonPrevious.opacity;
                opacity = Math.min(opacity + delta, 1);
                this.buttonPrevious.opacity = opacity;
                if (opacity == 1)
                    previousDone = true;
            }
            else {
                opacity = this.buttonPrevious.opacity;
                opacity = Math.max(opacity - (delta * 2), 0);
                this.buttonPrevious.opacity = opacity;
                if (opacity === 0)
                    previousDone = true;
            }

            var nextDone = false;
            if (this.showNext) {
                opacity = this.buttonNext.opacity;
                opacity = Math.min(opacity + delta, 1);
                this.buttonNext.opacity = opacity;
                if (opacity == 1)
                    nextDone = true;
            }
            else {
                opacity = this.buttonNext.opacity;
                opacity = Math.max(opacity - (delta * 2), 0);
                this.buttonNext.opacity = opacity;
                if (opacity === 0)
                    nextDone = true;
            }

            if (previousDone && nextDone && this.showClock) {
                this.showClock.stop();
                this.showClock = undefined;
            }
        }

        private onKeyDown(event: KeyboardEvent) {
            if (this.hasFocus) {
                if (event.which == 39)
                    this.next();
                else if (event.which == 37)
                    this.previous();
            }
        }

        protected measureCore(width: number, height: number): { width: number, height: number } {
            let minWidth = 0;
            let minHeight = 0;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                let size = child.measure(width, height);
                if (size.width > minWidth)
                    minWidth = size.width;
                if (size.height > minHeight)
                    minHeight = size.height;
            }
            return { width: minWidth, height: minHeight };
        }

        protected arrangeCore(width: number, height: number) {
            for (let i = 0; i < this.children.length; i++)
                this.children[i].arrange(0, 0, width, height);
        }

        protected onStyleChange() {
            var color = this.getStyleProperty('focusColor');
            this.buttonPreviousIcon.fill = color;
            this.buttonNextIcon.fill = color;
        }

        static style: any = {
            focusColor: '#21d3ff'
        }
    }
}