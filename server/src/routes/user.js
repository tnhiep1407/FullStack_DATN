const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  register,
  login,
  changePassword
} = require('../controllers/userController')

// Thiết lập multer để xử lý FormData
const upload = multer()

router.post('/register', upload.none(), register)
router.post('/login', upload.none(), login)
router.put('/changePassword', upload.none(), changePassword)

module.exports = router // như là export default
