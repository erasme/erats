namespace Ui
{
    export interface PopupInit extends ContainerInit {
        preferredWidth?: number;
        preferredHeight?: number;
        autoClose?: boolean;
        onclosed?: (event: { target: Popup }) => void;
        content?: Element;
    }

    export type AttachBorder = 'right' | 'left' | 'top' | 'bottom' | 'center';

    export class Popup extends Container implements PopupInit {
        popupSelection: Selection;
        background: PopupBackground;
        shadow: Pressable;
        contextBox: ContextBar;
        contentBox: LBox;
        scroll: ScrollingArea;
        posX: number = undefined;
        posY: number = undefined;
        attachedElement: Element = undefined;
        attachedBorder: AttachBorder = undefined;
        private _modal: boolean = true;
        private _autoClose: boolean = true;
        private _preferredWidth: number = undefined;
        private _preferredHeight: number = undefined;
        openClock: Anim.Clock = undefined;
        isClosed: boolean = true;
        readonly closed = new Core.Events<{ target: Popup }>();
        set onclosed(value: (event: { target: Popup }) => void) { this.closed.connect(value); }

        constructor(init?: PopupInit) {
            super(init);

            this.horizontalAlign = 'stretch';
            this.verticalAlign = 'stretch';

            this.popupSelection = new Selection();

            this.shadow = new Pressable();
            this.shadow.focusable = false;
            this.shadow.drawing.style.cursor = 'inherit';
            this.appendChild(this.shadow);

            this.background = new PopupBackground();
            this.background.radius = 0;
            this.background.fill = '#f8f8f8';
            this.background.setTransformOrigin(0, 0);
            this.appendChild(this.background);

            this.contentBox = new LBox();
            this.contentBox.margin = 2;
            this.contentBox.setTransformOrigin(0, 0);
            this.appendChild(this.contentBox);

            this.scroll = new ScrollingArea();
            this.contentBox.append(this.scroll);

            this.contextBox = new ContextBar();
            this.contextBox.selection = this.popupSelection;
            this.contextBox.verticalAlign = 'top';
            this.contextBox.hide(true);
            this.contentBox.append(this.contextBox);

            this.popupSelection.changed.connect((e) => this.onPopupSelectionChange(e.target));

            // handle auto hide
            this.shadow.pressed.connect((e) => this.onShadowPress());

            if (init) {
                if (init.preferredWidth !== undefined)
                    this.preferredWidth = init.preferredWidth;	
                if (init.preferredHeight !== undefined)
                    this.preferredHeight = init.preferredHeight;
                if (init.autoClose !== undefined)
                    this.autoClose = init.autoClose;
                if (init.content !== undefined)
                    this.content = init.content;
            }
        }

        get modal(): boolean {
            return this._modal;
        }

        set modal(value: boolean) {
            if (this._modal != value) {
                this._modal = value;
                this.shadow.opacity = value ? 1 : 0.01;
            }
        }

        set preferredWidth(width: number) {
            this._preferredWidth = width;
            this.invalidateMeasure();
        }

        set preferredHeight(height: number) {
            this._preferredHeight = height;
            this.invalidateMeasure();
        }

        // implement a selection handler for Selectionable elements
        getSelectionHandler() {
            return this.popupSelection;
        }

        set autoClose(autoClose: boolean) {
            this._autoClose = autoClose;
        }

        get content(): Element {
            return this.scroll.content;
        }

        set content(content: Element) {
            this.scroll.content = content;
        }

        protected onShadowPress() {
            if (this._autoClose)
                this.close();
        }

        protected onOpenTick(clock: Anim.Clock, progress: number, delta: number) {
            let end = (progress >= 1);

            if (this.isClosed)
                progress = 1 - progress;
        
            this.opacity = progress;
            let arrowBorder = this.background.arrowBorder;

            if (arrowBorder === 'right') {
                this.background.transform = Matrix.createTranslate(20 * (1 - progress), 0);
                this.contentBox.transform = Matrix.createTranslate(20 * (1 - progress), 0);
            }
            else if (arrowBorder === 'left') {
                this.background.transform = Matrix.createTranslate(-20 * (1 - progress), 0);
                this.contentBox.transform = Matrix.createTranslate(-20 * (1 - progress), 0);
            }
            else if ((arrowBorder === 'top') || (arrowBorder === 'none')) {
                this.background.transform = Matrix.createTranslate(0, -20 * (1 - progress));
                this.contentBox.transform = Matrix.createTranslate(0, -20 * (1 - progress));
            }
            else if (arrowBorder === 'bottom') {
                this.background.transform = Matrix.createTranslate(0, 20 * (1 - progress));
                this.contentBox.transform = Matrix.createTranslate(0, 20 * (1 - progress));
            }

            if (end) {
                this.openClock.stop();
                this.openClock = undefined;
                if (this.isClosed) {
                    App.removeDialog(this);
                    this.enable();
                }
            }
        }

        protected onPopupSelectionChange(selection: Selection) {
            if (selection.elements.length === 0)
                this.contextBox.hide(true);
            else
                this.contextBox.show();
        }

        protected onStyleChange() {
            this.background.fill = this.getStyleProperty('background');
            this.shadow.drawing.style.backgroundColor = Color.create(this.getStyleProperty('shadow')).getCssRgba();
            let radius = this.getStyleProperty('radius');
            this.background.radius = radius;
            this.contentBox.drawing.style.borderRadius = `${radius}px`;
        }

        open() {
            this.openPosOrElement();
        }

        openAt(posX: number, posY: number) {
            this.openPosOrElement(posX, posY);
        }

        openElement(element: Element, position?: AttachBorder) {
            this.openPosOrElement(element, position);
        }

        private openPosOrElement(posX?, posY?) {
            if (this.isClosed) {
                App.appendDialog(this, this.modal);
                this.isClosed = false;

                this.attachedElement = undefined;
                this.posX = undefined;
                this.posY = undefined;

                if ((typeof (posX) == 'object') && (posX instanceof Element)) {
                    this.attachedElement = posX as Element;
                    if ((posY !== undefined) && (typeof (posY) === 'string'))
                        this.attachedBorder = posY as AttachBorder;
                    let point = this.attachedElement.pointToWindow(
                        new Point(this.attachedElement.layoutWidth, this.attachedElement.layoutHeight / 2));
                    this.posX = point.x;
                    this.posY = point.y;
                }
                else if ((posX !== undefined) && (posY !== undefined)) {
                    this.posX = posX;
                    this.posY = posY;
                }
                else {
                    this.posX = undefined;
                    this.posY = undefined;
                }
                if (this.openClock === undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    // set the initial state
                    this.opacity = 0;
                    // the start of the animation is delayed to the next arrange
                }
                this.invalidateArrange();
            }
        }

        close() {
            if (!this.isClosed) {
                this.isClosed = true;

                this.closed.fire({ target: this });

                this.disable();
                if (this.openClock === undefined) {
                    this.openClock = new Anim.Clock({
                        duration: 1, target: this, speed: 5,
                        ease: new Anim.PowerEase({ mode: 'out' })
                    });
                    this.openClock.timeupdate.connect((e) => this.onOpenTick(e.target, e.progress, e.deltaTick));
                    this.openClock.begin();
                }
            }
        }

        invalidateArrange() {
            super.invalidateArrange();
            this.invalidateLayout();
        }

        invalidateMeasure() {
            super.invalidateMeasure();
            this.invalidateLayout();
        }

        protected measureCore(width: number, height: number) {
            let constraintWidth = Math.max(width - 40, 0);
            let constraintHeight = Math.max(height - 40, 0);

            if ((this._preferredWidth !== undefined) && (this._preferredWidth < constraintWidth))
                constraintWidth = this._preferredWidth;
            if ((this._preferredHeight !== undefined) && (this._preferredHeight < constraintHeight))
                constraintHeight = this._preferredHeight;
        
            this.background.measure(constraintWidth, constraintHeight);
            let size = this.contentBox.measure(constraintWidth, constraintHeight);

            size.width = Math.min(
                this._preferredWidth ? Math.max(size.width, this._preferredWidth) : size.width,	width);
            size.height = Math.min(
                this._preferredHeight ? Math.max(size.height, this._preferredHeight) : size.height,
                height);

            if ((this.posX !== undefined) || (this.attachedElement !== undefined))
                return { width: Math.max(50, size.width), height: Math.max(50, size.height) };
            else
                return { width: Math.max(width, size.width + 40), height: Math.max(height, size.height + 40) };
        }

        protected arrangeCore(width: number, height: number) {
            // the delayed open animation
            if ((this.openClock !== undefined) && !this.openClock.isActive)
                this.openClock.begin();

            let x = 0; let y = 0; let point; let borders; let border; let i;

            this.shadow.arrange(0, 0, width, height);

            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height);


            // handle open center screen
            if (((this.posX === undefined) && (this.attachedElement === undefined)) || (width < 150) || (height < 150)) {
                this.setCenter(width, height);
            }
            // handle open at an element
            else if (this.attachedElement !== undefined) {
                borders = ['right', 'left', 'top', 'bottom', 'center'];
                if (this.attachedBorder !== undefined)
                    borders.unshift(this.attachedBorder);
                for (i = 0; i < borders.length; i++) {
                    border = borders[i];
                    if (border === 'left') {
                        point = this.attachedElement.pointToWindow(
                            new Point(0, this.attachedElement.layoutHeight / 2));
                        if (usedWidth + 10 < point.x) {
                            this.setLeft(point.x, point.y, width, height);
                            break;
                        }
                    }
                    else if (border === 'right') {
                        point = this.attachedElement.pointToWindow(
                            new Point(this.attachedElement.layoutWidth, this.attachedElement.layoutHeight / 2));
                        if (usedWidth + point.x + 10 < width) {
                            this.setRight(point.x, point.y, width, height);
                            break;
                        }
                    }
                    else if (border === 'top') {
                        point = this.attachedElement.pointToWindow(
                            new Point(this.attachedElement.layoutWidth / 2, 0));
                        if (usedHeight + 10 < point.y) {
                            this.setTop(point.x, point.y, width, height);
                            break;
                        }
                    }
                    else if (border === 'bottom') {
                        point = this.attachedElement.pointToWindow(
                            new Point(this.attachedElement.layoutWidth / 2, this.attachedElement.layoutHeight));
                        if (usedHeight + 10 + point.y < height) {
                            this.setBottom(point.x, point.y, width, height);
                            break;
                        }
                    }
                    else {
                        this.setCenter(width, height);
                        break;
                    }
                }
            }
            // handle open at a position
            else {
                borders = ['right', 'left', 'top', 'bottom', 'center'];
                if (this.attachedBorder !== undefined)
                    borders.unshift(this.attachedBorder);
                for (i = 0; i < borders.length; i++) {
                    border = borders[i];
                    if (border === 'left') {
                        if (usedWidth + 10 < this.posX) {
                            this.setLeft(this.posX, this.posY, width, height);
                            break;
                        }
                    }
                    else if (border === 'right') {
                        if (usedWidth + this.posX + 10 < width) {
                            this.setRight(this.posX, this.posY, width, height);
                            break;
                        }
                    }
                    else if (border === 'top') {
                        if (usedHeight + 10 < this.posY) {
                            this.setTop(this.posX, this.posY, width, height);
                            break;
                        }
                    }
                    else if (border === 'bottom') {
                        if (usedHeight + 10 + this.posY < height) {
                            this.setBottom(this.posX, this.posY, width, height);
                            break;
                        }
                    }
                    else {
                        this.setCenter(width, height);
                        break;
                    }
                }
            }
        }

        setRight(x, y, width, height) {
            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width - 40);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height - 40);

            let ofs = Math.max(10, Math.min(30, usedHeight / 2));
            let px = x + 10;
            let py = y - ofs;

            this.background.arrowBorder = 'left';

            if (py + usedHeight > height) {
                py = height - usedHeight;

                let offset = y - py;
                if (offset > usedHeight - 18)
                    offset = usedHeight - 18;
                this.background.arrowOffset = offset;
            }
            else
                this.background.arrowOffset = ofs;
            this.background.arrange(px - 10, py, usedWidth + 10, usedHeight);
            this.contentBox.arrange(px, py, usedWidth, usedHeight);
        }

        setLeft(x, y, width, height) {
            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width - 40);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height - 40);

            let ofs = Math.max(10, Math.min(30, usedHeight / 2));
            let px = x - (10 + usedWidth);
            let py = y - ofs;

            this.background.arrowBorder = 'right';

            if (py + usedHeight > height) {
                py = height - usedHeight;

                let offset = y - py;
                if (offset > usedHeight - 18)
                    offset = usedHeight - 18;
                this.background.arrowOffset = offset;
            }
            else
                this.background.arrowOffset = ofs;
            this.background.arrange(px, py, usedWidth + 10, usedHeight);
            this.contentBox.arrange(px, py, usedWidth, usedHeight);
        }

        setTop(x, y, width, height) {
            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width - 40);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height - 40);

            let py = y - usedHeight;
            let px = x - 30;

            this.background.arrowBorder = 'bottom';

            if (px + usedWidth > width) {
                px = width - usedWidth;

                let offset = x - px;
                if (offset > usedWidth - 18)
                    offset = usedWidth - 18;
                this.background.arrowOffset = offset;
            }
            else if (px < 2) {
                this.background.arrowOffset = x + 2;
                px = 2;
            }
            else
                this.background.arrowOffset = 30;
            this.background.arrange(px, py - 10, usedWidth, usedHeight + 10);
            this.contentBox.arrange(px, py - 10, usedWidth, usedHeight);
        }

        setBottom(x, y, width, height) {
            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width - 40);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height - 40);

            let py = y + 10;
            let px = x - 30;

            this.background.arrowBorder = 'top';

            if (px + usedWidth > width) {
                px = width - usedWidth;

                let offset = x - px;
                if (offset > usedWidth - 18)
                    offset = usedWidth - 18;
                this.background.arrowOffset = offset;
            }
            else if (px < 2) {
                this.background.arrowOffset = x + 2;
                px = 2;
            }
            else
                this.background.arrowOffset = 30;
            this.background.arrange(px, py - 10, usedWidth, usedHeight + 10);
            this.contentBox.arrange(px, py, usedWidth, usedHeight);
        }

        setCenter(width, height) {
            this.background.arrowBorder = 'none';

            let usedWidth = Math.min(
                this._preferredWidth ? Math.max(this.contentBox.measureWidth, this._preferredWidth) : this.contentBox.measureWidth,
                width - 40);
            let usedHeight = Math.min(
                this._preferredHeight ? Math.max(this.contentBox.measureHeight, this._preferredHeight) : this.contentBox.measureHeight,
                height - 40);
            
            let x = (width - usedWidth) / 2;
            let y = (height - usedHeight) / 2;
            this.background.arrange(x, y, usedWidth, usedHeight);
            this.contentBox.arrange(x, y, usedWidth, usedHeight);
        }

        static style: any = {
            background: '#f8f8f8',
            shadow: 'rgba(0,0,0,0.15)',
            radius: 0
        }
    }

    export class PopupBackground extends CanvasElement
    {
        private _radius: number = 8;
        private _fill: Color;
        private _arrowBorder: 'left'|'right'|'top'|'bottom'|'none' = 'left';
        private _arrowOffset: number = 30;
        private readonly arrowSize: number = 10;

        constructor() {
            super();
            this.fill = 'black';
        }

        get arrowBorder(): 'left'|'right'|'top'|'bottom'|'none' {
            return this._arrowBorder;
        }

        set arrowBorder(arrowBorder: 'left'|'right'|'top'|'bottom'|'none') {
            if (this._arrowBorder != arrowBorder) {
                this._arrowBorder = arrowBorder;
                this.invalidateArrange();
            }
        }

        get arrowOffset(): number {
            return this._arrowOffset;
        }

        set arrowOffset(offset: number) {
            if (this._arrowOffset != offset) {
                this._arrowOffset = offset;
                this.invalidateArrange();
            }
        }

        set radius(radius: number) {
            if (this._radius != radius) {
                this._radius = radius;
                this.invalidateArrange();
            }
        }

        set fill(fill: Color | string) {
            if (this._fill != fill) {
                this._fill = Color.create(fill);
                this.invalidateDraw();
            }
        }

        private genPath(width, height, radius, arrowBorder, arrowSize, arrowOffset) {
            let v1; let v2;
            if (arrowBorder == 'none') {
                v1 = width - radius;
                v2 = height - radius;
                return 'M' + radius + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
            }
            else if (arrowBorder == 'left') {
                v1 = width - this._radius;
                v2 = height - this._radius;
                return 'M' + (radius + arrowSize) + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + (radius + arrowSize) + ',' + height + ' Q' + arrowSize + ',' + height + ' ' + arrowSize + ',' + v2 + ' L' + arrowSize + ',' + (arrowOffset + arrowSize) + ' L0,' + arrowOffset + ' L' + arrowSize + ',' + (arrowOffset - arrowSize) + ' L' + arrowSize + ',' + radius + ' Q' + arrowSize + ',0 ' + (radius + arrowSize) + ',0 z';
            }
            else if (arrowBorder == 'right') {
                v1 = width - (this._radius + arrowSize);
                v2 = height - this._radius;
                return 'M' + radius + ',0 L' + v1 + ',0 Q' + (width - arrowSize) + ',0 ' + (width - arrowSize) + ',' + radius + ' L' + (width - arrowSize) + ',' + (arrowOffset - arrowSize) + ' L' + width + ',' + arrowOffset + ' L' + (width - arrowSize) + ',' + (arrowOffset + arrowSize) + ' L ' + (width - arrowSize) + ',' + v2 + ' Q' + (width - arrowSize) + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
            }
            else if (arrowBorder == 'top') {
                v1 = width - this._radius;
                v2 = height - this._radius;
                return 'M' + radius + ',' + arrowSize + ' L' + (arrowOffset - arrowSize) + ',' + arrowSize + ' L' + arrowOffset + ',0 L' + (arrowOffset + arrowSize) + ',' + arrowSize + ' L' + v1 + ',' + arrowSize + ' Q' + width + ',' + arrowSize + ' ' + width + ',' + (arrowSize + radius) + ' L' + width + ',' + v2 + ' Q' + width + ',' + height + ' ' + v1 + ',' + height + ' L' + radius + ',' + height + ' Q0,' + height + ' 0,' + v2 + ' L0,' + (arrowSize + radius) + ' Q0,' + arrowSize + ' ' + radius + ',' + arrowSize + ' z';
            }
            else if (arrowBorder == 'bottom') {
                v1 = width - this._radius;
                v2 = height - (this._radius + arrowSize);
                return 'M' + radius + ',0 L' + v1 + ',0 Q' + width + ',0 ' + width + ',' + radius + ' L' + width + ',' + v2 + ' Q' + width + ',' + (height - arrowSize) + ' ' + v1 + ',' + (height - arrowSize) + ' L ' + (arrowOffset + arrowSize) + ',' + (height - arrowSize) + ' L' + arrowOffset + ',' + height + ' L' + (arrowOffset - arrowSize) + ',' + (height - arrowSize) + ' L' + radius + ',' + (height - arrowSize) + ' Q0,' + (height - arrowSize) + ' 0,' + v2 + ' L0,' + radius + ' Q0,0 ' + radius + ',0 z';
            }
        }

        updateCanvas(ctx) {
            let width = this.layoutWidth;
            let height = this.layoutHeight;
        
            if (this.arrowBorder == 'none') {
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.beginPath();
                ctx.roundRect(0, 0, width, height, this._radius, this._radius, this._radius, this._radius, false);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.beginPath();
                ctx.roundRect(1, 1, width - 2, height - 2, this._radius, this._radius, this._radius, this._radius, false);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = this._fill.getCssRgba();
                ctx.beginPath();
                ctx.roundRect(2, 2, width - 4, height - 4, this._radius, this._radius, this._radius, this._radius, false);
                ctx.closePath();
                ctx.fill();
            }
            else {
                ctx.fillStyle = 'rgba(0,0,0,0.1)';
                ctx.svgPath(this.genPath(width, height, this._radius, this.arrowBorder, this.arrowSize, this._arrowOffset));
                ctx.fill();
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.translate(1, 1);
                ctx.svgPath(this.genPath(width - 2, height - 2, Math.max(0, this._radius - 1), this.arrowBorder, this.arrowSize - 1, this._arrowOffset - 1));
                ctx.fill();
                ctx.restore();
                ctx.fillStyle = this._fill.getCssRgba();
                ctx.translate(2, 2);
                ctx.svgPath(this.genPath(width - 4, height - 4, Math.max(0, this._radius - 2), this.arrowBorder, this.arrowSize - 1, this._arrowOffset - 2));
                ctx.fill();
            }
        }
    }

    export interface MenuPopupInit extends PopupInit {
    }

    export class MenuPopup extends Popup implements MenuPopupInit
    {
        constructor(init?: MenuPopupInit) {
            super(init);
        }
    }

    export class MenuPopupSeparator extends Separator
    {
        constructor() {
            super();
        }
    }
}

