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
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `companyID` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `introduce` longtext,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `field` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `scale` smallint DEFAULT NULL,
  `corporateTaxCode` varchar(100) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','IN_ACTIVE','LOCK') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(36) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(36) NOT NULL DEFAULT 'system',
  PRIMARY KEY (`companyID`),
  UNIQUE KEY `corporateTaxCode` (`corporateTaxCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES ('0320fe54-7c6b-4662-806d-b43839f6ba12','Viettel','<p><strong>Viettel</strong> là một trong những tập đoàn viễn thông và công nghệ thông tin lớn nhất tại Việt Nam và Đông Nam Á. Dưới đây là một số điểm nổi bật về Viettel:</p><h3>1. <strong>Lịch sử hình thành và phát triển</strong></h3><ul><li><strong>Thành lập</strong>: Viettel được thành lập vào năm 1989 với tên gọi ban đầu là Tổng Công ty Điện tử thiết bị thông tin (SIGELCO). Đến năm 2004, tên gọi chính thức được đổi thành Tập đoàn Viễn thông Quân đội (Viettel), trực thuộc Bộ Quốc phòng Việt Nam.</li><li><strong>Phát triển</strong>: Ban đầu, Viettel chủ yếu hoạt động trong lĩnh vực xây dựng hạ tầng viễn thông. Sau đó, Viettel nhanh chóng mở rộng sang dịch vụ viễn thông, trở thành nhà cung cấp dịch vụ viễn thông lớn nhất Việt Nam. Từ những năm 2000, Viettel đã tiến hành các chiến lược mở rộng ra thị trường quốc tế và hiện có mặt tại nhiều quốc gia trên thế giới.</li></ul><h3>2. <strong>Hoạt động kinh doanh</strong></h3><ul><li><strong>Viễn thông</strong>: Viettel cung cấp các dịch vụ viễn thông như di động, internet, truyền hình và các dịch vụ giá trị gia tăng. Hãng cũng là nhà mạng di động lớn nhất Việt Nam với hàng chục triệu thuê bao.</li><li><strong>Công nghệ thông tin</strong>: Viettel đầu tư mạnh vào nghiên cứu và phát triển công nghệ thông tin, trở thành một trong những đơn vị hàng đầu cung cấp các giải pháp công nghệ số, bao gồm an ninh mạng, AI, và IoT.</li><li><strong>Đầu tư quốc tế</strong>: Viettel hiện có hoạt động tại hơn 10 quốc gia, chủ yếu tại khu vực Châu Á, Châu Phi, và Mỹ Latinh. Các công ty con của Viettel ở nước ngoài cũng đạt được những thành công đáng kể, đóng góp lớn vào doanh thu của tập đoàn.</li></ul><h3>3. <strong>Tầm nhìn và chiến lược</strong></h3><ul><li><strong>Tầm nhìn</strong>: Viettel đặt mục tiêu trở thành một tập đoàn viễn thông và công nghệ hàng đầu thế giới, tập trung vào phát triển hạ tầng kỹ thuật số và sáng tạo các giải pháp công nghệ để dẫn đầu trong kỷ nguyên công nghệ số.</li><li><strong>Chiến lược phát triển</strong>: Tập trung vào chuyển đổi số, nghiên cứu và phát triển các sản phẩm, dịch vụ mới trong các lĩnh vực viễn thông, công nghệ thông tin, và đầu tư quốc tế. Viettel cũng đẩy mạnh các hoạt động nghiên cứu và phát triển công nghệ 5G, AI, và các ứng dụng công nghệ cao khác.</li></ul><h3>4. <strong>Đóng góp xã hội</strong></h3><ul><li><strong>Quốc phòng</strong>: Là một doanh nghiệp trực thuộc Bộ Quốc phòng, Viettel đóng vai trò quan trọng trong việc xây dựng và bảo vệ an ninh quốc gia.</li><li><strong>Xã hội</strong>: Viettel cũng tham gia tích cực vào các hoạt động từ thiện, hỗ trợ giáo dục, y tế, và phát triển cộng đồng, đặc biệt là tại các khu vực khó khăn ở Việt Nam.</li></ul><p>Viettel là biểu tượng của sự phát triển mạnh mẽ trong lĩnh vực viễn thông và công nghệ tại Việt Nam, với sự ảnh hưởng ngày càng lớn trên thị trường quốc tế.</p>','viettel@gmail.com','','01','Hà nội','ELECTRICAL_ELECTRONIC','uploads\\1724754479202-OIP.jpg',5000,'2492479283','https://www.vietteltelecom.vn/vx/','ACTIVE','2024-08-17 00:37:00','2024-08-27 10:30:25','system','74c9ed65-76c1-4945-a024-1ac5a937caac'),('4f35040e-179b-4260-ba09-59de81ef55ab','Intel – Intel Corporation','<p>Intel Corporation, thành lập năm 1968, là một trong những tập đoàn công nghệ hàng đầu thế giới, nổi tiếng với việc sản xuất bộ vi xử lý và các linh kiện điện tử khác. Intel là công ty tiên phong trong việc phát triển các bộ vi xử lý x86, nền tảng quan trọng cho hầu hết các máy tính cá nhân. Sản phẩm của Intel không chỉ giới hạn ở CPU mà còn mở rộng sang các lĩnh vực như chip đồ họa, bộ nhớ, và các giải pháp IoT (Internet of Things).</p><p>Công ty có trụ sở chính tại Santa Clara, California, và là một trong những nhà cung cấp hàng đầu về chất bán dẫn toàn cầu. Với tầm nhìn hướng tới sự đổi mới liên tục, Intel đóng vai trò quan trọng trong ngành công nghiệp công nghệ, thúc đẩy các xu hướng mới như trí tuệ nhân tạo (AI), 5G, và các công nghệ tiên tiến khác. Sứ mệnh của Intel là tạo ra những sản phẩm mang lại giá trị vượt trội cho người tiêu dùng và doanh nghiệp trên toàn thế giới.</p>','intel@gmail.com','','01','Hà nội','INSURANCE','uploads\\1724756637804-th (1).jpg',0,'294748778','https://www.vietteltelecom.vn/vx/','ACTIVE','2024-08-27 11:03:34','2024-08-27 11:03:57','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac'),('752ce9e2-15fb-448c-b41e-6980bc1a633a','Bưu chính Viễn thông Việt Nam – VNPT','<p>VNPT (Tập đoàn Bưu chính Viễn thông Việt Nam) là một trong những doanh nghiệp hàng đầu trong lĩnh vực viễn thông và công nghệ thông tin tại Việt Nam. Được thành lập vào năm 1995, VNPT đã đóng vai trò quan trọng trong việc xây dựng và phát triển hạ tầng viễn thông của đất nước. Tập đoàn cung cấp các dịch vụ đa dạng như điện thoại cố định, di động, internet băng thông rộng, truyền hình và các giải pháp công nghệ thông tin cho cả cá nhân và doanh nghiệp.</p><p>VNPT luôn chú trọng đến đổi mới công nghệ, đầu tư mạnh mẽ vào hạ tầng mạng lưới và nâng cao chất lượng dịch vụ nhằm đáp ứng nhu cầu ngày càng cao của khách hàng. Với chiến lược chuyển đổi số, VNPT đã mở rộng hoạt động vào các lĩnh vực như chính phủ điện tử, giáo dục, y tế, góp phần thúc đẩy quá trình chuyển đổi số quốc gia.</p>','vnpt@gmail.com','0867813258','02','VietNam','INFORMATION_TECHNOLOGY_SYSTEMS_EQUIPMENT','uploads\\1724756024096-th (1).jpg',2000,'0101245486','https://vnpt.com.vn/','ACTIVE','2024-08-27 10:53:22','2024-08-27 11:01:53','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac'),('7637eefb-9d91-4a1f-8c0c-461c59b29abe','VNG','<p>VNG Corporation là một trong những công ty công nghệ hàng đầu tại Việt Nam, được thành lập vào năm 2004. Ban đầu, VNG nổi tiếng với các sản phẩm và dịch vụ giải trí trực tuyến như game online. Sau đó, công ty đã mở rộng lĩnh vực hoạt động sang các mảng như thương mại điện tử, dịch vụ đám mây, và truyền thông xã hội. Zalo, ứng dụng nhắn tin và gọi điện miễn phí do VNG phát triển, đã trở thành một trong những ứng dụng phổ biến nhất tại Việt Nam. VNG không chỉ tập trung vào thị trường nội địa mà còn có tham vọng vươn ra toàn cầu. Với tầm nhìn &quot;Phát triển Internet để thay đổi cuộc sống của con người&quot;, VNG đã không ngừng đổi mới và đóng góp tích cực cho sự phát triển của ngành công nghệ tại Việt Nam.</p>','vng@gmail.com','0867813258','02','VietNam','STOCK','uploads\\1724756380218-th.jpg',200,'01012454863','https://vng.com.vn/','ACTIVE','2024-08-27 10:59:40','2024-08-27 11:01:45','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac'),('b6926938-02c1-4230-b7ce-d1cbb26810c6','TNHH Phần mềm FPT – FPT Software','<p>FPT (Công ty Cổ phần FPT) là một tập đoàn công nghệ hàng đầu tại Việt Nam, thành lập vào năm 1988. FPT hoạt động trong nhiều lĩnh vực, bao gồm công nghệ thông tin, viễn thông, giáo dục, và dịch vụ số. Với hơn 30 năm phát triển, FPT đã mở rộng quy mô hoạt động toàn cầu, cung cấp dịch vụ và giải pháp công nghệ tiên tiến cho khách hàng trên toàn thế giới. Tập đoàn cũng nổi tiếng với các dự án chuyển đổi số, phát triển phần mềm, và các sáng kiến về trí tuệ nhân tạo, góp phần thúc đẩy nền kinh tế số của Việt Nam.</p>','fpt@gmail.com','','01','FPT Tower, số 10, đường Phạm Văn Bạch, phường Dịch Vọng, quận Cầu Giấy, Hà Nội','INFORMATION_TECHNOLOGY_SYSTEMS_EQUIPMENT','uploads\\1724755319611-th.jpg',10000,'0100109106','https://fpt.vn/vi','ACTIVE','2024-08-27 10:41:59','2024-08-27 10:42:33','74c9ed65-76c1-4945-a024-1ac5a937caac','74c9ed65-76c1-4945-a024-1ac5a937caac'),('c3ed4024-14dd-444c-9cde-f937d21d27d8','Global CyberSoft Việt Nam','<p>Cybersoft là một công ty công nghệ chuyên cung cấp các giải pháp phần mềm và dịch vụ đào tạo trong lĩnh vực công nghệ thông tin. Thành lập với sứ mệnh giúp các cá nhân và doanh nghiệp phát triển trong thời đại số, Cybersoft tập trung vào việc cung cấp các khóa học lập trình, phát triển phần mềm, và quản trị hệ thống với chất lượng cao.</p><p>Với đội ngũ giảng viên giàu kinh nghiệm và chương trình đào tạo hiện đại, Cybersoft không chỉ trang bị cho học viên kiến thức chuyên sâu mà còn tạo cơ hội thực hành thực tế qua các dự án. Công ty cũng cung cấp các dịch vụ tư vấn và phát triển phần mềm cho các doanh nghiệp, giúp tối ưu hóa quy trình làm việc và thúc đẩy hiệu quả kinh doanh. Cybersoft đã trở thành một trong những đơn vị hàng đầu trong việc đào tạo và cung cấp giải pháp công nghệ tại Việt Nam</p>','cybersoft@gmail.com','','01','Hà nội','SUPPLY_MANPOWER','uploads\\1724756839967-OIP.jpg',500,'0100681592','https://www.cybersoft.vn/vx/','ACTIVE','2024-08-27 11:07:19','2024-08-27 11:07:19','74c9ed65-76c1-4945-a024-1ac5a937caac','system');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-28  9:59:57
