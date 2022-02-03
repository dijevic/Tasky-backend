const { response, request } = require('express')
const asyncWrapper = require('../middlewares/asyncWrapper')
const Category = require('../models/Category')

const CreateCategory = asyncWrapper(async (req = request, res = response) => {

    const { name } = req.body
    const user = req.usuario



    const category = await Category.create({ name, category_user_id: user.getDataValue('id') })

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        category

    })



})
const getCategories = asyncWrapper(async (req = request, res = response) => {



    const categories = await Category.findAll()
    const total = await Category.count()

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        categories,
        total

    })



})
const getCategoriesByUser = asyncWrapper(async (req = request, res = response) => {




    const user = req.usuario

    const { rows, count } = await Category.findAndCountAll({ where: { category_user_id: user.getDataValue('id') } })

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        categories: rows,
        total: count,

    })



})
const getCategoryById = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params



    const category = await Category.findOne({ where: { uuid } })

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        category

    })



})


const deleteCategory = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params



    const category = await Category.findOne({ where: { uuid } })

    if (!category) {
        return res.status(404).json({
            ok: false,
            status: 404,
            msg: `something went wrong, there is not a category with that id`,
        })
    }

    await category.destroy()


    res.json({
        ok: true,
        status: 200,
        msg: `category deleted successfully!`,


    })



})
const updateCategory = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params
    const { uuid: id, ...body } = req.body

    const category = await Category.findOne({ where: { uuid } })

    if (!category) {
        return res.status(404).json({
            ok: false,
            status: 404,
            msg: `something went wrong, there is not a category with that id`,
        })
    }

    category.set(body)

    await category.save()


    res.json({
        ok: true,
        status: 200,
        msg: `category updated successfully!`,
        category


    })

})




module.exports = {
    CreateCategory,
    getCategories,
    getCategoriesByUser,
    getCategoryById,
    deleteCategory,
    updateCategory
}