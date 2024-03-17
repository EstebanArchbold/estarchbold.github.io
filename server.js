"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hello_js_1 = require("./hello.js");
const users_data_1 = require("./users.data");
(0, users_data_1.getData)()
    .then((data) => {
    (0, hello_js_1.sayHello)();
    console.log(data);
    (0, hello_js_1.sayGoodBye)();
})
    .catch((err) => {
    console.error("ERROR: User data not returned");
});
//# sourceMappingURL=server.js.map