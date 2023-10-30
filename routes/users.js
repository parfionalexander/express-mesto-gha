const router = require('express').Router();

const {
  getUsers,
  getUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const {
  getUserByIdValidation,
  upgradeUserInfoValidation,
  upgradeUserAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserByIdValidation, getUserById);
router.patch('/me', upgradeUserInfoValidation, updateUserInfo);
router.patch('/me/avatar', upgradeUserAvatarValidation, updateUserAvatar);

module.exports = router;
