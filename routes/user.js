const { Router } = require('express')
const { check } = require('express-validator')
const validarCampos = require('../middlewares/validate')
const { validarJwt } = require('../middlewares/verifyJWT')
const { validEmail, notValidEmail } = require('../middlewares/dbVallidator')
const { updateUser, getUsers, getUser, deleteUser } = require('../controllers/user')




const router = Router()

router.get('/', getUsers)

router.get('/:id', getUser)

router.put('/',
    [
        validarJwt,
    ],
    updateUser)
router.delete('/:id',
    [
        validarJwt
    ],
    deleteUser)

module.exports = router