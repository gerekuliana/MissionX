import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEmailDomainValid', async: false })
export class IsEmailDomainValidConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
        const allowedDomain = args.constraints[0] as string;
        if (!email || typeof email !== 'string') {
            return false;
        }
        const emailDomain = email.split('@')[1];
        return emailDomain === allowedDomain;
    }

    defaultMessage(args: ValidationArguments) {
        const allowedDomain = args.constraints[0] as string;
        return `Email must be from the @${allowedDomain} domain`;
    }
}

export function IsEmailDomain(allowedDomain: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [allowedDomain],
            validator: IsEmailDomainValidConstraint,
        });
    };
}
