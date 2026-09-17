import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Роли пользователей стали трёхуровневыми: owner (полный доступ) / admin
// (теперь означает "только товары", раньше это значение = полный доступ) /
// manager (без изменений). Все существующие строки users.role = 'admin'
// переводятся в 'owner', чтобы не понизить в правах уже работающие аккаунты —
// новое значение 'admin' с этого момента свободно для будущих назначений.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'enum_users_role' AND e.enumlabel = 'owner'
    ) THEN
      ALTER TYPE "public"."enum_users_role" RENAME TO "enum_users_role_old";
      CREATE TYPE "public"."enum_users_role" AS ENUM ('owner', 'admin', 'manager');
      ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
      ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."enum_users_role" USING (
        CASE role::text WHEN 'admin' THEN 'owner' ELSE role::text END
      )::"public"."enum_users_role";
      ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'manager';
      DROP TYPE "public"."enum_users_role_old";
    END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'enum_users_role' AND e.enumlabel = 'owner'
    ) THEN
      ALTER TYPE "public"."enum_users_role" RENAME TO "enum_users_role_new";
      CREATE TYPE "public"."enum_users_role" AS ENUM ('admin', 'manager');
      ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
      ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."enum_users_role" USING (
        CASE role::text WHEN 'owner' THEN 'admin' ELSE role::text END
      )::"public"."enum_users_role";
      ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'manager';
      DROP TYPE "public"."enum_users_role_new";
    END IF;
  END $$;`)
}
