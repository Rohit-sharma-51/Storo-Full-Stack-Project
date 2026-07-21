const Partner = require("../models/Partner");
const User = require("../models/User");

// Get all pending partner requests (admin only)
exports.getPendingPartners = async (req, res) => {
    try {
        // Find all partners that are not approved yet
        const pendingPartners = await Partner.find({ isApproved: false })
            .sort({ createdAt: -1 });

        // Get associated user details for each partner
        const partnersWithUsers = await Promise.all(
            pendingPartners.map(async (partner) => {
                const user = await User.findOne({ partnerId: partner._id }).select('-password');
                return {
                    partner: partner.toObject(),
                    user: user ? user.toObject() : null
                };
            })
        );

        res.json(partnersWithUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all approved partners (admin only)
exports.getApprovedPartners = async (req, res) => {
    try {
        const approvedPartners = await Partner.find({ isApproved: true })
            .sort({ createdAt: -1 });

        const partnersWithUsers = await Promise.all(
            approvedPartners.map(async (partner) => {
                const user = await User.findOne({ partnerId: partner._id }).select('-password');
                return {
                    partner: partner.toObject(),
                    user: user ? user.toObject() : null
                };
            })
        );

        res.json(partnersWithUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Approve a partner request (admin only)
exports.approvePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const partner = await Partner.findByIdAndUpdate(
            partnerId,
            { isApproved: true },
            { new: true }
        );

        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        res.json({ message: 'Partner approved successfully', partner });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reject/Delete a partner request (admin only)
exports.rejectPartner = async (req, res) => {
    try {
        const { partnerId } = req.params;

        // Find and delete the partner
        const partner = await Partner.findByIdAndDelete(partnerId);

        if (!partner) {
            return res.status(404).json({ error: 'Partner not found' });
        }

        // Also delete the associated user account
        await User.deleteOne({ partnerId: partnerId });

        res.json({ message: 'Partner request rejected and deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get admin statistics
exports.getAdminStats = async (req, res) => {
    try {
        const totalPartners = await Partner.countDocuments();
        const approvedPartners = await Partner.countDocuments({ isApproved: true });
        const pendingPartners = await Partner.countDocuments({ isApproved: false });
        const totalUsers = await User.countDocuments({ role: 'user' });

        res.json({
            totalPartners,
            approvedPartners,
            pendingPartners,
            totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
