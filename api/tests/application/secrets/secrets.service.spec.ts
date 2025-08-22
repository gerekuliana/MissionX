import { Test, TestingModule } from '@nestjs/testing';
import { SecretService } from '../../../src/application/secrets/secrets.service';
import { ISecretStorage, SECRET_STORAGE } from '../../../src/domain/secrets/secret-storage.interface';
import { SecretKey } from '../../../src/domain/enums/secret-key.enum';
import { SecretDto } from '../../../src/application/secrets/dto/secret.dto';

describe('SecretService', () => {
    let secretService: SecretService;
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

        secretService = module.get<SecretService>(SecretService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getSecret', () => {
        it('should retrieve a secret and return it as SecretDto', async () => {
            const tenantId = 'tenant-123';
            const key = SecretKey.OPEN_AI;
            const secretValue = 'sk-test-openai-key';
            const expectedSecretName = 'tenant--tenant-123--OpenAI';

            mockSecretStorage.getSingle.mockResolvedValue(secretValue);

            const result = await secretService.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                key: SecretKey.OPEN_AI,
                value: secretValue,
            });
        });

        it('should handle null value when secret does not exist', async () => {
            const tenantId = 'tenant-456';
            const key = SecretKey.STRIPE;
            const expectedSecretName = 'tenant--tenant-456--Stripe';

            mockSecretStorage.getSingle.mockResolvedValue(null);

            const result = await secretService.getSecret(tenantId, key);

            expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                key: SecretKey.STRIPE,
                value: null,
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
                'tenant--tenant-789--Stripe': 'sk-test-stripe-key',
                'tenant--tenant-789--OpenAI': 'sk-test-openai-key',
            };

            mockSecretStorage.getMultiple.mockResolvedValue(secretsRecord);

            const result = await secretService.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
            expect(result).toEqual([
                {
                    key: SecretKey.STRIPE,
                    value: 'sk-test-stripe-key',
                },
                {
                    key: SecretKey.OPEN_AI,
                    value: 'sk-test-openai-key',
                },
            ]);
        });

        it('should return empty array when no secrets exist', async () => {
            const tenantId = 'tenant-empty';
            const expectedSecretNames = [
                'tenant--tenant-empty--Stripe',
                'tenant--tenant-empty--OpenAI',
            ];

            mockSecretStorage.getMultiple.mockResolvedValue({});

            const result = await secretService.getAllSecrets(tenantId);

            expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
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
    });

    describe('setSecret', () => {
        it('should set a secret value correctly', async () => {
            const tenantId = 'tenant-set';
            const secretDto: SecretDto = {
                key: SecretKey.STRIPE,
                value: 'sk-live-stripe-key',
            };
            const expectedSecretName = 'tenant--tenant-set--Stripe';

            mockSecretStorage.set.mockResolvedValue();

            await secretService.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                'sk-live-stripe-key'
            );
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });

        it('should handle setting null value', async () => {
            const tenantId = 'tenant-null';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: null,
            };
            const expectedSecretName = 'tenant--tenant-null--OpenAI';

            mockSecretStorage.set.mockResolvedValue();

            await secretService.setSecret(tenantId, secretDto);

            expect(mockSecretStorage.set).toHaveBeenCalledWith(
                expectedSecretName,
                null
            );
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });
    });

    describe('error handling', () => {
        it('should propagate storage errors from getSecret', async () => {
            const tenantId = 'tenant-error';
            const key = SecretKey.STRIPE;
            const storageError = new Error('Storage connection failed');

            mockSecretStorage.getSingle.mockRejectedValue(storageError);

            await expect(secretService.getSecret(tenantId, key)).rejects.toThrow(storageError);
            expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
        });

        it('should propagate storage errors from getAllSecrets', async () => {
            const tenantId = 'tenant-error';
            const storageError = new Error('Invalid tenant ID');

            mockSecretStorage.getMultiple.mockRejectedValue(storageError);

            await expect(secretService.getAllSecrets(tenantId)).rejects.toThrow(storageError);
            expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
        });

        it('should propagate storage errors from setSecret', async () => {
            const tenantId = 'tenant-error';
            const secretDto: SecretDto = {
                key: SecretKey.OPEN_AI,
                value: 'test-value',
            };
            const storageError = new Error('Storage write failed');

            mockSecretStorage.set.mockRejectedValue(storageError);

            await expect(secretService.setSecret(tenantId, secretDto)).rejects.toThrow(storageError);
            expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
        });
    });
});