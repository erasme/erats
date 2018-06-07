namespace Ui {
    export class RichTextButton extends ToggleButton {
        style = {
            borderWidth: 0,
            background: 'rgba(255,255,255,0)',
            activeBackground: 'rgba(255,255,255,0)'
        }
    }

    export class RichTextEditor extends LBox {
        private _contentEditable: ContentEditable;

        constructor() {
            super();
            let boldButton = new RichTextButton().assign({
                icon: 'format-bold', focusable: false,
                ontoggled: () => document.execCommand('bold', false, null),
                onuntoggled: () => document.execCommand('bold', false, null)
            });
            let italicButton = new RichTextButton().assign({
                icon: 'format-italic', focusable: false,
                ontoggled: () => document.execCommand('italic', false, null),
                onuntoggled: () => document.execCommand('italic', false, null)
            });
            let alignLeftButton = new RichTextButton().assign({
                icon: 'format-align-left', focusable: false,
                ontoggled: () => document.execCommand('justifyLeft', false, null),
                onuntoggled: () => document.execCommand('justifyLeft', false, null)
            });
            let alignCenterButton = new RichTextButton().assign({
                icon: 'format-align-center', focusable: false,
                ontoggled: () => document.execCommand('justifyCenter', false, null),
                onuntoggled: () => document.execCommand('justifyCenter', false, null)
            });
            let alignRightButton = new RichTextButton().assign({
                icon: 'format-align-right', focusable: false,
                ontoggled: () => document.execCommand('justifyRight', false, null),
                onuntoggled: () => document.execCommand('justifyRight', false, null)
            });


            let controls = new Ui.HBox().assign({
                uniform: true, isDisabled: false,
                content: [
                    boldButton,
                    italicButton,
                    alignLeftButton,
                    alignCenterButton,
                    alignRightButton
                ]
            });

            let bg = new Ui.TextBgGraphic();

            this._contentEditable = new Ui.ContentEditable().assign({
                margin: 10, interLine: 1.2, fontSize: 16,
                html: '', resizable: true,
                onfocused: () => bg.hasFocus = true,
                onblurred: () => bg.hasFocus = false,
                onanchorchanged: () => {
                    boldButton.isActive = document.queryCommandState('bold');
                    italicButton.isActive = document.queryCommandState('italic');
                    alignLeftButton.isActive = document.queryCommandState('justifyLeft');
                    alignCenterButton.isActive = document.queryCommandState('justifyCenter');
                    alignRightButton.isActive = document.queryCommandState('justifyRight');
                },
                onselectionentered: () => controls.enable(),
                onselectionleaved: () => controls.disable(),
                selectable: true
            });

            this.content = [
                bg,
                new Ui.VBox().assign({
                    margin: 1,
                    content: [
                        new Ui.LBox().assign({
                            content: [
                                new Ui.Rectangle().assign({ fill: 'white', opacity: 0.6 }),
                                controls
                            ]
                        }),
                        this._contentEditable
                    ]
                })
            ];
        }

        get html(): string {
            return this._contentEditable.html;
        }

        set html(html: string) {
            this._contentEditable.html = html;
        }
    
        get text(): string {
            return this._contentEditable.text;
        }

        set text(text: string) {
            this._contentEditable.text = text;
        }
    
        get textAlign(): string {
            return this._contentEditable.textAlign;
        }

        set textAlign(textAlign: string) {
            this._contentEditable.textAlign = textAlign;
        }

        get fontSize(): number {
            return this._contentEditable.fontSize;
        }
    
        set fontSize(fontSize: number) {
            this._contentEditable.fontSize = fontSize;
        }
    
        get fontFamily(): string {
            return this._contentEditable.fontFamily;
        }
    
        set fontFamily(fontFamily: string) {
            this._contentEditable.fontFamily = fontFamily;
        }
    
        get fontWeight() {
            return this._contentEditable.fontWeight;
        }
    
        set fontWeight(fontWeight) {
            this._contentEditable.fontWeight = fontWeight;
        }
    
        get interLine(): number {
            return this._contentEditable.interLine;
        }

        set interLine(interLine: number) {
            this._contentEditable.interLine = interLine;
        }

        get wordWrap(): string {
            return this._contentEditable.wordWrap;
        }

        set wordWrap(wordWrap: string) {
            this._contentEditable.wordWrap = wordWrap;
        }

        get whiteSpace(): string {
            return this._contentEditable.whiteSpace;
        }

        set whiteSpace(whiteSpace: string) {
            this._contentEditable.whiteSpace = whiteSpace;
        }
    
        get color(): Color | string {
            return this._contentEditable.color;
        }

        set color(color: Color | string) {
            this._contentEditable.color = color;
        }
    }
}

Ui.Icon.register('format-bold', "M31.2 21.58c1.93-1.35 3.3-3.53 3.3-5.58 0-4.51-3.49-8-8-8h-12.5v28h14.08c4.19 0 7.42-3.4 7.42-7.58 0-3.04-1.73-5.63-4.3-6.84zm-11.2-8.58h6c1.66 0 3 1.34 3 3s-1.34 3-3 3h-6v-6zm7 18h-7v-6h7c1.66 0 3 1.34 3 3s-1.34 3-3 3z");
Ui.Icon.register('format-italic', "M20 8v6h4.43l-6.86 16h-5.57v6h16v-6h-4.43l6.86-16h5.57v-6z");
Ui.Icon.register('format-align-left', "M30 30h-24v4h24v-4zm0-16h-24v4h24v-4zm-24 12h36v-4h-36v4zm0 16h36v-4h-36v4zm0-36v4h36v-4h-36z");
Ui.Icon.register('format-align-right', "M6 42h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-8h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-12v4h36v-4h-36z");
Ui.Icon.register('format-align-center', "M14 30v4h20v-4h-20zm-8 12h36v-4h-36v4zm0-16h36v-4h-36v4zm8-12v4h20v-4h-20zm-8-8v4h36v-4h-36z");
