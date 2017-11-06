/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let toolbar2 = new Ui.ToolBar();
        vbox.append(toolbar2);

        let trans1Button = new Ui.Button({ text: 'transition 1' });
        toolbar.append(trans1Button);
        this.connect(trans1Button, 'press', function () {
            transitionbox.current = page1;
        });

        let trans2Button = new Ui.Button({ text: 'transition 2' });
        toolbar.append(trans2Button);
        this.connect(trans2Button, 'press', function () {
            transitionbox.current = page2;
        });

        let fadeButton = new Ui.Button({ text: 'fade' });
        toolbar.append(fadeButton);
        this.connect(fadeButton, 'press', function () {
            transitionbox.transition = 'fade';
        });

        let flipButton = new Ui.Button({ text: 'flip horizontal' });
        toolbar2.append(flipButton);
        this.connect(flipButton, 'press', function () {
            transitionbox.transition = 'flip';
        });

        let flipverticalButton = new Ui.Button({ text: 'flip vertical' });
        toolbar2.append(flipverticalButton);
        this.connect(flipverticalButton, 'press', function () {
            transitionbox.transition = new Ui.Flip({ orientation: 'vertical' });
        });

        let slideButton = new Ui.Button({ text: 'slide right' });
        toolbar2.append(slideButton);
        this.connect(slideButton, 'press', function () {
            transitionbox.transition = 'slide';
        });

        let slideleftButton = new Ui.Button({ text: 'slide left' });
        toolbar2.append(slideleftButton);
        this.connect(slideleftButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'left' });
        });

        let slidetopButton = new Ui.Button({ text: 'slide top' });
        toolbar2.append(slidetopButton);
        this.connect(slidetopButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'top' });
        });

        let slidebottomButton = new Ui.Button({ text: 'slide bottom' });
        toolbar2.append(slidebottomButton);
        this.connect(slidebottomButton, 'press', function () {
            transitionbox.transition = new Ui.Slide({ direction: 'bottom' });
        });


        let linearButton = new Ui.Button({ text: 'linear' });
        toolbar.append(linearButton);
        this.connect(linearButton, 'press', function () {
            transitionbox.ease = 'linear';
        });

        let bounceButton = new Ui.Button({ text: 'bounce' });
        toolbar.append(bounceButton);
        this.connect(bounceButton, 'press', function () {
            transitionbox.ease = 'bounce';
        });

        let elasticButton = new Ui.Button({ text: 'elastic' });
        toolbar.append(elasticButton);
        this.connect(elasticButton, 'press', function () {
            transitionbox.ease = 'elastic';
        });

        let powerButton = new Ui.Button({ text: 'power' });
        toolbar.append(powerButton);
        this.connect(powerButton, 'press', function () {
            transitionbox.ease = 'power';
        });

        let poweroutButton = new Ui.Button({ text: 'power out' });
        toolbar.append(poweroutButton);
        this.connect(poweroutButton, 'press', function () {
            transitionbox.ease = new Anim.PowerEase({ mode: 'out' });
        });

        let transitionbox = new Ui.TransitionBox({ transition: 'fade', duration: 0.5 });
        vbox.append(transitionbox, true);

        let page1 = new Ui.LBox();
        page1.append(new Ui.Rectangle({ fill: 'lightblue' }));
        page1.append(new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 1', verticalAlign: 'center', horizontalAlign: 'center' }));
        transitionbox.append(page1);

        let page2 = new Ui.LBox();
        page2.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        page2.append(new Ui.Label({ color: 'white', fontSize: 40, text: 'Page 2', verticalAlign: 'center', horizontalAlign: 'center' }));
        transitionbox.append(page2);
    }
}

new App();