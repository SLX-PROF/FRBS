import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_type" AS ENUM('врезной', 'накладной');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contacts_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contacts_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_docs_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__docs_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_catalog_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__catalog_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__products_v_version_type",
  	"version_series" varchar,
  	"version_min_door_width" numeric,
  	"version_warranty" numeric,
  	"version_features" varchar,
  	"version_package" varchar,
  	"version_recommendation" varchar,
  	"version_compatible_profiles" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_sort_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Производство · Россия',
  	"hero_title" varchar DEFAULT 'Автоматические пороги',
  	"hero_accent" varchar DEFAULT 'FORBSA',
  	"hero_lead" varchar DEFAULT 'Герметизация двери за 1 секунду. Защита от дыма, шума, холода, света, пыли и насекомых. 1 000 000 циклов. Сертификат РОСТЕСТ.',
  	"hero_cta" varchar DEFAULT 'Смотреть каталог',
  	"problem_title" varchar DEFAULT 'Щель под дверью —',
  	"problem_accent" varchar DEFAULT 'источник 6 проблем',
  	"numbers_title" varchar DEFAULT 'Цифры, которые',
  	"numbers_accent" varchar DEFAULT 'говорят сами',
  	"audience_title" varchar DEFAULT 'Выберите вашу роль',
  	"audience_subtitle" varchar DEFAULT 'Мы говорим на одном языке с каждым участником строительного процесса',
  	"catalog_title" varchar DEFAULT 'Линейка продукции',
  	"catalog_subtitle" varchar DEFAULT '{count} моделей под любые задачи — от жилых объектов до противопожарных дверей',
  	"tech_title" varchar DEFAULT 'Инженерное превосходство',
  	"tech_lead" varchar DEFAULT 'Ни одного пластикового узла. Только металл, закалённая сталь и точная механика.',
  	"trust_title" varchar DEFAULT 'Нам доверяют',
  	"trust_lead" varchar DEFAULT 'Сертифицированная продукция, проверенная миллионами циклов',
  	"cta_title" varchar DEFAULT 'Обсудим ваш проект?',
  	"cta_lead" varchar DEFAULT 'Оставьте заявку — инженер свяжется в течение рабочего дня, подберёт модель и подготовит коммерческое предложение.',
  	"seo_title" varchar DEFAULT 'FORBSA — автоматические пороги для дверей. Производство от 1 дня',
  	"seo_description" varchar DEFAULT 'Российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, {count} моделей. Для архитекторов и монтажников.',
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Производство · Россия',
  	"version_hero_title" varchar DEFAULT 'Автоматические пороги',
  	"version_hero_accent" varchar DEFAULT 'FORBSA',
  	"version_hero_lead" varchar DEFAULT 'Герметизация двери за 1 секунду. Защита от дыма, шума, холода, света, пыли и насекомых. 1 000 000 циклов. Сертификат РОСТЕСТ.',
  	"version_hero_cta" varchar DEFAULT 'Смотреть каталог',
  	"version_problem_title" varchar DEFAULT 'Щель под дверью —',
  	"version_problem_accent" varchar DEFAULT 'источник 6 проблем',
  	"version_numbers_title" varchar DEFAULT 'Цифры, которые',
  	"version_numbers_accent" varchar DEFAULT 'говорят сами',
  	"version_audience_title" varchar DEFAULT 'Выберите вашу роль',
  	"version_audience_subtitle" varchar DEFAULT 'Мы говорим на одном языке с каждым участником строительного процесса',
  	"version_catalog_title" varchar DEFAULT 'Линейка продукции',
  	"version_catalog_subtitle" varchar DEFAULT '{count} моделей под любые задачи — от жилых объектов до противопожарных дверей',
  	"version_tech_title" varchar DEFAULT 'Инженерное превосходство',
  	"version_tech_lead" varchar DEFAULT 'Ни одного пластикового узла. Только металл, закалённая сталь и точная механика.',
  	"version_trust_title" varchar DEFAULT 'Нам доверяют',
  	"version_trust_lead" varchar DEFAULT 'Сертифицированная продукция, проверенная миллионами циклов',
  	"version_cta_title" varchar DEFAULT 'Обсудим ваш проект?',
  	"version_cta_lead" varchar DEFAULT 'Оставьте заявку — инженер свяжется в течение рабочего дня, подберёт модель и подготовит коммерческое предложение.',
  	"version_seo_title" varchar DEFAULT 'FORBSA — автоматические пороги для дверей. Производство от 1 дня',
  	"version_seo_description" varchar DEFAULT 'Российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, {count} моделей. Для архитекторов и монтажников.',
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'О компании',
  	"hero_title" varchar DEFAULT 'Мы делаем двери',
  	"hero_accent" varchar DEFAULT 'защищёнными',
  	"hero_lead" varchar DEFAULT 'FORBSA — российский производитель автоматических порогов. Наша миссия — герметизация каждого дверного проёма: без дыма, шума, пыли, сквозняков и насекомых.',
  	"history_title" varchar DEFAULT 'История и путь развития',
  	"history_text" varchar DEFAULT 'Мы выросли из производства дверной фурнитуры в полноценного производителя автоматических порогов полного цикла: собственный цех, контроль качества, складская программа и отгрузки по России и СНГ.',
  	"history_note" varchar DEFAULT '* Точные даты и вехи истории добавит директор — скелет блока готов к наполнению.',
  	"production_title" varchar DEFAULT 'Производство',
  	"production_note" varchar DEFAULT '* Фото и видео цеха появятся после фотосессии — бюджет согласован.',
  	"cta_title" varchar DEFAULT 'Связаться с нами',
  	"cta_text" varchar DEFAULT 'Ответим на вопросы, поможем подобрать модель и подготовим коммерческое предложение.',
  	"cta_button" varchar DEFAULT 'Связаться с нами',
  	"seo_title" varchar DEFAULT 'О компании — FORBSA',
  	"seo_description" varchar DEFAULT 'FORBSA — российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, производство от 1 дня.',
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'О компании',
  	"version_hero_title" varchar DEFAULT 'Мы делаем двери',
  	"version_hero_accent" varchar DEFAULT 'защищёнными',
  	"version_hero_lead" varchar DEFAULT 'FORBSA — российский производитель автоматических порогов. Наша миссия — герметизация каждого дверного проёма: без дыма, шума, пыли, сквозняков и насекомых.',
  	"version_history_title" varchar DEFAULT 'История и путь развития',
  	"version_history_text" varchar DEFAULT 'Мы выросли из производства дверной фурнитуры в полноценного производителя автоматических порогов полного цикла: собственный цех, контроль качества, складская программа и отгрузки по России и СНГ.',
  	"version_history_note" varchar DEFAULT '* Точные даты и вехи истории добавит директор — скелет блока готов к наполнению.',
  	"version_production_title" varchar DEFAULT 'Производство',
  	"version_production_note" varchar DEFAULT '* Фото и видео цеха появятся после фотосессии — бюджет согласован.',
  	"version_cta_title" varchar DEFAULT 'Связаться с нами',
  	"version_cta_text" varchar DEFAULT 'Ответим на вопросы, поможем подобрать модель и подготовим коммерческое предложение.',
  	"version_cta_button" varchar DEFAULT 'Связаться с нами',
  	"version_seo_title" varchar DEFAULT 'О компании — FORBSA',
  	"version_seo_description" varchar DEFAULT 'FORBSA — российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, производство от 1 дня.',
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "contacts_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Офис · Производство',
  	"hero_title" varchar DEFAULT 'Свяжитесь',
  	"hero_accent" varchar DEFAULT 'с нами',
  	"hero_lead" varchar DEFAULT 'Отвечаем в течение рабочего дня. Поможем подобрать модель, подготовим КП или проконсультируем по монтажу.',
  	"hours_eyebrow" varchar DEFAULT 'Когда мы работаем',
  	"hours_title" varchar DEFAULT 'Режим работы',
  	"hours_weekdays" varchar DEFAULT '9:00 – 18:00',
  	"hours_saturday" varchar DEFAULT 'По договорённости',
  	"hours_sunday" varchar DEFAULT 'Выходной',
  	"fast_reply_title" varchar DEFAULT 'Отвечаем быстро',
  	"fast_reply_text" varchar DEFAULT 'Заявки с сайта обрабатываются в течение 1 рабочего дня.',
  	"form_title" varchar DEFAULT 'Напишите нам',
  	"form_subtitle" varchar DEFAULT 'Заполните форму — менеджер свяжется с вами в течение рабочего дня и ответит на все вопросы.',
  	"seo_title" varchar DEFAULT 'Контакты FORBSA — офис и производство в Москве',
  	"seo_description" varchar DEFAULT 'Свяжитесь с FORBSA: офис и производство в Москве. Телефон, email, форма обратной связи, реквизиты ООО «Форбса». Отвечаем в течение рабочего дня.',
  	"_status" "enum_contacts_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contacts_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Офис · Производство',
  	"version_hero_title" varchar DEFAULT 'Свяжитесь',
  	"version_hero_accent" varchar DEFAULT 'с нами',
  	"version_hero_lead" varchar DEFAULT 'Отвечаем в течение рабочего дня. Поможем подобрать модель, подготовим КП или проконсультируем по монтажу.',
  	"version_hours_eyebrow" varchar DEFAULT 'Когда мы работаем',
  	"version_hours_title" varchar DEFAULT 'Режим работы',
  	"version_hours_weekdays" varchar DEFAULT '9:00 – 18:00',
  	"version_hours_saturday" varchar DEFAULT 'По договорённости',
  	"version_hours_sunday" varchar DEFAULT 'Выходной',
  	"version_fast_reply_title" varchar DEFAULT 'Отвечаем быстро',
  	"version_fast_reply_text" varchar DEFAULT 'Заявки с сайта обрабатываются в течение 1 рабочего дня.',
  	"version_form_title" varchar DEFAULT 'Напишите нам',
  	"version_form_subtitle" varchar DEFAULT 'Заполните форму — менеджер свяжется с вами в течение рабочего дня и ответит на все вопросы.',
  	"version_seo_title" varchar DEFAULT 'Контакты FORBSA — офис и производство в Москве',
  	"version_seo_description" varchar DEFAULT 'Свяжитесь с FORBSA: офис и производство в Москве. Телефон, email, форма обратной связи, реквизиты ООО «Форбса». Отвечаем в течение рабочего дня.',
  	"version__status" "enum__contacts_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "docs_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Для архитекторов и проектировщиков',
  	"hero_title" varchar DEFAULT 'Документация',
  	"hero_accent" varchar DEFAULT 'FORBSA',
  	"hero_lead" varchar DEFAULT 'Сертификаты, альбом типовых технических решений, BIM-модели и инструкции по монтажу. Все файлы доступны для скачивания без регистрации.',
  	"cta_title" varchar DEFAULT 'Нужна консультация инженера?',
  	"cta_text" varchar DEFAULT 'Поможем подобрать модель, подготовим узел под ваш проект, проконсультируем по госэкспертизе.',
  	"cta_button" varchar DEFAULT 'Связаться с инженером →',
  	"seo_title" varchar DEFAULT 'Документация FORBSA — сертификаты, альбом узлов, инструкции',
  	"seo_description" varchar DEFAULT 'Сертификаты РОСТЕСТ, альбом типовых технических решений, BIM-модели, инструкции по монтажу. Всё для архитекторов, проектировщиков и монтажников.',
  	"_status" "enum_docs_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_docs_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'Для архитекторов и проектировщиков',
  	"version_hero_title" varchar DEFAULT 'Документация',
  	"version_hero_accent" varchar DEFAULT 'FORBSA',
  	"version_hero_lead" varchar DEFAULT 'Сертификаты, альбом типовых технических решений, BIM-модели и инструкции по монтажу. Все файлы доступны для скачивания без регистрации.',
  	"version_cta_title" varchar DEFAULT 'Нужна консультация инженера?',
  	"version_cta_text" varchar DEFAULT 'Поможем подобрать модель, подготовим узел под ваш проект, проконсультируем по госэкспертизе.',
  	"version_cta_button" varchar DEFAULT 'Связаться с инженером →',
  	"version_seo_title" varchar DEFAULT 'Документация FORBSA — сертификаты, альбом узлов, инструкции',
  	"version_seo_description" varchar DEFAULT 'Сертификаты РОСТЕСТ, альбом типовых технических решений, BIM-модели, инструкции по монтажу. Всё для архитекторов, проектировщиков и монтажников.',
  	"version__status" "enum__docs_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "catalog_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'Каталог продукции',
  	"hero_accent" varchar DEFAULT 'FORBSA',
  	"hero_lead" varchar DEFAULT 'Автоматические пороги для герметизации дверей любого типа. Шаг длины 200 мм — подбираем под любую ширину полотна.',
  	"cta_title" varchar DEFAULT 'Не знаете, какая модель подходит?',
  	"cta_subtitle" varchar DEFAULT 'Сообщите ширину двери и тип монтажа — инженер подберёт подходящую модель.',
  	"cta_button" varchar DEFAULT 'Консультация инженера →',
  	"seo_title" varchar DEFAULT 'Каталог автоматических порогов FORBSA',
  	"seo_description" varchar DEFAULT 'Врезные и накладные автоматические пороги FORBSA для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.',
  	"_status" "enum_catalog_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_catalog_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_title" varchar DEFAULT 'Каталог продукции',
  	"version_hero_accent" varchar DEFAULT 'FORBSA',
  	"version_hero_lead" varchar DEFAULT 'Автоматические пороги для герметизации дверей любого типа. Шаг длины 200 мм — подбираем под любую ширину полотна.',
  	"version_cta_title" varchar DEFAULT 'Не знаете, какая модель подходит?',
  	"version_cta_subtitle" varchar DEFAULT 'Сообщите ширину двери и тип монтажа — инженер подберёт подходящую модель.',
  	"version_cta_button" varchar DEFAULT 'Консультация инженера →',
  	"version_seo_title" varchar DEFAULT 'Каталог автоматических порогов FORBSA',
  	"version_seo_description" varchar DEFAULT 'Врезные и накладные автоматические пороги FORBSA для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.',
  	"version__status" "enum__catalog_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "products" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "products" ADD COLUMN "_status" "enum_products_status" DEFAULT 'draft';
  UPDATE "products" SET "_status" = 'published';
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_media_id_idx" ON "_products_v_rels" USING btree ("media_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE INDEX "contacts_page__status_idx" ON "contacts_page" USING btree ("_status");
  CREATE INDEX "_contacts_page_v_version_version__status_idx" ON "_contacts_page_v" USING btree ("version__status");
  CREATE INDEX "_contacts_page_v_created_at_idx" ON "_contacts_page_v" USING btree ("created_at");
  CREATE INDEX "_contacts_page_v_updated_at_idx" ON "_contacts_page_v" USING btree ("updated_at");
  CREATE INDEX "_contacts_page_v_latest_idx" ON "_contacts_page_v" USING btree ("latest");
  CREATE INDEX "docs_page__status_idx" ON "docs_page" USING btree ("_status");
  CREATE INDEX "_docs_page_v_version_version__status_idx" ON "_docs_page_v" USING btree ("version__status");
  CREATE INDEX "_docs_page_v_created_at_idx" ON "_docs_page_v" USING btree ("created_at");
  CREATE INDEX "_docs_page_v_updated_at_idx" ON "_docs_page_v" USING btree ("updated_at");
  CREATE INDEX "_docs_page_v_latest_idx" ON "_docs_page_v" USING btree ("latest");
  CREATE INDEX "catalog_page__status_idx" ON "catalog_page" USING btree ("_status");
  CREATE INDEX "_catalog_page_v_version_version__status_idx" ON "_catalog_page_v" USING btree ("version__status");
  CREATE INDEX "_catalog_page_v_created_at_idx" ON "_catalog_page_v" USING btree ("created_at");
  CREATE INDEX "_catalog_page_v_updated_at_idx" ON "_catalog_page_v" USING btree ("updated_at");
  CREATE INDEX "_catalog_page_v_latest_idx" ON "_catalog_page_v" USING btree ("latest");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_about_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contacts_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_contacts_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "docs_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_docs_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "catalog_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_catalog_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "contacts_page" CASCADE;
  DROP TABLE "_contacts_page_v" CASCADE;
  DROP TABLE "docs_page" CASCADE;
  DROP TABLE "_docs_page_v" CASCADE;
  DROP TABLE "catalog_page" CASCADE;
  DROP TABLE "_catalog_page_v" CASCADE;
  DROP INDEX "products__status_idx";
  ALTER TABLE "products" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "products" DROP COLUMN "_status";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_type";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum_contacts_page_status";
  DROP TYPE "public"."enum__contacts_page_v_version_status";
  DROP TYPE "public"."enum_docs_page_status";
  DROP TYPE "public"."enum__docs_page_v_version_status";
  DROP TYPE "public"."enum_catalog_page_status";
  DROP TYPE "public"."enum__catalog_page_v_version_status";`)
}
