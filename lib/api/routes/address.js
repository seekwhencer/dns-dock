const router = new EXPRESS.Router();

router.get('/', async (req, res, next) => {
    try {
        const addresses = ENGINE.getAddresses();
        return res.json(addresses);
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: 'Server Error',
            data: err
        });
    }
});

router.post('/add', async (req, res, next) => {
    const options = {
        source: req.formData.source,
        target: req.formData.target,
    };

    try {
        ENGINE.addAddress(options);

        return res.json({
            action: 'add',
            options: options,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: 'Server Error',
            data: err
        });
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        ENGINE.deleteAddress(req.params.id);

        return res.json({
            action: 'delete',
            id: req.params.id
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            error: 'Server Error',
            data: err
        });
    }
});

module.exports = router;
