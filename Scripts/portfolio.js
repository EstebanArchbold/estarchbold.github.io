"use strict";

class Project {
    constructor(imgTitle ="", imgDescription="", imageUrl="") {
        this._imgTitle = imgTitle;
        this._imgDescription = imgDescription;
        this._imageUrl = imageUrl;
    }

    get imgTitle(){
        return this._imgTitle;
    }

    set imgTitle(value){
        this._imgTitle=value;
    }

    get imgDescription() {
        return this._imgDescription;
    }

    set imgDescription(value) {
        this._imgDescription = value;
    }

    get imageUrl() {
        return this._imageUrl;
    }

    set imageUrl(value) {
        this._imageUrl = value;
    }


    toString(){
        return `Full Name: ${this._imgTitle}\n Contact Number: ${this._imgDescription}\n 
                Email Address: ${this._imageUrl}`
    }

    /**
     * Serialize for writing to localStorage
     */
    serialize() {
        if(this._imgTitle !== "" && this._imgDescription !== "" && this._imageUrl !== ""){
            return `${this._imgTitle}, ${this._imgDescription}, ${this._imageUrl}`;
        }
        console.error("One or more of the Portfolio properties is missing or invalid");
        return null;
    }

    /**
     * Deserialize is used to read data from localStorage.
     */
    deserialize(data){
        let propertyArray = data.split(",");
        this._imgTitle = propertyArray[0];
        this._imgDescription = propertyArray[1];
        this._imageUrl = propertyArray[2];
    }
}

