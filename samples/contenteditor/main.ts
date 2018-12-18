/// <reference path="../../era/era.d.ts" />
/*
Ui.Icon.register('format-bold', "M31.2 21.58c1.93-1.35 3.3-3.53 3.3-5.58 0-4.51-3.49-8-8-8h-12.5v28h14.08c4.19 0 7.42-3.4 7.42-7.58 0-3.04-1.73-5.63-4.3-6.84zm-11.2-8.58h6c1.66 0 3 1.34 3 3s-1.34 3-3 3h-6v-6zm7 18h-7v-6h7c1.66 0 3 1.34 3 3s-1.34 3-3 3z");
Ui.Icon.register('format-italic', "M20 8v6h4.43l-6.86 16h-5.57v6h16v-6h-4.43l6.86-16h5.57v-6z");
Ui.Icon.register('format-align-left', "M30 30h-24v4h24v-4zm0-16h-24v4h24v-4zm-24 12h36v-4h-36v4zm0 16h36v-4h-36v4zm0-36v4h36v-4h-36z");
Ui.Icon.register('format-align-right', "M6 42h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-8h36v-4h-36v4zm12-8h24v-4h-24v4zm-12-12v4h36v-4h-36z");
Ui.Icon.register('format-align-center', "M14 30v4h20v-4h-20zm-8 12h36v-4h-36v4zm0-16h36v-4h-36v4zm8-12v4h20v-4h-20zm-8-8v4h36v-4h-36z");
*/
class App extends Ui.App {
    constructor() {
        super();
        let scroll = new Ui.ScrollingArea();
        this.content = scroll;

        let vbox = new Ui.VBox().assign({ margin: 50, spacing: 20 });
        scroll.content = vbox;

        let boldButton = new Ui.ToggleButton().assign({
            icon: 'format-bold', focusable: false,
            ontoggled: () => document.execCommand('bold', false, undefined),
            onuntoggled: () => document.execCommand('bold', false, undefined)
        });
        let italicButton = new Ui.ToggleButton().assign({
            icon: 'format-italic', focusable: false,
            ontoggled: () => document.execCommand('italic', false, undefined),
            onuntoggled: () => document.execCommand('italic', false, undefined)
        });
        let alignLeftButton = new Ui.ToggleButton().assign({
            icon: 'format-align-left', focusable: false,
            ontoggled: () => document.execCommand('justifyLeft', false, undefined),
            onuntoggled: () => document.execCommand('justifyLeft', false, undefined)
        });
        let alignCenterButton = new Ui.ToggleButton().assign({
            icon: 'format-align-center', focusable: false,
            ontoggled: () => document.execCommand('justifyCenter', false, undefined),
            onuntoggled: () => document.execCommand('justifyCenter', false, undefined)
        });
        let alignRightButton = new Ui.ToggleButton().assign({
            icon: 'format-align-right', focusable: false,
            ontoggled: () => document.execCommand('justifyRight', false, undefined),
            onuntoggled: () => document.execCommand('justifyRight', false, undefined)
        });
        let listButton = new Ui.ToggleButton().assign({
            focusable: false,
            icon: 'eye'
        });

        let controls = new Ui.HBox().assign({
            uniform: true, isDisabled: false,
            content: [
                boldButton,
                italicButton,
                alignLeftButton,
                alignCenterButton,
                alignRightButton//,
                //listButton
            ]
        });

        let bg = new Ui.TextBgGraphic();

        let html = new Ui.ContentEditable().assign({
            width: 400, margin: 10, interLine: 1.2, fontSize: 20,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long',
            onfocused: () => bg.hasFocus = true,
            onblurred: () => bg.hasFocus = false,
            onanchorchanged: () => {
                boldButton.isActive = document.queryCommandState('bold');
                italicButton.isActive = document.queryCommandState('italic');
                alignLeftButton.isActive = document.queryCommandState('justifyLeft');
                alignCenterButton.isActive = document.queryCommandState('justifyCenter');
                alignRightButton.isActive = document.queryCommandState('justifyRight');
            },
            onselectionentered: () => { console.log('onselectionentered'); controls.enable(); },
            onselectionleaved: () => { console.log('onselectionleaved'); controls.disable(); /*bg.hasFocus = false;*/ }
        });
        html.selectable = true;

        let editor = new Ui.LBox().assign({
            horizontalAlign: 'center',
            content: [
                bg,
                //new Ui.Frame().assign({ frameWidth: 1, fill: 'rgb(152, 152, 152)' }),
                new Ui.VBox().assign({
                    margin: 1,
                    content: [
                        new Ui.LBox().assign({ content: [
                            new Ui.Rectangle().assign({ fill: 'white', opacity: 0.6 }),
                            controls
                        ] }),
                        new Ui.LBox().assign({
                            horizontalAlign: 'center',
                            content: [
                                //new Ui.Rectangle().assign({ fill: '#eeeeee' }),
                                html
                            ]
                        })
                    ]
                })
            ]
        });
        vbox.append(editor);

        vbox.append(new Ui.ContentEditable().assign({
            width: 400, margin: 10, interLine: 1.2, fontSize: 20,
            html: 'Un autre texte sympa'
        }));

        vbox.append(new Ui.TextField());

        vbox.append(new Ui.Button().assign({ text: 'Click' }));

        vbox.append(new Ui.RichTextEditor().assign({ width: 500 }));
    }
}

new App().assign({
    style: {
        types: [
            {
                type: Ui.ToggleButton,
                borderWidth: 0,
                background: 'rgba(255,255,255,0)',
                activeBackground: 'rgba(255,255,255,0)'
            }    
        ]
    }
});
