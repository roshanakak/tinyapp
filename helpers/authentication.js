
const generateAuthenticator = () => {
  return (req, res, next) => {
    const whiteList = ['/login'];
    if (req.session.user_id || whiteList.includes(req.path)) {
      return next();
    }
    res.cookie('error', 'Error 400: You should register or login first.');
    res.redirect('/login');
  }
}

module.exports = generateAuthenticator;