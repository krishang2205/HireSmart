const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Job');
const MatchResult = require('../models/MatchResult');

async function updateJobsWithJobRole() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiresmart');
    console.log('Connected to MongoDB');

    // First, let's see what we have
    const allJobs = await Job.find({});
    console.log(`Found ${allJobs.length} total jobs`);
    
    const allMatchResults = await MatchResult.find({});
    console.log(`Found ${allMatchResults.length} total match results`);

    // Group match results by jobId to get unique job roles
    const jobRoleMap = new Map();
    
    allMatchResults.forEach(match => {
      if (match.jobId && match.jobRole && match.jobRole !== 'Unknown Role') {
        if (!jobRoleMap.has(match.jobId)) {
          jobRoleMap.set(match.jobId, {
            jobId: match.jobId,
            jobRole: match.jobRole,
            jobDescription: '' // We'll need to get this from somewhere
          });
        }
      }
    });

    console.log(`Found ${jobRoleMap.size} unique job IDs with roles`);

    // For each unique job, create or update a job document
    for (const [jobId, jobData] of jobRoleMap) {
      console.log(`Processing job ${jobId} with role: ${jobData.jobRole}`);
      
      // Check if we already have a job with this role
      const existingJob = await Job.findOne({ 
        jobRole: jobData.jobRole,
        originalJobId: jobId 
      });
      
      if (existingJob) {
        console.log(`Job with role ${jobData.jobRole} already exists for jobId ${jobId}`);
        continue;
      }
      
      // Create unique identifier
      const uniqueJobIdentifier = `${jobId}_${jobData.jobRole}`;
      
      // Check if we already have a job with this unique identifier
      const existingUniqueJob = await Job.findOne({ jobId: uniqueJobIdentifier });
      
      if (existingUniqueJob) {
        console.log(`Job with unique identifier ${uniqueJobIdentifier} already exists`);
        continue;
      }
      
      // Create new job document
      const newJob = new Job({
        jobId: uniqueJobIdentifier,
        originalJobId: jobId,
        jobRole: jobData.jobRole,
        jobDescription: `Job description for ${jobData.jobRole} role`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newJob.save();
      console.log(`Created new job: ${uniqueJobIdentifier} with role: ${jobData.jobRole}`);
    }

    // Verify all jobs now have jobRole
    const finalJobs = await Job.find({});
    console.log('\nFinal verification:');
    finalJobs.forEach(job => {
      console.log(`Job ${job.jobId}: jobRole = "${job.jobRole}", originalJobId = "${job.originalJobId}"`);
    });

    console.log('\nUpdate completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating jobs:', error);
    process.exit(1);
  }
}

updateJobsWithJobRole();
