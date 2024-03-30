"use strict";
(function () {
    let protectedRoutes = ["statistics"];
    if (protectedRoutes.includes(router.ActiveLink)) {
        if (!sessionStorage.getItem("user")) {
            location.href = "/login";
        }
    }
})();
//# sourceMappingURL=authguard.js.map