CREATE TABLE `app` (
  `externalId` varchar(8) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  PRIMARY KEY (`id`),
  KEY `externalId` (`externalId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

CREATE TABLE `collection` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `appId` int(10) unsigned NOT NULL,
  `name` tinytext,
  `externalId` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appName` (`appId`,`name`(32)),
  KEY `externalId` (`externalId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

CREATE TABLE `record` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `collectionId` int(10) unsigned NOT NULL,
  `revisionId` int(10) unsigned NOT NULL,
  `externalId` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `externalId` (`externalId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

CREATE TABLE `revision` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `recordId` int(10) unsigned NOT NULL,
  `content` text,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `revisionTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

