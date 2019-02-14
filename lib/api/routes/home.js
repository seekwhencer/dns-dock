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

router.get('/restart', async (req, res, next) => {
    const options = {
    };

    try {
        ENGINE.restart();
        return res.json({
            action: 'restart',
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
