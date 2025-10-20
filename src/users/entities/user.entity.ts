import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ 
        description: 'ID único del usuario', 
        example: 'uuid-123-456-789' 
    })
    id: string;

    @ApiProperty({ 
        description: 'Nombre del usuario', 
        example: 'Juan Pérez' 
    })
    name: string;

    @ApiProperty({ 
        description: 'Correo electrónico del usuario', 
        example: 'juan.perez@example.com' 
    })
    email: string;

    @ApiProperty({ 
        description: 'Contraseña encriptada del usuario' 
    })
    password: string;

    @ApiProperty({ 
        description: 'Rol del usuario', 
        example: 'admin',
        enum: ['admin', 'user', 'moderator'] 
    })
    rol: string;

    @ApiProperty({ 
        description: 'Fecha de creación del usuario', 
        example: '2023-01-01T00:00:00.000Z' 
    })
    created_at?: Date;

    @ApiProperty({ 
        description: 'Fecha de última actualización del usuario', 
        example: '2023-01-01T00:00:00.000Z' 
    })
    updated_at?: Date;
}