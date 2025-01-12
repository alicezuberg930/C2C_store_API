import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { paymentMethods, transactionStatuses, transactionTypes } from "../enum";
import { Types } from "mongoose";

export class CreateTransactionDto {
    @IsNotEmpty({ message: "Người dùng không được trống" })
    userId: Types.ObjectId;

    @IsEnum(transactionTypes, { message: "Loại giao dịch không hợp lệ" })
    type: string;

    @IsNotEmpty({ message: "Số tiền không được trống" })
    @IsNumber({}, { message: "Số tiền phải là số" })
    amount: number;

    @IsEnum(transactionStatuses, { message: "Trạng thái giao dịch không hợp lệ" })
    @IsNotEmpty({ message: "Trạng thái giao dịch không được thiếu" })
    status: string;

    @IsOptional()
    description: string;

    @IsEnum(paymentMethods, { message: "Phương thức thanh toán không hợp lệ" })
    paymentMethod: string;
}