import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTenantDto {
    @ApiProperty({
        description: 'Name of the tenant',
        example: 'Updated Corporation Name',
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({
        description: 'Billing contact name for the tenant',
        example: 'Jane Doe',
        required: false,
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    billingContact?: string;
}
