const { Router } = require('express')
const { check } = require('express-validator')
const validarCampos = require('../middlewares/validate')
const { validarJwt } = require('../middlewares/verifyJWT')
const { getCategories,
    CreateCategory,
    getCategoriesByUser,
    deleteCategory,
    updateCategory,
    getCategoryById
} = require('../controllers/category')
const { validateCategory } = require('../middlewares/dbVallidator')



const router = Router()

router.get('/', getCategories)

router.get('/:uuid',
    [
        check('uuid', 'invalid id').isUUID('4'),
        validarCampos
    ],
    getCategoryById)

router.get('/user/categories',
    [
        validarCampos,
        validarJwt
    ],
    getCategoriesByUser)

router.post('/',
    [
        validarJwt,
        check('name').custom(validateCategory),
        validarCampos
    ]
    , CreateCategory)
router.post('/',
    [
        validarJwt,
        check('name').custom(validateCategory),
        validarCampos
    ]
    , CreateCategory)
router.delete('/:uuid',
    [
        validarJwt,
        check('uuid').exists().isUUID('4'),
        validarCampos
    ]
    , deleteCategory)
router.put('/:uuid',
    [
        validarJwt,
        check('uuid').exists().isUUID('4'),
        check('name', 'name is required').exists().not().isEmpty(),
        validarCampos
    ]
    , updateCategory)





module.exports = router