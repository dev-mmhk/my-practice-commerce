import { Optional } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEmail, IsMobilePhone, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateUserDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({message: "This is not a name."})
    @ApiProperty()
    name: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail({},{message: "This is not a valid email"})
    email: string;
    
    
    @ApiPropertyOptional()
    // @IsPhoneNumber()
    @IsOptional()
    @Length(8, 15,{message: "Mobile number must be between 8 to 15 characters"})
    @IsString({message: "This is not a number"})
    // @IsMobilePhone("bn-BD",{message: "This is not a Bangladeshi mobile number"})
    mobile: string;

    @ApiPropertyOptional()
    @Optional()
    @IsString({message: "This is not a password"})
    @Length(5, 15, {message: "Password must be between 5 to 15 characters"})
    password: string;
    
    @ApiPropertyOptional()
    @Optional()
    @IsNumber()
    // @ApiProperty({type: Number})
    roleId: number;
}

