const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('../models/Job');
const MatchResult = require('../models/MatchResult');

// Function to determine experience level based on job role
function determineExperienceLevel(jobRole) {
  const role = jobRole.toLowerCase();
  
  // Entry-level roles (0-1 years)
  if (role.includes('intern') || role.includes('trainee') || role.includes('entry') || 
      role.includes('fresher') || role.includes('graduate') || role.includes('student')) {
    return 'Fresher';
  }
  
  // Junior roles (1-3 years)
  if (role.includes('junior') || role.includes('associate') || role.includes('assistant') ||
      role.includes('level 1') || role.includes('entry level')) {
    return 'Junior';
  }
  
  // Mid-level roles (3-5 years)
  if (role.includes('mid') || role.includes('intermediate') || role.includes('level 2') ||
      role.includes('specialist') || role.includes('analyst')) {
    return 'Mid-level';
  }
  
  // Senior roles (5-8 years)
  if (role.includes('senior') || role.includes('lead') || role.includes('level 3') ||
      role.includes('principal') || role.includes('team lead')) {
    return 'Senior';
  }
  
  // Expert roles (8+ years)
  if (role.includes('expert') || role.includes('architect') || role.includes('director') ||
      role.includes('manager') || role.includes('head') || role.includes('chief') ||
      role.includes('vp') || role.includes('cto') || role.includes('ceo')) {
    return 'Expert';
  }
  
  // Default to Junior if no clear indicators
  return 'Junior';
}

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
      
      // Determine experience level based on job role
      const experienceLevel = determineExperienceLevel(jobData.jobRole);
      
      // Create new job document
      const newJob = new Job({
        jobId: uniqueJobIdentifier,
        originalJobId: jobId,
        jobRole: jobData.jobRole,
        experienceLevel: experienceLevel,
        jobDescription: `Job description for ${jobData.jobRole} role (${experienceLevel} level)`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await newJob.save();
      console.log(`Created new job: ${uniqueJobIdentifier} with role: ${jobData.jobRole}`);
    }

    // Verify all jobs now have jobRole and experienceLevel
    const finalJobs = await Job.find({});
    console.log('\nFinal verification:');
    finalJobs.forEach(job => {
      console.log(`Job ${job.jobId}: jobRole = "${job.jobRole}", experienceLevel = "${job.experienceLevel}", originalJobId = "${job.originalJobId}"`);
    });

    // Show experience level distribution
    const experienceLevelCounts = {};
    finalJobs.forEach(job => {
      const level = job.experienceLevel || 'Unknown';
      experienceLevelCounts[level] = (experienceLevelCounts[level] || 0) + 1;
    });
    
    console.log('\nExperience Level Distribution:');
    Object.entries(experienceLevelCounts).forEach(([level, count]) => {
      console.log(`  ${level}: ${count} jobs`);
    });

    console.log('\nUpdate completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating jobs:', error);
    process.exit(1);
  }
}

updateJobsWithJobRole();
