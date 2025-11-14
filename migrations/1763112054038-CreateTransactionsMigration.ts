import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionsMigration1763112054038
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "product_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "type" text NOT NULL CHECK (type IN ('INCREASE', 'DECREASE')),
        "quantity_change" int NOT NULL,
        "previous_quantity" int NOT NULL,
        "new_quantity" int NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "FK_transaction_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_transaction_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "transactions";
    `);
  }
}
