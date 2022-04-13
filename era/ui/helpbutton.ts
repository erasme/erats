namespace Ui {

    export interface HelpButtonInit extends Ui.PressableInit {
        icon?: string;
        src?: string;
        help?: Ui.Element;
        dialogWidth?: number;
        dialogHeight?: number;
        title: string;
    }

    export class HelpButton extends Ui.Pressable {
        dialogWidth?: number;
        dialogHeight?: number;
        help?: Ui.Element;
        src?: string;
        fetchContent: (helpButton: HelpButton) => Promise<string | undefined> | undefined;

        private _icon = new Ui.Icon({
            width: 24, height: 24,
            fill: '#0074c1',
            icon: "resource/help"
        });
        constructor(init?: HelpButtonInit) {
            super(init);

            this.title = 'Aide';
            this.append(this._icon);
            this.pressed.connect(() => this.showDialog())

            if (init) {
                if (init.icon)
                    this.icon = init.icon;
                if (init.dialogWidth)
                    this.dialogWidth = init.dialogWidth
                if (init.dialogHeight)
                    this.dialogHeight = init.dialogHeight
                if (init.title)
                    this.title = init.title
                if (init.src)
                    this.src = init.src;
                if (init.help)
                    this.help = init.help;
            }
        }

        get icon(): string | undefined {
            return this._icon.icon;
        }

        set icon(value: string | undefined) {
            if (value)
                this._icon.icon = value;
        }

        protected async fetchHelp(url: string): Promise<Ui.Element> {
            let htmlContent: string | undefined;
            if (this.fetchContent) {
                htmlContent = await this.fetchContent(this);
            }
            else {
                let req = new Core.HttpRequest({ method: 'GET', url: url });
                let res = await req.sendAsync();
                if (res.status >= 200 && res.status < 300)
                    htmlContent = res.responseText;
            }
            if (htmlContent) {
                return new Ui.Html().assign({
                    interLine: 1.2, margin: 10,
                    selectable: true,
                    html: htmlContent
                });
            }
            else {
                return new Ui.Text().assign({
                    interLine: 1.2, margin: 20,
                    textAlign: 'center', selectable: true,
                    text: `Désolé la documentation n'a pas été trouvé. Ré-essayez plus tard ou contacter votre administrateur`
                });
            }
        }

        async showDialog() {
            if (!this.help && this.src)
                this.help = await this.fetchHelp(this.src);

            new Ui.Dialog().assign({
                preferredWidth: this.dialogWidth, title: this.title,
                preferredHeight: this.dialogHeight, content: this.help
            }).open();
        }
    }
}