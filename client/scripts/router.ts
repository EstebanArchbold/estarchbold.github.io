"use strict";

namespace core {

    export class Router {

        private _activeLink: string;

        private _routingTable: string[];
        private _linkData:string;

        constructor() {
            this._activeLink = "";
            this._routingTable = [];
            this._linkData="";
        }

        public get LinkData(): string {
            return this._linkData;
        }

        public set LinkData(link: string) {
            this._linkData = link;
        }
        public get ActiveLink(): string {
            return this._activeLink;
        }

        public set ActiveLink(link: string) {
            this._activeLink = link;
        }

        /**
         * This method adds a new router to the Routing Table
         * @param route
         * @return{void}
         */

        public Add(route: string): void {
            this._routingTable.push(route);
        }

        /**
         * This method replaces the reference for the routing table with a new one
         * @param routingTable
         * return {void}
         */

        public AddTable(routingTable: string[]): void {
            this._routingTable = routingTable;
        }

        /**
         * This method find a route from the routing table.
         * @param route
         * @returns {*}
         */

        public Find(route: string): number {
            return this._routingTable.indexOf(route);
        }

        /**
         * This method  find a route in the routing table. Returns true of it success, false otherwise
         * @param route
         * @returns {boolean}
         */

        public Remove(route: string): boolean {
            if (this.Find(route) > -1) {
                this._routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }

        /**
         * This method converts the contents of the route table into a csv (comma, separated value)
         * @returns {string}
         */
        public toString(): string {
            return this._routingTable.toString();
        }
    }
}


//Instantiate a new Router
let router: core.Router = new core.Router()

router.AddTable([
    "/",
    "/home",
    "/about",
    "/products",
    "/services",
    "/contact",
    "/contact-list",
    "/login",
    "/register",
    "/edit",

]);

let route:string = location.pathname;

router.ActiveLink = (router.Find(route) > -1)
                    ? ((route === "/")) ? "home" : route.substring(1)
                    : ("404");