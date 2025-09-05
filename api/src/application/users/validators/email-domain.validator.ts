import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isHoneycombSoftEmail', async: false })
export class IsHoneycombSoftEmailConstraint implements ValidatorConstraintInterface {
    validate(email: string): boolean {
        if (!email || typeof email !== 'string') {
            return false;
        }

        // Check for valid email format first
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }

        return email.toLowerCase().endsWith('@honeycombsoft.com');
    }

    defaultMessage(): string {
        return 'Email must be from @honeycombsoft.com domain';
    }
}

export function IsHoneycombSoftEmail(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsHoneycombSoftEmailConstraint,
        });
    };
}
