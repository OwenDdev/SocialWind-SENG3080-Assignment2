CREATE Database SocialWind;

USE SocialWind;
GO

CREATE Table Users(
	UseerID Int Primary KEY,
	UserName varchar(255) NOT NULL,
);
GO