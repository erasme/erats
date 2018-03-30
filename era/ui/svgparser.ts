
namespace Ui
{
	export class SvgParser extends Core.Object
	{
		path: string;
		pos: number = 0;
		cmd?: string;
		current: any = undefined;
		value: boolean = false;
		end: boolean = false;

		constructor(path: string) {
			super();
			this.path = path;
		}

		isEnd() {
			return this.end;
		}

		next() {
			this.end = this.pos >= this.path.length;
			if (!this.end) {
				while ((this.pos < this.path.length) && ((this.path[this.pos] == ' ') || (this.path[this.pos] == ',') || (this.path[this.pos] == ';')))
					this.pos++;
				let dotseen = false;
				let eseen = false;
				this.current = '';
				let c = this.path[this.pos];

				let isCmd = (c !== 'e') && ((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z'));
				if (isCmd) {
					this.current = this.path[this.pos++];
					this.cmd = this.current;
					this.value = false;
				}
				else {
					while ((this.pos < this.path.length) && (((this.path[this.pos] >= '0') && (this.path[this.pos] <= '9')) ||
						((this.path[this.pos] === '-') && ((this.current.length == 0) || (this.current[this.current.length - 1] === 'e'))) ||
						(!eseen && (this.path[this.pos] === 'e')) || (!dotseen && (this.path[this.pos] === '.')))) {
						if (this.path[this.pos] === '.')
							dotseen = true;
						if (this.path[this.pos] === 'e')
							eseen = true;
						this.current += this.path[this.pos++];
					}
					this.value = true;
					if (this.current[0] === '.')
						this.current = '0' + this.current;
					if ((this.current[0] === '-') && (this.current[1] === '.'))
						this.current = '-0' + this.current.substring(1);
					this.current = parseFloat(this.current);
					if (isNaN(this.current))
						throw ('bad number');
				}
			}
		}

		setCmd(cmd) {
			this.cmd = cmd;
		}

		getCmd() {
			return this.cmd;
		}

		getCurrent() {
			return this.current;
		}

		isCmd() {
			return !this.value;
		}

		isValue() {
			return this.value;
		}
	}
}

