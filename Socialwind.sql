CREATE Database SocialWind;

USE SocialWind;
GO

CREATE Table Users(
	userid Int IDENTITY(1,1) Primary KEY,
	username varchar(50) NOT NULL UNIQUE
);

CREATE Table Posts(
	postid Int IDENTITY(1,1) Primary KEY,
	postcontent VARCHAR(500) NOT NULL,
	userid INT NOT NULL FOREIGN KEY REFERENCES Users(userid),
	timeofpost DATETIME DEFAULT GETDATE()
);

GO
DROP TABLE Users;

SELECT * FROM Users;