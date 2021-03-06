const
    Super = require('./super.js'),
    dateFormat = require('dateformat');


module.exports = class Log extends Super {

    constructor(args) {
        super(args);
        this.name = 'logger';
        this.label = 'LOGGER';
    }

    log() {
        if (DEBUG === false) {
            return false;
        }
        let output = [
            '[',
            dateFormat(new Date(), "H:MM:ss - d.m.yyyy"),
            ']'
        ].concat(Array.from(arguments));
        console.log.apply(console, output);
    }
};