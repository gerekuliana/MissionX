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

    describe('getSecret', () => {
        it('should retrieve a secret for a valid tenant and key', async () => {
            const tenantId = 'tenant-123';
            const key = SecretKey.STRIPE;
            const expectedValue = 'sk_test_123456789';
            const expectedSecretName = 'tenant--tenant-123--Stripe';

            mockSecretStorage.getSingle.mockResolvedValue(expectedValue);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: expectedValue,
            });
        });

        it('should return null value when secret does not exist', async () => {
            const tenantId = 'tenant-456';
            const key = SecretKey.OPEN_AI;
            const expectedSecretName = 'tenant--tenant-456--OpenAI';

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(result).toEqual({
                key: SecretKey.OPEN_AI,
                value: null,
            });
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const key = SecretKey.STRIPE;
            const expectedSecretName = 'tenant----Stripe';

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: null,
            });
        });

        it('should handle null tenant ID', async () => {
            const tenantId = null as any;
            const key = SecretKey.STRIPE;
            const expectedSecretName = 'tenant--null--Stripe';

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: null,
            });
        });

        it('should sanitize special characters in key names', async () => {
            const tenantId = 'tenant-123';
            // Test with a key that would have special characters if modified
            const key = 'Test@Key#123' as SecretKey;
            const expectedSecretName = 'tenant--tenant-123--Test-Key-123';

            mockSecretStorage.getSingle.mockResolvedValue('test-value');

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(result).toEqual({
                key: key,
                value: 'test-value',
            });
        });
    });

    describe('getAllSecrets', () => {
        it('should retrieve all secrets for a tenant', async () => {
            const tenantId = 'tenant-789';
            const expectedSecretNames = [
                'tenant--tenant-789--Stripe',
                'tenant--tenant-789--OpenAI',
            ];
            const secretsRecord: Record<string, string | null> = {
                'tenant--tenant-789--Stripe': 'sk_test_stripe',
                'tenant--tenant-789--OpenAI': 'sk-test-openai',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                {
                    key: SecretKey.STRIPE,
                    value: 'sk_test_stripe',
                },
                {
                    key: SecretKey.OPEN_AI,
                    value: 'sk-test-openai',
                },
            ]);
        });

        it('should handle missing secrets with null values', async () => {
            const tenantId = 'tenant-999';
            const expectedSecretNames = [
                'tenant--tenant-999--Stripe',
                'tenant--tenant-999--OpenAI',
            ];
            const secretsRecord: Record<string, string | null> = {
                'tenant--tenant-999--Stripe': 'sk_test_stripe',
                // OpenAI key is missing from the record
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(result).toEqual([
                {
                    key: SecretKey.STRIPE,
                    value: 'sk_test_stripe',
                },
                {
                    key: SecretKey.OPEN_AI,
                    value: null,
                },
            ]);
        });

        it('should return all null values when no secrets exist', async () => {
            const tenantId = 'tenant-empty';
            const expectedSecretNames = [
                'tenant--tenant-empty--Stripe',
                'tenant--tenant-empty--OpenAI',
            ];

            mockSecretStorage.getMultiple.mockResolvedValue({});

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(result).toEqual([
                {
                    key: SecretKey.STRIPE,
                    value: null,
                },
                {
                    key: SecretKey.OPEN_AI,
                    value: null,
                },
            ]);
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const expectedSecretNames = [
                'tenant----Stripe',
                'tenant----OpenAI',
            ];

            mockSecretStorage.getMultiple.mockResolvedValue({});

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(result).toHaveLength(2);
            expect(result.every(secret => secret.value === null)).toBe(true);
        });

        it('should handle null tenant ID', async () => {
            const tenantId = null as any;
            const expectedSecretNames = [
                'tenant--null--Stripe',
                'tenant--null--OpenAI',
            ];

            mockSecretStorage.getMultiple.mockResolvedValue({});

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(result).toHaveLength(2);
        });
    });

    describe('setSecret', () => {
        it('should set a secret for a tenant', async () => {
            const tenantId = 'tenant-set-123';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk_live_new_value',
            };
            const expectedSecretName = 'tenant--tenant-set-123--Stripe';

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'sk_live_new_value'
            );
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });

        it('should handle setting a secret with null value', async () => {
            const tenantId = 'tenant-null-value';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: null,
            };
            const expectedSecretName = 'tenant--tenant-null-value--OpenAI';

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                null
            );
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });

        it('should handle empty tenant ID', async () => {
            const tenantId = '';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'test-value',
            };
            const expectedSecretName = 'tenant----Stripe';

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'test-value'
            );
        });

        it('should handle null tenant ID', async () => {
            const tenantId = null as any;
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: 'api-key',
            };
            const expectedSecretName = 'tenant--null--OpenAI';

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'api-key'
            );
        });

        it('should sanitize special characters in key names when setting', async () => {
            const tenantId = 'tenant-special';
            const secretDto: SecretDto = {
                key: 'Key@With#Special$Chars' as SecretKey,
                value: 'special-value',
            };
            const expectedSecretName = 'tenant--tenant-special--Key-With-Special-Chars';

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'special-value'
            );
        });

        it('should handle storage errors gracefully', async () => {
            const tenantId = 'tenant-error';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'error-value',
            };
            const expectedSecretName = 'tenant--tenant-error--Stripe';
            const storageError = new Error('Storage service unavailable');

            mockSecretStorage.set.mockRejectedValue(storageError);

            await expect(service.setSecret(tenantId, secretDto)).rejects.toThrow(
                'Storage service unavailable'
            );

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'error-value'
            );
        });
    });

    describe('constructSecretName', () => {
        it('should construct valid secret names', () => {
            const service = new SecretService(mockSecretStorage);
            
            // Access private method through reflection for testing
            const constructSecretName = (service as any).constructSecretName.bind(service);

            expect(constructSecretName('tenant-123', SecretKey.STRIPE))
                .toBe('tenant--tenant-123--Stripe');
            
            expect(constructSecretName('tenant-456', SecretKey.OPEN_AI))
                .toBe('tenant--tenant-456--OpenAI');
            
            expect(constructSecretName('tenant', 'Key With Spaces' as SecretKey))
                .toBe('tenant--tenant--Key-With-Spaces');
            
            expect(constructSecretName('tenant', 'Key!@#$%^&*()' as SecretKey))
                .toBe('tenant--tenant--Key----------');
        });
    });

    describe('edge cases and error handling', () => {
        it('should handle undefined values from storage', async () => {
            const tenantId = 'tenant-undefined';
            const key = SecretKey.STRIPE;
            
            mockSecretStorage.getSingle.mockResolvedValue(undefined as any);

            const result = await service.getSecret(tenantId, key);

            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: undefined,
            });
        });

        it('should handle very long tenant IDs', async () => {
            const longTenantId = 'a'.repeat(1000);
            const key = SecretKey.OPEN_AI;
            const expectedSecretName = `tenant--${longTenantId}--OpenAI`;

            mockSecretStorage.getSingle.mockResolvedValue('value');

            const result = await service.getSecret(longTenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(result.value).toBe('value');
        });

        it('should handle storage throwing errors on getSingle', async () => {
            const tenantId = 'tenant-error';
            const key = SecretKey.STRIPE;
            const storageError = new Error('Storage failure');

            mockSecretStorage.getSingle.mockRejectedValue(storageError);

            await expect(service.getSecret(tenantId, key)).rejects.toThrow('Storage failure');
        });

        it('should handle storage throwing errors on getMultiple', async () => {
            const tenantId = 'tenant-error';
            const storageError = new Error('Bulk fetch failed');

            mockSecretStorage.getMultiple.mockRejectedValue(storageError);

            await expect(service.getAllSecrets(tenantId)).rejects.toThrow('Bulk fetch failed');
        });
    });
});