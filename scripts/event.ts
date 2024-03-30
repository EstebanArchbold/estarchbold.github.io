namespace core {

    export class Event {

        private _date: string;
        private _name: string;
        private _description: string;

        constructor(date: string = "", name: string = "", description: string = "") {
            this._date = date;
            this._name = name;
            this._description = description;
        }

        public get date(): string {
            return this._date;
        }

        public set date(value: string) {
            this._date = value;
        }

        public get name(): string {
            return this._name;
        }

        public set name(value: string) {
            this._name = value;
        }

        public get description(): string {
            return this._description;
        }

        public set description(value: string) {
            this._description = value;
        }

        /**
         * Serialize for writing to localStorage
         */
        public serialize(): string | null {
            if (this._date !== "" && this._name !== "" && this._description !== "") {
                return `${this._date}, ${this._name}, ${this._description}`;
            }
            console.error("One or more of the event properties is missing or invalid!");
            return null;
        }

        /**
         * Deserialize is used to read data from localStorage
         */
        public deserialize(data: string): void {
            let propertyArray = data.split(",");
            this._date = propertyArray[0];
            this._name = propertyArray[1];
            this._description = propertyArray[2];
        }

    }

}