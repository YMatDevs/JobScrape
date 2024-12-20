-- Creation of Database
create database jobsscrapedb;
USE jobsscrapedb;

-- Website table creation
CREATE TABLE websites (
    website_id INT PRIMARY KEY,
    website_name VARCHAR(50),
    link VARCHAR(500)
);

-- Joblisting table creation
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

-- Searchtranslation table creation
CREATE TABLE SearchTranslation (
search varchar(100) primary key,
jobrole varchar(200) not null
);

-- Wordcloud table creation
CREATE TABLE WordCloud (
    word VARCHAR(255),
    post VARCHAR(50),
    freq INT DEFAULT 1,
    PRIMARY KEY (word, post)
);



-- Privelege Alterations
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Grub@123';
FLUSH PRIVILEGES;