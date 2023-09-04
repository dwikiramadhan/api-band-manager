/*
 Navicat Premium Data Transfer

 Source Server         : PG Local
 Source Server Type    : PostgreSQL
 Source Server Version : 140003 (140003)
 Source Host           : localhost:5432
 Source Catalog        : band_mgr
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140003 (140003)
 File Encoding         : 65001

 Date: 04/09/2023 07:15:19
*/


-- ----------------------------
-- Sequence structure for band_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."band_id_seq";
CREATE SEQUENCE "public"."band_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for t_members_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."t_members_id_seq";
CREATE SEQUENCE "public"."t_members_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for t_members_id_seq1
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."t_members_id_seq1";
CREATE SEQUENCE "public"."t_members_id_seq1" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for t_bands
-- ----------------------------
DROP TABLE IF EXISTS "public"."t_bands";
CREATE TABLE "public"."t_bands" (
  "id" int4 NOT NULL DEFAULT nextval('band_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "max_member" int2 NOT NULL,
  "created_at" timestamp(6),
  "updated_at" timestamp(6)
)
;

-- ----------------------------
-- Table structure for t_members
-- ----------------------------
DROP TABLE IF EXISTS "public"."t_members";
CREATE TABLE "public"."t_members" (
  "id" int4 NOT NULL DEFAULT nextval('t_members_id_seq1'::regclass),
  "band_id" int4 NOT NULL,
  "player_id" int4 NOT NULL,
  "status" bool,
  "created_at" timestamp(6)
)
;

-- ----------------------------
-- Table structure for t_players
-- ----------------------------
DROP TABLE IF EXISTS "public"."t_players";
CREATE TABLE "public"."t_players" (
  "id" int4 NOT NULL DEFAULT nextval('t_members_id_seq'::regclass),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6),
  "position" varchar(100) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- View structure for v_bands
-- ----------------------------
DROP VIEW IF EXISTS "public"."v_bands";
CREATE VIEW "public"."v_bands" AS  SELECT b.id,
    b.name,
    b.max_member,
    b.created_at,
    count(m.id) AS total_members
   FROM t_bands b
     LEFT JOIN t_members m ON b.id = m.band_id AND m.status = true
  GROUP BY b.id, b.name, b.max_member, b.created_at;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."band_id_seq"
OWNED BY "public"."t_bands"."id";
SELECT setval('"public"."band_id_seq"', 57, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."t_members_id_seq"
OWNED BY "public"."t_players"."id";
SELECT setval('"public"."t_members_id_seq"', 25, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."t_members_id_seq1"
OWNED BY "public"."t_members"."id";
SELECT setval('"public"."t_members_id_seq1"', 1, false);

-- ----------------------------
-- Uniques structure for table t_bands
-- ----------------------------
ALTER TABLE "public"."t_bands" ADD CONSTRAINT "name" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table t_bands
-- ----------------------------
ALTER TABLE "public"."t_bands" ADD CONSTRAINT "band_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table t_members
-- ----------------------------
ALTER TABLE "public"."t_members" ADD CONSTRAINT "t_members_pkey1" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table t_players
-- ----------------------------
ALTER TABLE "public"."t_players" ADD CONSTRAINT "t_members_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table t_members
-- ----------------------------
ALTER TABLE "public"."t_members" ADD CONSTRAINT "band_id" FOREIGN KEY ("band_id") REFERENCES "public"."t_bands" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."t_members" ADD CONSTRAINT "player_id" FOREIGN KEY ("player_id") REFERENCES "public"."t_players" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
