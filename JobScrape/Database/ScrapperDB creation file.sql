
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Grub@123';
FLUSH PRIVILEGES;


--   CREATION SECTION -- 
create database jobsscrapedb;
USE jobsscrapedb;
CREATE TABLE websites (
    website_id INT PRIMARY KEY,
    website_name VARCHAR(50),
    link VARCHAR(500)
);
CREATE TABLE joblisting (
    listing_id INT PRIMARY KEY,
    post VARCHAR(100) NOT NULL,
    website_id INT NOT NULL,
    
    job_title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    experience VARCHAR(20),
    salary VARCHAR(100),
    location VARCHAR(100),
	link varchar(200),
    days varchar(50),
    
    FOREIGN KEY (website_id) REFERENCES websites(website_id)
);
CREATE TABLE SearchTranslation (
search varchar(100) primary key,
jobrole varchar(200) not null
);
CREATE TABLE WordCloud (
word varchar(100),
post varchar(100),
freq int default 0
);

-- 	MANUAL INSERTS --  
INSERT INTO websites VALUES
(1, 'Naukri.com', 'https://www.naukri.com');


-- 	PROCEDURES	--  

# 1. Procedure to Insert Tags
DELIMITER $$
CREATE PROCEDURE InsertTags(IN jsonData TEXT)
BEGIN
    INSERT INTO WordCloud (word, post)
    SELECT jt.col1, jt.col2
    FROM JSON_TABLE(jsonData, '$[*]'
        COLUMNS (
            col1 VARCHAR(255) PATH '$.col1',
            col2 VARCHAR(255) PATH '$.col2'
        )
    ) AS jt;
END$$
DELIMITER ;
DELIMITER $$
CREATE PROCEDURE InsertJobListings(IN jsonData TEXT)
BEGIN
    -- Parse JSON array and insert each object into the table
    INSERT INTO joblisting (post, website_id, job_title, company, experience, salary, location, link, days)
    SELECT jt.post, jt.website_id, jt.job_title, jt.company, jt.experience, jt.salary, jt.location, jt.link, jt.days
    FROM JSON_TABLE(jsonData, '$[*]' 
        COLUMNS (
            post VARCHAR(100) PATH '$.post',
            website_id INT PATH '$.website_id',
            job_title VARCHAR(200) PATH '$.job_title',
            company VARCHAR(100) PATH '$.company',
            experience VARCHAR(20) PATH '$.experience',
            salary VARCHAR(100) PATH '$.salary',
            location VARCHAR(100) PATH '$.location',
            link VARCHAR(200) PATH '$.link',
            days VARCHAR(50) PATH '$.days'
        )
    ) AS jt;
END$$
DELIMITER ;



-- 	TRUNCATE SECTION  -- 
TRUNCATE joblisting;
TRUNCATE websites;
TRUNCATE SearchTranslations;
TRUNCATE WordCloud;
  
  

  
--   DANGER :: DELETION SECTION -- 
DROP TABLE IF EXISTS joblisting;
DROP TABLE IF EXISTS websites;
DROP TABLE IF EXISTS SearchTranslations;
DROP TABLE IF EXISTS WordCloud;
drop database jobsscrapedb;
