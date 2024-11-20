import { IsNotEmpty } from "class-validator"

export class LoginAuthDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string
}
