import { Test, TestingModule } from '@nestjs/testing';
import { SecretService } from '../../../src/application/secrets/secrets.service';
import { ISecretStorage, SECRET_STORAGE } from '../../../src/domain/secrets/secret-storage.interface';
import { SecretKey } from '../../../src/domain/enums/secret-key.enum';
import { SecretDto } from '../../../src/application/secrets/dto/secret.dto';

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

    it('should retrieve a secret using getSecret and correctly delegate to scoped secret service', async () => {
        const tenantId = 'tenant-123';
        const key = SecretKey.OPEN_AI;
        const expectedValue = 'sk-test-openai-key';
        const expectedSecretName = 'tenant--tenant-123--OpenAI';

        mockSecretStorage.getSingle.mockResolvedValue(expectedValue);

        const result = await service.getSecret(tenantId, key);

        expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
        expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ key, value: expectedValue });
    });

    it('should list all secrets using getAllSecrets and correctly delegate to scoped secret service', async () => {
        const tenantId = 'tenant-789';
        const expectedSecretNames = [
            'tenant--tenant-789--Stripe',
            'tenant--tenant-789--OpenAI',
        ];
        const mockSecretsRecord: Record<string, string | null> = {
            'tenant--tenant-789--Stripe': 'sk-test-stripe-key',
            'tenant--tenant-789--OpenAI': 'sk-test-openai-key',
        };

        mockSecretStorage.getMultiple.mockResolvedValue(mockSecretsRecord);

        const result = await service.getAllSecrets(tenantId);

        expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
        expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
        expect(result).toEqual([
            { key: SecretKey.STRIPE, value: 'sk-test-stripe-key' },
            { key: SecretKey.OPEN_AI, value: 'sk-test-openai-key' },
        ]);
    });

    it('should set a secret using setSecret and correctly delegate to scoped secret service', async () => {
        const tenantId = 'tenant-set';
        const secretDto: SecretDto = {
            key: SecretKey.STRIPE,
            value: 'sk-live-stripe-key',
        };
        const expectedSecretName = 'tenant--tenant-set--Stripe';

        mockSecretStorage.set.mockResolvedValue(undefined);

        await service.setSecret(tenantId, secretDto);

        expect(mockSecretStorage.set).toHaveBeenCalledWith(
            expectedSecretName,
            secretDto.value
        );
        expect(mockSecretStorage.set).toHaveBeenCalledTimes(1);
    });

    it('should handle error scenarios by rethrowing errors from scoped secret service unchanged', async () => {
        const tenantId = 'tenant-error';
        const key = SecretKey.OPEN_AI;
        const storageError = new Error('Storage service failure');
        const invalidTenantError = new Error('Invalid tenant ID');
        const missingKeysError = new Error('Failed to retrieve secrets');

        mockSecretStorage.getSingle.mockRejectedValueOnce(storageError);
        mockSecretStorage.getSingle.mockRejectedValueOnce(invalidTenantError);
        mockSecretStorage.getMultiple.mockRejectedValueOnce(missingKeysError);

        await expect(service.getSecret(tenantId, key)).rejects.toThrow(storageError);
        await expect(service.getSecret('', SecretKey.STRIPE)).rejects.toThrow(invalidTenantError);
        await expect(service.getAllSecrets('tenant-missing')).rejects.toThrow(missingKeysError);

        expect(mockSecretStorage.getSingle).toHaveBeenCalledTimes(2);
        expect(mockSecretStorage.getMultiple).toHaveBeenCalledTimes(1);
    });

    it('should handle empty results correctly for both getSecret returning null and getAllSecrets returning empty array', async () => {
        const tenantId = 'tenant-empty';
        const key = SecretKey.STRIPE;
        const expectedSecretName = 'tenant--tenant-empty--Stripe';
        const expectedSecretNames = [
            'tenant--tenant-empty--Stripe',
            'tenant--tenant-empty--OpenAI',
        ];

        mockSecretStorage.getSingle.mockResolvedValue(null);
        mockSecretStorage.getMultiple.mockResolvedValue({});

        const singleResult = await service.getSecret(tenantId, key);
        const allResults = await service.getAllSecrets(tenantId);

        expect(mockSecretStorage.getSingle).toHaveBeenCalledWith(expectedSecretName);
        expect(singleResult).toEqual({ key, value: null });
        
        expect(mockSecretStorage.getMultiple).toHaveBeenCalledWith(expectedSecretNames);
        expect(allResults).toEqual([
            { key: SecretKey.STRIPE, value: null },
            { key: SecretKey.OPEN_AI, value: null },
        ]);
    });
});