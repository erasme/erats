namespace Ui {
	export interface DatePickerInit extends TextButtonFieldInit {
		dayFilter?: number[];
		dateFilter?: string[];
		selectedDate?: Date;
	}

	export class DatePicker extends TextButtonField implements DatePickerInit {
		protected popup: Popup;
		protected calendar: MonthCalendar;
		protected _selectedDate: Date;
		protected _isValid: boolean = false;
		protected _dayFilter: number[];
		protected _dateFilter: string[];

		//
		// @class TextButtonField that open a calendar to choose a day and then display it in a DD/MM/YYYY format 
		//
		constructor(init?: DatePickerInit) {
			super(init);
			this.buttonIcon = 'calendar';
			this.widthText = 9;

			this.connect(this, 'buttonpress', this.onDatePickerButtonPress);
			this.connect(this, 'change', this.onDatePickerChange);
			if (init) {
				if (init.dayFilter !== undefined)
					this.dayFilter = init.dayFilter;	
				if (init.dateFilter !== undefined)
					this.dateFilter = init.dateFilter;	
				if (init.selectedDate !== undefined)
					this.selectedDate = init.selectedDate;	
			}
		}

		set dayFilter(dayFilter: number[]) {
			this._dayFilter = dayFilter;
		}

		set dateFilter(dateFilter: string[]) {
			this._dateFilter = dateFilter;
		}

		get isValid(): boolean {
			return this._isValid;
		}
	
		get selectedDate(): Date {
			return this._selectedDate;
		}

		set selectedDate(date: Date) {
			if (date === undefined) {
				this._selectedDate = undefined;
				this.textValue = '';
			}
			else {
				this._selectedDate = date;
				this.textValue = `${this.zeroPad(date.getDate(), 2)}/${this.zeroPad(date.getMonth()+1,2)}/${date.getFullYear()}`;
			}

			this._isValid = true;
			this.fireEvent('change', this, this.selectedDate);
		}

		protected onDatePickerButtonPress() {
			var splitDate = this.textValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
			if (splitDate !== null)
				this.selectedDate = new Date(parseInt(splitDate[3]), parseInt(splitDate[2]) - 1, parseInt(splitDate[1]));
			this.popup = new Popup();
			if (this.selectedDate !== undefined)
				this.calendar = new MonthCalendar({ horizontalAlign: 'center', margin: 10, selectedDate: this.selectedDate, date: this.selectedDate });
			else
				this.calendar = new MonthCalendar({ horizontalAlign: 'center', margin: 10 });
			if (this._dayFilter !== undefined)
				this.calendar.dayFilter = this._dayFilter;
			if (this._dateFilter !== undefined)
				this.calendar.dateFilter = this._dateFilter;
			this.popup.content = this.calendar;
			this.connect(this.calendar, 'dayselect', this.onDaySelect);

			this.popup.openElement(this);
		}

		protected onDatePickerChange() {
			this._isValid = false;
			this._selectedDate = undefined;
			var dateStr = this.textValue;
			if (dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/)) {
				var splitDate = this.textValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/);
				var date = new Date(parseInt(splitDate[3]), parseInt(splitDate[2]) - 1, parseInt(splitDate[1]));
				var newStr = ((date.getDate() < 10) ? '0' : '') + date.getDate() + '/' + ((date.getMonth() < 9) ? '0' : '') + (date.getMonth() + 1) + '/' + date.getFullYear();
				if (!((parseInt(splitDate[3]) != date.getFullYear()) || (parseInt(splitDate[2]) - 1 != date.getMonth()) || (parseInt(splitDate[1]) != date.getDate()))) {
					this._selectedDate = date;
					this._isValid = true;
				}
			}

		}

		private zeroPad(val: number, size: number = 2) {
			let s = val.toString();
			while (s.length < size)
				s = "0" + s;
			return s;
		}

		protected onDaySelect(monthcalendar, date: Date) {
			this.selectedDate = date;
			this.popup.close();
			this.popup = undefined;
		}
	}
}
