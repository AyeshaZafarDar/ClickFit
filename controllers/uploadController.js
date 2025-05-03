exports.uploadImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded." });
    }
    const uploaded = req.files.map(file => ({
      filename: file.filename,
      path: `/upload_images/${file.filename}`,
      size: file.size
    }));
    res.status(200).json({ success: true, message: "Files uploaded.", files: uploaded });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 