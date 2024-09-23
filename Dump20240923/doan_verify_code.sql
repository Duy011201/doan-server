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
-- Table structure for table `verify_code`
--

DROP TABLE IF EXISTS `verify_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verify_code` (
  `verifyCodeID` varchar(36) NOT NULL,
  `code` varchar(36) NOT NULL,
  `email` varchar(50) NOT NULL,
  `status` enum('ACTIVE','IN_ACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(36) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(36) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`verifyCodeID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verify_code`
--

LOCK TABLES `verify_code` WRITE;
/*!40000 ALTER TABLE `verify_code` DISABLE KEYS */;
INSERT INTO `verify_code` VALUES ('d56d59a3-a587-4721-af2c-db93b7c19400','719623','ungvien1@gmail.com','IN_ACTIVE','2024-08-17 00:34:00','2024-08-17 00:34:22','system','system'),('de48578c-bb28-4b69-8a19-b124b644f4e1','230056','ungvien@gmail.com','IN_ACTIVE','2024-08-17 00:33:20','2024-08-17 00:33:41','system','system'),('df890a1c-a506-4f2f-a0a6-adf210eb6618','806790','nhatuyendung@gmail.com','IN_ACTIVE','2024-08-17 00:36:41','2024-08-17 00:37:00','system','system'),('e27e2272-9c5f-433c-b98a-b601d77e1333','269492','admin@gmail.com','IN_ACTIVE','2024-08-17 00:38:15','2024-08-17 00:46:27','system','system'),('f1a14cea-98f1-4f30-ae2e-36e97220da9c','800923','ungvien2@gmail.com','IN_ACTIVE','2024-08-17 00:34:38','2024-08-17 00:34:56','system','system');
/*!40000 ALTER TABLE `verify_code` ENABLE KEYS */;
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
