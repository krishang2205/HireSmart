const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', ctrl.signup);
router.get('/verify-email', ctrl.verifyEmail);
router.post('/login', ctrl.login);
router.post('/password-reset/request', ctrl.requestPasswordReset);
router.post('/password-reset/confirm', ctrl.resetPassword);
router.get('/me', protect, ctrl.me);

module.exports = router;
