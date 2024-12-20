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

