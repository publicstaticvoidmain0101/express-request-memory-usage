'use strict';

let Table = require('cli-table');

const types = [
    'rss',
    'heapTotal',
    'heapUsed',
    'external',
];

let getUsageString = value => `${Math.round(value / 1024 / 1024 * 100) / 100} MB`;
let getUsageStats = (usageOnStart, usageOnFinish) => {
    let result = { start: {}, finish: {} };

    types.forEach((key) => {
        result.start[key] = getUsageString(usageOnStart[key]);
        result.finish[key] = getUsageString(usageOnFinish[key]);
    });

    return result;
};
let getUsageTable = usageStats => {
    let table = new Table({ head: ['', ...types] });

    Object.keys(usageStats).forEach(stage => {
        let stageStats = usageStats[stage];
        let values = types.map(type => stageStats[type]);

        table.push({[stage]: values});
    });

    return table.toString();
};

let getMiddleware = logger => (req, res, next) => {
    let usageOnStart = process.memoryUsage();

    next();
    res.once('finish', () => {
        let usageOnFinish = process.memoryUsage();
        let usageStats = getUsageStats(usageOnStart, usageOnFinish);
        let table = getUsageTable(usageStats);

        logger(table);
    });


};

module.exports = getMiddleware;
