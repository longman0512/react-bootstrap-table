/*
SQLyog Community
MySQL - 10.4.14-MariaDB : Database - bootstrap
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`bootstrap` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `bootstrap`;

/*Table structure for table `data` */

DROP TABLE IF EXISTS `data`;

CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `res_name` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4;

/*Data for the table `data` */

insert  into `data`(`id`,`name`,`price`,`res_name`,`created_at`) values 
(49,'33',333,'333','2021-03-05 07:31:35'),
(50,'333',333,'3333','2021-03-05 07:31:38'),
(51,'33334456',1456,'3333','2021-03-05 09:14:33'),
(52,'333',33,'3333','2021-03-05 07:31:43'),
(54,'3333',333,'333','2021-03-05 09:10:47'),
(55,'eee',123123000,'2222','2021-03-05 07:36:07'),
(56,'123',123,'123','2021-03-05 07:36:31'),
(57,'asdas',23123100,'','2021-03-05 07:41:40'),
(58,'23',333,'','2021-03-05 07:53:22'),
(59,'222',2222,'','2021-03-05 07:54:11'),
(60,'32',222,'','2021-03-05 07:55:04'),
(61,'236e',323,'','2021-03-09 17:19:05'),
(87,'2',NULL,NULL,'2021-03-05 05:50:45');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
