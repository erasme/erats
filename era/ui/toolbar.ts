namespace Ui {
    export interface ToolBarInit extends ContainerInit {
        content?: Element | Element[];
    }

    export class ToolBar extends Container implements ToolBarInit {
        private scroll: ScrollingArea;
        private hbox: HBox;

        constructor(init?: ToolBarInit) {
            super(init);
            this.scroll = new ScrollingArea();
            this.scroll.scrollVertical = false;
            this.appendChild(this.scroll);

            this.hbox = new HBox();
            this.hbox.eventsHidden = true;
            this.scroll.content = this.hbox;
        }

        append(child: Element, resizable: boolean = false) {
            this.hbox.append(child, resizable);
        }

        remove(child: Element) {
            this.hbox.remove(child);
        }

        set content(content: Element | Element[]) {
            this.hbox.content = content;
        }

        protected measureCore(width: number, height: number) {
            return this.scroll.measure(width, height);
        }

        protected arrangeCore(width: number, height: number) {
            this.scroll.arrange(0, 0, width, height);
        }

        protected onStyleChange() {
            let spacing = this.getStyleProperty('spacing');
            this.hbox.margin = spacing;
            this.hbox.spacing = spacing;
        }

        static style: object = {
            spacing: 3
        }
    }
}	
