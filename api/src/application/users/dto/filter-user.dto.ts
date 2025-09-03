import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsArray, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterUsersDto {
    @ApiPropertyOptional({
        description: 'Filter by email (partial match)',
        example: 'john@example.com',
    })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional({
        description: 'Filter by name (partial match on first or last name)',
        example: 'John',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        description: 'Filter by active status',
        example: true,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by role IDs',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') return [value];
        return value;
    })
    @IsArray()
    @IsUUID('4', { each: true })
    roleIds?: string[];
}