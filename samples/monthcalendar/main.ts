/// <reference path="../../era/era.d.ts" />

class Logs extends Ui.VBox {
    logs: Ui.VBox;

    constructor() {
        super();
		this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
		let scrolling = new Ui.ScrollingArea();
		this.append(scrolling, true);
		this.logs = new Ui.VBox();
		scrolling.content = this.logs;
	}

	log(text: string, color?: string) {
		if(color == undefined)
			color = 'black';
		this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
	}
}

class App extends Ui.App {
    constructor() {
        super();

        let app = new Ui.App();

        let vbox = new Ui.VBox();
        app.setContent(vbox);

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let button = new Ui.Button({ text: 'get date' });
        toolbar.append(button);
        app.connect(button, 'press', function () {
            let date = calendar.selectedDate;
            if (date == undefined)
                logs.log('date is undefined');
            else
                logs.log('date: ' + date);
        });

        let hbox = new Ui.HBox();
        vbox.append(hbox, true);

        let calendar = new Ui.MonthCalendar({ verticalAlign: 'center', horizontalAlign: 'center' });
        calendar.dayFilter = [6, 0];
        calendar.dateFilter = ['2011/11/2[1-5]', '2011/12/*', '2012/0[2-3]/.[4]'];
        hbox.append(calendar, true);

        app.connect(calendar, 'dayselect', function (calendar: Ui.MonthCalendar, date: Date) {
            console.log('Day select: ' + date);
        });

        let logs = new Logs();
        hbox.append(logs, true);
    }
}

new App();