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
-- Table structure for table `service_pack`
--

DROP TABLE IF EXISTS `service_pack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_pack` (
  `servicePackID` varchar(36) NOT NULL,
  `servicePackName` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `promotion` tinyint NOT NULL,
  `content` longtext NOT NULL,
  `expirationDate` tinyint NOT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(36) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(36) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`servicePackID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_pack`
--

LOCK TABLES `service_pack` WRITE;
/*!40000 ALTER TABLE `service_pack` DISABLE KEYS */;
INSERT INTO `service_pack` VALUES ('312642b5-b5ec-4ba0-b57d-656e53a5471f','Hiệu ứng đỏ đậm',420000,5,'Tin đăng hiển thị có tiêu đề tô ĐỎ ĐẬM.',7,'uploads\\1723858998801-effect_redtext-min_170364710990.png','2024-08-17 01:43:18','2024-09-21 10:42:07','74c9ed65-76c1-4945-a024-1ac5a937caac','ea1e875b-104b-49a5-a2e2-061a540eca3a'),('68dbacaf-b9a6-4bad-8012-66bfc47b3844','Hiệu ứng hot',420000,0,'Tin đăng được gắn nhãn “HOT” ở tiêu đề.',7,'uploads\\1723859081998-effect_hot-min_170364710373.png','2024-08-17 01:44:42','2024-08-18 15:02:42','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac'),('d0b4530f-acc4-463c-9b1c-abf537f5b8fe','Hiệu ứng đóng khung',420000,0,'Tin đăng hiển thị với hiệu ứng ĐÓNG KHUNG.',7,'uploads\\1723859044293-effect_frame-min_170364709516.png','2024-08-17 01:44:04','2024-08-17 01:44:04','74c9ed65-76c1-4945-a024-1ac5a937caac','system'),('d80597de-d30b-4bbf-bcc6-245f58beea05','Công ty nổi bật',3260000,0,'Tin đăng nổi bật công ty trên trang tìm kiếm',7,'uploads\\1723858423951-homepage-min_170364711828.png','2024-08-17 01:33:43','2024-08-18 09:30:44','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac');
/*!40000 ALTER TABLE `service_pack` ENABLE KEYS */;
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
