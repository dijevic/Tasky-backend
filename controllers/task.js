const { response, request } = require('express')
const Task = require('../models/Task')
const Usuario = require('../models/Usuario')
const Category = require('../models/Category')

const CreateTask = async (req = request, res = response) => {

    const { description, task_category } = req.body
    const user = req.usuario

    try {
        const category = await Category.findOne({ where: { uuid: task_category } })
        const task = await Task.create({ description, user_id: user.getDataValue('id'), category_id: category.getDataValue('id') })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            task

        })

    } catch (e) {
        throw new Error(e)
    }

}
const getTasks = async (req = request, res = response) => {


    try {
        const tasks = await Task.findAll({ include: [`task_category`, 'user'] })
        const total = await Task.count()

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            tasks,
            total

        })

    } catch (e) {
        throw new Error(e)
    }

}
const getTasksByUser = async (req = request, res = response) => {



    try {
        const user = req.usuario

        const rows = await Task.findAll({
            where: {
                user_id: user.getDataValue('id')
            },
            include: {
                model: Category,
                as: 'task_category',
                attributes: ['uuid']
            }
        })
        console.log(rows)
        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            rows


        })

    } catch (e) {
        console.log(e)
        // throw new Error(e)
    }

}
const getTasksById = async (req = request, res = response) => {

    const { uuid } = req.params

    try {
        const user = await Usuario.findOne({ where: { uuid } })
        if (!user) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: `something went wrong, user does not exist`,
            })
        }

        const task = await Task.findAll({ where: { user_id: user.getDataValue('id') } })

        res.json({
            ok: true,
            status: 200,
            msg: `success`,
            task

        })

    } catch (e) {
        console.log(e)
        // throw new Error(e)
    }

}


const deleteTask = async (req = request, res = response) => {

    const { uuid } = req.params


    try {
        const task = await Task.findOne({ where: { uuid } })

        if (!task) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: `something went wrong, there is not a task with that id`,
            })
        }

        await task.destroy()


        res.json({
            ok: true,
            status: 200,
            msg: `task deleted successfully!`,


        })

    } catch (e) {
        throw new Error(e)
    }

}
const updateTask = async (req = request, res = response) => {

    const { uuid } = req.params
    const { uuid: id, creatinDate, ...body } = req.body




    try {
        const task = await Task.findOne({ where: { uuid } })

        if (!task) {
            return res.status(404).json({
                ok: false,
                status: 404,
                msg: `something went wrong, there is not a task with that id`,
            })
        }

        task.set(body)
        console.log(body)
        // task.description = description

        await task.save()


        res.json({
            ok: true,
            // status: 200,
            // msg: `task updated successfully!`,
            task


        })

    } catch (e) {
        throw new Error(e)
    }

}




module.exports = {
    CreateTask,
    getTasks,
    deleteTask,
    updateTask,
    getTasksByUser,
    getTasksById
}