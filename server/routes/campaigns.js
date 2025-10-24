const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// ============================
// Multer setup for campaign images
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  }
});

const upload = multer({ storage });

// ============================
// @route   GET /api/campaigns
// @desc    Get all active campaigns
// @access  Public
// ============================
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    // Categorize campaigns
    const mostUrgent = campaigns.filter(c => c.priority === "most-urgent");
    const recentlyAdded = campaigns.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    const highestFunded = campaigns.sort((a, b) => b.raised - a.raised);

    res.json({
      success: true,
      campaignsList: campaigns,
      categorized: {
        "most-urgent": mostUrgent,
        "recently-added": recentlyAdded,
        "highest-funded": highestFunded
      }
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns"
    });
  }
});

// ============================
// @route   GET /api/campaigns/:id
// @desc    Get single campaign by ID
// @access  Public
// ============================
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email profilePic");

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    res.json({
      success: true,
      campaign
    });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign"
    });
  }
});

// ============================
// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (requires authentication)
// ============================
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      organization,
      email,
      phone,
      bankAccount,
      ifsc,
      upi,
      goal,
      raised,
      priority
    } = req.body;

    // Validate required fields
    if (!title || !description || !organization || !email || !phone || !goal) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const newCampaign = new Campaign({
      title,
      description,
      organization,
      email,
      phone,
      bankAccount: bankAccount || "",
      ifsc: ifsc || "",
      upi: upi || "",
      goal: Number(goal),
      raised: Number(raised) || 0,
      image: req.file ? req.file.filename : "",
      priority: priority || "most-urgent",
      creator: req.user._id
    });

    await newCampaign.save();

    const populatedCampaign = await Campaign.findById(newCampaign._id)
      .populate("creator", "name email");

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign: populatedCampaign
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message
    });
  }
});

// ============================
// @route   PUT /api/campaigns/:id
// @desc    Update campaign (only by creator)
// @access  Private
// ============================
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    // Check if user is the creator
    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this campaign"
      });
    }

    // Update fields
    const updateData = {
      title: req.body.title || campaign.title,
      description: req.body.description || campaign.description,
      organization: req.body.organization || campaign.organization,
      email: req.body.email || campaign.email,
      phone: req.body.phone || campaign.phone,
      bankAccount: req.body.bankAccount || campaign.bankAccount,
      ifsc: req.body.ifsc || campaign.ifsc,
      upi: req.body.upi || campaign.upi,
      goal: req.body.goal ? Number(req.body.goal) : campaign.goal,
      raised: req.body.raised ? Number(req.body.raised) : campaign.raised,
      priority: req.body.priority || campaign.priority
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("creator", "name email");

    res.json({
      success: true,
      message: "Campaign updated successfully",
      campaign: updatedCampaign
    });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update campaign"
    });
  }
});

// ============================
// @route   DELETE /api/campaigns/:id
// @desc    Delete campaign (only by creator)
// @access  Private
// ============================
router.delete("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    // Check if user is the creator
    if (campaign.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this campaign"
      });
    }

    // Soft delete by setting isActive to false
    campaign.isActive = false;
    await campaign.save();

    res.json({
      success: true,
      message: "Campaign deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete campaign"
    });
  }
});

// ============================
// @route   GET /api/campaigns/user/my-campaigns
// @desc    Get campaigns created by logged-in user
// @access  Private
// ============================
router.get("/user/my-campaigns", protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ 
      creator: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      campaigns
    });
  } catch (error) {
    console.error("Error fetching user campaigns:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns"
    });
  }
});

// ============================
// @route   POST /api/campaigns/:id/donate-intent
// @desc    Send donation intent notification to campaign creator
// @access  Private
// ============================
router.post("/:id/donate-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const campaignId = req.params.id;
    const donorId = req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid donation amount"
      });
    }

    // Find the campaign
    const campaign = await Campaign.findById(campaignId).populate("creator", "name email");
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found"
      });
    }

    // Don't allow creator to donate to their own campaign
    if (campaign.creator._id.toString() === donorId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot donate to your own campaign"
      });
    }

    // Format amount in INR
    const formattedAmount = new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);

    // Create notification for campaign creator
    const notification = new Notification({
      user: campaign.creator._id,
      caregiver: donorId,
      message: `${req.user.name} wishes to donate ${formattedAmount} to your campaign "${campaign.title}"`,
      type: "donation"
    });

    await notification.save();

    res.json({
      success: true,
      message: "Donation intent sent successfully! The campaign creator will be notified.",
      campaign: {
        title: campaign.title,
        organization: campaign.organization,
        bankAccount: campaign.bankAccount,
        ifsc: campaign.ifsc,
        upi: campaign.upi
      }
    });
  } catch (error) {
    console.error("Error sending donation intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send donation intent"
    });
  }
});

module.exports = router;
