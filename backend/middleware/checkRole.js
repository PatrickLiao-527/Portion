const checkRole = (role) => (req, res, next) => {
  console.log('checkRole - Checking if user role is', role);
  console.log('checkRole - User role is', req.user.role);

  if (req.user.role !== role) {
    console.log('checkRole - Access denied. User role is', req.user.role, 'but required role is', role);
    return res.status(403).json({ error: 'Access denied' });
  }

  console.log('checkRole - User role authorized');
  next();
};

export default checkRole;
