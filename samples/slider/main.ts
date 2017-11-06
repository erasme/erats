/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let beginButton = new Ui.Button({ text: 'begin' });
        toolbar.append(beginButton);
        this.connect(beginButton, 'press', function () {
            clock.begin();
        });

        let enableButton = new Ui.Button({ text: 'enable' });
        toolbar.append(enableButton);
        this.connect(enableButton, 'press', function () {
            slider.enable();
        });

        let disableButton = new Ui.Button({ text: 'disable' });
        toolbar.append(disableButton);
        this.connect(disableButton, 'press', function () {
            slider.disable();
        });

        let horizontalButton = new Ui.Button({ text: 'horizontal' });
        toolbar.append(horizontalButton);
        this.connect(horizontalButton, 'press', function () {
            slider.orientation = 'horizontal';
        });

        let verticalButton = new Ui.Button({ text: 'vertical' });
        toolbar.append(verticalButton);
        this.connect(verticalButton, 'press', function () {
            slider.orientation = 'vertical';
        });

        let vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
        vbox.append(vbox2, true);

        let label = new Ui.Label({ horizontalAlign: 'center' });
        vbox2.append(label);

        let slider = new Ui.Slider({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, height: 200, value: 0.2
        });
        vbox2.append(slider);
        label.text = 'Value: ' + slider.value;

        this.connect(slider, 'change', function () {
            label.text = 'Value: ' + slider.value.toFixed(2);
        });

        let clock = new Anim.Clock({ duration: 4.0 });
        this.connect(clock, 'timeupdate', function (clock: Anim.Clock, progress: number) {
            slider.setValue(progress);
        });
    }
}

new App();