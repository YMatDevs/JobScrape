--  1. Procedure to Insert Tags
DELIMITER $$

CREATE PROCEDURE InsertTags(IN jsonData JSON, IN post VARCHAR(50))
BEGIN
    -- Create a temporary table to store the tags
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_tags (
        tag VARCHAR(255)
    );
    
    -- Insert the tags into the temporary table from the JSON input
    INSERT INTO temp_tags (tag)
    SELECT jt.col1
    FROM JSON_TABLE(jsonData, '$[*]'
        COLUMNS (
            col1 VARCHAR(255) PATH '$.Tags'
        )
    ) AS jt;
    
    -- Now insert the tags and their frequencies into WordCloud
    -- Count the frequency of each word per job post and insert into the WordCloud table
    INSERT INTO WordCloud (word, post, freq)
    SELECT tag, post, COUNT(tag)
    FROM temp_tags
    GROUP BY tag, post
    ON DUPLICATE KEY UPDATE freq = freq + 1;

    -- Clean up the temporary table
    DROP TEMPORARY TABLE IF EXISTS temp_tags;
END$$

DELIMITER ;



-- 2. Procedure to Insert Job Listings
DELIMITER $$

CREATE PROCEDURE InsertJobListings( IN jsonData JSON )
BEGIN
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
