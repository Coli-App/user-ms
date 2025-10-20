import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ 
        description: 'Nueva contraseña del usuario (opcional)', 
        example: 'NuevaContraseña123',
        required: false,
        minLength: 6 
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}