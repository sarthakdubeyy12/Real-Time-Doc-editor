import Document from "../models/Document.js";

// 📄 Create new document
export const createDocument = async (req, res) => {
  try {
    const doc = new Document({
      title: req.body.title || "Untitled Document",
      content: req.body.content || "",
      createdBy: req.user._id,
      collaborators: [req.user._id],
    });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error creating document" });
  }
};

// 📄 Get all user documents
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ collaborators: req.user._id }).sort({ updatedAt: -1 });
    res.json(docs);
  } catch {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// 📄 Get a specific document
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Fix: compare collaborator IDs as strings
    const hasAccess = doc.collaborators.map(id => id.toString()).includes(req.user._id.toString());
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    res.json(doc);
  } catch {
    res.status(500).json({ message: "Error fetching document" });
  }
};

// 📝 Update document content or title
export const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Fix: compare collaborator IDs as strings
    const hasAccess = doc.collaborators.map(id => id.toString()).includes(req.user._id.toString());
    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;
    doc.lastUpdated = Date.now();

    const updated = await doc.save();
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Error updating document" });
  }
};

// ❌ Remove a collaborator from a document
export const removeCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: "Only owner can remove collaborators" });

    if (doc.collaborators.includes(collaboratorId)) {
      doc.collaborators = doc.collaborators.filter(
        (id) => id.toString() !== collaboratorId.toString()
      );
      await doc.save();
    }

    res.json({ message: "Collaborator removed", doc });
  } catch (err) {
    res.status(500).json({ message: "Error removing collaborator" });
  }
};

// ❌ Delete document
export const deleteDocument = async (req, res) => {
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
};

// ➕ Add a collaborator to a document
export const addCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.createdBy.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: "Only owner can add collaborators" });

    if (!doc.collaborators.includes(collaboratorId)) {
      doc.collaborators.push(collaboratorId);
      await doc.save();
    }

    res.json({ message: "Collaborator added", doc });
  } catch {
    res.status(500).json({ message: "Error adding collaborator" });
  }
};