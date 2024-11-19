const bcrypt = require("bcrypt")

export const hashPassword = async (password: string) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        console.log(error);
    }
}


