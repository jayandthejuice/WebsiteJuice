const adminProtect = (req, res, next) => {
    console.log("User Role in Middleware:", req.user.role); // Debug log
    if (req.user.role !== 'admin') {
      console.log('Access denied. User is not an admin.');
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
  
  
  module.exports = adminProtect;
  