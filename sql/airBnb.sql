/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `comment` (
  `commentID` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `rate` int DEFAULT '5',
  `userID` int NOT NULL,
  `hostID` int NOT NULL,
  PRIMARY KEY (`commentID`),
  KEY `userID` (`userID`),
  KEY `hostID` (`hostID`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`hostID`) REFERENCES `host` (`hostID`),
  CONSTRAINT `maxMinRate` CHECK ((`rate` between 1 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `host` (
  `hostID` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `hostName` varchar(255) NOT NULL,
  `phone` int NOT NULL,
  `bath` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `air` tinyint(1) DEFAULT '0',
  `iron` tinyint(1) DEFAULT '0',
  `tv` tinyint(1) DEFAULT '0',
  `wifi` tinyint(1) DEFAULT '0',
  `kitchen` tinyint(1) DEFAULT '0',
  `park` tinyint(1) DEFAULT '0',
  `coffe` tinyint(1) DEFAULT '0',
  `refrigerator` tinyint(1) DEFAULT '0',
  `lng` float DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `positionID` int NOT NULL,
  PRIMARY KEY (`hostID`),
  KEY `positionID` (`positionID`),
  CONSTRAINT `host_ibfk_1` FOREIGN KEY (`positionID`) REFERENCES `position` (`positionID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `imageHost` (
  `imageID` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `hostID` int NOT NULL,
  PRIMARY KEY (`imageID`),
  KEY `hostID` (`hostID`),
  CONSTRAINT `imageHost_ibfk_1` FOREIGN KEY (`hostID`) REFERENCES `host` (`hostID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `position` (
  `positionID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `lat` float DEFAULT NULL,
  PRIMARY KEY (`positionID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reservation` (
  `reserID` int NOT NULL AUTO_INCREMENT,
  `startDay` datetime NOT NULL,
  `endDay` datetime NOT NULL,
  `guest` int NOT NULL,
  `roomID` int NOT NULL,
  `userID` int NOT NULL,
  PRIMARY KEY (`reserID`),
  KEY `roomID` (`roomID`),
  KEY `userID` (`userID`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`roomID`) REFERENCES `room` (`roomID`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `room` (
  `roomID` int NOT NULL AUTO_INCREMENT,
  `nameRoom` varchar(255) NOT NULL,
  `imageRoom` varchar(255) DEFAULT NULL,
  `guest` int NOT NULL,
  `bed` int NOT NULL,
  `price` int NOT NULL,
  `hostID` int NOT NULL,
  PRIMARY KEY (`roomID`),
  KEY `hostID` (`hostID`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`hostID`) REFERENCES `host` (`hostID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `passWord` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` int DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `role` tinyint(1) DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `comment` (`commentID`, `content`, `dateCreated`, `rate`, `userID`, `hostID`) VALUES
(1, 'greate', '2022-12-12 00:00:00', 10, 1, 1);
INSERT INTO `comment` (`commentID`, `content`, `dateCreated`, `rate`, `userID`, `hostID`) VALUES
(6, 'string', NULL, 5, 1, 1);
INSERT INTO `comment` (`commentID`, `content`, `dateCreated`, `rate`, `userID`, `hostID`) VALUES
(7, 'string', NULL, 5, 1, 1);
INSERT INTO `comment` (`commentID`, `content`, `dateCreated`, `rate`, `userID`, `hostID`) VALUES
(10, 'string', NULL, 5, 8, 1);

INSERT INTO `host` (`hostID`, `address`, `hostName`, `phone`, `bath`, `description`, `air`, `iron`, `tv`, `wifi`, `kitchen`, `park`, `coffe`, `refrigerator`, `lng`, `lat`, `positionID`) VALUES
(1, 'string', '123', 0, 0, 'string', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, 1);


INSERT INTO `imageHost` (`imageID`, `url`, `hostID`) VALUES
(1, 'link', 1);
INSERT INTO `imageHost` (`imageID`, `url`, `hostID`) VALUES
(17, 'http://localhost:3000/api/host/image-host/16742860483771 (17).jpg', 1);
INSERT INTO `imageHost` (`imageID`, `url`, `hostID`) VALUES
(18, 'http://localhost:3000/api/host/image-host/16742861105831 (12).jpg', 1);
INSERT INTO `imageHost` (`imageID`, `url`, `hostID`) VALUES
(19, 'http://localhost:3000/api/host/image-host/16742862458891 (15).png', 1),
(20, 'http://localhost:3000/api/host/image-host/1674287525784r1_config.jpg', 1);

INSERT INTO `position` (`positionID`, `name`, `city`, `country`, `image`, `lng`, `lat`) VALUES
(1, 'ha loi', 'city', 'country', 'http://localhost:3000/position/image/16742936197321 (19).jpg', 12.1212, 10.1212);
INSERT INTO `position` (`positionID`, `name`, `city`, `country`, `image`, `lng`, `lat`) VALUES
(2, 'Quan 1', 'Hồ Chí Minh', 'Viet Name', NULL, NULL, NULL);
INSERT INTO `position` (`positionID`, `name`, `city`, `country`, `image`, `lng`, `lat`) VALUES
(3, 'string', 'string', 'string', NULL, NULL, NULL);

INSERT INTO `reservation` (`reserID`, `startDay`, `endDay`, `guest`, `roomID`, `userID`) VALUES
(1, '2022-11-12 00:00:00', '2023-12-12 00:00:00', 2, 1, 1);
INSERT INTO `reservation` (`reserID`, `startDay`, `endDay`, `guest`, `roomID`, `userID`) VALUES
(6, '2023-01-22 09:06:26', '2023-01-22 09:06:26', 2, 1, 1);


INSERT INTO `room` (`roomID`, `nameRoom`, `imageRoom`, `guest`, `bed`, `price`, `hostID`) VALUES
(1, 'toa lan', 'http://localhost:3000/api/room/image-room/16742922757551 (13).jpg', 2, 2, 30, 1);


INSERT INTO `user` (`userID`, `name`, `passWord`, `email`, `phone`, `birthDate`, `gender`, `role`, `avatar`) VALUES
(1, 'phong', '1234', 'phongckm93@gmail.com', 980980980, '2022-12-12', 0, 1, 'http://localhost:3000/api/auth/avatar/16742852421401 (13).jpg');
INSERT INTO `user` (`userID`, `name`, `passWord`, `email`, `phone`, `birthDate`, `gender`, `role`, `avatar`) VALUES
(8, 'check', 'string', 'string', NULL, NULL, NULL, 0, 'http://localhost:3000/api/auth/avatar/16738791207141 (17).jpg');
INSERT INTO `user` (`userID`, `name`, `passWord`, `email`, `phone`, `birthDate`, `gender`, `role`, `avatar`) VALUES
(9, 'string', 'string', 'string@gmail.com', 0, '2023-01-19', 1, 0, 'string');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;