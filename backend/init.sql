-- CREATE ALL TABLE
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-08-04 11:07:41

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
-- TOC entry 878 (class 1247 OID 24599)
-- Name: room_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.room_status_enum AS ENUM (
    'interval-show-word',
    'interval-not-show-word',
    'new-turn',
    'inactive',
    'wait-for-players',
    'game-start',
    'end-game'
);


ALTER TYPE public.room_status_enum OWNER TO postgres;

--
-- TOC entry 851 (class 1247 OID 24157)
-- Name: user_provider_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_provider_enum AS ENUM (
    'facebook',
    'google'
);


ALTER TYPE public.user_provider_enum OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 24229)
-- Name: word_difficulty_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.word_difficulty_enum AS ENUM (
    'easy',
    'medium',
    'hard'
);


ALTER TYPE public.word_difficulty_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 24149)
-- Name: language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language (
    code character varying NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.language OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24207)
-- Name: room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room (
    id integer NOT NULL,
    code_room character varying NOT NULL,
    host_id integer NOT NULL,
    max_player integer,
    time_per_round integer NOT NULL,
    number_of_round integer NOT NULL,
    thumbnail character varying NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    status public.room_status_enum DEFAULT 'wait-for-players'::public.room_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL,
    updated_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL,
    words_collection_id integer NOT NULL,
    is_created_by_system boolean NOT NULL DEFAULT true,
    language_code character varying
);


ALTER TABLE public.room OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24220)
-- Name: roomround; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roomround (
    room_id integer NOT NULL,
    current_round integer DEFAULT 1 NOT NULL,
    word character varying,
    started_at timestamp without time zone NOT NULL,
    ended_at timestamp without time zone,
    painter integer NOT NULL,
    next_painter integer NOT NULL
);


ALTER TABLE public.roomround OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24245)
-- Name: roomuser; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roomuser (
    room_id integer NOT NULL,
    user_id integer NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    answered_at timestamp without time zone
);


ALTER TABLE public.roomuser OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24174)
-- Name: theme; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.theme (
    id integer NOT NULL,
    name character varying NOT NULL,
    thumbnail character varying NOT NULL
);


ALTER TABLE public.theme OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24173)
-- Name: theme_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.theme_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.theme_id_seq OWNER TO postgres;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 217
-- Name: theme_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.theme_id_seq OWNED BY public.theme.id;


--
-- TOC entry 216 (class 1259 OID 24162)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    avatar character varying NOT NULL,
    nickname character varying NOT NULL,
    is_guest boolean DEFAULT true NOT NULL,
    provider public.user_provider_enum,
    id_provider character varying,
    created_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL,
    updated_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL,
    language_code character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24161)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 215
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 224 (class 1259 OID 24236)
-- Name: word; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.word (
    id integer NOT NULL,
    word character varying NOT NULL,
    difficulty public.word_difficulty_enum DEFAULT 'easy'::public.word_difficulty_enum NOT NULL,
    words_collection_id integer NOT NULL
);


ALTER TABLE public.word OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24235)
-- Name: word_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.word_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.word_id_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 223
-- Name: word_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.word_id_seq OWNED BY public.word.id;


--
-- TOC entry 220 (class 1259 OID 24183)
-- Name: words_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.words_collection (
    id integer NOT NULL,
    theme_id integer NOT NULL,
    creator_id integer,
    language_code character varying NOT NULL,
    is_created_by_system boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL,
    updated_at timestamp without time zone DEFAULT '2023-08-04 11:06:59.35692'::timestamp without time zone NOT NULL
);


ALTER TABLE public.words_collection OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24182)
-- Name: words_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.words_collection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.words_collection_id_seq OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 219
-- Name: words_collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.words_collection_id_seq OWNED BY public.words_collection.id;


--
-- TOC entry 3217 (class 2604 OID 24177)
-- Name: theme id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.theme ALTER COLUMN id SET DEFAULT nextval('public.theme_id_seq'::regclass);


--
-- TOC entry 3213 (class 2604 OID 24165)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3227 (class 2604 OID 24239)
-- Name: word id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.word ALTER COLUMN id SET DEFAULT nextval('public.word_id_seq'::regclass);


--
-- TOC entry 3218 (class 2604 OID 24186)
-- Name: words_collection id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words_collection ALTER COLUMN id SET DEFAULT nextval('public.words_collection_id_seq'::regclass);


--
-- TOC entry 3231 (class 2606 OID 24155)
-- Name: language PK_465b3173cdddf0ac2d3fe73a33c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT "PK_465b3173cdddf0ac2d3fe73a33c" PRIMARY KEY (code);


--
-- TOC entry 3245 (class 2606 OID 24244)
-- Name: word PK_ad026d65e30f80b7056ca31f666; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.word
    ADD CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY (id);


--
-- TOC entry 3243 (class 2606 OID 24227)
-- Name: roomround PK_af86c5a12994958fe26a90cb5da; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomround
    ADD CONSTRAINT "PK_af86c5a12994958fe26a90cb5da" PRIMARY KEY (room_id);


--
-- TOC entry 3235 (class 2606 OID 24181)
-- Name: theme PK_c1934d0b4403bf10c1ab0c18166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.theme
    ADD CONSTRAINT "PK_c1934d0b4403bf10c1ab0c18166" PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 24217)
-- Name: room PK_c6d46db005d623e691b2fbcba23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 24172)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 24250)
-- Name: roomuser PK_ed8cee3d4bf4f051f7098f02a09; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomuser
    ADD CONSTRAINT "PK_ed8cee3d4bf4f051f7098f02a09" PRIMARY KEY (room_id, user_id);


--
-- TOC entry 3237 (class 2606 OID 24193)
-- Name: words_collection PK_f394eec17a3ea60401eb8650d35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words_collection
    ADD CONSTRAINT "PK_f394eec17a3ea60401eb8650d35" PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 24219)
-- Name: room UQ_3894204acc6f0e88fffb23c716e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "UQ_3894204acc6f0e88fffb23c716e" UNIQUE (code_room);


--
-- TOC entry 3259 (class 2606 OID 24311)
-- Name: roomuser FK_162490c04bddc0c62cc2d903ddb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomuser
    ADD CONSTRAINT "FK_162490c04bddc0c62cc2d903ddb" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 3248 (class 2606 OID 24251)
-- Name: user FK_1a4658671f0d0f7e5788c7954fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_1a4658671f0d0f7e5788c7954fc" FOREIGN KEY (language_code) REFERENCES public.language(code);


--
-- TOC entry 3249 (class 2606 OID 24256)
-- Name: words_collection FK_2d5a486dbfc13e351c3bd7ee2e9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words_collection
    ADD CONSTRAINT "FK_2d5a486dbfc13e351c3bd7ee2e9" FOREIGN KEY (theme_id) REFERENCES public.theme(id);


--
-- TOC entry 3252 (class 2606 OID 24281)
-- Name: room FK_4a3ecc80069b5e8c315d3a33b32; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "FK_4a3ecc80069b5e8c315d3a33b32" FOREIGN KEY (language_code) REFERENCES public.language(code);


--
-- TOC entry 3255 (class 2606 OID 24296)
-- Name: roomround FK_9f1cbc2efebf4e6f87cbe59090d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomround
    ADD CONSTRAINT "FK_9f1cbc2efebf4e6f87cbe59090d" FOREIGN KEY (next_painter) REFERENCES public."user"(id);


--
-- TOC entry 3250 (class 2606 OID 24266)
-- Name: words_collection FK_a332eec04b05f211d4d4ea7c34c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words_collection
    ADD CONSTRAINT "FK_a332eec04b05f211d4d4ea7c34c" FOREIGN KEY (language_code) REFERENCES public.language(code);


--
-- TOC entry 3256 (class 2606 OID 24286)
-- Name: roomround FK_af86c5a12994958fe26a90cb5da; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomround
    ADD CONSTRAINT "FK_af86c5a12994958fe26a90cb5da" FOREIGN KEY (room_id) REFERENCES public.room(id);


--
-- TOC entry 3257 (class 2606 OID 24291)
-- Name: roomround FK_b3e48fce126db6ae4fcebbaad40; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomround
    ADD CONSTRAINT "FK_b3e48fce126db6ae4fcebbaad40" FOREIGN KEY (painter) REFERENCES public."user"(id);


--
-- TOC entry 3253 (class 2606 OID 24271)
-- Name: room FK_bd18dee6d0bc5caab60e8a704e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "FK_bd18dee6d0bc5caab60e8a704e5" FOREIGN KEY (host_id) REFERENCES public."user"(id);


--
-- TOC entry 3251 (class 2606 OID 24261)
-- Name: words_collection FK_cb68a1c4c9dea3476e116826231; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words_collection
    ADD CONSTRAINT "FK_cb68a1c4c9dea3476e116826231" FOREIGN KEY (creator_id) REFERENCES public."user"(id);


--
-- TOC entry 3260 (class 2606 OID 24306)
-- Name: roomuser FK_d3f8d5f9984c1771b48c2040eee; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roomuser
    ADD CONSTRAINT "FK_d3f8d5f9984c1771b48c2040eee" FOREIGN KEY (room_id) REFERENCES public.room(id);


--
-- TOC entry 3254 (class 2606 OID 24846)
-- Name: room FK_f1cc011dae2c842575672399d3d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "FK_f1cc011dae2c842575672399d3d" FOREIGN KEY (words_collection_id) REFERENCES public.words_collection(id);


--
-- TOC entry 3258 (class 2606 OID 24851)
-- Name: word FK_f1fe227dbd2a8ce60794a906388; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.word
    ADD CONSTRAINT "FK_f1fe227dbd2a8ce60794a906388" FOREIGN KEY (words_collection_id) REFERENCES public.words_collection(id);


-- Completed on 2023-08-04 11:07:42

--
-- PostgreSQL database dump complete
--


-- init data for language
INSERT INTO public.language(code, name) VALUES ('af', 'Afrikaans');
INSERT INTO public.language(code, name) VALUES ('sq', 'Albanian');
INSERT INTO public.language(code, name) VALUES ('am', 'Amharic');
INSERT INTO public.language(code, name) VALUES ('ar', 'Arabic');
INSERT INTO public.language(code, name) VALUES ('hy', 'Armenian');
INSERT INTO public.language(code, name) VALUES ('az', 'Azerbaijani');
INSERT INTO public.language(code, name) VALUES ('eu', 'Basque');
INSERT INTO public.language(code, name) VALUES ('be', 'Belarusian');
INSERT INTO public.language(code, name) VALUES ('bn', 'Bengali');
INSERT INTO public.language(code, name) VALUES ('bs', 'Bosnian');
INSERT INTO public.language(code, name) VALUES ('bg', 'Bulgarian');
INSERT INTO public.language(code, name) VALUES ('ca', 'Catalan');
INSERT INTO public.language(code, name) VALUES ('ceb', 'Cebuano');
INSERT INTO public.language(code, name) VALUES ('ny', 'Chichewa');
INSERT INTO public.language(code, name) VALUES ('zh', 'Chinese (Simplified)');
INSERT INTO public.language(code, name) VALUES ('zh-TW', 'Chinese (Traditional)');
INSERT INTO public.language(code, name) VALUES ('co', 'Corsican');
INSERT INTO public.language(code, name) VALUES ('hr', 'Croatian');
INSERT INTO public.language(code, name) VALUES ('cs', 'Czech');
INSERT INTO public.language(code, name) VALUES ('da', 'Danish');
INSERT INTO public.language(code, name) VALUES ('nl', 'Dutch');
INSERT INTO public.language(code, name) VALUES ('en', 'English');
INSERT INTO public.language(code, name) VALUES ('eo', 'Esperanto');
INSERT INTO public.language(code, name) VALUES ('et', 'Estonian');
INSERT INTO public.language(code, name) VALUES ('tl', 'Filipino');
INSERT INTO public.language(code, name) VALUES ('fi', 'Finnish');
INSERT INTO public.language(code, name) VALUES ('fr', 'French');
INSERT INTO public.language(code, name) VALUES ('fy', 'Frisian');
INSERT INTO public.language(code, name) VALUES ('gl', 'Galician');
INSERT INTO public.language(code, name) VALUES ('ka', 'Georgian');
INSERT INTO public.language(code, name) VALUES ('de', 'German');
INSERT INTO public.language(code, name) VALUES ('el', 'Greek');
INSERT INTO public.language(code, name) VALUES ('gu', 'Gujarati');
INSERT INTO public.language(code, name) VALUES ('ht', 'Haitian Creole');
INSERT INTO public.language(code, name) VALUES ('ha', 'Hausa');
INSERT INTO public.language(code, name) VALUES ('haw', 'Hawaiian');
INSERT INTO public.language(code, name) VALUES ('iw', 'Hebrew');
INSERT INTO public.language(code, name) VALUES ('hi', 'Hindi');
INSERT INTO public.language(code, name) VALUES ('hmn', 'Hmong');
INSERT INTO public.language(code, name) VALUES ('hu', 'Hungarian');
INSERT INTO public.language(code, name) VALUES ('is', 'Icelandic');
INSERT INTO public.language(code, name) VALUES ('ig', 'Igbo');
INSERT INTO public.language(code, name) VALUES ('id', 'Indonesian');
INSERT INTO public.language(code, name) VALUES ('ga', 'Irish');
INSERT INTO public.language(code, name) VALUES ('it', 'Italian');
INSERT INTO public.language(code, name) VALUES ('ja', 'Japanese');
INSERT INTO public.language(code, name) VALUES ('jw', 'Javanese');
INSERT INTO public.language(code, name) VALUES ('kn', 'Kannada');
INSERT INTO public.language(code, name) VALUES ('kk', 'Kazakh');
INSERT INTO public.language(code, name) VALUES ('km', 'Khmer');
INSERT INTO public.language(code, name) VALUES ('rw', 'Kinyarwanda');
INSERT INTO public.language(code, name) VALUES ('ko', 'Korean');
INSERT INTO public.language(code, name) VALUES ('ku', 'Kurdish (Kurmanji)');
INSERT INTO public.language(code, name) VALUES ('ky', 'Kyrgyz');
INSERT INTO public.language(code, name) VALUES ('lo', 'Lao');
INSERT INTO public.language(code, name) VALUES ('la', 'Latin');
INSERT INTO public.language(code, name) VALUES ('lv', 'Latvian');
INSERT INTO public.language(code, name) VALUES ('lt', 'Lithuanian');
INSERT INTO public.language(code, name) VALUES ('lb', 'Luxembourgish');
INSERT INTO public.language(code, name) VALUES ('mk', 'Macedonian');
INSERT INTO public.language(code, name) VALUES ('mg', 'Malagasy');
INSERT INTO public.language(code, name) VALUES ('ms', 'Malay');
INSERT INTO public.language(code, name) VALUES ('ml', 'Malayalam');
INSERT INTO public.language(code, name) VALUES ('mt', 'Maltese');
INSERT INTO public.language(code, name) VALUES ('mi', 'Maori');
INSERT INTO public.language(code, name) VALUES ('mr', 'Marathi');
INSERT INTO public.language(code, name) VALUES ('mn', 'Mongolian');
INSERT INTO public.language(code, name) VALUES ('my', 'Myanmar (Burmese)');
INSERT INTO public.language(code, name) VALUES ('ne', 'Nepali');
INSERT INTO public.language(code, name) VALUES ('no', 'Norwegian');
INSERT INTO public.language(code, name) VALUES ('or', 'Odia (Oriya)');
INSERT INTO public.language(code, name) VALUES ('ps', 'Pashto');
INSERT INTO public.language(code, name) VALUES ('fa', 'Persian');
INSERT INTO public.language(code, name) VALUES ('pl', 'Polish');
INSERT INTO public.language(code, name) VALUES ('pt', 'Portuguese');
INSERT INTO public.language(code, name) VALUES ('pa', 'Punjabi');
INSERT INTO public.language(code, name) VALUES ('ro', 'Romanian');
INSERT INTO public.language(code, name) VALUES ('ru', 'Russian');
INSERT INTO public.language(code, name) VALUES ('sm', 'Samoan');
INSERT INTO public.language(code, name) VALUES ('gd', 'Scots Gaelic');
INSERT INTO public.language(code, name) VALUES ('sr', 'Serbian');
INSERT INTO public.language(code, name) VALUES ('st', 'Sesotho');
INSERT INTO public.language(code, name) VALUES ('sn', 'Shona');
INSERT INTO public.language(code, name) VALUES ('sd', 'Sindhi');
INSERT INTO public.language(code, name) VALUES ('si', 'Sinhala');
INSERT INTO public.language(code, name) VALUES ('sk', 'Slovak');
INSERT INTO public.language(code, name) VALUES ('sl', 'Slovenian');
INSERT INTO public.language(code, name) VALUES ('so', 'Somali');
INSERT INTO public.language(code, name) VALUES ('es', 'Spanish');
INSERT INTO public.language(code, name) VALUES ('su', 'Sundanese');
INSERT INTO public.language(code, name) VALUES ('sw', 'Swahili');
INSERT INTO public.language(code, name) VALUES ('sv', 'Swedish');
INSERT INTO public.language(code, name) VALUES ('tg', 'Tajik');
INSERT INTO public.language(code, name) VALUES ('ta', 'Tamil');
INSERT INTO public.language(code, name) VALUES ('tt', 'Tatar');
INSERT INTO public.language(code, name) VALUES ('te', 'Telugu');
INSERT INTO public.language(code, name) VALUES ('th', 'Thai');
INSERT INTO public.language(code, name) VALUES ('tr', 'Turkish');
INSERT INTO public.language(code, name) VALUES ('tk', 'Turkmen');
INSERT INTO public.language(code, name) VALUES ('uk', 'Ukrainian');
INSERT INTO public.language(code, name) VALUES ('ur', 'Urdu');
INSERT INTO public.language(code, name) VALUES ('ug', 'Uyghur');
INSERT INTO public.language(code, name) VALUES ('uz', 'Uzbek');
INSERT INTO public.language(code, name) VALUES ('vi', 'Vietnamese');
INSERT INTO public.language(code, name) VALUES ('cy', 'Welsh');
INSERT INTO public.language(code, name) VALUES ('xh', 'Xhosa');
INSERT INTO public.language(code, name) VALUES ('yi', 'Yiddish');
INSERT INTO public.language(code, name) VALUES ('yo', 'Yoruba');
INSERT INTO public.language(code, name) VALUES ('zu', 'Zulu');

-- init data for theme
INSERT INTO public.theme(id, name, thumbnail) VALUES (1, 'animal', 'https://media.istockphoto.com/vectors/animal-circle-pattern-vector-id175606088?k=6&m=175606088&s=170667a&w=0&h=h8NFINyj_616W34sy_2bSq7s_NfVQhOzJHiU6p1NkGc=');
INSERT INTO public.theme(id, name, thumbnail) VALUES (2, 'games', 'https://us.123rf.com/450wm/jemastock/jemastock1912/jemastock191220956/135481905-video-game-control-handle-icon-vector-illustration-design.jpg?ver=6');
INSERT INTO public.theme(id, name, thumbnail) VALUES (3, 'pokemon', 'https://th.bing.com/th/id/R.c6303dd15997893f02348dafd1e4062f?rik=A7EjLrbq%2fokSaA&riu=http%3a%2f%2fjourneytojah.com%2fwp-content%2fuploads%2f2020%2f05%2fpokemon-3418266_640.png&ehk=QJMrwpN5aeIYlP%2fwAHNENVq8SBL2NHkwutmNxVUqb3k%3d&risl=&pid=ImgRaw&r=0');
INSERT INTO public.theme(id, name, thumbnail) VALUES (4, 'football club', 'https://th.bing.com/th/id/R.1ce8d1d6ccc8ff539048b46f0051e997?rik=T81PNTHsJoitbw&pid=ImgRaw&r=0');

-- init data user
INSERT INTO public."user"(id, avatar, nickname, is_guest, language_code) 
VALUES (1, 'https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-female-4-1024.png', 'USER123TEST', true, 'en');

-- init words collection
INSERT INTO public.words_collection(id, is_created_by_system, theme_id, creator_id, language_code) VALUES (1, true, 1, 1, 'en');
INSERT INTO public.words_collection(id, is_created_by_system, theme_id, creator_id, language_code) VALUES (2, true, 2, 1, 'en');
INSERT INTO public.words_collection(id, is_created_by_system, theme_id, creator_id, language_code) VALUES (3, true, 3, 1, 'en');
INSERT INTO public.words_collection(id, is_created_by_system, theme_id, creator_id, language_code) VALUES (4, true, 4, 1, 'en');

-- init data room
INSERT INTO public.room(id, code_room, max_player, time_per_round, number_of_round, thumbnail, is_public, host_id, words_collection_id, language_code)
VALUES (1, 'ULSKJSH_1', 8, 60, 3, 'https://media.istockphoto.com/vectors/animal-circle-pattern-vector-id175606088?k=6&m=175606088&s=170667a&w=0&h=h8NFINyj_616W34sy_2bSq7s_NfVQhOzJHiU6p1NkGc=', true, 1, 4, 'en');

-- init word
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('dog', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('cat', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('bird', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('buffalo', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('chicken', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('dolphin', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('elephant', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('fox', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('frog', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('kangaroo', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('lion', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('monkey', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('penguin', 'hard', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('whale', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('tiger', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('wolf', 'easy', 1);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('pubg', 'easy', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('csgo', 'easy', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('valorant', 'easy', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('genshin impact', 'hard', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('outlast', 'easy', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('naraka', 'easy', 2);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('pikachu', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('golem', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('charmander', 'hard', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('pidgey', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('meowth', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('mankey', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('machop', 'easy', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('alakazam', 'hard', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('ponyta', 'hard', 3);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('manchester united', 'medium', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('manchester city', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('real madrid', 'medium', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('liverpool', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('chelsea', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('arsenal', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('tottenham', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('juventus', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('barca', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('inter miami', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('al nassr', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('ac milan', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('as roma', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('inter milan', 'medium', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('psg', 'easy', 4);
INSERT INTO public.word(word, difficulty, words_collection_id)
VALUES ('newcastle', 'easy', 4);