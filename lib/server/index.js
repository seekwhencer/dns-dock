const
    Event = require('events'),
    Api = require('./api'),
    Frontend = require('./frontend'),
    formidable = require('formidable');

module.exports = class Server {

    constructor(args) {
        this.name = 'server';
        this.label = 'SERVER';
        LOG(this.label, 'INIT');

        this.args = args;
        this.defaults = CONFIG[this.name];
        this.options = {};
        this.event = new Event();

        this.mergeOptions();

        if (ENV === 'pihole') {
            const Pihole = require(`${APP_DIR}/lib/pihole`);
            this.engine = new Pihole();
        } else {
            const DnsMasq = require(`${APP_DIR}/lib/dnsmasq`);
            this.engine = new DnsMasq();
        }

        APP.use((req, res, next) => {
            const form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if (err) {
                    LOG(name, 'FORMIDABLE ERROR', err, fields);
                }
                if (Object.keys(fields).length > 0) {
                    req.formData = fields;
                    // for passport
                    if (req.originalUrl === '/login') {
                        if (fields.email) req.query.email = fields.email;
                        if (fields.password) req.query.password = fields.password;
                    }
                }
                next();
            });
        });


        this.api = new Api();
        this.frontend = new Frontend();

        //
        APP.listen(this.options.port, this.onListen.bind(this));
    }

    mergeOptions() {
        if (typeof this.args === 'object') {
            this.options = R.merge(this.defaults, this.args);
        } else {
            this.options = this.defaults;
        }
    }

    onListen() {
        LOG(this.label, '>>> READY');
    }

    getAddresses(){
        return this.engine.getAddresses();
    }

    addAddress(address){
        return this.engine.addAddress(address);
    }

    deleteAddress(id){
        return this.engine.deleteAddress(id);
    }

    on() {
        this.event.on.apply(this.event, Array.from(arguments));
    }

    emit() {
        this.event.emit.apply(this.event, Array.from(arguments));
    }


};