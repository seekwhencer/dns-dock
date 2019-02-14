const
    Event = require('events'),
    formidable = require('formidable');

module.exports = class Server {

    constructor(args) {
        this.name = 'frontend';
        this.label = 'FRONTEND';
        LOG(this.label, 'INIT');

        this.args = args;
        this.defaults = CONFIG[this.name];
        this.options = {};
        this.event = new Event();

        this.mergeOptions();

        APP.use('/', EXPRESS.static(`${APP_DIR}/statics`));
        LOG(this.label, 'READY');
    }

    mergeOptions() {
        if (typeof this.args === 'object') {
            this.options = R.merge(this.defaults, this.args);
        } else {
            this.options = this.defaults;
        }
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }
};