const bcrypt = require("bcrypt")

export const hashPassword = async (password: string) => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        return false;
    }
}