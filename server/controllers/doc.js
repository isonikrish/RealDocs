import Doc from '../models/doc.js';
import User from '../models/user.js';
export const  getDoc = async (req, res) => {
    try {
        const user = req.user;
        
        const userDocs = await User.findById(user._id).populate('docs');
        res.status(200).json(userDocs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deleteDoc = async (req, res) => {
    try {
      const user = req.user;
      const docId = req.params.id;
      const userDocs = await User.findById(user._id).populate('docs');
  
      const doc = await Doc.findById(docId);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }
  
      // Check if the document belongs to the user by comparing the IDs as strings
      if (userDocs.docs.map(doc => doc._id.toString()).includes(docId.toString())) {
        // Remove the document from the user's docs array
        userDocs.docs = userDocs.docs.filter(id => id._id.toString() !== docId.toString());
        await userDocs.save();
        
        // Delete the document from the database
        await doc.deleteOne();
  
        res.status(200).json({ message: 'Document deleted successfully' });
      } else {
        res.status(403).json({ error: 'You are not authorized to delete this document' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  