CREATE Database SocialWind;

USE SocialWind;
GO

CREATE Table Users(
	userid Int Primary KEY,
	username varchar(50) NOT NULL UNIQUE
);
GO