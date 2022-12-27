/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/api/src/app/no-passing-router.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.noPassingRouter = void 0;
const tslib_1 = __webpack_require__("tslib");
const express = __webpack_require__("express");
const sqlite_utils_1 = __webpack_require__("./apps/api/src/app/sqlite-utils.ts");
exports.noPassingRouter = express.Router();
exports.noPassingRouter.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, sqlite_utils_1.getRowsFromSqlite)("SELECT * FROM reflect");
        res.json(rows);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));


/***/ }),

/***/ "./apps/api/src/app/reflect-router.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reflectRouter = void 0;
const tslib_1 = __webpack_require__("tslib");
const express = __webpack_require__("express");
const sqlite_utils_1 = __webpack_require__("./apps/api/src/app/sqlite-utils.ts");
exports.reflectRouter = express.Router();
exports.reflectRouter.get('/all', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield (0, sqlite_utils_1.getRowsFromSqlite)("SELECT * FROM reflect");
        res.json(rows);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));


/***/ }),

/***/ "./apps/api/src/app/sqlite-utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRowsFromSqlite = void 0;
const tslib_1 = __webpack_require__("tslib");
const sqlite3 = __webpack_require__("sqlite3");
const getRowsFromSqlite = (query) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    let db = new sqlite3.Database(global.DATABASE_FILE);
    const rows = yield new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
    db.close();
    return rows;
});
exports.getRowsFromSqlite = getRowsFromSqlite;


/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "sqlite3":
/***/ ((module) => {

module.exports = require("sqlite3");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),

/***/ "fs":
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __webpack_require__("express");
const path = __webpack_require__("path");
const fs = __webpack_require__("fs");
const no_passing_router_1 = __webpack_require__("./apps/api/src/app/no-passing-router.ts");
const reflect_router_1 = __webpack_require__("./apps/api/src/app/reflect-router.ts");
// Check if there is a command-line argument
const arg = process.argv[2];
// Initialize the database file name
console.log('arg', arg);
let dbFile = '';
// If there is a command-line argument, use it as the database file name
if (arg) {
    dbFile = arg;
}
else {
    // If no command-line argument is provided, use a temporary file name
    dbFile = path.join(__dirname, '../../../tmp/database.db');
}
console.log('dbFile ', dbFile);
// Check if the database file exists
if (!fs.existsSync(dbFile)) {
    console.log(`Database file ${dbFile} does not exist. ${dbFile}`);
    // If the database file does not exist, throw an exception
    throw new Error(`Database file ${dbFile} does not exist. ${dbFile}`);
}
global.DATABASE_FILE = dbFile;
console.log('global.DATABASE_FILE', global.DATABASE_FILE);
const app = express();
app.use(express.static(path.join(__dirname, 'assets')));
app.use('/api/no-passing', no_passing_router_1.noPassingRouter);
app.use('/api/reflect', reflect_router_1.reflectRouter);
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' });
});
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/assets/index.html'));
});
const port = process.env.port || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map