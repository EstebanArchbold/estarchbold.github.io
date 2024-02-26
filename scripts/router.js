"views strict";

(function (core){
    class Router{
        constructor(){
            this.ActiveLink = "";
        }
        get ActiveLink(){
            return this._activeLink;
        }
        set ActiveLink(link){
            this._activeLink = link;
        }

        /**
         * This method adds a new route tho the Routing Table
         * @param route
         */
        Add(route){
            this._routingTable.push(route);
        }

        /**
         *
         * This method replaces the reference for the routing table with a new one
         * @return {void}
         */
        AddTable(routingTable){
            this._routingTable = routingTable;
        }

        /**
         * This metod removes a route from the routing table.
         * @param route
         * @returns {*}
         */
        Find(route){
            return this._routingTable.indexOf(route);
        }

        /**
         * This method removes a route from the routing table. Returns true of it success, false otherwise.
         * @param route
         * @returns {boolean}
         */
        Remove(route){
            if(this.Find(route)>-1){
                this._routingTable.splice(this.Find(route),1);
                return true;
            }
            return false;
        }

        /**
         * This method converts the contens of the routing table into a csv (comma, separated values)
         * @returns {string}
         */
        toString(){
            return this._routingTable.toString();
        }
    }
    core.Router = Router;
})(core ||(core = {}));

let router = new core.Router();

router.AddTable([
    "/",
    "/home",
    "/about",
    "/portfolio",
    "/service",
    "/team",
    "/contact",
    "/contact-list",
    "/login",
    "/register",
    "/edit",
    "/blog",
    "/api"
]);

let route = location.pathname;

router.ActiveLink = (router.Find(route) > -1)
                    ? ((route === "/")) ? "home" : route.substring(1)
                    : ("404");