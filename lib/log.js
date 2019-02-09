const Event = require('events'),
    dateFormat = require('dateformat');

/**
 * the logger
 *
 * @param args
 * @returns {module.log|*}
 */
module.exports = function (args) {
    const defaults = {},
        event = new Event();
    let options = defaults;

    function mergeOptions() {
        if (args) {
            if (args.options) {
                if (typeof args.options === 'object')
                    options = R.merge(defaults, args.options);
            }
        }
    }

    function init() {
        mergeOptions();
    }

    function log() {
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

    function on() {
        event.on.apply(event, Array.from(arguments));
    }

    function emit() {
        event.emit.apply(event, Array.from(arguments));
    }

    init();

    return log;

};