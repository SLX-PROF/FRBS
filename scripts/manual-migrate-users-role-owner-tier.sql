-- Ручное применение src/migrations/20260917_150000_users_role_owner_tier.ts
-- Нужно, потому что `npx payload migrate` виснет на инициализации адаптера
-- при push: true (известная проблема, см. src/migrations/README.md).
-- Применять на живой прод-БД так:
--   docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < scripts/manual-migrate-users-role-owner-tier.sql

BEGIN;

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
END $$;

INSERT INTO "payload_migrations" ("name", "batch")
VALUES ('20260917_150000_users_role_owner_tier', (SELECT COALESCE(MAX(batch), 0) + 1 FROM "payload_migrations"));

COMMIT;
