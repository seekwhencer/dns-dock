const fs = require("fs-extra");
/**
 * autoloads config files from the config folder by the given environment NODE_ENV
 */
module.exports = function () {
    const name = 'APP CONFIG';
    let path = null;
    let keys = [];
    let data = {
        load: load,
        get: get,
        set: set,
        getAll: getAll,
        setAll: setAll
    };
    const excludes = Object.keys(data);


    function init() {
        LOG(name, 'INIT', ENV);
        path = `${APP_DIR}/config/${ENV}`;
        load();
        display();
        LOG(name, '>>> READY');
    }

    function load() {
        fs.readdirSync(path).forEach(function (file) {
            LOG(name, 'READING FILE:', file);
            let key = file.replace(/\.js/, '').toLowerCase();
            if (excludes.includes(key)) {
                return false;
            }
            let req = require(`${path}/${file}`);
            set(key, req);
        });

        if (keys.length === 0) {
            LOG(name, 'NO FILE FOUND');
        } else {
            LOG(name, keys.length, 'FILES LOADED');
        }
    }

    function get(key) {
        if (excludes.includes(key)) {
            return false;
        }
        if (key) {
            return data[key];
        } else {
            return getAll();
        }
    }

    function getAll() {
        let conf = {};
        for (let k in keys) {
            conf[keys[k]] = get(keys[k]);
        }
        return conf;
    }

    function set(key, value) {
        if (typeof key === 'string' && value) {
            if (excludes.includes(key)) {
                return false;
            }
            data[key] = value;
            keys.push(key);
        }
        if (typeof key === 'object' && !value) {
            setAll(key);
        }
        return true;
    }

    function setAll(data) {
        for (let c in data) {
            set(c, data[c]);
        }
        return true;
    }

    function display() {
        const conf = getAll();
        //LOG(name, '\n', conf);
    }

    init();

    return data;
};