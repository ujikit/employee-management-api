-- MySQL dump 10.13  Distrib 26.7.0, for Linux (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'c7748cb1-8a93-11f1-8e6a-5a3ff7a15049:1-8044';

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('3b202be2-ec73-496b-ada3-8a14683ad26d','fc6aa04d709c3cb96333463f3671ff23633c9e9a9e5c61ba69a2430e118c6f62','2026-08-11 09:58:03.799','20260811095800_init',NULL,NULL,'2026-08-11 09:58:00.740',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `module_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` enum('LOGIN','LOGOUT','CREATE','READ','UPDATE','DELETE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `subject_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `method` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_fkey` (`user_id`),
  CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'MOD_USER','LOGIN','User berhasil login',NULL,NULL,'127.0.0.1','PostmanRuntime/7.32.3',NULL,NULL,NULL,NULL,'2026-08-11 10:07:22.353','2026-08-11 10:07:22.353'),(2,1,'MOD_USER','LOGIN','User berhasil login',NULL,NULL,'127.0.0.1','PostmanRuntime/7.32.3',NULL,NULL,NULL,NULL,'2026-08-11 10:25:52.377','2026-08-11 10:25:52.377');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_imports`
--

DROP TABLE IF EXISTS `attendance_imports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_imports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `original_filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period_year` int NOT NULL,
  `period_month` int NOT NULL,
  `status` enum('QUEUED','PROCESSING','COMPLETED','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'QUEUED',
  `total_rows` int NOT NULL DEFAULT '0',
  `processed_rows` int NOT NULL DEFAULT '0',
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `started_at` datetime(3) DEFAULT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_imports_user_id_fkey` (`user_id`),
  CONSTRAINT `attendance_imports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_imports`
--

LOCK TABLES `attendance_imports` WRITE;
/*!40000 ALTER TABLE `attendance_imports` DISABLE KEYS */;
INSERT INTO `attendance_imports` VALUES (1,1,'absensi_agustus.xlsx',2026,8,'COMPLETED',100,100,NULL,NULL,NULL,'2026-08-11 10:07:22.211','2026-08-11 10:07:22.211'),(2,1,'absensi_agustus.xlsx',2026,8,'COMPLETED',100,100,NULL,NULL,NULL,'2026-08-11 10:25:52.292','2026-08-11 10:25:52.292'),(62,3,'manual_import_2026_7.json',2026,7,'COMPLETED',3,3,NULL,'2026-08-13 02:28:02.319','2026-08-13 02:28:02.319','2026-08-13 02:28:02.320','2026-08-13 02:28:02.320'),(63,3,'manual_import_2026_7.json',2026,7,'COMPLETED',3,3,NULL,'2026-08-13 03:36:52.922','2026-08-13 03:36:52.922','2026-08-13 03:36:52.924','2026-08-13 03:36:52.924'),(64,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 03:47:31.996','2026-08-13 03:47:31.996','2026-08-13 03:47:31.997','2026-08-13 03:47:31.997'),(65,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 03:49:57.243','2026-08-13 03:49:57.243','2026-08-13 03:49:57.244','2026-08-13 03:49:57.244'),(66,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 03:50:29.005','2026-08-13 03:50:29.005','2026-08-13 03:50:29.006','2026-08-13 03:50:29.006'),(67,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 03:53:13.486','2026-08-13 03:53:13.486','2026-08-13 03:53:13.488','2026-08-13 03:53:13.488'),(68,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 03:55:24.475','2026-08-13 03:55:24.475','2026-08-13 03:55:24.476','2026-08-13 03:55:24.476'),(69,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 04:02:28.001','2026-08-13 04:02:28.001','2026-08-13 04:02:28.003','2026-08-13 04:02:28.003'),(71,3,'manual_import_2026_7.json',2026,7,'COMPLETED',76,76,NULL,'2026-08-13 04:09:24.243','2026-08-13 04:09:24.243','2026-08-13 04:09:24.244','2026-08-13 04:09:24.244'),(72,3,'manual_import_2026_7.json',2026,7,'COMPLETED',114,114,NULL,'2026-08-13 06:26:22.678','2026-08-13 06:26:22.678','2026-08-13 06:26:22.679','2026-08-13 06:26:22.679'),(73,3,'manual_import_2026_7.json',2026,7,'COMPLETED',114,114,NULL,'2026-08-13 06:33:52.167','2026-08-13 06:33:52.167','2026-08-13 06:33:52.168','2026-08-13 06:33:52.168'),(74,3,'manual_import_2026_7.json',2026,7,'COMPLETED',114,114,NULL,'2026-08-13 06:50:38.244','2026-08-13 06:50:38.244','2026-08-13 06:50:38.246','2026-08-13 06:50:38.246'),(75,3,'manual_import_2026_7.json',2026,7,'COMPLETED',57,57,NULL,'2026-08-13 06:55:49.560','2026-08-13 06:55:49.560','2026-08-13 06:55:49.561','2026-08-13 06:55:49.561');
/*!40000 ALTER TABLE `attendance_imports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_summaries`
--

DROP TABLE IF EXISTS `attendance_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_summaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `period_year` int NOT NULL,
  `period_month` int NOT NULL,
  `hadir` int NOT NULL DEFAULT '0',
  `cuti` int NOT NULL DEFAULT '0',
  `kuota_cuti` int NOT NULL DEFAULT '0',
  `izin` int NOT NULL DEFAULT '0',
  `kuota_izin` int NOT NULL DEFAULT '0',
  `unpaid_leave` int NOT NULL DEFAULT '0',
  `kuota_unpaid_leave` int NOT NULL DEFAULT '0',
  `status_hadir` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calculated_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendance_summaries_employee_id_period_year_period_month_key` (`employee_id`,`period_year`,`period_month`),
  CONSTRAINT `attendance_summaries_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_summaries`
--

LOCK TABLES `attendance_summaries` WRITE;
/*!40000 ALTER TABLE `attendance_summaries` DISABLE KEYS */;
INSERT INTO `attendance_summaries` VALUES (1,1,2026,8,22,0,0,0,0,0,0,'Terpenuhi',NULL,'2026-08-11 10:07:22.254','2026-08-11 10:07:22.254');
/*!40000 ALTER TABLE `attendance_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `attendance_import_id` int DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `checkin_at` datetime(3) DEFAULT NULL,
  `checkout_at` datetime(3) DEFAULT NULL,
  `checkin_location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checkout_location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance_type` enum('HADIR','CUTI','IZIN','UNPAID_LEAVE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_hours` double DEFAULT NULL,
  `status` enum('TERPENUHI','TIDAK_TERPENUHI') COLLATE utf8mb4_unicode_ci NOT NULL,
  `verification_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified_by_role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attendances_employee_id_attendance_date_key` (`employee_id`,`attendance_date`),
  KEY `attendances_attendance_import_id_fkey` (`attendance_import_id`),
  CONSTRAINT `attendances_attendance_import_id_fkey` FOREIGN KEY (`attendance_import_id`) REFERENCES `attendance_imports` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `attendances_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (961,1,75,'2026-07-01','2026-07-01 01:15:00.000','2026-07-01 10:00:00.000','Gedung Utama','Gedung Utama','IZIN',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(962,1,75,'2026-07-02','2026-07-02 01:00:00.000','2026-07-02 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(963,1,75,'2026-07-03','2026-07-03 01:15:00.000','2026-07-03 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(964,1,75,'2026-07-06','2026-07-06 01:00:00.000','2026-07-06 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(965,1,75,'2026-07-07','2026-07-07 01:15:00.000','2026-07-07 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(966,1,75,'2026-07-08','2026-07-08 01:00:00.000','2026-07-08 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(967,1,75,'2026-07-09','2026-07-09 01:15:00.000','2026-07-09 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(968,1,75,'2026-07-10','2026-07-10 01:00:00.000','2026-07-10 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(969,1,75,'2026-07-13','2026-07-13 01:15:00.000','2026-07-13 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(970,1,75,'2026-07-14','2026-07-14 01:00:00.000','2026-07-14 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TIDAK_TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(971,1,75,'2026-07-15','2026-07-14 01:00:00.000','2026-07-14 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TIDAK_TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(972,1,75,'2026-07-16','2026-07-16 01:00:00.000','2026-07-16 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(973,1,75,'2026-07-17','2026-07-17 01:15:00.000','2026-07-17 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(974,1,75,'2026-07-20','2026-07-20 01:00:00.000','2026-07-20 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(975,1,75,'2026-07-21','2026-07-21 01:15:00.000','2026-07-21 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(976,1,75,'2026-07-22','2026-07-21 01:15:00.000','2026-07-21 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(977,1,75,'2026-07-23','2026-07-23 01:15:00.000','2026-07-23 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(978,1,75,'2026-07-24','2026-07-24 01:00:00.000','2026-07-24 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(979,1,75,'2026-07-27','2026-07-27 01:15:00.000','2026-07-27 10:00:00.000','Gedung Utama','Gedung Utama','HADIR',8.75,'TERPENUHI','Disetujui','HRD','Absensi di Gedung Utama','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(980,2,75,'2026-07-01','2026-07-01 01:00:00.000','2026-07-01 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(981,2,75,'2026-07-02','2026-07-02 01:15:00.000','2026-07-02 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(982,2,75,'2026-07-03','2026-07-03 01:00:00.000','2026-07-03 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(983,2,75,'2026-07-06','2026-07-06 01:15:00.000','2026-07-06 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(984,2,75,'2026-07-07','2026-07-07 01:00:00.000','2026-07-07 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(985,2,75,'2026-07-08','2026-07-14 01:00:00.000','2026-07-14 10:00:00.000','Gedung Utama','Gedung Utama','IZIN',9,'TERPENUHI','Disetujui','HRD','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(986,2,75,'2026-07-09','2026-07-09 01:00:00.000','2026-07-09 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(987,2,75,'2026-07-10','2026-07-10 01:15:00.000','2026-07-10 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(988,2,75,'2026-07-13','2026-07-13 01:00:00.000','2026-07-13 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(989,2,75,'2026-07-14','2026-07-14 01:15:00.000','2026-07-14 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(990,2,75,'2026-07-15','2026-07-15 01:00:00.000','2026-07-15 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(991,2,75,'2026-07-16','2026-07-16 01:15:00.000','2026-07-16 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(992,2,75,'2026-07-17','2026-07-17 01:00:00.000','2026-07-17 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(993,2,75,'2026-07-20','2026-07-20 01:15:00.000','2026-07-20 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(994,2,75,'2026-07-21','2026-07-21 01:00:00.000','2026-07-21 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(995,2,75,'2026-07-22','2026-07-22 01:15:00.000','2026-07-22 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(996,2,75,'2026-07-23','2026-07-23 01:00:00.000','2026-07-23 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(997,2,75,'2026-07-24','2026-07-24 01:15:00.000','2026-07-24 10:00:00.000','Gedung A','Gedung A','HADIR',8.75,'TERPENUHI','Disetujui','Manager','Absensi di Gedung A','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(998,2,75,'2026-07-27','2026-07-27 01:00:00.000','2026-07-27 10:00:00.000','Gedung A','Gedung A','HADIR',9,'TERPENUHI','Disetujui','Manager','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(999,3,75,'2026-07-01','2026-07-01 01:15:00.000','2026-07-01 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1000,3,75,'2026-07-02','2026-07-02 01:00:00.000','2026-07-02 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1001,3,75,'2026-07-03','2026-07-03 01:15:00.000','2026-07-03 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1002,3,75,'2026-07-06','2026-07-06 01:00:00.000','2026-07-06 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1003,3,75,'2026-07-07','2026-07-07 01:15:00.000','2026-07-07 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1004,3,75,'2026-07-08','2026-07-08 01:00:00.000','2026-07-08 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1005,3,75,'2026-07-09','2026-07-09 01:15:00.000','2026-07-09 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1006,3,75,'2026-07-10','2026-07-10 01:00:00.000','2026-07-10 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1007,3,75,'2026-07-13','2026-07-13 01:15:00.000','2026-07-13 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1008,3,75,'2026-07-14','2026-07-14 01:00:00.000','2026-07-14 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1009,3,75,'2026-07-15','2026-07-15 01:15:00.000','2026-07-15 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1010,3,75,'2026-07-16','2026-07-16 01:00:00.000','2026-07-16 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1011,3,75,'2026-07-17','2026-07-16 01:00:00.000','2026-07-16 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1012,3,75,'2026-07-20','2026-07-20 01:00:00.000','2026-07-20 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1013,3,75,'2026-07-21','2026-07-21 01:15:00.000','2026-07-21 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1014,3,75,'2026-07-22','2026-07-22 01:00:00.000','2026-07-22 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1015,3,75,'2026-07-23','2026-07-23 01:15:00.000','2026-07-23 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1016,3,75,'2026-07-24','2026-07-24 01:00:00.000','2026-07-24 10:00:00.000','Gedung B','Gedung B','HADIR',9,'TERPENUHI','Disetujui','Lead','Datang tepat waktu','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582'),(1017,3,75,'2026-07-27','2026-07-27 01:15:00.000','2026-07-27 10:00:00.000','Gedung B','Gedung B','HADIR',8.75,'TERPENUHI','Disetujui','Lead','Absensi di Gedung B','2026-08-13 06:55:49.582','2026-08-13 06:55:49.582');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'HRD','Human Resources Department','2026-08-11 10:07:21.887','2026-08-11 10:07:21.887');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `regency_id` int NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `districts_code_key` (`code`),
  KEY `districts_regency_id_fkey` (`regency_id`),
  CONSTRAINT `districts_regency_id_fkey` FOREIGN KEY (`regency_id`) REFERENCES `regencies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,1,'DPK','Depok','2026-08-11 10:07:21.969','2026-08-11 10:07:21.969');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_educations`
--

DROP TABLE IF EXISTS `employee_educations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_educations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `education_level` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `graduation_year` int NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_educations_employee_id_fkey` (`employee_id`),
  CONSTRAINT `employee_educations_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_educations`
--

LOCK TABLES `employee_educations` WRITE;
/*!40000 ALTER TABLE `employee_educations` DISABLE KEYS */;
INSERT INTO `employee_educations` VALUES (1,1,'S1','Universitas Gadjah Mada',2012,0,'2026-08-11 10:07:22.035','2026-08-11 10:07:22.035'),(52,52,'SMA','SMA Negeri 1 Yogyakarta',2013,1,'2026-08-12 16:07:52.175','2026-08-12 16:07:52.175'),(53,52,'S1','Universitas Gadjah Mada',2017,2,'2026-08-12 16:07:52.175','2026-08-12 16:07:52.175'),(54,53,'s1','sdsdsd',2026,1,'2026-08-12 16:28:34.985','2026-08-12 16:28:34.985');
/*!40000 ALTER TABLE `employee_educations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nip` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_place` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `marital_status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `children_count` int NOT NULL DEFAULT '0',
  `joined_at` date DEFAULT NULL,
  `position_id` int NOT NULL,
  `department_id` int NOT NULL,
  `employment_type` enum('PKWTT','PKWT','MAGANG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance_km` double DEFAULT NULL,
  `district_id` int NOT NULL,
  `full_address` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_nip_key` (`nip`),
  UNIQUE KEY `employees_email_key` (`email`),
  KEY `employees_position_id_fkey` (`position_id`),
  KEY `employees_department_id_fkey` (`department_id`),
  KEY `employees_district_id_fkey` (`district_id`),
  CONSTRAINT `employees_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `employees_district_id_fkey` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `employees_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'123456789','John Doe','john.doe@company.com','+6281234567890',NULL,'Yogyakarta','1990-01-01','kawin',1,'2022-01-01',1,1,'PKWTT','Laki-laki',15.5,1,'Jl. Kaliurang KM 5','ACTIVE',NULL,NULL,'2026-08-11 10:07:21.995','2026-08-11 10:07:21.995',NULL),(2,'123456790','Jane Doe','jane.doe@company.com','+6281234567891',NULL,'Jakarta','1992-05-15','kawin',0,'2023-03-01',1,1,'PKWTT','Perempuan',8.2,1,'Jl. Gejayan','ACTIVE',NULL,NULL,'2026-08-11 10:25:52.039','2026-08-11 10:25:52.039',NULL),(3,'123456791','Bob Smith','bob.smith@company.com','+6281234567892',NULL,'Bandung','1995-10-20','tidak kawin',0,'2024-01-15',2,1,'PKWTT','Laki-laki',20,1,'Jl. Magelang','ACTIVE',NULL,NULL,'2026-08-11 10:25:52.064','2026-08-11 10:25:52.064',NULL),(52,'11223344','Fauzi Tech','fauzi.tech@example.com','+6281234567890',NULL,'Yogyakarta','1995-08-12','kawin',1,'2024-01-15',1,1,'PKWTT',NULL,12,1,'Jl. Kaliurang KM 5, Depok, Sleman','ACTIVE',2,NULL,'2026-08-12 16:07:52.123','2026-08-12 16:07:52.123',NULL),(53,'1012930213','Tess Zaki','tess@gmail.com','+6288392328323',NULL,'sadsadas','2026-08-06','kawin',2,'2026-08-19',1,1,'PKWTT',NULL,3,1,'4','ACTIVE',2,NULL,'2026-08-12 16:28:34.970','2026-08-12 16:28:34.970',NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_otps`
--

DROP TABLE IF EXISTS `login_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `otp_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('EMAIL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMAIL',
  `sent_to` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `verified_at` datetime(3) DEFAULT NULL,
  `used_at` datetime(3) DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `login_otps_user_id_fkey` (`user_id`),
  CONSTRAINT `login_otps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_otps`
--

LOCK TABLES `login_otps` WRITE;
/*!40000 ALTER TABLE `login_otps` DISABLE KEYS */;
INSERT INTO `login_otps` VALUES (120,1,'0000','EMAIL','super@yopmail.com','2026-08-12 13:27:48.109','2026-08-12 13:25:00.949',NULL,NULL,NULL,'2026-08-12 13:24:48.110','2026-08-13 00:11:19.251'),(121,2,'0000','EMAIL','manager@yopmail.com','2026-08-12 13:28:30.256','2026-08-12 13:25:42.234',NULL,NULL,NULL,'2026-08-12 13:25:30.257','2026-08-12 17:19:24.220'),(122,1,'0000','EMAIL','super@yopmail.com','2026-08-12 17:14:05.637','2026-08-12 17:11:10.586',NULL,NULL,NULL,'2026-08-12 17:11:05.638','2026-08-13 00:11:19.251'),(123,2,'0000','EMAIL','manager@yopmail.com','2026-08-12 17:14:18.097','2026-08-12 17:11:29.349',NULL,NULL,NULL,'2026-08-12 17:11:18.098','2026-08-12 17:19:24.220'),(124,3,'0000','EMAIL','admin@yopmail.com','2026-08-12 17:18:25.007','2026-08-12 17:15:34.745',NULL,NULL,NULL,'2026-08-12 17:15:25.008','2026-08-13 00:11:32.111'),(125,1,'0000','EMAIL','super@yopmail.com','2026-08-12 17:22:05.616','2026-08-12 17:19:19.727',NULL,NULL,NULL,'2026-08-12 17:19:05.617','2026-08-13 00:11:19.251'),(126,2,'0000','EMAIL','manager@yopmail.com','2026-08-12 17:22:24.239','2026-08-12 17:19:27.475',NULL,NULL,NULL,'2026-08-12 17:19:24.240','2026-08-12 17:19:27.476'),(127,3,'0000','EMAIL','admin@yopmail.com','2026-08-12 17:22:39.794','2026-08-12 17:19:46.171',NULL,NULL,NULL,'2026-08-12 17:19:39.794','2026-08-13 00:11:32.111'),(154,1,'0000','EMAIL','super@yopmail.com','2026-08-13 00:13:19.327','2026-08-13 00:11:27.570',NULL,NULL,NULL,'2026-08-13 00:10:19.328','2026-08-13 00:11:27.571'),(155,1,'0000','EMAIL','super@yopmail.com','2026-08-13 00:14:19.262',NULL,NULL,NULL,NULL,'2026-08-13 00:11:19.263','2026-08-13 00:11:19.263'),(156,3,'0000','EMAIL','admin@yopmail.com','2026-08-13 00:14:32.120','2026-08-13 00:11:42.818',NULL,NULL,NULL,'2026-08-13 00:11:32.121','2026-08-13 00:11:42.819');
/*!40000 ALTER TABLE `login_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `modules_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
INSERT INTO `modules` VALUES (1,'MOD_ROLE','Kelola Role',NULL,0,'2026-08-11 10:07:21.769','2026-08-11 10:07:21.769'),(2,'MOD_USER','Kelola User',NULL,0,'2026-08-11 10:07:21.792','2026-08-11 10:07:21.792'),(3,'MOD_PEGAWAI','Data Pegawai',NULL,0,'2026-08-11 10:07:21.806','2026-08-11 10:07:21.806'),(4,'MOD_PRESENSI','Presensi',NULL,0,'2026-08-11 10:07:21.820','2026-08-11 10:07:21.820'),(5,'MOD_TUNJANGAN','Tunjangan Transport',NULL,0,'2026-08-11 10:07:21.835','2026-08-11 10:07:21.835');
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_type` enum('MANAGER','STAF','MAGANG') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `positions_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'MGR','Manager','MANAGER','2026-08-11 10:07:21.907','2026-08-11 10:07:21.907'),(2,'STAF','Staff','STAF','2026-08-11 10:25:51.946','2026-08-11 10:25:51.946');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `provinces_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,'DIY','Daerah Istimewa Yogyakarta','2026-08-11 10:07:21.926','2026-08-11 10:07:21.926');
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regencies`
--

DROP TABLE IF EXISTS `regencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `province_id` int NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `regencies_code_key` (`code`),
  KEY `regencies_province_id_fkey` (`province_id`),
  CONSTRAINT `regencies_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regencies`
--

LOCK TABLES `regencies` WRITE;
/*!40000 ALTER TABLE `regencies` DISABLE KEYS */;
INSERT INTO `regencies` VALUES (1,1,'SLM','Sleman','2026-08-11 10:07:21.947','2026-08-11 10:07:21.947');
/*!40000 ALTER TABLE `regencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `module_id` int NOT NULL,
  `can_access` tinyint(1) NOT NULL DEFAULT '0',
  `can_create` tinyint(1) NOT NULL DEFAULT '0',
  `read_scope` enum('NO','ALL','OWN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NO',
  `update_scope` enum('NO','ALL','OWN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NO',
  `delete_scope` enum('NO','ALL','OWN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NO',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_id_module_id_key` (`role_id`,`module_id`),
  KEY `role_permissions_module_id_fkey` (`module_id`),
  CONSTRAINT `role_permissions_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,1,1,1,'ALL','ALL','ALL','2026-08-11 10:07:21.864','2026-08-11 10:07:21.864');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPERADMIN','Superadmin','System Administrator','2026-08-11 10:07:21.680','2026-08-11 10:07:21.680'),(2,'MGR_HRD','Manager HRD','Manager Human Resources','2026-08-11 10:07:21.733','2026-08-11 10:07:21.733'),(3,'ADM_HRD','Admin HRD','Admin Human Resources','2026-08-11 10:07:21.754','2026-08-11 10:07:21.754');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_allowance_details`
--

DROP TABLE IF EXISTS `transport_allowance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_allowance_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `base_fare` double NOT NULL,
  `original_km` double NOT NULL,
  `rounded_km` double NOT NULL,
  `attendance_days` int NOT NULL,
  `nominal` double NOT NULL,
  `eligibility_status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `calculation_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transport_allowance_details_period_id_employee_id_key` (`period_id`,`employee_id`),
  KEY `transport_allowance_details_employee_id_fkey` (`employee_id`),
  CONSTRAINT `transport_allowance_details_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transport_allowance_details_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `transport_allowance_periods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_allowance_details`
--

LOCK TABLES `transport_allowance_details` WRITE;
/*!40000 ALTER TABLE `transport_allowance_details` DISABLE KEYS */;
INSERT INTO `transport_allowance_details` VALUES (90,65,1,5000,15.5,16,16,0,'INELIGIBLE',NULL,'2026-08-13 06:55:49.674','2026-08-13 06:55:49.674'),(91,65,2,5000,8.2,8,18,0,'INELIGIBLE',NULL,'2026-08-13 06:55:49.702','2026-08-13 06:55:49.702'),(92,65,3,5000,20,20,19,1900000,'ELIGIBLE',NULL,'2026-08-13 06:55:49.746','2026-08-13 06:55:49.746');
/*!40000 ALTER TABLE `transport_allowance_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_allowance_periods`
--

DROP TABLE IF EXISTS `transport_allowance_periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_allowance_periods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period_year` int NOT NULL,
  `period_month` int NOT NULL,
  `total_recipients` int NOT NULL DEFAULT '0',
  `total_amount` double NOT NULL DEFAULT '0',
  `status` enum('DRAFT','CALCULATED','LOCKED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `calculated_by` int DEFAULT NULL,
  `calculated_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transport_allowance_periods_period_year_period_month_key` (`period_year`,`period_month`),
  KEY `transport_allowance_periods_calculated_by_fkey` (`calculated_by`),
  CONSTRAINT `transport_allowance_periods_calculated_by_fkey` FOREIGN KEY (`calculated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_allowance_periods`
--

LOCK TABLES `transport_allowance_periods` WRITE;
/*!40000 ALTER TABLE `transport_allowance_periods` DISABLE KEYS */;
INSERT INTO `transport_allowance_periods` VALUES (65,2026,7,1,1900000,'CALCULATED',NULL,NULL,'2026-08-13 06:55:49.641','2026-08-13 06:55:49.766');
/*!40000 ALTER TABLE `transport_allowance_periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_allowance_settings`
--

DROP TABLE IF EXISTS `transport_allowance_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_allowance_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `base_fare` double NOT NULL,
  `effective_start` datetime(3) NOT NULL,
  `min_km` double NOT NULL,
  `max_km` double NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transport_allowance_settings_created_by_fkey` (`created_by`),
  CONSTRAINT `transport_allowance_settings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_allowance_settings`
--

LOCK TABLES `transport_allowance_settings` WRITE;
/*!40000 ALTER TABLE `transport_allowance_settings` DISABLE KEYS */;
INSERT INTO `transport_allowance_settings` VALUES (1,5000,'2026-01-01 00:00:00.000',5,25,1,1,'2026-08-11 10:07:22.280','2026-08-11 10:07:22.280');
/*!40000 ALTER TABLE `transport_allowance_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_me` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `last_activity_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) NOT NULL,
  `logged_out_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_sessions_session_token_key` (`session_token`),
  KEY `user_sessions_user_id_fkey` (`user_id`),
  CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (1,1,'dummy-token-1786442842194',0,'127.0.0.1',NULL,NULL,'2026-08-11 10:10:22.194',NULL,'2026-08-11 10:07:22.195','2026-08-11 10:07:22.195'),(2,1,'dummy-token-1786443952272',0,'127.0.0.1',NULL,NULL,'2026-08-11 10:28:52.272',NULL,'2026-08-11 10:25:52.273','2026-08-11 10:25:52.273');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `role_id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cellphone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `password_changed_at` datetime(3) DEFAULT NULL,
  `last_login_at` datetime(3) DEFAULT NULL,
  `last_logout_at` datetime(3) DEFAULT NULL,
  `remember_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_cellphone_key` (`cellphone`),
  KEY `users_employee_id_fkey` (`employee_id`),
  KEY `users_role_id_fkey` (`role_id`),
  CONSTRAINT `users_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,1,'John Doe','johndoe','super@yopmail.com',NULL,'$2b$10$WXYoIB47dZF1fHKHw4noDOtxwhXs/bupmsXmWppb8C9GiIpHOt05e','ACTIVE',NULL,NULL,NULL,NULL,'2026-08-11 10:07:22.051','2026-08-11 10:07:22.051',NULL),(2,2,2,'Jane Doe','janedoe','manager@yopmail.com',NULL,'$2b$10$2.iqyZYUKsKDpguwrVOyEuRVMQHea6tkemZSBJ0zPBVE.naO8U/rK','ACTIVE',NULL,NULL,NULL,NULL,'2026-08-11 10:25:52.103','2026-08-11 10:25:52.103',NULL),(3,3,3,'Bob Smith','bobsmith','admin@yopmail.com',NULL,'$2b$10$2.iqyZYUKsKDpguwrVOyEuRVMQHea6tkemZSBJ0zPBVE.naO8U/rK','ACTIVE',NULL,NULL,NULL,NULL,'2026-08-11 10:25:52.124','2026-08-11 10:25:52.124',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-13  7:05:48
