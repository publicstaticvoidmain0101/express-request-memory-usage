'use strict';

let { getTable } = require('console.table');

let getUsageString = value => `${Math.round(value / 1024 / 1024 * 100) / 100} MB`;
let getUsageTable = (usageOnStart, usageOnFinish) => {
    let result = { start: {}, finish: {} };

    Object.keys(usageOnStart).forEach((key) => {
        result.start[key] = getUsageString(usageOnStart[key]);
        result.finish[key] = getUsageString(usageOnFinish[key]);
    });

    return getTable(result);
};

let getMiddleware = logger => (req, res, next) => {
    let usageOnStart = process.memoryUsage();

    next();
    res.once('finish', () => {
        let usageOnFinish = process.memoryUsage();

        let table = getUsageTable(usageOnStart, usageOnFinish);

        logger(table);
    });


};

module.exports = getMiddleware;
