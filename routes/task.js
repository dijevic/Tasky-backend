const { Router } = require('express')
const { check } = require('express-validator')
const validarCampos = require('../middlewares/validate')
const { validarJwt } = require('../middlewares/verifyJWT')
const { CreateTask, getTasks, deleteTask, updateTask, getTasksByUser, getTasksById } = require('../controllers/task')



const router = Router()

router.get('/', getTasks)

router.get('/id/:uuid',
    [
        check('uuid', 'id is mandatory').isUUID('4')
    ],
    getTasksById)

router.get('/user/',
    [

        validarJwt

    ], getTasksByUser)

router.post('/',
    [
        check('title', 'the description is mandatory').not().isEmpty(),
        validarCampos,
        validarJwt

    ], CreateTask)


router.put('/:uuid',
    [
        check('uuid', 'invalid value for the uuid').isUUID('4'),
        validarCampos,
        validarJwt
    ], updateTask)

router.delete('/:uuid',
    [
        validarJwt
    ], deleteTask)

module.exports = router