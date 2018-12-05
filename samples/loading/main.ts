/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        
        let loading = new Ui.Loading();
        let checkbox = new Ui.CheckBox();
        let slider = new Ui.Slider();

        this.content = new Ui.VBox().assign({
            content: [
                new Ui.ToolBar().assign({
                    verticalAlign: 'top',
                    content: [
                        checkbox.assign({
                            value: true,
                            content: new Ui.Label().assign({ text: 'infinite' }),
                            onchanged: () => {
                                if (checkbox.value)
                                    loading.value = 'infinite';
                                else
                                    loading.value = slider.value;
                            }
                        }),
                        slider.assign({
                            width: 200,
                            onchanged: () => {
                                if (!checkbox.value)
                                    loading.value = slider.value;
                            }
                        })
                    ]
                }),
                loading.assign({
                    resizable: true,
                    width: 48, height: 48,
                    verticalAlign: 'center', horizontalAlign: 'center'
                })
            ]
        });
    }
}
new App();

