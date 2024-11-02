import db from "./DBConn.js";
import puppeteer from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(stealthPlugin());

async function NaukriscrapeJobs(jobTitle) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    const url = `https://www.naukri.com/${jobTitle.toLowerCase().replace(/\s+/g, '-')}-jobs`;

    await page.goto(url);

    let selector = '.srp-jobtuple-wrapper'; // Naukri.com job container selector

    // Wait for job listings container
    await page.waitForSelector(selector);

    let post = jobTitle;

    // Scrape job listings
    const jobs = await page.evaluate((post) => {
        const jobList = [];
        document.querySelectorAll('.srp-jobtuple-wrapper').forEach(jobElement => {
            const job_title = jobElement.querySelector('.title')?.innerText.trim();
            const company = jobElement.querySelector('.comp-name')?.innerText.trim();
            const experience = jobElement.querySelector('.expwdth')?.innerText.trim();
            const salary = jobElement.querySelector('.sal-wrap span')?.innerText.trim();
            const location = jobElement.querySelector('.locWdth')?.innerText.trim();
            const website_id = 1;
            const link = jobElement.querySelector('.title')?.href.trim();
            const days = jobElement.querySelector('span.job-post-day').innerHTML.trim();

            // Debugging missing elements
            if (!job_title) console.log(`Missing job title on Naukri.com!`);
            if (!company) console.log(`Missing company name on Naukri.com!`);
            if (!experience) console.log(`Missing experience on Naukri.com!`);
            if (!salary) console.log(`Missing salary on Naukri.com!`);
            if (!location) console.log(`Missing location on Naukri.com!`);

            if (job_title) {
                jobList.push({
                    post,
                    website_id,
                    job_title,
                    company,
                    experience,
                    salary,
                    location,
                    link,
                    days
                });
            }
        });
        return jobList;
    }, post);

    await browser.close(); // Close the browser
    return jobs; // Return the scraped jobs
}

async function fetchJobs(jobTitle) {
    try {
        const query = 'SELECT * FROM joblisting WHERE post = ?';

        let [rows] = await db.promise().query(query, [jobTitle]);

        if (rows.length === 0) {
            console.log("DB does not have this JOB, will now scrape from net");
            rows = await NaukriscrapeJobs(jobTitle);

            const insertQuery = `
                INSERT INTO joblisting 
                (post, website_id, job_title, company, experience, salary, location, link, days) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

            // Inserting each job record into the table
            for (const job of rows) {
                await db.promise().query(insertQuery, [
                    jobTitle,          // post
                    job.website_id,    // website_id
                    job.job_title,     // job_title
                    job.company,       // company
                    job.experience,    // experience
                    job.salary,        // salary
                    job.location,      // location
                    job.link,          // link
                    job.days           // days
                ]);
            }


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
