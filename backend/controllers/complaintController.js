const Complaint = require('../models/Complaint');

// @desc    Add a new complaint
// @route   POST /api/complaints
// @access  Private
const addComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    if (!title || !email || !description || !location) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const complaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
      status: 'Pending'
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = status || complaint.status;
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search
// @access  Private
const searchComplaints = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'Location query parameter is required' });
    }

    const complaints = await Complaint.find({ 
      location: { $regex: location, $options: 'i' } 
    }).sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComplaint,
  getComplaints,
  updateComplaintStatus,
  searchComplaints
};
