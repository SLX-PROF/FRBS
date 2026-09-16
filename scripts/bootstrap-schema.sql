-- One-time bootstrap for a FRESH, empty production DB.
-- `postgresAdapter({ push: true })` only auto-creates tables outside NODE_ENV=production
-- (see node_modules/@payloadcms/db-postgres/dist/connect.js), and src/migrations/ only
-- contains deltas on top of a DB that already had the base collections (products, users,
-- leads, media, ...) from dev push. Apply once against a brand-new DB:
--   docker compose -f Docker-compose.yml exec -T db psql -U forbsa -d forbsa < scripts/bootstrap-schema.sql
-- One-time only: CREATE TABLE/TYPE here are plain (no IF NOT EXISTS), so re-running
-- against a DB that already has this schema will fail with "already exists" errors.
--
-- PostgreSQL database dump
--


-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_activities_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_activities_kind AS ENUM (
    'call',
    'email',
    'meeting',
    'note'
);


--
-- Name: enum_activities_priority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_activities_priority AS ENUM (
    'low',
    'normal',
    'high'
);


--
-- Name: enum_audit_log_action; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_audit_log_action AS ENUM (
    'create',
    'update',
    'delete'
);


--
-- Name: enum_companies_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_companies_kind AS ENUM (
    'dealer',
    'architect',
    'developer',
    'installer',
    'endCustomer'
);


--
-- Name: enum_companies_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_companies_source AS ENUM (
    'site',
    'chatbot',
    'manual',
    '1c'
);


--
-- Name: enum_deals_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_deals_source AS ENUM (
    'site',
    'chatbot',
    'manual',
    '1c'
);


--
-- Name: enum_deals_stage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_deals_stage AS ENUM (
    'proposal',
    'negotiation',
    'won',
    'lost'
);


--
-- Name: enum_documents_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_documents_category AS ENUM (
    'certificates',
    'drawings',
    'instructions',
    'bim',
    'legal'
);


--
-- Name: enum_leads_business_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_business_type AS ENUM (
    'wholesale',
    'retail',
    'installation'
);


--
-- Name: enum_leads_client_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_client_type AS ENUM (
    'architect',
    'developer',
    'dealer',
    'installer',
    'individual'
);


--
-- Name: enum_leads_source; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_source AS ENUM (
    'site',
    'chatbot',
    'manual',
    '1c'
);


--
-- Name: enum_leads_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_status AS ENUM (
    'new',
    'progress',
    'done',
    'spam'
);


--
-- Name: enum_leads_volume; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leads_volume AS ENUM (
    's',
    'm',
    'l'
);


--
-- Name: enum_products_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_products_type AS ENUM (
    'врезной',
    'накладной'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'manager'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    kind public.enum_activities_kind DEFAULT 'note'::public.enum_activities_kind NOT NULL,
    subject character varying NOT NULL,
    body character varying,
    deal_id integer,
    lead_id integer,
    author_id integer,
    due_at timestamp(3) with time zone,
    done_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    assignee_id integer,
    priority public.enum_activities_priority DEFAULT 'normal'::public.enum_activities_priority
);


--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id integer NOT NULL,
    action public.enum_audit_log_action,
    collection_slug character varying,
    document_id character varying,
    user_id integer,
    changed_fields jsonb,
    at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_sessions (
    id integer NOT NULL,
    messages jsonb,
    lead_id integer,
    consent boolean,
    started_at timestamp(3) with time zone,
    last_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    token character varying
);


--
-- Name: chat_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_sessions_id_seq OWNED BY public.chat_sessions.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying NOT NULL,
    inn character varying,
    kind public.enum_companies_kind,
    city character varying,
    website character varying,
    contact_person character varying,
    phone character varying,
    email character varying,
    notes character varying,
    owner_id integer,
    external_id character varying,
    source public.enum_companies_source DEFAULT 'manual'::public.enum_companies_source,
    synced_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


--
-- Name: company_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_profile (
    id integer NOT NULL,
    legal_name character varying DEFAULT 'ООО «Форбса»'::character varying,
    inn character varying,
    kpp character varying,
    ogrn character varying,
    address character varying DEFAULT 'г. Екатеринбург, ул. Производственная, 1'::character varying,
    phone character varying DEFAULT '+7 (343) 000-00-00'::character varying,
    email character varying DEFAULT 'info@forbsa.ru'::character varying,
    bank_name character varying,
    account character varying,
    corr_account character varying,
    bik character varying,
    signer_name character varying,
    signer_title character varying DEFAULT 'Генеральный директор'::character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


--
-- Name: company_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_profile_id_seq OWNED BY public.company_profile.id;


--
-- Name: deals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deals (
    id integer NOT NULL,
    title character varying NOT NULL,
    company_id integer NOT NULL,
    owner_id integer NOT NULL,
    stage public.enum_deals_stage DEFAULT 'proposal'::public.enum_deals_stage NOT NULL,
    amount numeric,
    expected_close_at timestamp(3) with time zone,
    lost_reason character varying,
    source_lead_id integer,
    notes character varying,
    external_id character varying,
    source public.enum_deals_source DEFAULT 'manual'::public.enum_deals_source,
    synced_at timestamp(3) with time zone,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    valid_until timestamp(3) with time zone,
    vat_included boolean DEFAULT true
);


--
-- Name: deals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deals_id_seq OWNED BY public.deals.id;


--
-- Name: deals_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deals_positions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    label character varying NOT NULL,
    qty numeric DEFAULT 1,
    unit_price numeric
);


--
-- Name: deals_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deals_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    products_id integer
);


--
-- Name: deals_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deals_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deals_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deals_rels_id_seq OWNED BY public.deals_rels.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    title character varying NOT NULL,
    category public.enum_documents_category NOT NULL,
    product_id integer,
    file_id integer NOT NULL,
    description character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: kb_chunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kb_chunks (
    id integer NOT NULL,
    source character varying,
    ref_id numeric,
    ref_slug character varying,
    text character varying,
    embedding jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: kb_chunks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kb_chunks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kb_chunks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kb_chunks_id_seq OWNED BY public.kb_chunks.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    name character varying NOT NULL,
    company character varying,
    phone character varying,
    email character varying,
    city character varying,
    client_type public.enum_leads_client_type DEFAULT 'dealer'::public.enum_leads_client_type,
    business_type public.enum_leads_business_type,
    volume public.enum_leads_volume,
    comment character varying,
    status public.enum_leads_status DEFAULT 'new'::public.enum_leads_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    consent boolean,
    consent_at timestamp(3) with time zone,
    policy_version character varying,
    triage_note character varying,
    owner_id integer,
    linked_company_id integer,
    linked_deal_id integer,
    external_id character varying,
    source public.enum_leads_source DEFAULT 'site'::public.enum_leads_source,
    synced_at timestamp(3) with time zone
);


--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    products_id integer,
    leads_id integer,
    documents_id integer,
    companies_id integer,
    deals_id integer,
    activities_id integer,
    audit_log_id integer,
    kb_chunks_id integer,
    chat_sessions_id integer
);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    type public.enum_products_type NOT NULL,
    series character varying,
    min_door_width numeric,
    warranty numeric,
    features character varying,
    package character varying,
    recommendation character varying,
    compatible_profiles character varying,
    images_id integer,
    seo_title character varying,
    seo_description character varying,
    sort_order numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone,
    name character varying NOT NULL,
    role public.enum_users_role DEFAULT 'manager'::public.enum_users_role NOT NULL,
    telegram_chat_id character varying,
    active boolean DEFAULT true
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: chat_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions ALTER COLUMN id SET DEFAULT nextval('public.chat_sessions_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: company_profile id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profile ALTER COLUMN id SET DEFAULT nextval('public.company_profile_id_seq'::regclass);


--
-- Name: deals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals ALTER COLUMN id SET DEFAULT nextval('public.deals_id_seq'::regclass);


--
-- Name: deals_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_rels ALTER COLUMN id SET DEFAULT nextval('public.deals_rels_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: kb_chunks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kb_chunks ALTER COLUMN id SET DEFAULT nextval('public.kb_chunks_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: company_profile company_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_profile
    ADD CONSTRAINT company_profile_pkey PRIMARY KEY (id);


--
-- Name: deals deals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_pkey PRIMARY KEY (id);


--
-- Name: deals_positions deals_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_positions
    ADD CONSTRAINT deals_positions_pkey PRIMARY KEY (id);


--
-- Name: deals_rels deals_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_rels
    ADD CONSTRAINT deals_rels_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: kb_chunks kb_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kb_chunks
    ADD CONSTRAINT kb_chunks_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: activities_assignee_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_assignee_idx ON public.activities USING btree (assignee_id);


--
-- Name: activities_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_author_idx ON public.activities USING btree (author_id);


--
-- Name: activities_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_created_at_idx ON public.activities USING btree (created_at);


--
-- Name: activities_deal_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_deal_idx ON public.activities USING btree (deal_id);


--
-- Name: activities_lead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_lead_idx ON public.activities USING btree (lead_id);


--
-- Name: activities_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_updated_at_idx ON public.activities USING btree (updated_at);


--
-- Name: audit_log_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_created_at_idx ON public.audit_log USING btree (created_at);


--
-- Name: audit_log_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_updated_at_idx ON public.audit_log USING btree (updated_at);


--
-- Name: audit_log_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_user_idx ON public.audit_log USING btree (user_id);


--
-- Name: chat_sessions_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_sessions_created_at_idx ON public.chat_sessions USING btree (created_at);


--
-- Name: chat_sessions_lead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_sessions_lead_idx ON public.chat_sessions USING btree (lead_id);


--
-- Name: chat_sessions_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX chat_sessions_token_idx ON public.chat_sessions USING btree (token);


--
-- Name: chat_sessions_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX chat_sessions_updated_at_idx ON public.chat_sessions USING btree (updated_at);


--
-- Name: companies_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX companies_created_at_idx ON public.companies USING btree (created_at);


--
-- Name: companies_external_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX companies_external_id_idx ON public.companies USING btree (external_id);


--
-- Name: companies_owner_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX companies_owner_idx ON public.companies USING btree (owner_id);


--
-- Name: companies_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX companies_updated_at_idx ON public.companies USING btree (updated_at);


--
-- Name: deals_company_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_company_idx ON public.deals USING btree (company_id);


--
-- Name: deals_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_created_at_idx ON public.deals USING btree (created_at);


--
-- Name: deals_external_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX deals_external_id_idx ON public.deals USING btree (external_id);


--
-- Name: deals_owner_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_owner_idx ON public.deals USING btree (owner_id);


--
-- Name: deals_positions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_positions_order_idx ON public.deals_positions USING btree (_order);


--
-- Name: deals_positions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_positions_parent_id_idx ON public.deals_positions USING btree (_parent_id);


--
-- Name: deals_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_rels_order_idx ON public.deals_rels USING btree ("order");


--
-- Name: deals_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_rels_parent_idx ON public.deals_rels USING btree (parent_id);


--
-- Name: deals_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_rels_path_idx ON public.deals_rels USING btree (path);


--
-- Name: deals_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_rels_products_id_idx ON public.deals_rels USING btree (products_id);


--
-- Name: deals_source_lead_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_source_lead_idx ON public.deals USING btree (source_lead_id);


--
-- Name: deals_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deals_updated_at_idx ON public.deals USING btree (updated_at);


--
-- Name: documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_created_at_idx ON public.documents USING btree (created_at);


--
-- Name: documents_file_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_file_idx ON public.documents USING btree (file_id);


--
-- Name: documents_product_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_product_idx ON public.documents USING btree (product_id);


--
-- Name: documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_updated_at_idx ON public.documents USING btree (updated_at);


--
-- Name: kb_chunks_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_chunks_created_at_idx ON public.kb_chunks USING btree (created_at);


--
-- Name: kb_chunks_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_chunks_updated_at_idx ON public.kb_chunks USING btree (updated_at);


--
-- Name: leads_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_created_at_idx ON public.leads USING btree (created_at);


--
-- Name: leads_external_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX leads_external_id_idx ON public.leads USING btree (external_id);


--
-- Name: leads_linked_company_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_linked_company_idx ON public.leads USING btree (linked_company_id);


--
-- Name: leads_linked_deal_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_linked_deal_idx ON public.leads USING btree (linked_deal_id);


--
-- Name: leads_owner_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_owner_idx ON public.leads USING btree (owner_id);


--
-- Name: leads_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_updated_at_idx ON public.leads USING btree (updated_at);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_activities_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_activities_id_idx ON public.payload_locked_documents_rels USING btree (activities_id);


--
-- Name: payload_locked_documents_rels_audit_log_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_audit_log_id_idx ON public.payload_locked_documents_rels USING btree (audit_log_id);


--
-- Name: payload_locked_documents_rels_chat_sessions_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_chat_sessions_id_idx ON public.payload_locked_documents_rels USING btree (chat_sessions_id);


--
-- Name: payload_locked_documents_rels_companies_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_companies_id_idx ON public.payload_locked_documents_rels USING btree (companies_id);


--
-- Name: payload_locked_documents_rels_deals_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_deals_id_idx ON public.payload_locked_documents_rels USING btree (deals_id);


--
-- Name: payload_locked_documents_rels_documents_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_documents_id_idx ON public.payload_locked_documents_rels USING btree (documents_id);


--
-- Name: payload_locked_documents_rels_kb_chunks_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_kb_chunks_id_idx ON public.payload_locked_documents_rels USING btree (kb_chunks_id);


--
-- Name: payload_locked_documents_rels_leads_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_leads_id_idx ON public.payload_locked_documents_rels USING btree (leads_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_products_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_products_id_idx ON public.payload_locked_documents_rels USING btree (products_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: products_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_created_at_idx ON public.products USING btree (created_at);


--
-- Name: products_images_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_images_idx ON public.products USING btree (images_id);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_updated_at_idx ON public.products USING btree (updated_at);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: activities activities_assignee_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_assignee_id_users_id_fk FOREIGN KEY (assignee_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: activities activities_author_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: activities activities_deal_id_deals_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_deal_id_deals_id_fk FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;


--
-- Name: activities activities_lead_id_leads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_lead_id_leads_id_fk FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: audit_log audit_log_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: chat_sessions chat_sessions_lead_id_leads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_lead_id_leads_id_fk FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: companies companies_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: deals deals_company_id_companies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_company_id_companies_id_fk FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: deals deals_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: deals_positions deals_positions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_positions
    ADD CONSTRAINT deals_positions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: deals_rels deals_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_rels
    ADD CONSTRAINT deals_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: deals_rels deals_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals_rels
    ADD CONSTRAINT deals_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: deals deals_source_lead_id_leads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deals
    ADD CONSTRAINT deals_source_lead_id_leads_id_fk FOREIGN KEY (source_lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: documents documents_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: documents documents_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: leads leads_linked_company_id_companies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_linked_company_id_companies_id_fk FOREIGN KEY (linked_company_id) REFERENCES public.companies(id) ON DELETE SET NULL;


--
-- Name: leads leads_linked_deal_id_deals_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_linked_deal_id_deals_id_fk FOREIGN KEY (linked_deal_id) REFERENCES public.deals(id) ON DELETE SET NULL;


--
-- Name: leads leads_owner_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_owner_id_users_id_fk FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_activities_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_activities_fk FOREIGN KEY (activities_id) REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_audit_log_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_audit_log_fk FOREIGN KEY (audit_log_id) REFERENCES public.audit_log(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_chat_sessions_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_chat_sessions_fk FOREIGN KEY (chat_sessions_id) REFERENCES public.chat_sessions(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_companies_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_companies_fk FOREIGN KEY (companies_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_deals_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_deals_fk FOREIGN KEY (deals_id) REFERENCES public.deals(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_documents_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_documents_fk FOREIGN KEY (documents_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_kb_chunks_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_kb_chunks_fk FOREIGN KEY (kb_chunks_id) REFERENCES public.kb_chunks(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_leads_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_leads_fk FOREIGN KEY (leads_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_images_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_images_id_media_id_fk FOREIGN KEY (images_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (1, 'dev', -1, '2026-09-14 11:27:54.458+00', '2026-08-20 12:31:46.831+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (2, '20260828_093500_sp1_sp2_crm', 1, '2026-08-28 09:35:51.513+00', '2026-08-28 09:35:51.513+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (3, '20260828_100000_sp3_tasks', 2, '2026-08-28 09:47:24.578+00', '2026-08-28 09:47:24.578+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (4, '20260828_110000_sp4_kp', 3, '2026-08-28 09:58:55.946+00', '2026-08-28 09:58:55.946+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (5, '20260828_120000_sp5_chat', 4, '2026-08-28 10:16:39.155+00', '2026-08-28 10:16:39.155+00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.payload_migrations (id, name, batch, updated_at, created_at) VALUES (6, '20260828_130000_sp5_chat_token', 5, '2026-08-28 10:28:48.033+00', '2026-08-28 10:28:48.033+00') ON CONFLICT (id) DO NOTHING;

SELECT setval('public.payload_migrations_id_seq', (SELECT MAX(id) FROM public.payload_migrations));
