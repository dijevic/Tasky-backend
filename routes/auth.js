// // path : '/api/v1/auth'

const { Router } = require('express')
const { check } = require('express-validator')
const { registerUser, registrationCheckingEmail, loginUser, ForgotPassword, changePaswword, renewUserToken } = require('../controllers/auth')
const { validEmail, notValidEmail } = require('../middlewares/dbVallidator')
const validarCampos = require('../middlewares/validate')
const { validarRegistrationJWT, validarResetJwt, validarJwt } = require('../middlewares/verifyJWT')

const router = Router()


// login
router.post('/login', [

    check('email', 'email is required').isEmail(),
    check('email').custom(notValidEmail),
    check('password', 'password is required').not().isEmpty(),
    validarCampos
], loginUser)


router.post('/register',
    [
        validarRegistrationJWT
    ], registerUser)



router.get('/renew',
    [
        validarJwt,

    ], renewUserToken)


router.put('/forgot-password',

    [
        check('email', 'debe ser un correo valido').isEmail(),
        check('password', 'debe ser de mas de 6 digitos la clave').isLength({ min: 6 }),
        validarCampos

    ], ForgotPassword)

router.put('/change-password',

    [
        validarResetJwt

    ], changePaswword)

router.post('/validate-email',
    [
        check('email', 'must be an valid email').isEmail().bail(),
        check('email', 'email already exist').custom(validEmail).bail(),

        check('password', 'password length must be over 6').isLength({ min: 6 }).bail(),
        check('name', 'name is required').not().isEmpty().bail(),
        validarCampos

    ], registrationCheckingEmail)




module.exports = router



