const express = require('express');
const router = express.Router();
const { 
  addComplaint, 
  getComplaints, 
  updateComplaintStatus, 
  searchComplaints 
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

// Note: In a real system, you might not want all routes protected, 
// or you might have admin vs user roles. Here we protect them per requirements.
router.route('/')
  .post(protect, addComplaint)
  .get(protect, getComplaints);

router.get('/search', protect, searchComplaints);

router.route('/:id')
  .put(protect, updateComplaintStatus);

module.exports = router;
