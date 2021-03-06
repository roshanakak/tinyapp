
const generateAuthenticator = () => {
  return (req, res, next) => {
    const whiteList = ['/login', '/register'];
    if (req.session.user_id || whiteList.includes(req.path)) {
      return next();
    }
    res.cookie('error', 'You should register or login first.');
    res.redirect('/login');
  };
};

module.exports = generateAuthenticator;