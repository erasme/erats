/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();

        let count = 0;
        let label = new Ui.Label();

        this.content = new Ui.VBox().assign({
            verticalAlign: 'center', horizontalAlign: 'center', spacing: 10,
            content: [
                label.assign({ text: 'toggle count: 0' }),
                new Ui.ToggleButton().assign({
                    text: 'toggle me',
                    ontoggled: () => label.text = `toggle count: ${(++count)}`
                })
            ]
        });
    }
}
new App();
