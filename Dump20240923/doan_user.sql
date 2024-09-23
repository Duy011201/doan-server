-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: doan
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` varchar(36) NOT NULL,
  `companyID` varchar(36) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','IN_ACTIVE','LOCK') NOT NULL DEFAULT 'ACTIVE',
  `language` varchar(50) DEFAULT NULL,
  `certificate` varchar(100) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(36) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(36) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('06f68302-ac93-4c17-91d9-b277599bc120','','Thái UV','ungvien@gmail.com','$2a$10$IVP0ylFtdvJ1FMigxiXNpOtxN7Wohb3ySUd6wSUQp9xrIUJSXSffy','02438313733','uploads\\1724753975435-th.jpg','uploads\\1726974456723-demo.docx','ACTIVE','RU','TOEIT','ELEMENTARY_III','2024-08-17 00:33:41','2024-09-22 03:07:36','system','06f68302-ac93-4c17-91d9-b277599bc120'),('1308c158-e955-4558-a6e8-6c9e64551e37','','Đạt UV','ungvien1@gmail.com','$2a$10$eHsTKCSdF/MtlusVFrlDRORxEMCxs4dbd8NjMRwyodsbn.lLplnw6','02439749999','uploads\\1724753887942-th.jpg','','ACTIVE','HI','TOEIT','ELEMENTARY_II','2024-08-17 00:34:22','2024-08-27 10:21:21','system','74c9ed65-76c1-4945-a024-1ac5a937caac'),('3b1d1224-1d7a-43e5-ba3e-87e963c0e1d7','c3ed4024-14dd-444c-9cde-f937d21d27d8','Huyền HR','nhatuyendung1@gmail.com','$2a$10$Ym2QKm4kamYX/WKL0EWM4uNkv7SvUqnVWFRdoTWbMcotgs2cGGmpO','02438313733','uploads\\1724754416582-download.jpg','','ACTIVE','HI','','ELEMENTARY_II','2024-08-27 10:26:23','2024-08-28 02:02:12','74c9ed65-76c1-4945-a024-1ac5a937caac','ea1e875b-104b-49a5-a2e2-061a540eca3a'),('63d153d8-f1cc-4967-b8e6-a35ced2a8752','','Thắng UV','ungvien22@gmail.com','$2a$10$59Z0kIkyEn/3XVr.KqdTWeAYcmIaQ9fwZEdPi0qEdbko3HHyPzFTm','02438313733','uploads\\1724753855003-th (1).jpg','uploads\\1725937250351-BaocaoPowerpoint.pdf','ACTIVE','ZH','TOEIT','ELEMENTARY_II','2024-08-17 00:34:56','2024-09-10 03:01:12','system','ea1e875b-104b-49a5-a2e2-061a540eca3a'),('65409576-ee32-46ba-a89c-5e4a74b570d5','b6926938-02c1-4230-b7ce-d1cbb26810c6','Linh FPT','linhfpt@gmail.com','$2a$10$ThEVkxc09KBkomaeYCahj.TSjZABAjJTDJYenksaJ3xzRR8/.crEK','02439749999','uploads\\1726625143741-download.jpg','','ACTIVE','EN','','COLLEGE','2024-09-18 02:05:43','2024-09-18 02:05:43','ea1e875b-104b-49a5-a2e2-061a540eca3a','system'),('74c9ed65-76c1-4945-a024-1ac5a937caac','7637eefb-9d91-4a1f-8c0c-461c59b29abe','Duy ADMIN','nguyenduy011201@gmail.com','$2a$10$IE/uqZz6QC9W74lDTxDSqulugWIuFEH1w8XbUNN0HkhikLJCfF.8O','','uploads\\1724768039287-th (2).jpg','','ACTIVE','','','','2024-08-17 00:46:27','2024-08-28 02:25:20','system','ea1e875b-104b-49a5-a2e2-061a540eca3a'),('a1d85342-7484-4c7b-9774-aeea64296576','0320fe54-7c6b-4662-806d-b43839f6ba12','Huy HR','nhatuyendung@gmail.com','$2a$10$M2NUa1BiuqqA6k8gMmfq2uvnuNpg0wbnS43RRFeq0sw4tfX7HLOAC','','uploads\\1724753816804-th (2).jpg','','ACTIVE','','','','2024-08-17 00:37:00','2024-08-27 10:16:56','system','74c9ed65-76c1-4945-a024-1ac5a937caac'),('ea1e875b-104b-49a5-a2e2-061a540eca3a',NULL,'admin','admin@gmail.com','$2a$10$OXAeFyeYx5NP0JQByLvDIesxFXxrpKnfjHyiz760PyF4810DJb5WG','0867813258','uploads\\1724767977097-th.jpg','','ACTIVE','','','','2024-08-27 14:12:57','2024-08-27 14:12:57','74c9ed65-76c1-4945-a024-1ac5a937caac','system');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-23  8:52:00
