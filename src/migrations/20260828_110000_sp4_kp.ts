import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// SP4 — генерация КП: позиции сделки, срок действия, ставка НДС + глобал
// «Реквизиты компании». Идемпотентная дельта.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "deals" ADD COLUMN IF NOT EXISTS "valid_until" timestamp(3) with time zone;
  ALTER TABLE "deals" ADD COLUMN IF NOT EXISTS "vat_included" boolean DEFAULT true;

  CREATE TABLE IF NOT EXISTS "deals_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"qty" numeric DEFAULT 1,
  	"unit_price" numeric
  );

  CREATE TABLE IF NOT EXISTS "company_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal_name" varchar DEFAULT 'ООО «Форбса»',
  	"inn" varchar,
  	"kpp" varchar,
  	"ogrn" varchar,
  	"address" varchar DEFAULT 'г. Екатеринбург, ул. Производственная, 1',
  	"phone" varchar DEFAULT '+7 (343) 000-00-00',
  	"email" varchar DEFAULT 'info@forbsa.ru',
  	"bank_name" varchar,
  	"account" varchar,
  	"corr_account" varchar,
  	"bik" varchar,
  	"signer_name" varchar,
  	"signer_title" varchar DEFAULT 'Генеральный директор',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  DO $$ BEGIN ALTER TABLE "deals_positions" ADD CONSTRAINT "deals_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."deals"("id") ON DELETE cascade ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN null; END $$;
  CREATE INDEX IF NOT EXISTS "deals_positions_order_idx" ON "deals_positions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "deals_positions_parent_id_idx" ON "deals_positions" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "deals_positions" CASCADE;
  DROP TABLE IF EXISTS "company_profile" CASCADE;
  ALTER TABLE "deals" DROP COLUMN IF EXISTS "valid_until";
  ALTER TABLE "deals" DROP COLUMN IF EXISTS "vat_included";`)
}
