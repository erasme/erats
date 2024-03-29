namespace Ui {

    export interface IconInit extends ElementInit {
        icon?: string;
        fill?: string | Color;
        path?: string;
    }

    export class Icon extends Element {
        static baseUrl = '';
        static forceExternal: boolean = false;
        private static loadingReqs: Core.HashTable<Core.HttpRequest> = {};
        private static iconsCache: Core.HashTable<string> = {};
        private _icon = '';
        private _fill?: Color | string;
        readonly loadingfailed = new Core.Events<{ target: Icon }>();
        set onloadingfailed(value: ({ target: Icon }) => void) { this.loadingfailed.connect(value) }

        constructor(init?: IconInit) {
            super(init);
            if (init) {
                if (init.icon !== undefined)
                    this.icon = init.icon;
                if (init.fill !== undefined)
                    this.fill = init.fill;
                if (init.path !== undefined)
                    this.path = init.path;
            }
        }

        get fill(): Color | string {
            if (this._fill === undefined)
                return Color.create(this.getStyleProperty('color'));
            else
                return this._fill;
        }

        set fill(value: Color | string) {
            this._fill = value;
            this.drawing.style.fill = Color.create(this.fill).getCssRgba();
        }

        set path(value: string) {
            let drawing = <HTMLDivElement>this.drawing;
            drawing.innerHTML =
                `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="${value}"/>
    </svg>`;
            this.normalize();
        }

        get icon(): string {
            return this._icon;
        }

        set icon(value: string) {
            if (this._icon == value)
                return;
            this._icon = value;
            if (Icon.forceExternal)
                this.loadIcon(value);
            else {
                let path = Icon.getPath(value);
                if (path == undefined)
                    this.loadIcon(value);
                else
                    this.path = path;
            }
        }

        protected onStyleChange() {
            this.drawing.style.fill = Color.create(this.fill).getCssRgba();
        }

        protected onLoadingFailed() {
            this.loadingfailed.fire({ target: this });
        }

        private async loadIcon(value: string) {
            if (!(value.indexOf('.svg') + 4 == value.length && value.length > 4))
                value = `${value}.svg`;
            let drawing = <HTMLDivElement>this.drawing;
            if (Ui.Icon.iconsCache[value] != undefined) {
                drawing.innerHTML = Ui.Icon.iconsCache[value];
            }
            else {
                let req: Core.HttpRequest;
                if (Ui.Icon.loadingReqs[value] != undefined) {
                    req = Ui.Icon.loadingReqs[value];
                    await req.waitAsync();
                }
                else {
                    req = new Core.HttpRequest().assign({
                        url: `${Icon.baseUrl}${value}`
                    });
                    Ui.Icon.loadingReqs[value] = req;
                    await req.sendAsync();
                    delete (Ui.Icon.loadingReqs[value]);
                }
                if (req.status == 200) {
                    drawing.innerHTML = req.responseText;
                    this.normalize();
                    Ui.Icon.iconsCache[value] = this.drawing.innerHTML;
                }
                else {
                    drawing.innerHTML = '';
                    this.onLoadingFailed();
                }
            }
        }

        private normalize() {
            let child = (<HTMLDivElement>this.drawing).children.item(0);
            if (child instanceof SVGSVGElement) {
                let svgWidth = child.getAttribute('width');
                let svgHeight = child.getAttribute('height');
                let svgViewBox = child.getAttribute('viewBox');
                if (svgViewBox == null) {
                    if (svgWidth != null && svgHeight != null)
                        svgViewBox = `0 0 ${parseInt(svgWidth)} ${parseInt(svgHeight)}`;
                    else
                        svgViewBox = '0 0 48 48';
                    child.setAttribute('viewBox', svgViewBox);
                }
                child.style.width = '100%';
                child.style.height = '100%';
                child.style.position = 'absolute';
            }
        }

        static style: any = {
            color: '#444444'
        }

        ///
        // List of all the registered Icons which can be accessible by their names
        // 'check', 'home', 'search' ...
        //
        static icons: object = {};

        static initialize() {
            this.register('check', 'M18 32.3L9.7 24l-2.8 2.8L18 38 42 14l-2.8-2.8z');
            this.register('home', 'm24 6-20 18 6 0 0 16 10 0 0-12 8 0 0 12 10 0 0-16 6 0z');
            this.register('search', 'M16.6 2.8C9.3 2.8 3.3 8.7 3.3 16 3.3 23.3 9.3 29.3 16.6 29.3 19.2 29.3 21.7 28.5 23.8 27.1L26.5 29.8C26 31.2 26.4 32.9 27.5 34L37 43.5C38.5 45.1 41.1 45.1 42.6 43.5L44.3 41.8C45.9 40.3 45.9 37.8 44.3 36.2L34.8 26.7C33.7 25.6 32.3 25.3 30.9 25.7L28 22.7C29.2 20.8 29.8 18.5 29.8 16 29.8 8.7 23.9 2.8 16.6 2.8zM16.6 6.8C21.7 6.8 25.8 10.9 25.8 16 25.8 21.2 21.7 25.3 16.6 25.3 11.4 25.3 7.3 21.2 7.3 16 7.3 10.9 11.4 6.8 16.6 6.8z');
            this.register('close', 'M38 12.82L35.18 10 24 21.18 12.82 10 10 12.82 21.18 24 10 35.18 12.82 38 24 26.82 35.18 38 38 35.18 26.82 24z');
            this.register('backarrow', 'M40 22H15.86l11.18-11.18L24 8l-16 16 16 16 2.82-2.82L15.66 26H40v-4z');
            this.register('arrowleft', 'm30 4 5 5-15 15 15 15-5 5-20-20z');
            this.register('arrowright', 'm18 4-5 5 15 15-15 15 5 5 20-20z');
            this.register('arrowtop', 'm44 31-5 5-15-15-15 15-5-5 20-20z');
            this.register('arrowbottom', 'm4 16 5-5 15 15 15-15 5 5-20 20z');
            this.register('refresh', 'M24 8C15.2 8 8 15.2 8 24 8 32.8 15.2 40 24 40 31.5 40 37.7 34.9 39.5 28l-4.2 0C33.7 32.7 29.2 36 24 36 17.4 36 12 30.6 12 24c0-6.6 5.4-12 12-12 3.3 0 6.3 1.4 8.4 3.6L26 22 40 22 40 8 35.3 12.7C32.4 9.8 28.4 8 24 8Z');
            this.register('deny', 'M24.4 4.6C13.8 4.6 5.3 13.1 5.3 23.6 5.3 34.2 13.8 42.7 24.4 42.7 34.9 42.7 43.4 34.2 43.4 23.6 43.4 13.1 34.9 4.6 24.4 4.6zM12.9 20.5L36.4 20.5 36.4 27.8 12.9 27.8 12.9 20.5z');
            this.register('warning', 'M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z');
            this.register('trash', 'm12 38 c0 2 1.8 4 4 4l16 0c2.2 0 4-1.8 4-4L36 14 11.6 14ZM38 8 31 8 29 6 19 6 17 8 10 8 10 12 38 12Z');
            this.register('new', 'M38 6H10c-2.22 0-4 1.8-4 4v28c0 2.2 2.78 4 4 4h28c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4zm-4 20h-8v8h-4v-8H14v-4h8V14h4v8h8v4z');
            this.register('star', 'M24 34.54L36.36 42l-3.28-14.06L44 18.48l-14.38-1.22L24 4 18.38 17.26 4 18.48l10.92 9.46L11.64 42z');
            this.register('exit', 'M20.18 31.18L23 34l10-10-10-10-2.82 2.82L25.34 22H6v4h19.34l-5.16 5.18zM38 6H10c-2.22 0-4 1.8-4 4v4h4V10h28v28H10v-8H6v8c0 2.2 1.78 4 4 4h28c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4z');
            this.register('loading', 'M24 2.5C22.1 2.5 20.5 4.1 20.5 6 20.5 7.9 22.1 9.5 24 9.5 25.9 9.5 27.5 7.9 27.5 6 27.5 4.1 25.9 2.5 24 2.5zM11.3 7.8C10.4 7.8 9.5 8.1 8.8 8.8 7.5 10.2 7.5 12.4 8.8 13.8 10.2 15.1 12.4 15.1 13.8 13.8 15.1 12.4 15.1 10.2 13.8 8.8 13.1 8.1 12.2 7.8 11.3 7.8zM36.7 7.8C35.8 7.8 34.9 8.1 34.3 8.8 32.9 10.2 32.9 12.4 34.3 13.8 35.6 15.1 37.8 15.1 39.2 13.8 40.5 12.4 40.5 10.2 39.2 8.8 38.5 8.1 37.6 7.8 36.7 7.8zM6 20.5C4.1 20.5 2.5 22.1 2.5 24 2.5 25.9 4.1 27.5 6 27.5 7.9 27.5 9.5 25.9 9.5 24 9.5 22.1 7.9 20.5 6 20.5zM42 20.5C40.1 20.5 38.5 22.1 38.5 24 38.5 25.9 40.1 27.5 42 27.5 43.9 27.5 45.5 25.9 45.5 24 45.5 22.1 43.9 20.5 42 20.5zM11.3 33.3C10.4 33.3 9.5 33.6 8.8 34.3 7.5 35.6 7.5 37.8 8.8 39.2 10.2 40.5 12.4 40.5 13.8 39.2 15.1 37.8 15.1 35.6 13.8 34.3 13.1 33.6 12.2 33.3 11.3 33.3zM36.7 33.3C35.8 33.3 34.9 33.6 34.3 34.3 32.9 35.6 32.9 37.8 34.3 39.2 35.6 40.5 37.8 40.5 39.2 39.2 40.5 37.8 40.5 35.6 39.2 34.3 38.5 33.6 37.6 33.3 36.7 33.3zM24 38.5C22.1 38.5 20.5 40.1 20.5 42 20.5 43.9 22.1 45.5 24 45.5 25.9 45.5 27.5 43.9 27.5 42 27.5 40.1 25.9 38.5 24 38.5z');
            this.register('edit', 'M6 34.5V42h7.5L35.62 19.88l-7.5-7.5L6 35.5zM41.42 14.08c.78-.78.78-2.04 0-2.82l-4.68-4.68c-.78-.78-2.04-.78-2.82 0l-3.66 3.66 7.5 7.5 3.66-3.66z');
            this.register('upload', 'M18 32h12v-12h8l-14-14-14 14h8zm-8 18h28v4H10z');
            this.register('lock', 'M24 2C18.5 2 14 6.5 14 12l0 4-2 0c-2.2 0-4 1.8-4 4l0 20c0 2.2 1.8 4 4 4l24 0c2.2 0 4-1.8 4-4 0-10.5 0-11.2 0-20 0-2.2-1.8-4-4-4l-2 0 0-4C34 6.5 29.5 2 24 2Zm0 3.8C27.4 5.8 30.2 8.6 30.2 12l0 4-12.4 0 0-4C17.8 8.6 20.6 5.8 24 5.8ZM24 26c2.2 0 4 1.8 4 4 0 2.2-1.8 4-4 4-2.2 0-4-1.8-4-4 0-2.2 1.8-4 4-4z');
            this.register('savecloud', 'M38.7 20.08C37.34 13.18 31.28 8 24 8 18.22 8 13.2 11.28 10.7 16.08 2.68 16.72 0 21.82 0 28c0 6.62 5.28 12 12 12h26c5.52 0 10-4.48 10-10 0-5.28-4.1-9.56-9.3-9.92zM28 26v8h-8v-8H14l10-10 10 10h-6z');
            this.register('calendar', 'M34 24h-10v10h10v-10zM32 2v4H16V2H12v4H10c-2.22 0-3.98 1.8-3.98 4L6 38c0 2.2 1.78 4 4 4h28c2.2 0 2-1.8 4-4V10c0-2.2-1.8-4-4-4h-2V2h-4zm6 36H10V16h28v22z');
            this.register('phone', 'M13.2 21.6c2.9 5.7 7.5 10.3 13.2 13.2l4.4-4.4c.5-.5 1.3-.7 2-.5 2.2 .7 4.7 1.1 7.1 1.1 1.1 0 2 .9 2 2V40c0 1.1-.9 2-2 2-18.8 0-34-15.2-34-34 0-1.1 .9-2 2-2h7c1.1 0 2 .9 2 2 0 2.5 .4 4.9 1.1 7.1 .2 .7 .1 1.5-.5 2l-4.4 4.4z');
            this.register('mail', 'M40 8H8c-2.2 0-4 1.8-4 4L4 36c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4zm0 8l-16 10-16-10V12l16 10 16-10v4z');
            this.register('plus', 'M38 26h-12v12h-4v-12H10v-4h12V10h4v12h12v4z');
            this.register('eye', 'M24.2 10.4C11.7 10.4 2 23.6 1.6 24.2L.9 25.1 1.6 26.1C2 26.7 11.7 39.9 24.2 39.9 36.6 39.9 46.3 26.7 46.7 26.1L47.4 25.1 46.7 24.2C46.3 23.6 36.6 10.4 24.2 10.4zM24.2 13.7C33.1 13.7 40.9 22.2 43.3 25.1 41 28 33.1 36.6 24.2 36.6 15.2 36.6 7.4 28 5 25.1 7.4 22.2 15.2 13.7 24.2 13.7zM24.8 15.2C19.4 15.2 15 19.6 15 24.9 15 30.3 19.4 34.7 24.8 34.7 30.2 34.7 34.6 30.3 34.6 24.9 34.6 23.1 34.1 21.5 33.3 20 33.1 22.1 31.4 23.8 29.3 23.8 27 23.8 25.3 22 25.3 19.8 25.3 17.9 26.7 16.3 28.5 15.9 27.4 15.5 26.1 15.2 24.8 15.2z');
            this.register('map', 'M41 6l-.3 .1L30 10.2 18 6 6.7 9.8c-.4 .1-.7 .5-.7 1V41c0 .6 .4 1 1 1l.3-.1L18 37.8l12 4.2 11.3-3.8c.4-.1 .7-.5 .7-1V7c0-.6-.4-1-1-1zM30 38l-12-4.2V10l12 4.2V38z');
            this.register('sortarrow', 'm4 32 40 0-20-20z');
            this.register('dragcopy', 'M24 .2C10.8 .2 .2 10.8 .2 24 .2 37.2 10.8 47.8 24 47.8 37.2 47.8 47.8 37.2 47.8 24 47.8 10.8 37.2 .2 24 .2zm-4.5 5.9 8.9 0 0 13.5 13.5 0 0 8.9-13.5 0 0 13.5-8.9 0 0-13.6-13.5 .1 0-8.9 13.5 0z');
            this.register('dragmove', 'M24 .2C10.8 .2 .2 10.8 .2 24 .2 37.2 10.8 47.8 24 47.8 37.2 47.8 47.8 37.2 47.8 24 47.8 10.8 37.2 .2 24 .2zM26.6 8.6L42 24 26.6 39.4 21.4 34.3 26.6 29.2 6 29.2 6 18.8 26.6 18.8 21.4 13.8 26.6 8.6z');
            this.register('draglink', 'M24 .2C10.8 .2 .2 10.8 .2 24 .2 37.2 10.8 47.8 24 47.8 37.2 47.8 47.8 37.2 47.8 24 47.8 10.8 37.2 .2 24 .2zM34.9 13.9C40.7 13.9 44.3 18.3 44.3 23.9 44.3 29.6 40.8 34.1 34.8 34.1 30.2 34.1 26.9 31.1 24 27.8 21 31.1 18.1 34.1 13.3 34.1 7.4 34.1 3.7 29.7 3.7 24 3.7 18.4 7.2 13.9 13.1 13.9 17.9 13.9 21.1 17.2 24 20.6 26.9 17.2 30.1 13.9 34.9 13.9zM34.8 19.3C31.9 19.3 29.1 22.1 27.2 24.1 29.2 26.3 31.8 28.7 34.9 28.7 37.7 28.7 39.3 26.7 39.3 24.1 39.3 21.4 37.6 19.3 34.8 19.3zM13.1 19.3C10.4 19.3 8.8 21.6 8.8 24.1 8.8 26.8 10.5 28.7 13.2 28.7 16.1 28.7 19 26.1 20.8 24.1 18.9 22.2 15.9 19.3 13.1 19.3z');
            this.register('dragchoose', 'M24 .2C10.8 .2 .2 10.8 .2 24 .2 37.2 10.8 47.8 24 47.8 37.2 47.8 47.8 37.2 47.8 24 47.8 10.8 37.2 .2 24 .2zM23.6 3.3L25.9 3.3C33.1 3.3 37.8 8 37.8 14.7 37.8 22.1 33.3 24 29.7 25.6 27.7 26.6 26 27.4 26 29.8 26 31.4 26.4 32.3 26.4 32.8 26.4 33.2 26.2 33.3 25.8 33.3L19.7 33.3C19.3 33.3 19.1 33.1 19 32.8 18.8 31.6 18.6 30.2 18.6 28.9 18.6 23 22.8 21.3 26.3 19.5 28.5 18.4 30.4 17.3 30.4 14.7 30.4 12.1 28.4 10.1 25.9 10.1L23.6 10.1C21.8 10.1 20.2 11.1 19 13.8 18.9 14.2 18.7 14.3 18.5 14.3 18.2 14.3 18 14.1 17.8 14L12.6 11.3C12.4 11.2 12.2 11.1 12.2 10.9 12.2 10.5 12.9 9.5 13.4 8.5 15.4 5.5 18.3 3.3 23.6 3.3zM23.4 36.4C25.7 36.4 27.7 38.4 27.7 40.7 27.7 43 25.7 44.9 23.4 44.9 21.1 44.9 19.1 43 19.1 40.7 19.1 38.4 21.1 36.4 23.4 36.4z');
            this.register('dragrun', 'M24 2.4C12.1 2.4 2.4 12.1 2.4 24 2.4 36 12.1 45.6 24 45.6 36 45.6 45.6 36 45.6 24 45.6 12.1 36 2.4 24 2.4zM23.9 7.8C24 7.8 24 7.8 24 7.8 27 7.8 29.8 8.6 32.2 10L30.4 13.1C32.3 14.2 33.8 15.7 34.9 17.6L38 15.8C39.4 18.2 40.3 21 40.3 24 40.3 24 40.3 24 40.3 24.1L36.7 24C36.7 26.3 36.1 28.4 35 30.3L38.1 32.1C36.7 34.6 34.6 36.7 32.1 38.1L30.3 35C28.4 36.1 26.3 36.7 24 36.7L24.1 40.3C24 40.3 24 40.3 24 40.3 21 40.3 18.2 39.4 15.8 38L17.6 34.9C15.7 33.8 14.2 32.3 13.1 30.4L10 32.2C8.6 29.8 7.8 27 7.8 24 7.8 24 7.8 24 7.8 23.9L11.3 24C11.3 21.7 12 19.6 13 17.7L9.9 15.9C11.3 13.4 13.4 11.3 15.9 9.9L17.7 13C19.6 12 21.7 11.3 24 11.3L23.9 7.8zM24 18.8C21.1 18.8 18.8 21.1 18.8 24 18.8 26.9 21.1 29.2 24 29.2 26.9 29.2 29.2 26.9 29.2 24 29.2 21.1 26.9 18.8 24 18.8z');
            this.register('dragplay', 'M24 .2C10.8 .2 .2 10.8 .2 24 .2 37.2 10.8 47.8 24 47.8 37.2 47.8 47.8 37.2 47.8 24 47.8 10.8 37.2 .2 24 .2zM13.8 7.8L42.2 24 13.8 40.3 13.8 7.8z');
            this.register('burger', 'M24 1.47C20.77 1.48 18.16 4.17 18.16 7.49 18.16 10.82 20.77 13.52 24 13.52 27.23 13.52 29.84 10.82 29.84 7.49 29.84 4.17 27.23 1.48 24 1.47Zm0 16.42c-3.23 0-5.84 2.7-5.84 6.02 0 3.33 2.61 6.02 5.84 6.02 3.23 0 5.84-2.7 5.84-6.02C29.84 20.59 27.23 17.9 24 17.9Zm0 16.42c-3.23 0-5.84 2.7-5.84 6.02 0 3.33 2.61 6.02 5.84 6.02 3.23 0 5.84-2.7 5.84-6.02C29.84 37.01 27.23 34.32 24 34.32Z');
            this.register('help', 'M24 4C6.2 4-2.7 25.5 9.9 38.1 22.5 50.7 44 41.8 44 24 44 13 35 4 24 4zM23.5 8C31.9 7.8 40 14.2 40 24 40 32.8 32.8 40 24 40 9.7 40 2.6 22.8 12.7 12.7 15.8 9.5 19.7 8.1 23.5 8zM24 12C19.6 12 16 15.6 16 20L20 20C20 14.7 28 14.7 28 20 28 24 22 23.5 22 30L26 30C26 25.5 32 25 32 20 32 15.6 28.4 12 24 12zM24 32.2A2.9 2.9 0 0 0 21.1 35.1 2.9 2.9 0 0 0 24 38 2.9 2.9 0 0 0 26.9 35.1 2.9 2.9 0 0 0 24 32.2z');
        }

        static getPath(icon) {
            return Icon.icons[icon];
        }

        static getNames() {
            let names = new Array<string>();
            for (let tmp in Icon.icons)
                names.push(tmp);
            return names;
        }

        static register(iconName, iconPath) {
            if (Icon.icons[iconName] !== undefined)
                throw ('Icon \'' + iconName + '\' is already registered. To change it, use override');
            Icon.icons[iconName] = iconPath;
        }

        static override(iconName, iconPath) {
            Icon.icons[iconName] = iconPath;
        }

        static parse(icon) {
            let ico = new Icon();
            ico.icon = icon;
            return ico;
        }

        static drawIcon(ctx, icon, size, fill) {
            ctx.save();
            let scale = size / 48;
            ctx.scale(scale, scale);
            ctx.svgPath(Icon.getPath(icon));
            ctx.fillStyle = fill;
            ctx.fill();
            ctx.restore();
        }

        static drawIconAndBadge(ctx, icon, size, fill, badgeText, badgeSize, badgeFill, textFill) {
            ctx.save();
            let scale = size / 48;
            badgeSize /= scale;
            let textHeight = badgeSize * 0.75;
            ctx.font = 'bold ' + textHeight + 'px sans-serif';
            let textSize = ctx.measureText(badgeText);
            let textWidth = textSize.width;
            let badgeWidth = Math.max(badgeSize, textWidth * 1.25);
            ctx.scale(scale, scale);

            ctx.save();

            ctx.beginPath();
            ctx.rect(0, 0, 48, 48);
            ctx.roundRect(1, 48 - 5 - badgeSize, badgeWidth + 4, badgeSize + 4, badgeSize / 2, badgeSize / 2, badgeSize / 2, badgeSize / 2, true);
            ctx.closePath();
            ctx.clip();

            ctx.svgPath(Icon.getPath(icon));
            ctx.fillStyle = fill;
            ctx.fill();

            ctx.restore();

            ctx.fillStyle = badgeFill;
            ctx.beginPath();
            ctx.roundRect(3, 48 - 3 - badgeSize, badgeWidth, badgeSize, badgeSize / 2, badgeSize / 2, badgeSize / 2, badgeSize / 2);
            ctx.closePath();
            ctx.fill();

            ctx.textBaseline = 'middle';
            ctx.fillStyle = textFill;
            ctx.fillText(badgeText, 3 + ((badgeWidth - textWidth) / 2), 48 - (3 + (badgeSize / 2)));

            ctx.restore();
        }
    }
}

Ui.Icon.initialize();