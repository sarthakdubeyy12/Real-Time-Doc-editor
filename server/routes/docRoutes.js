import express from "express";
import Document from "../models/Document.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a document
router.post("/", protect, async (req, res) => {
  try {
    const doc = new Document({
      title: req.body.title || "Untitled Document",
      content: req.body.content || "",
      createdBy: req.user._id,
      collaborators: [req.user._id],
    });

    const saved = await doc.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ message: "Error creating document" });
  }
});

// Get all documents user is part of
router.get("/", protect, async (req, res) => {
  try {
    const docs = await Document.find({ collaborators: req.user._id }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch {
    res.status(500).json({ message: "Error fetching documents" });
  }
});

// Get document by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const hasAccess = doc.collaborators.includes(req.user._id);
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    res.json(doc);
  } catch {
    res.status(500).json({ message: "Error fetching document" });
  }
});

// Update document
router.put("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const hasAccess = doc.collaborators.includes(req.user._id);
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;
    doc.lastUpdated = Date.now();

    const updated = await doc.save();
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error updating document" });
  }
});

// Delete document (anyone can delete, optional check can be added)
router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const hasAccess = doc.collaborators.includes(req.user._id);
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    await doc.deleteOne();
    res.json({ message: "Document deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting document" });
  }
});

export default router;