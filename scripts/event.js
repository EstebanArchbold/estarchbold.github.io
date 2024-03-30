"use strict";
var core;
(function (core) {
    class Event {
        _date;
        _name;
        _description;
        constructor(date = "", name = "", description = "") {
            this._date = date;
            this._name = name;
            this._description = description;
        }
        get date() {
            return this._date;
        }
        set date(value) {
            this._date = value;
        }
        get name() {
            return this._name;
        }
        set name(value) {
            this._name = value;
        }
        get description() {
            return this._description;
        }
        set description(value) {
            this._description = value;
        }
        serialize() {
            if (this._date !== "" && this._name !== "" && this._description !== "") {
                return `${this._date}, ${this._name}, ${this._description}`;
            }
            console.error("One or more of the event properties is missing or invalid!");
            return null;
        }
        deserialize(data) {
            let propertyArray = data.split(",");
            this._date = propertyArray[0];
            this._name = propertyArray[1];
            this._description = propertyArray[2];
        }
    }
    core.Event = Event;
})(core || (core = {}));
//# sourceMappingURL=event.js.map