const { response, request } = require('express')
const Task = require('../models/Task')
const Usuario = require('../models/Usuario')
const Category = require('../models/Category')
const asyncWrapper = require('../middlewares/asyncWrapper')


const CreateTask = asyncWrapper(async (req = request, res = response) => {

    const { description, task_category } = req.body
    const user = req.usuario

    const category = await Category.findOne({ where: { uuid: task_category } })
    const task = await Task.create({ description, user_id: user.getDataValue('id'), category_id: category.getDataValue('id') })

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        task

    })


})
const getTasks = asyncWrapper(async (req = request, res = response) => {

    const tasks = await Task.findAll({ include: [`task_category`, 'user'] })
    const total = await Task.count()

    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        tasks,
        total

    })


})
const getTasksByUser = asyncWrapper(async (req = request, res = response) => {


    const user = req.usuario

    const rows = await Task.findAll({
        where: {
            user_id: user.getDataValue('id')
        },
        include: {
            model: Category,
            as: 'task_category',
            attributes: ['uuid', 'name']
        }
    })
    res.json({
        ok: true,
        status: 200,
        msg: `success`,
        tasks: rows


    })


})
const getTasksById = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params

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

})


const deleteTask = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params

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


})
const updateTask = asyncWrapper(async (req = request, res = response) => {

    const { uuid } = req.params
    const { uuid: id, creatinDate, ...body } = req.body



    const task = await Task.findOne({
        where: { uuid },
        include: {
            model: Category,
            as: 'task_category',
            attributes: ['uuid', 'name']
        }
    })

    if (!task) {
        return res.status(404).json({
            ok: false,
            status: 404,
            msg: `something went wrong, there is not a task with that id`,
        })
    }

    task.set(body)
    await task.save()

    res.json({
        ok: true,
        status: 200,
        msg: `task updated successfully!`,
        task


    })



})



module.exports = {
    CreateTask,
    getTasks,
    deleteTask,
    updateTask,
    getTasksByUser,
    getTasksById
}