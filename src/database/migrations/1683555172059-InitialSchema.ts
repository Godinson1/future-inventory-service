import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1683555172059 implements MigrationInterface {
  name = 'InitialSchema1683555172059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "inventories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "product_name" text, "product_id" text, "status" text, "current_price" integer, "quantity_purchased" integer, "quantity_sold" integer DEFAULT '0', "quantity_remaining" integer DEFAULT '0', "archived" text DEFAULT false, CONSTRAINT "PK_7b1946392ffdcb50cfc6ac78c0e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "product_name" text, "product_id" text, "price" integer, "quantity_purchased" text, "purchased_by" text, "archived" text DEFAULT false, "inventoryId" uuid, CONSTRAINT "PK_7905047372019e1b9415e0f2fe3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_histories" ADD CONSTRAINT "FK_fecbc23cd64fab59317ed2053dd" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "inventory_histories" DROP CONSTRAINT "FK_fecbc23cd64fab59317ed2053dd"`);
    await queryRunner.query(`DROP TABLE "inventory_histories"`);
    await queryRunner.query(`DROP TABLE "inventories"`);
  }
}
