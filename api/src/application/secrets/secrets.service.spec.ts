/* eslint-disable @typescript-eslint/unbound-method */
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

    describe('constructSecretName', () => {
        it('should construct secret name with tenant id and key', () => {
            const tenantId = 'tenant-123';
            const key = SecretKey.STRIPE;

            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--tenant-123--Stripe');
        });

        it('should sanitize special characters in the key', () => {
            const tenantId = 'tenant-456';
            const key = 'Test@Key#With$Special%Chars' as SecretKey;

            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--tenant-456--Test-Key-With-Special-Chars');
        });

        it('should handle empty tenant id', () => {
            const tenantId = '';
            const key = SecretKey.OPEN_AI;

            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant----OpenAI');
        });

        it('should handle key with numbers and hyphens', () => {
            const tenantId = 'tenant-789';
            const key = 'API-Key-123' as SecretKey;

            const result = service['constructSecretName'](tenantId, key);

            expect(result).toBe('tenant--tenant-789--API-Key-123');
        });
    });

    describe('getSecret', () => {
        it('should return secret dto when secret exists', async () => {
            const tenantId = 'tenant-123';
            const key = SecretKey.STRIPE;
            const value = 'sk_test_123456789';

            mockSecretStorage.getSingle.mockResolvedValue(value);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--tenant-123--Stripe');
            expect(result).toEqual<SecretDto>({
                key,
                value,
            });
        });

        it('should return secret dto with null value when secret does not exist', async () => {
            const tenantId = 'tenant-456';
            const key = SecretKey.OPEN_AI;

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--tenant-456--OpenAI');
            expect(result).toEqual<SecretDto>({
                key,
                value: null,
            });
        });

        it('should handle errors from secret storage', async () => {
            const tenantId = 'tenant-789';
            const key = SecretKey.STRIPE;
            const error = new Error('Storage error');

            mockSecretStorage.getSingle.mockRejectedValue(error);

            await expect(service.getSecret(tenantId, key)).rejects.toThrow(error);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--tenant-789--Stripe');
        });
    });

    describe('getAllSecrets', () => {
        it('should return all secrets for a tenant', async () => {
            const tenantId = 'tenant-123';
            const secretsRecord: Record<string, string | null> = {
                'tenant--tenant-123--Stripe': 'sk_test_stripe',
                'tenant--tenant-123--OpenAI': 'sk-openai-key',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant--tenant-123--Stripe',
                'tenant--tenant-123--OpenAI',
            ]);
            expect(result).toEqual<SecretDto[]>([
                { key: SecretKey.STRIPE, value: 'sk_test_stripe' },
                { key: SecretKey.OPEN_AI, value: 'sk-openai-key' },
            ]);
        });

        it('should handle missing secrets with null values', async () => {
            const tenantId = 'tenant-456';
            const secretsRecord: Record<string, string | null> = {
                'tenant--tenant-456--Stripe': 'sk_test_stripe',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant--tenant-456--Stripe',
                'tenant--tenant-456--OpenAI',
            ]);
            expect(result).toEqual<SecretDto[]>([
                { key: SecretKey.STRIPE, value: 'sk_test_stripe' },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });

        it('should return empty values when no secrets exist', async () => {
            const tenantId = 'tenant-789';
            const secretsRecord: Record<string, string | null> = {};

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(result).toEqual<SecretDto[]>([
                { key: SecretKey.STRIPE, value: null },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });

        it('should handle errors from secret storage', async () => {
            const tenantId = 'tenant-999';
            const error = new Error('Storage error');

            mockSecretStorage.getMultiple.mockRejectedValue(error);

            await expect(service.getAllSecrets(tenantId)).rejects.toThrow(error);
        });
    });

    describe('setSecret', () => {
        it('should set a secret successfully', async () => {
            const tenantId = 'tenant-123';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk_test_new_value',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--tenant-123--Stripe',
                'sk_test_new_value',
            );
        });

        it('should set a secret with null value', async () => {
            const tenantId = 'tenant-456';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: null,
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant--tenant-456--OpenAI', null);
        });

        it('should handle errors from secret storage', async () => {
            const tenantId = 'tenant-789';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk_test_value',
            };
            const error = new Error('Storage error');

            mockSecretStorage.set.mockRejectedValue(error);

            await expect(service.setSecret(tenantId, secretDto)).rejects.toThrow(error);
            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--tenant-789--Stripe',
                'sk_test_value',
            );
        });

        it('should handle empty string value', async () => {
            const tenantId = 'tenant-999';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: '',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant--tenant-999--OpenAI', '');
        });
    });
});
