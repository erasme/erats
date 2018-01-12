/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		
		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let button = new Ui.Button({
			text: 'change orientation',
			onpressed: () => {
				if(accordeon.orientation == 'horizontal')
					accordeon.orientation = 'vertical';
				else
					accordeon.orientation = 'horizontal';
			}
		});
		toolbar.append(button);
		
		toolbar.append(new Ui.Button({
			text: 'set page1',
			onpressed: () => page1.select()
		}));
		
		button = new Ui.Button({
			text: 'add pageX',
			onpressed: () => {
				let page = new Ui.AccordeonPage();
				accordeon.appendPage(page);
				page.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'green', margin: 3 }));
				page.setContent(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
			}
		});
		toolbar.append(button);
		
		toolbar.append(new Ui.Button({
			text: 'remove last page',
			onpressed: () => {
				let pos = accordeon.pages.length - 1;
				if(pos >= 0) {
					let page = accordeon.pages[pos];
					accordeon.removePage(page);
				}
			}
		}));
		
		toolbar.append(new Ui.Button({
			text: 'remove current page',
			onpressed: () => {	
				let pos = accordeon.currentPosition;
				if(pos >= 0) {
					let page = accordeon.pages[pos];
					accordeon.removePage(page);
				}
			}
		}));
		
		let label = new Ui.Label({ text: 'Current page: ', margin: 5 });
		vbox.append(label);
		
		let accordeon = new Ui.Accordeon({ margin: 20 });
		vbox.append(accordeon, true);
		
		accordeon.changed.connect(e => label.text = `Current page: ${e.position+1}`);
		
		let page1 = new Ui.AccordeonPage();
		accordeon.appendPage(page1);
		page1.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue' }));
		let content1 = new Ui.LBox();
		content1.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
		let vbox1 = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center' });
		content1.append(vbox1);
		vbox1.append(new Ui.Button({ text: 'button1 p1' }));
		vbox1.append(new Ui.Button({ text: 'button2 p1' }));
		page1.setContent(content1);
		
		let page2 = new Ui.AccordeonPage();
		accordeon.appendPage(page2);
		page2.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'pink' }));
		let content2 = new Ui.LBox();
		content2.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));
		let vbox2 = new Ui.VBox({ horizontalAlign: 'center', verticalAlign: 'center' });
		content2.append(vbox2);
		vbox2.append(new Ui.Button({ text: 'button1 p2' }));
		vbox2.append(new Ui.Button({ text: 'button2 p2' }));
		page2.setContent(content2);
		
		let page3 = new Ui.AccordeonPage();
		accordeon.appendPage(page3);
		page3.setHeader(new Ui.Rectangle({ width: 50, height: 50, fill: 'purple' }));
		page3.setContent(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen' }));

	}
}

new App();
