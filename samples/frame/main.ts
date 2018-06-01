/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Frame, the basic drawing element
//

new Ui.App().assign({
    content: new Ui.Frame().assign({
        fill: new Ui.LinearGradient([
            { offset: 0, color: new Ui.Color(0.2, 0.5, 0.2) },
            { offset: 0.5, color: new Ui.Color(0.9, 0.1, 0.1) },
            { offset: 1, color: new Ui.Color(0.1, 0.8, 0.9) }
        ], 'vertical'),
        margin: 50,
        radius: 16,
        radiusTopLeft: 8,
        radiusBottomRight: 0,
        frameWidth: 5
    })
});
