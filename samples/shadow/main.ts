/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Shadow, the basic drawing element
//

new Ui.App().assign({
    content: new Ui.LBox().assign({
        verticalAlign: 'center',
        horizontalAlign: 'center',
        content: [
            new Ui.Rectangle().assign({ fill: '#cccccc' }),
            new Ui.Shadow().assign({
                width: 100,
                height: 100,
                shadowWidth: 5,
                radius: 8,
                inner: true,
                opacity: 0.5,
                color: Ui.Color.create('red'),
                margin: 30
            })
        ]
    })
});    
