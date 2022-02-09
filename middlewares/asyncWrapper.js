const asyncWrapper = (fn) => {
    return async (req, res) => {

        try {
            await fn(req, res)
        } catch (e) {
            res.json({ msg: e })
            console.log(e)
            // throw new Error(e)
        }

    }
}

module.exports = asyncWrapper