-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: i4m1g
-- ------------------------------------------------------
-- Server version	5.1.41-community

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `arduino`
--

DROP TABLE IF EXISTS `arduino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `arduino` (
  `id` char(17) NOT NULL,
  `p_ip` varchar(15) DEFAULT NULL,
  `l_ip` varchar(15) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `m_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `m_id_idx` (`m_id`),
  CONSTRAINT `m_id` FOREIGN KEY (`m_id`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arduino`
--

LOCK TABLES `arduino` WRITE;
/*!40000 ALTER TABLE `arduino` DISABLE KEYS */;
/*!40000 ALTER TABLE `arduino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_feed`
--

DROP TABLE IF EXISTS `auto_feed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_feed` (
  `feed_time` time DEFAULT NULL,
  `wait_time` double DEFAULT NULL,
  `feed_cnt` int(11) DEFAULT NULL,
  `today` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `m_id` varchar(20) NOT NULL,
  PRIMARY KEY (`m_id`),
  CONSTRAINT `m_id2` FOREIGN KEY (`m_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_feed`
--

LOCK TABLES `auto_feed` WRITE;
/*!40000 ALTER TABLE `auto_feed` DISABLE KEYS */;
/*!40000 ALTER TABLE `auto_feed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto_light`
--

DROP TABLE IF EXISTS `auto_light`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auto_light` (
  `on_time` time DEFAULT NULL,
  `off_time` time DEFAULT NULL,
  `is_on` tinyint(4) DEFAULT '0',
  `m_id` varchar(20) NOT NULL,
  PRIMARY KEY (`m_id`),
  CONSTRAINT `m_id4` FOREIGN KEY (`m_id`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto_light`
--

LOCK TABLES `auto_light` WRITE;
/*!40000 ALTER TABLE `auto_light` DISABLE KEYS */;
/*!40000 ALTER TABLE `auto_light` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member` (
  `id` varchar(20) NOT NULL,
  `pw` char(60) NOT NULL,
  `a_id` char(17) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `a_id_UNIQUE` (`a_id`),
  CONSTRAINT `a_id` FOREIGN KEY (`a_id`) REFERENCES `arduino` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-09-14  2:36:56
