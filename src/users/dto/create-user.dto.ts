import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ 
        description: 'Nombre del usuario', 
        example: 'Juan Pérez' 
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ 
        description: 'Correo electrónico del usuario', 
        example: 'juan.perez@example.com' 
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ 
        description: 'Contraseña del usuario', 
        example: 'MiContraseña123',
        minLength: 6 
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ 
        description: 'Rol del usuario', 
        example: 'admin',
        enum: ['admin', 'user', 'moderator'] 
    })
    @IsNotEmpty()
    @IsString()
    rol: string;
}