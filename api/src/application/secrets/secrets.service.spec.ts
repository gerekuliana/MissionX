import { Test, TestingModule } from '@nestjs/testing';
import { SecretService } from './secrets.service';
import { ISecretStorage, SECRET_STORAGE } from '../../domain/secrets/secret-storage.interface';
import { SecretKey } from '../../domain/enums/secret-key.enum';
import { SecretDto } from './dto/secret.dto';

describe('SecretService', () => {
    let service: SecretService;
    let mockSecretStorage: jest.Mocked<ISecretStorage>;

    beforeEach(async () => {
        mockSecretStorage = {
            getSingle: jest.fn(),
            getMultiple: jest.fn(),
            set: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SecretService,
                {
                    provide: SECRET_STORAGE,
                    useValue: mockSecretStorage,
                },
            ],
        }).compile();

        service = module.get<SecretService>(SecretService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        it('should inject secret storage dependency', () => {
            expect(mockSecretStorage).toBeDefined();
        });
    });

    describe('constructSecretName', () => {
        it('should construct secret name with valid tenant ID and key', () => {
            const tenantId = 'test-tenant-123';
            const key = SecretKey.STRIPE;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--test-tenant-123--Stripe');
        });

        it('should replace special characters in key with hyphens', () => {
            const tenantId = 'test-tenant';
            const key = 'Test@Key#With$Special%Chars!' as SecretKey;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--test-tenant--Test-Key-With-Special-Chars-');
        });

        it('should handle empty tenant ID', () => {
            const tenantId = '';
            const key = SecretKey.OPEN_AI;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant----OpenAI');
        });

        it('should handle empty key', () => {
            const tenantId = 'test-tenant';
            const key = '' as SecretKey;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--test-tenant--');
        });

        it('should handle key with only special characters', () => {
            const tenantId = 'test-tenant';
            const key = '@#$%^&*()' as SecretKey;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--test-tenant-----------');
        });

        it('should preserve alphanumeric characters and hyphens in key', () => {
            const tenantId = 'test-tenant';
            const key = 'Test-Key-123' as SecretKey;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--test-tenant--Test-Key-123');
        });

        it('should handle tenant ID with special characters', () => {
            const tenantId = 'tenant@123#test';
            const key = SecretKey.STRIPE;
            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--tenant@123#test--Stripe');
        });
    });

    describe('getSecret', () => {
        it('should return secret with value when storage returns value', async () => {
            const tenantId = 'test-tenant';
            const key = SecretKey.STRIPE;
            const secretValue = 'sk_test_123456';

            mockSecretStorage.getSingle.mockResolvedValue(secretValue);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--test-tenant--Stripe');
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: secretValue,
            });
        });

        it('should return secret with null value when storage returns null', async () => {
            const tenantId = 'test-tenant';
            const key = SecretKey.OPEN_AI;

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--test-tenant--OpenAI');
            expect(result).toEqual({
                key: SecretKey.OPEN_AI,
                value: null,
            });
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const key = SecretKey.STRIPE;
            const secretValue = 'test-value';

            mockSecretStorage.getSingle.mockResolvedValue(secretValue);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant----Stripe');
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: secretValue,
            });
        });

        it('should handle storage error', async () => {
            const tenantId = 'test-tenant';
            const key = SecretKey.STRIPE;
            const error = new Error('Storage error');

            mockSecretStorage.getSingle.mockRejectedValue(error);

            await expect(service.getSecret(tenantId, key)).rejects.toThrow('Storage error');
            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--test-tenant--Stripe');
        });

        it('should handle empty string value from storage', async () => {
            const tenantId = 'test-tenant';
            const key = SecretKey.STRIPE;

            mockSecretStorage.getSingle.mockResolvedValue('');

            const result = await service.getSecret(tenantId, key);

            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: '',
            });
        });
    });

    describe('getAllSecrets', () => {
        it('should return all secrets with values', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--Stripe': 'sk_test_123',
                'tenant--test-tenant--OpenAI': 'sk-openai-456',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant--test-tenant--Stripe',
                'tenant--test-tenant--OpenAI',
            ]);
            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: 'sk_test_123' },
                { key: SecretKey.OPEN_AI, value: 'sk-openai-456' },
            ]);
        });

        it('should handle missing secrets with null values', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--Stripe': 'sk_test_123',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: 'sk_test_123' },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });

        it('should return null for all secrets when storage returns empty record', async () => {
            const tenantId = 'test-tenant';

            mockSecretStorage.getMultiple.mockResolvedValue({});

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: null },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });

        it('should handle null values in storage response', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--Stripe': null,
                'tenant--test-tenant--OpenAI': 'sk-openai-456',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: null },
                { key: SecretKey.OPEN_AI, value: 'sk-openai-456' },
            ]);
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const secretsRecord: Record<string, string | null> = {
                'tenant----Stripe': 'value1',
                'tenant----OpenAI': 'value2',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant----Stripe',
                'tenant----OpenAI',
            ]);
            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: 'value1' },
                { key: SecretKey.OPEN_AI, value: 'value2' },
            ]);
        });

        it('should handle storage error', async () => {
            const tenantId = 'test-tenant';
            const error = new Error('Storage error');

            mockSecretStorage.getMultiple.mockRejectedValue(error);

            await expect(service.getAllSecrets(tenantId)).rejects.toThrow('Storage error');
        });

        it('should handle empty string values from storage', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--Stripe': '',
                'tenant--test-tenant--OpenAI': '',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: '' },
                { key: SecretKey.OPEN_AI, value: '' },
            ]);
        });

        it('should handle undefined values as null', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--Stripe': 'value1',
                'tenant--test-tenant--OpenAI': undefined as any,
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: 'value1' },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });
    });

    describe('setSecret', () => {
        it('should set secret with valid value', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk_test_123456',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant--Stripe',
                'sk_test_123456',
            );
        });

        it('should set secret with null value', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: null,
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant--test-tenant--OpenAI', null);
        });

        it('should handle empty string value', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: '',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant--test-tenant--Stripe', '');
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'test-value',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant----Stripe', 'test-value');
        });

        it('should handle storage error', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk_test_123456',
            };
            const error = new Error('Storage write error');

            mockSecretStorage.set.mockRejectedValue(error);

            await expect(service.setSecret(tenantId, secretDto)).rejects.toThrow(
                'Storage write error',
            );
            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant--Stripe',
                'sk_test_123456',
            );
        });

        it('should handle very long secret value', async () => {
            const tenantId = 'test-tenant';
            const longValue = 'x'.repeat(10000);
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: longValue,
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant--Stripe',
                longValue,
            );
        });

        it('should handle special characters in value', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: 'sk_test!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant--OpenAI',
                'sk_test!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~',
            );
        });

        it('should not mutate the input DTO', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'original-value',
            };
            const originalDto = { ...secretDto };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(secretDto).toEqual(originalDto);
        });
    });

    describe('edge cases and comprehensive coverage', () => {
        it('should handle concurrent getSecret calls', async () => {
            const tenantId = 'test-tenant';
            mockSecretStorage.getSingle.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve('value'), 10)),
            );

            const promises = [
                service.getSecret(tenantId, SecretKey.STRIPE),
                service.getSecret(tenantId, SecretKey.OPEN_AI),
            ];

            const results = await Promise.all(promises);

            expect(results).toHaveLength(2);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(2);
        });

        it('should handle concurrent setSecret calls', async () => {
            const tenantId = 'test-tenant';
            mockSecretStorage.set.mockResolvedValue(undefined);

            const promises = [
                service.setSecret(tenantId, { key: SecretKey.STRIPE, value: 'value1' }),
                service.setSecret(tenantId, { key: SecretKey.OPEN_AI, value: 'value2' }),
            ];

            await Promise.all(promises);

            expect(mockSecretStorage.set).toHaveBeenCalledTimes(2);
        });

        it('should handle unicode characters in tenant ID', async () => {
            const tenantId = 'тест-тенант-😀';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'test-value',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--тест-тенант-😀--Stripe',
                'test-value',
            );
        });

        it('should handle whitespace in values', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: '  value with spaces  ',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant--Stripe',
                '  value with spaces  ',
            );
        });

        it('should maintain order of secrets in getAllSecrets', async () => {
            const tenantId = 'test-tenant';
            const secretsRecord: Record<string, string | null> = {
                'tenant--test-tenant--OpenAI': 'value2',
                'tenant--test-tenant--Stripe': 'value1',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result[0].key).toBe(SecretKey.STRIPE);
            expect(result[1].key).toBe(SecretKey.OPEN_AI);
        });
    });
});
