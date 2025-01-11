/*
 Navicat Premium Data Transfer

 Source Server         : shadmin
 Source Server Type    : SQLite
 Source Server Version : 3035005 (3.35.5)
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005 (3.35.5)
 File Encoding         : 65001

 Date: 14/12/2024 23:10:52
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for _admin_old_20241214
-- ----------------------------
DROP TABLE IF EXISTS "_admin_old_20241214";
CREATE TABLE "_admin_old_20241214" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT(50) NOT NULL
);

-- ----------------------------
-- Records of _admin_old_20241214
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _admin_old_20241214_1
-- ----------------------------
DROP TABLE IF EXISTS "_admin_old_20241214_1";
CREATE TABLE "_admin_old_20241214_1" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT(50) NOT NULL,
  "password" TEXT(100)
);

-- ----------------------------
-- Records of _admin_old_20241214_1
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214";
CREATE TABLE "_menu_old_20241214" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- ----------------------------
-- Records of _menu_old_20241214
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_1
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_1";
CREATE TABLE "_menu_old_20241214_1" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Records of _menu_old_20241214_1
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_2
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_2";
CREATE TABLE "_menu_old_20241214_2" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL
);

-- ----------------------------
-- Records of _menu_old_20241214_2
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_3
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_3";
CREATE TABLE "_menu_old_20241214_3" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100)
);

-- ----------------------------
-- Records of _menu_old_20241214_3
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_4
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_4";
CREATE TABLE "_menu_old_20241214_4" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL
);

-- ----------------------------
-- Records of _menu_old_20241214_4
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_5
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_5";
CREATE TABLE "_menu_old_20241214_5" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL,
  "key" TEXT(100) NOT NULL
);

-- ----------------------------
-- Records of _menu_old_20241214_5
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_6
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_6";
CREATE TABLE "_menu_old_20241214_6" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL,
  "key" TEXT(100) NOT NULL,
  "display" INTEGER NOT NULL
);

-- ----------------------------
-- Records of _menu_old_20241214_6
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_7
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_7";
CREATE TABLE "_menu_old_20241214_7" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL,
  "key" TEXT(100) NOT NULL,
  "display" INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Records of _menu_old_20241214_7
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _menu_old_20241214_8
-- ----------------------------
DROP TABLE IF EXISTS "_menu_old_20241214_8";
CREATE TABLE "_menu_old_20241214_8" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL,
  "key" TEXT(100) NOT NULL,
  "display" INTEGER NOT NULL DEFAULT 1
);

-- ----------------------------
-- Records of _menu_old_20241214_8
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS "admin";
CREATE TABLE "admin" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT(50) NOT NULL,
  "password" TEXT(100) NOT NULL
);

-- ----------------------------
-- Records of admin
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for app
-- ----------------------------
DROP TABLE IF EXISTS "app";
CREATE TABLE "app" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "name" TEXT(100)
);

-- ----------------------------
-- Records of app
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS "menu";
CREATE TABLE "menu" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "pid" INTEGER NOT NULL DEFAULT 0,
  "label" TEXT(50) NOT NULL,
  "path" TEXT(100) NOT NULL,
  "key" TEXT(100) NOT NULL,
  "display" INTEGER NOT NULL DEFAULT 1,
  "sort" INTEGER NOT NULL DEFAULT 0
);

-- ----------------------------
-- Records of menu
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);

-- ----------------------------
-- Records of sqlite_sequence
-- ----------------------------
BEGIN;
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('app', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_admin_old_20241214_1', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('admin', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_1', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_2', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_3', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_4', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_5', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_6', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_7', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('_menu_old_20241214_8', 0);
INSERT INTO "sqlite_sequence" ("name", "seq") VALUES ('menu', 0);
COMMIT;

-- ----------------------------
-- Auto increment value for _admin_old_20241214_1
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_1
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_2
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_3
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_4
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_5
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_6
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_7
-- ----------------------------

-- ----------------------------
-- Auto increment value for _menu_old_20241214_8
-- ----------------------------

-- ----------------------------
-- Auto increment value for admin
-- ----------------------------

-- ----------------------------
-- Auto increment value for app
-- ----------------------------

-- ----------------------------
-- Auto increment value for menu
-- ----------------------------

PRAGMA foreign_keys = true;
