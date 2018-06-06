namespace Ui {
    export interface MonthCalendarInit extends VBoxInit {
        date?: Date;
        selectedDate?: Date;
        dayFilter?: number[];
        dateFilter?: string[];
        ondayselected?: (event: { target: MonthCalendar, value: Date }) => void;
    }

    export class MonthCalendar extends VBox {
        private _selectedDate: Date;
        private _date: Date;
        private title: Label;
        private leftarrow: Icon;
        private rightarrow: Icon;
        private grid: Grid;
        private _dayFilter: number[];
        private _dateFilter: string[];
        readonly dayselected = new Core.Events<{ target: MonthCalendar, value: Date }>();
        set ondayselected(value: (event: { target: MonthCalendar, value: Date }) => void) { this.dayselected.connect(value); }

        //
        // @class The MonthCalendar is a small month calendar which allow
        // to select a day.
        //
        constructor(init?: MonthCalendarInit) {
            super(init);
            this._date = new Date();

            let hbox = new HBox();
            this.append(hbox);

            let button = new Pressable({
                verticalAlign: 'center',
                onpressed: () => this.onLeftButtonPress()
            });
            this.leftarrow = new Icon({ icon: 'arrowleft', width: 24, height: 24 });
            button.append(this.leftarrow);
            hbox.append(button);

            this.title = new Label({ fontWeight: 'bold', fontSize: 18, margin: 5 });
            hbox.append(this.title, true);

            button = new Pressable({
                verticalAlign: 'center',
                onpressed: () => this.onRightButtonPress()
            });
            this.rightarrow = new Icon({ icon: 'arrowright', width: 24, height: 24 });
            button.append(this.rightarrow);
            hbox.append(button);

            this.grid = new Grid({
                cols: '*,*,*,*,*,*,*',
                rows: '*,*,*,*,*,*,*',
                horizontalAlign: 'stretch'
            });
            this.append(this.grid);

            this.updateDate();

            if (init) {
                if (init.date !== undefined)
                    this.date = init.date;
                if (init.selectedDate !== undefined)
                    this.selectedDate = init.selectedDate;
                if (init.dayFilter !== undefined)
                    this.dayFilter = init.dayFilter;
                if (init.dateFilter !== undefined)
                    this.dateFilter = init.dateFilter;
                if (init.ondayselected)
                    this.dayselected.connect(init.ondayselected);
            }
        }

        //
        // @param {Number[]} Array of day to disable (from 0 to 6), 0 is sunday
        //
        set dayFilter(dayFilter: number[]) {
            this._dayFilter = dayFilter;
            this.updateDate();
        }

        //
        // @param {String[]} Array of dates to disable. This dates must always be in yyyy/mm/dd format and will be converted to regex
        // so you can do a lot of things
        // @ example
        // let calendar = new MonthCalendar();
        // calendar.setDateFilter([ '2011/11/2[1-5]', '2011/12/*', '2012/0[2-3]/.[4]' ]);
        //
        set dateFilter(dateFilter: string[]) {
            this._dateFilter = dateFilter;
            this.updateDate();
        }

        set date(date: Date) {
            this._date = date;
            this.updateDate();
        }

        get selectedDate(): Date {
            return this._selectedDate;
        }

        set selectedDate(selectedDate: Date) {
            this._selectedDate = selectedDate;
            this.updateDate();
        }

        protected onLeftButtonPress() {
            this._date.setMonth(this._date.getMonth() - 1);
            this.updateDate();
        }

        protected onRightButtonPress() {
            this._date.setMonth(this._date.getMonth() + 1);
            this.updateDate();
        }

        protected onDaySelect(button) {
            this._selectedDate = button.monthCalendarDate;
            this.updateDate();
            this.dayselected.fire({ target: this, value: this._selectedDate });
        }

        protected updateDate() {
            let i;
            let dayPivot = [6, 0, 1, 2, 3, 4, 5];
            let dayNames = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
            let monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

            this.title.text = monthNames[this._date.getMonth()] + ' ' + this._date.getFullYear();

            while (this.grid.firstChild !== undefined)
                this.grid.detach(this.grid.firstChild);

            for (i = 0; i < 7; i++)
                this.grid.attach(new Label({ text: dayNames[i], fontWeight: 'bold', margin: 5 }), i, 0);

            let month = this._date.getMonth();
            let current = new Date(this._date.getTime());
            current.setDate(1);
            let row = 1;
            let now = new Date();
            do {
                let day = new DayButton({
                    onpressed: () => this.onDaySelect(day)
                });
                day.monthCalendarDate = current;

                let bg;
                if ((current.getFullYear() == now.getFullYear()) && (current.getMonth() == now.getMonth()) && (current.getDate() == now.getDate())) {
                    day.monthCalendarCurrent = true;
                    bg = new Rectangle({ fill: new Color(0.2, 0.4, 1, 0.4), margin: 1 });
                    day.append(bg);
                }
                else {
                    bg = new Rectangle({ fill: new Color(0.8, 0.8, 0.8, 0.4), margin: 1 });
                    day.append(bg);
                }

                if ((this._selectedDate !== undefined) && (current.getFullYear() === this._selectedDate.getFullYear()) && (current.getMonth() === this._selectedDate.getMonth()) && (current.getDate() === this.selectedDate.getDate()))
                    day.append(new Frame({ frameWidth: 3, fill: 'red', radius: 0 }));

                let disable = false;
                if (this._dayFilter !== undefined) {
                    let weekday = current.getDay();
                    for (i = 0; (i < this._dayFilter.length) && !disable; i++)
                        if (weekday == this._dayFilter[i])
                            disable = true;
                }
                if (this._dateFilter !== undefined) {
                    let daystr = current.getFullYear() + '/';
                    if (current.getMonth() + 1 < 10)
                        daystr += '0';
                    daystr += (current.getMonth() + 1) + '/';
                    if (current.getDate() < 10)
                        daystr += '0';
                    daystr += current.getDate();
                    for (i = 0; (i < this._dateFilter.length) && !disable; i++) {
                        let re = new RegExp(this._dateFilter[i]);
                        if (re.test(daystr)) {
                            disable = true;
                        }
                    }
                }

                if (disable) {
                    day.disable();
                    day.opacity = 0.2;
                }

                day.append(new Label({ text: current.getDate().toString(), margin: 5 }));

                this.grid.attach(day, dayPivot[current.getDay()], row);
                current = new Date(current.getTime() + 1000 * 60 * 60 * 24);
                if (dayPivot[current.getDay()] === 0)
                    row++;
            } while (month == current.getMonth());
            this.onStyleChange();
        }

        protected onStyleChange(): void {
            let color = this.getStyleProperty('color');
            let dayColor = this.getStyleProperty('dayColor');
            let currentDayColor = this.getStyleProperty('currentDayColor');
            this.title.color = color;
            this.leftarrow.fill = color;
            this.rightarrow.fill = color;

            for (let i = 0; i < this.grid.children.length; i++) {
                let child = this.grid.children[i];
                if (child instanceof Label)
                    child.color = color;
                else if (child instanceof DayButton) {
                    for (let i2 = 0; i2 < child.children.length; i2++) {
                        let child2 = child.children[i2];
                        if (child2 instanceof Label)
                            child2.color = color;
                        else if (child2 instanceof Rectangle) {
                            if (child.monthCalendarCurrent)
                                child2.fill = currentDayColor;
                            else
                                child2.fill = dayColor;
                        }
                    }
                }
            }
        }

        static style: object = {
            color: 'black',
            dayColor: new Color(0.81, 0.81, 0.81, 0.5),
            currentDayColor: new Color(1, 0.31, 0.66, 0.5)
        }
    }

    class DayButton extends Pressable {
        monthCalendarDate: Date;
        monthCalendarCurrent: boolean;
    }

}
