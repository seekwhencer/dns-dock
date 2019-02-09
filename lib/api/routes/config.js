const router = new EXPRESS.Router();

router.get('/', async (req, res, next) => {
    const options = {
    };

    try {
        return res.json({
            action: 'index',
            options: options
        });
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
        address: req.formData.address,
    };

    try {
        return es.json({
            action: 'add',
            options: options
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
