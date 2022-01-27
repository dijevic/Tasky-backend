const { response, request } = require('express')
const Category = require('../models/Category')

const CreateCategory = async (req = request, res = response) => {

    const { name } = req.body
    const user = req.usuario

    try {

        const category = await Category.create({ name, category_user_id: user.getDataValue('id') })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            category

        })

    } catch (e) {
        throw new Error(e)
    }

}
const getCategories = async (req = request, res = response) => {


    try {
        const categories = await Category.findAll()
        const total = await Category.count()

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            categories,
            total

        })

    } catch (e) {
        throw new Error(e)
    }

}
const getCategoriesByUser = async (req = request, res = response) => {



    try {
        const user = req.usuario

        const { rows, count } = await Category.findAndCountAll({ where: { category_user_id: user.getDataValue('id') } })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            categories: rows,
            total: count,
            user: 'by user'

        })

    } catch (e) {
        throw new Error(e)
    }

}
const getCategoryById = async (req = request, res = response) => {

    const { uuid } = req.params
    try {


        const category = await Category.findOne({ where: { uuid } })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            category

        })

    } catch (e) {
        throw new Error(e)
    }

}


const deleteCategory = async (req = request, res = response) => {

    const { uuid } = req.params


    try {
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

    } catch (e) {
        throw new Error(e)
    }

}
const updateCategory = async (req = request, res = response) => {

    const { uuid } = req.params
    const { uuid: id, ...body } = req.body




    try {
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

    } catch (e) {
        throw new Error(e)
    }

}




module.exports = {
    CreateCategory,
    getCategories,
    getCategoriesByUser,
    getCategoryById,
    deleteCategory,
    updateCategory
}