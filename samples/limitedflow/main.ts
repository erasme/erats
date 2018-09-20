/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let expandButton = new Ui.Button().assign({
            icon: 'arrowbottom', isVisible: false,
        });
        let limitedFlow = new Ui.LimitedFlow();
        let textField = new Ui.TextField();
        this.content = new Ui.VBox().assign({
            content: [
                textField.assign({
                    onvalidated: (e) => {
                        if (e.target.value == undefined || e.target.value == '')
                            limitedFlow.maxLines = undefined;
                        else
                            limitedFlow.maxLines = parseInt(e.target.value);
                    }
                }),
                new Ui.CheckBox().assign({
                    content: new Ui.Label().assign({ text: 'uniform' }),
                    onchanged: (e) => {
                        limitedFlow.uniform = e.value;
                    }
                }),
                new Ui.HBox().assign({
                    content: [
                        limitedFlow.assign({
                            oncanexpandchanged: e => expandButton.isVisible = e.value,
                            spacing: 10, resizable: true,
                            content: [
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'pink' }),
                                new Ui.Rectangle().assign({ width: 100, height: 50, fill: 'purple', verticalAlign: 'center' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'brown' }),
                                new Ui.Rectangle().assign({ width: 200, height: 15, fill: 'orange' }),
                                new Ui.Rectangle().assign({ width: 150, height: 150, fill: 'lightblue' })
                            ]
                        }),
                        expandButton.assign({
                            onpressed: () => {
                                textField.value = '';
                                limitedFlow.maxLines = undefined;
                            }
                        })
                    ]
                }),
                new Ui.Rectangle().assign({ height: 150, fill: 'green' })
            ]
        })
    }
}

new App();

