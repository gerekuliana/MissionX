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
        it('should retrieve a secret successfully and return it with the key', async () => {
            const tenantId = 'test-tenant-123';
            const key = SecretKey.OPEN_AI;
            const secretValue = 'sk-test-openai-key';

            mockSecretStorage.getSingle.mockResolvedValue(secretValue);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--test-tenant-123--OpenAI');
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                key: SecretKey.OPEN_AI,
                value: secretValue,
            });
        });

        it('should handle null value when secret does not exist', async () => {
            const tenantId = 'test-tenant-456';
            const key = SecretKey.STRIPE;

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await service.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--test-tenant-456--Stripe');
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: null,
            });
        });
    });

    describe('getAllSecrets', () => {
        it('should retrieve all secrets for a tenant', async () => {
            const tenantId = 'test-tenant-789';
            const mockSecretsRecord = {
                'tenant--test-tenant-789--Stripe': 'sk-test-stripe',
                'tenant--test-tenant-789--OpenAI': 'sk-test-openai',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(mockSecretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant--test-tenant-789--Stripe',
                'tenant--test-tenant-789--OpenAI',
            ]);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: 'sk-test-stripe' },
                { key: SecretKey.OPEN_AI, value: 'sk-test-openai' },
            ]);
        });

        it('should handle empty results when no secrets are stored', async () => {
            const tenantId = 'empty-tenant';
            const mockSecretsRecord = {};

            mockSecretStorage.getMultiple.mockResolvedValue(mockSecretsRecord);

            const result = await service.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith([
                'tenant--empty-tenant--Stripe',
                'tenant--empty-tenant--OpenAI',
            ]);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                { key: SecretKey.STRIPE, value: null },
                { key: SecretKey.OPEN_AI, value: null },
            ]);
        });
    });

    describe('setSecret', () => {
        it('should set a secret successfully', async () => {
            const tenantId = 'test-tenant-set';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk-live-stripe-key',
            };

            mockSecretStorage.set.mockResolvedValue(undefined);

            await service.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                'tenant--test-tenant-set--Stripe',
                'sk-live-stripe-key'
            );
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });
    });

    describe('error handling', () => {
        it('should propagate errors from the scoped secret service without modification', async () => {
            const tenantId = 'error-tenant';
            const key = SecretKey.OPEN_AI;
            const error = new Error('Storage service failure');

            mockSecretStorage.getSingle.mockRejectedValue(error);

            await expect(service.getSecret(tenantId, key)).rejects.toThrow(error);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant--error-tenant--OpenAI');
        });

        it('should handle errors for invalid tenant IDs', async () => {
            const invalidTenantId = '';
            const key = SecretKey.STRIPE;
            const error = new Error('Invalid tenant ID');

            mockSecretStorage.getSingle.mockRejectedValue(error);

            await expect(service.getSecret(invalidTenantId, key)).rejects.toThrow(error);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith('tenant----Stripe');
        });

        it('should handle errors when setting secrets', async () => {
            const tenantId = 'test-tenant';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: 'invalid-key',
            };
            const error = new Error('Failed to store secret');

            mockSecretStorage.set.mockRejectedValue(error);

            await expect(service.setSecret(tenantId, secretDto)).rejects.toThrow(error);
            expect(mockSecretStorage.set).toHaveBeenCalledWith('tenant--test-tenant--OpenAI', 'invalid-key');
        });
    });
});