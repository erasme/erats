/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();

        let main = new Ui.LBox();
        let frame = new Ui.Frame()

        new Ui.FocusInWatcher({
            element: main,
            onfocusin: () => {
                console.log('main focusin');
                frame.frameWidth = 1;
            },
            onfocusout: () => {
                console.log('main focusout');
                frame.frameWidth = 0;
            }
        });

        let textField = new Ui.TextField();
        new Ui.FocusInWatcher({
            element: textField,
            onfocusin: () => console.log('textfield focusin'),
            onfocusout: () => console.log('textfield focusout')
        });

        this.content = main.assign({
            horizontalAlign: 'center', verticalAlign: 'center',
            content: [
                frame.assign({
                    fill: 'red', frameWidth: 0
                }),
                new Ui.VBox().assign({
                    width: 300, spacing: 10, margin: 5,
                    content: [
                        textField,
                        new Ui.Button().assign({
                            text: 'Click Me',
                            onfocused: () => console.log('button focus'),
                            onblurred: () => console.log('button blur'),
                        })
                    ]
                })        
            ]
        });
    }
}
new App();
