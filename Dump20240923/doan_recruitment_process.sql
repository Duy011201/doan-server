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
-- Table structure for table `recruitment_process`
--

DROP TABLE IF EXISTS `recruitment_process`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitment_process` (
  `recruitmentProcessID` varchar(36) NOT NULL,
  `recruitmentID` varchar(36) NOT NULL,
  `candidateID` varchar(36) NOT NULL,
  `saveProfile` varchar(5) NOT NULL DEFAULT 'false',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(36) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(36) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`recruitmentProcessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitment_process`
--

LOCK TABLES `recruitment_process` WRITE;
/*!40000 ALTER TABLE `recruitment_process` DISABLE KEYS */;
INSERT INTO `recruitment_process` VALUES ('3ff6489b-d8a6-46b3-90c0-89f512e371da','b0af2017-cc6c-45be-a3f4-8fd65cbbeb78','63d153d8-f1cc-4967-b8e6-a35ced2a8752','false','2024-08-19 15:54:00','2024-08-19 15:54:00','63d153d8-f1cc-4967-b8e6-a35ced2a8752','system'),('9245fa60-e773-41ea-8987-0f2fd424b26d','a5599f1f-34fb-439a-97fa-ab94c39ab376','06f68302-ac93-4c17-91d9-b277599bc120','false','2024-09-22 03:04:44','2024-09-22 03:04:44','06f68302-ac93-4c17-91d9-b277599bc120','system'),('ab9634d1-9589-4bbe-8c44-21a1a0d3165d','b0af2017-cc6c-45be-a3f4-8fd65cbbeb78','06f68302-ac93-4c17-91d9-b277599bc120','false','2024-08-18 16:16:20','2024-08-18 16:16:20','06f68302-ac93-4c17-91d9-b277599bc120','system'),('c02b9265-8ea0-4ff8-976d-ffd655298d0d','b0af2017-cc6c-45be-a3f4-8fd65cbbeb78','1308c158-e955-4558-a6e8-6c9e64551e37','false','2024-08-19 15:01:02','2024-08-19 15:01:02','1308c158-e955-4558-a6e8-6c9e64551e37','system'),('c539ab54-f102-479f-bb13-62663ca8705f','08e9c88b-bcd2-4d6f-93bd-9204d2f4caf4','06f68302-ac93-4c17-91d9-b277599bc120','true','2024-08-28 02:48:49','2024-08-28 02:52:36','06f68302-ac93-4c17-91d9-b277599bc120','system'),('c779a4e9-390c-4bbb-a05b-5f87d3e315f0','48a4e044-40b2-42d1-86fc-b82a2cec7339','1308c158-e955-4558-a6e8-6c9e64551e37','false','2024-09-18 04:02:41','2024-09-18 04:02:41','1308c158-e955-4558-a6e8-6c9e64551e37','system');
/*!40000 ALTER TABLE `recruitment_process` ENABLE KEYS */;
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
