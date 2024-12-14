import { IsEmail, IsNotEmpty, Length, Matches, Max, Min } from "class-validator";

export class ConfigDto {
    @IsNotEmpty({ message: "Tên người dùng không được để trống" })
    company: string

    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    @Length(10, 10, { message: "Số điện thoại phải chứa đúng 10 ký tự" })
    @Matches(/^[0-9]*$/, { message: "Số điện thoại chỉ được chứa số" })
    phone: string

    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    @Length(10, 10, { message: "Số điện thoại phải chứa đúng 10 ký tự" })
    @Matches(/^[0-9]*$/, { message: "Số điện thoại chỉ được chứa số" })
    hotline: string

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string

    @IsNotEmpty({ message: "Giờ hoạt động không được để trống" })
    openHour: string

    slogan: string

    googleMap: string

    @IsEmail({}, { message: "Email sai định dạng" })
    email: string

    zaloChatURL: string

    facebookChatURL: string

    facebookPage: string

    googlePage: string

    youtubePage: string

    @IsNotEmpty({ message: "Thông tin footer Fkhông được để trống" })
    footerInfo: string

    footerContact: string
}
