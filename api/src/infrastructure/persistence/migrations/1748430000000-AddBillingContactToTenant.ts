import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBillingContactToTenant1748430000000 implements MigrationInterface {
    name = 'AddBillingContactToTenant1748430000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tenants" ADD "billingContact" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "tenants" ADD CONSTRAINT "UQ_billingContact" UNIQUE ("billingContact")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tenants" DROP CONSTRAINT "UQ_billingContact"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "billingContact"`);
    }
}
