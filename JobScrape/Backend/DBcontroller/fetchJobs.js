import db from "./DBConn.js";

async function fetchJobs(jobTitle) {
    try {
        const query = 'SELECT * FROM joblisting WHERE post = ?';

        const [rows] = await db.promise().query(query, [jobTitle]);

        if (rows.length === 0) {
            console.log("DB does not have this JOB, will now scrape from net");
        } else {
            console.log(rows);
            return rows;
        }

        return rows; 
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return null; 
    }
}

export { fetchJobs };