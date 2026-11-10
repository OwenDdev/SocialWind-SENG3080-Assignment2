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

CREATE Table Comments(
	commentid Int IDENTITY(1,1) Primary KEY,
	commentcontent VARCHAR(500) NOT NULL,
	userid INT NOT NULL FOREIGN KEY REFERENCES Users(userid),
	postid INT NOT NULL FOREIGN KEY REFERENCES Posts(postid),
	timeofcomment DATETIME DEFAULT GETDATE()
);
CREATE Table Likes(
	Likeid Int IDENTITY(1,1) Primary KEY,
	isliked Int NOT NULL,
	userid INT NOT NULL FOREIGN KEY REFERENCES Users(userid),
	postid INT NOT NULL FOREIGN KEY REFERENCES Posts(postid),
	CONSTRAINT UQ_UserPostLike UNIQUE(userid, postid)
);

GO
DROP TABLE Users;

SELECT * FROM Users;
SELECT * FROM Posts;