/// <reference path="../../era/era.d.ts" />

window.onload = () => {
	let e1 = document.getElementById('e1');
    let embed = new Ui.Embed(e1!);
    
    embed.content = new Ui.LBox().assign({
        content: [
            new Ui.Rectangle().assign({ fill: 'red', radius: 10 }),
            new Ui.VBox().assign({
                margin: 10, spacing: 10,
                content: [
                    new Ui.Button().assign({
                        text: 'click 1'
                    }),
                    new Ui.Button().assign({
                        text: 'click 2',
                        onpressed: () => {
                            new Ui.Dialog().assign({
                                title: 'Test dialog',
                                content: new Ui.Rectangle().assign({
                                    fill: 'green',
                                    margin: 20,
                                    width: 200,
                                    height: 150
                                })
                            }).open();
                        }
                    })
                ]
            })
        ]
    });
};