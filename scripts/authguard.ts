"use strict";

(function () {
    // Define protected routes
    let protectedRoutes = ["statistics"];

    // Check if the current route is in the protected routes list
    if (protectedRoutes.includes(router.ActiveLink)) {
        // Check if user is authenticated
        if (!sessionStorage.getItem("user")) {
            // Redirect to login page
            location.href = "/login";
        }
    }
})();