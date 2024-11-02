'use strict';

import express from 'express';
import { fetchJobs } from '../DBcontroller/fetchJobs.js';

var router = express.Router();


router.get('/api/getJobs', async (req, res) => {
    try {
        var searchList = req.query.search.split(",");
        console.log("SearchList: " + searchList);

        var jobList = [];

        for (const job of searchList) {
            jobList = jobList.concat(await fetchJobs(job));
        }

        res.status(200).json(jobList);
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Error on Server end" });
    }
});

export default router;



// Temp
//const jobList = [
//    { JobTitle: "Software Engineer", company: "Company A", salary: "80,000 - 120,000", experience: "2-4 years", location: "New York, NY" },
//    { JobTitle: "Data Scientist", company: "Company B", salary: "100,000 - 150,000", experience: "3-5 years", location: "San Francisco, CA" },
//    { JobTitle: "Product Manager", company: "Company C", salary: "90,000 - 130,000", experience: "5-7 years", location: "Austin, TX" },
//    { JobTitle: "DevOps Engineer", company: "Company D", salary: "85,000 - 125,000", experience: "4-6 years", location: "Remote" },
//    { JobTitle: "UI/UX Designer", company: "Company E", salary: "70,000 - 110,000", experience: "2-3 years", location: "Seattle, WA" },
//    { JobTitle: "Marketing Specialist", company: "Company F", salary: "50,000 - 80,000", experience: "1-3 years", location: "Chicago, IL" },
//    { JobTitle: "Sales Engineer", company: "Company G", salary: "90,000 - 130,000", experience: "3-5 years", location: "Boston, MA" },
//    { JobTitle: "Backend Developer", company: "Company H", salary: "75,000 - 115,000", experience: "2-4 years", location: "Los Angeles, CA" },
//    { JobTitle: "Front-End Developer", company: "Company I", salary: "70,000 - 110,000", experience: "2-4 years", location: "Miami, FL" },
//    { JobTitle: "Cybersecurity Analyst", company: "Company J", salary: "95,000 - 135,000", experience: "3-5 years", location: "Washington, D.C." }
//];
