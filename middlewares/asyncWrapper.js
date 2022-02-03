const asyncWrapper = (fn) => {
    return async (req, res) => {

        try {
            await fn(req, res)
        } catch (e) {
            throw new Error(e)
        }

    }
}

module.exports = asyncWrapper