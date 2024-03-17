"use strict";

(function (){

    let protected_route = ["contact-list"];

    if(protected_route.indexOf(router.ActiveLink)>-1){
        if(!sessionStorage.getItem("user")){
            location.href = "/login";
        }
    }

})();