import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem, LinearProgress, Paper, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

const categories = ['Not hire', 'Can consider', 'Best one'];
const statuses = ['Pending Communication', 'Communication Sent', 'Assessment Assigned', 'Assessment Completed', 'Rejected'];

export default function NextSteps() {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchMatchResults();
  }, []);

  // Fetch match results from DB (MatchResult model)
  const fetchMatchResults = async () => {
    setLoading(true);
    // TODO: Replace with actual jobId source (query param, localStorage, etc.)
  // DEBUG: Set your actual jobId here for testing
  const jobId = '298633';
  console.log('Fetching match results for jobId:', jobId);
    try {
      const res = await axios.get(`/api/match-results/${jobId}`);
      // Map results to candidate-like objects for table
      setCandidates(res.data.map(r => ({
        _id: r._id,
        name: r.candidateName,
        resumeScore: r.matchScore,
        category: r.prediction,
        contactInfo: { email: r.email, phone: r.contactNumber },
        status: 'Pending Communication', // Default, update as needed
        assessmentScore: r.assessmentScore || null,
        finalRank: r.finalRank || null
      })));
    } catch (err) {
      setCandidates([]);
    }
    setLoading(false);
  };

  const handleSendCommunication = async (id) => {
    setLoading(true);
    await axios.post('/api/candidates/send-communication', { candidateId: id, templateType: 'default' });
    fetchCandidates();
  };

  const handleAssignAssessment = async (id) => {
    setLoading(true);
    await axios.post('/api/candidates/assign-assessment', { candidateId: id, assessmentLink: 'https://assessment.link' });
    fetchCandidates();
  };

  const handleViewAssessmentScore = async (id) => {
    const res = await axios.get(`/api/candidates/assessment-score/${id}`);
    alert(`Assessment Score: ${res.data.assessmentScore}`);
    fetchCandidates();
  };

  // Filtering logic
  const filteredCandidates = candidates.filter(c =>
    (!filter.category || c.category === filter.category) &&
    (!filter.status || c.status === filter.status) &&
    (search === '' || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Analytics
  const total = candidates.length;
  const pending = candidates.filter(c => c.status === 'Pending Communication').length;
  const completed = candidates.filter(c => c.status === 'Assessment Completed').length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  // Color helpers
  const getCategoryColor = (cat) => {
    if (cat === 'Best one') return { bg: '#2563eb', color: '#fff' };
    if (cat === 'Can consider') return { bg: '#e0e7ff', color: '#3730a3' };
    return { bg: '#fee2e2', color: '#b91c1c' };
  };
  const getStatusColor = (status) => {
    if (status === 'Pending Communication') return { bg: '#fde68a', color: '#b45309' };
    if (status === 'Communication Sent') return { bg: '#dbeafe', color: '#2563eb' };
    if (status === 'Assessment Assigned') return { bg: '#dbeafe', color: '#2563eb' };
    if (status === 'Assessment Completed') return { bg: '#bbf7d0', color: '#166534' };
    if (status === 'Rejected') return { bg: '#fecaca', color: '#b91c1c' };
    return { bg: '#f3f4f6', color: '#374151' };
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, background: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700, color: 'primary.main' }}>Next Steps</Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
        Manage shortlisted candidates through the hiring process
      </Typography>
      {/* Analytics Panel */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{ flex: 1, p: 2, minWidth: 180, textAlign: 'center', borderRadius: 2, border: '1px solid #f3f4f6' }}>
          <Typography fontWeight={600}>Total Candidates</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Typography variant="h5" color="primary">{total}</Typography>
            <TrendingUpIcon color="primary" />
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, p: 2, minWidth: 180, textAlign: 'center', borderRadius: 2, border: '1px solid #f3f4f6' }}>
          <Typography fontWeight={600}>Pending Communications</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Typography variant="h5" color="warning.main">{pending}</Typography>
            <EmailIcon color="warning" />
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, p: 2, minWidth: 180, textAlign: 'center', borderRadius: 2, border: '1px solid #f3f4f6' }}>
          <Typography fontWeight={600}>Assessments Completed</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Typography variant="h5" color="success.main">{completed}</Typography>
            <CheckCircleIcon color="success" />
          </Box>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, p: 2, minWidth: 180, textAlign: 'center', borderRadius: 2, border: '1px solid #f3f4f6' }}>
          <Typography fontWeight={600}>Progress</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Typography variant="h5" color="primary">{progress}%</Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ width: 80, height: 8, borderRadius: 4, background: '#e0e7ff' }} />
          </Box>
        </Paper>
      </Box>

      {/* Candidate Management */}
      <Paper elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3, border: '1px solid #f3f4f6', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Candidate Management</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Filter and manage your shortlisted candidates</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search candidates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} displayEmpty size="small" sx={{ minWidth: 160 }}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
          <Select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} displayEmpty size="small" sx={{ minWidth: 160 }}>
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
          </Select>
        </Box>
        {loading ? <LinearProgress /> : (
          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Resume Score</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assessment Score</TableCell>
                <TableCell>Final Rank</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No candidates found. Please upload resumes to see shortlisted candidates here.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map(c => (
                  <TableRow key={c._id}>
                    <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                    <TableCell>
                      {c.resumeScore ? <Box sx={{ fontWeight: 500, px: 1, py: 0.5, borderRadius: 2, background: '#f3f4f6', display: 'inline-block' }}>{c.resumeScore}/100</Box> : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600, fontSize: 13, background: getCategoryColor(c.category).bg, color: getCategoryColor(c.category).color, display: 'inline-block' }}>{c.category}</Box>
                    </TableCell>
                    <TableCell>
                      <Box>{c.contactInfo?.email}</Box>
                      <Box sx={{ color: 'text.secondary', fontSize: 13 }}>{c.contactInfo?.phone}</Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 600, fontSize: 13, background: getStatusColor(c.status).bg, color: getStatusColor(c.status).color, display: 'inline-block' }}>{c.status}</Box>
                    </TableCell>
                    <TableCell>
                      {c.assessmentScore ? <Box sx={{ fontWeight: 500, px: 1, py: 0.5, borderRadius: 2, background: '#f3f4f6', display: 'inline-block' }}>{c.assessmentScore}/100</Box> : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {c.finalRank ? <Box sx={{ fontWeight: 500, px: 1, py: 0.5, borderRadius: 2, background: '#e0e7ff', color: '#3730a3', display: 'inline-block' }}>{c.finalRank}/100</Box> : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" onClick={() => handleSendCommunication(c._id)} startIcon={<EmailIcon />}>Send</Button>
                        <Button variant="outlined" size="small" onClick={() => handleAssignAssessment(c._id)} startIcon={<TrendingUpIcon />}>Assess</Button>
                        <Button variant="outlined" size="small" onClick={() => handleViewAssessmentScore(c._id)} startIcon={<CheckCircleIcon />}>View</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
