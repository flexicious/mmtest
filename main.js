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

/***/ "./apps/api/src/app/report-generator/reports/no-passing/route-report/executor.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNoPassingRouteReportData = void 0;
const tslib_1 = __webpack_require__("tslib");
const sqlite_utils_1 = __webpack_require__("./apps/api/src/app/sqlite-utils.ts");
const utils_1 = __webpack_require__("./apps/api/src/app/report-generator/reports/utils.ts");
const getNoPassingRouteReportData = (request) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const basicInfo = yield (0, utils_1.getBasicInfo)();
    const sqlStatement = request.sqlStatement;
    console.log(sqlStatement);
    const npData = yield (0, sqlite_utils_1.getRowsFromSqlite)(sqlStatement);
    const response = {
        reportType: request.reportType,
        agency: {
            agencyName: basicInfo.agencyName,
        }, orderBy: {
            orderedBy: request.orderedBy,
        },
        routeReport: {
            data: npData.map(np => {
                return {
                    routeName: np.route_name,
                    routeNumber: np.route_route,
                    routeDirection: np.route_dir_route,
                    routeCode: np.route_rtecode,
                    zoneCode: np.zone_code,
                    minLogPoint: np.min_log_point,
                    maxLogPoint: np.max_log_point,
                    minDescription: np.min_descript,
                    maxDescription: np.max_descript,
                    eTruLog: np.e_trulog,
                    bTruLog: np.b_trulog,
                    clientId: -1,
                };
            })
        }
    };
    return response;
});
exports.getNoPassingRouteReportData = getNoPassingRouteReportData;


/***/ }),

/***/ "./apps/api/src/app/report-generator/reports/utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBasicInfo = void 0;
const tslib_1 = __webpack_require__("tslib");
const sqlite_utils_1 = __webpack_require__("./apps/api/src/app/sqlite-utils.ts");
const getBasicInfo = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT * FROM dict, (SELECT * FROM system LIMIT 1)";
    const basicInfo = yield (0, sqlite_utils_1.getRowsFromSqlite)(sql);
    const agencyName = basicInfo.length < 1 ? "" : basicInfo[0].agency;
    const dict = basicInfo;
    return {
        agencyName,
        dict
    };
});
exports.getBasicInfo = getBasicInfo;


/***/ }),

/***/ "./apps/api/src/app/report-generator/router.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reportGeneratorRouter = void 0;
const tslib_1 = __webpack_require__("tslib");
const express = __webpack_require__("express");
const utils_1 = __webpack_require__("./apps/api/src/app/report-generator/utils.ts");
exports.reportGeneratorRouter = express.Router();
exports.reportGeneratorRouter.get('/', (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestFilePath = req.query.filePath;
        const result = yield (0, utils_1.generateReport)(requestFilePath.toString());
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}));


/***/ }),

/***/ "./apps/api/src/app/report-generator/utils.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateReport = void 0;
const tslib_1 = __webpack_require__("tslib");
const shared_1 = __webpack_require__("./libs/shared/src/index.ts");
const fs = __webpack_require__("fs");
const path = __webpack_require__("path");
const executor_1 = __webpack_require__("./apps/api/src/app/report-generator/reports/no-passing/route-report/executor.ts");
const generateReport = (filePath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (filePath) {
        const fileData = fs.readFileSync(path.resolve(filePath.toString()), 'utf8');
        const data = JSON.parse(fileData);
        if (!data || !data.reportType) {
            throw new Error('Invalid file data');
        }
        if (data.reportType === shared_1.ReportType.NO_PASSING_ROUTE_REPORT) {
            const result = yield (0, executor_1.getNoPassingRouteReportData)(data);
            return result;
        }
        else if (data.reportType === shared_1.ReportType.NO_PASSING_ROUTE_GRAPHICAL_ZONES_REPORT) {
            const result = yield (0, executor_1.getNoPassingRouteReportData)(data);
            return result;
        }
        else {
            throw new Error('Invalid report type' + data.reportType);
        }
    }
    else {
        throw new Error('No file path provided');
    }
});
exports.generateReport = generateReport;


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

/***/ "./libs/shared/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/shared.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/types.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/no-passing/index.ts"), exports);


/***/ }),

/***/ "./libs/shared/src/lib/no-passing/graphical-zones-report/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/no-passing/graphical-zones-report/types.ts"), exports);


/***/ }),

/***/ "./libs/shared/src/lib/no-passing/graphical-zones-report/types.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/shared/src/lib/no-passing/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NpZonesReportTypes = void 0;
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/no-passing/graphical-zones-report/index.ts"), exports);
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/no-passing/route-report/index.ts"), exports);
exports.NpZonesReportTypes = {
    ROUTE_REPORT: { key: 'ROUTE_REPORT', reportType: 'Route Report', fileName: 'NoPassing_RouteList.pdf' },
    NP_ZONES_REPORT: { key: 'NP_ZONES_REPORT', reportType: 'No-Passing Zone Report', fileName: 'NoPassingZoneData.pdf' }
};


/***/ }),

/***/ "./libs/shared/src/lib/no-passing/route-report/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/shared/src/lib/no-passing/route-report/types.ts"), exports);


/***/ }),

/***/ "./libs/shared/src/lib/no-passing/route-report/types.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./libs/shared/src/lib/shared.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shared = void 0;
function shared() {
    return 'shared';
}
exports.shared = shared;


/***/ }),

/***/ "./libs/shared/src/lib/types.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["NO_PASSING_ROUTE_REPORT"] = "NO_PASSING_ROUTE_REPORT";
    ReportType["NO_PASSING_ROUTE_GRAPHICAL_ZONES_REPORT"] = "NO_PASSING_ROUTE_GRAPHICAL_ZONES_REPORT";
})(ReportType = exports.ReportType || (exports.ReportType = {}));


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
const router_1 = __webpack_require__("./apps/api/src/app/report-generator/router.ts");
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
app.use("/api/report-generator", router_1.reportGeneratorRouter);
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' });
});
app.get('/generate-report', (req, res) => {
    res.sendFile(path.join(__dirname + '/assets/index.html'));
});
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