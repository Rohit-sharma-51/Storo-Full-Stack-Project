const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// Admin routes - all protected by adminAuth middleware
router.get('/stats', adminAuth, adminController.getAdminStats);
router.get('/partners/pending', adminAuth, adminController.getPendingPartners);
router.get('/partners/approved', adminAuth, adminController.getApprovedPartners);
router.put('/partners/:partnerId/approve', adminAuth, adminController.approvePartner);
router.delete('/partners/:partnerId/reject', adminAuth, adminController.rejectPartner);

module.exports = router;
