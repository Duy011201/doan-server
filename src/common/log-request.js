function logRequest(req, res, next) {
  console.log('----------------------------------------------------');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  // console.log('Headers:', req.headers);
  console.log('Query Parameters:', req.query);
  console.log('Body:', req.body);
  console.log('----------------------------------------------------');
  next();
}

module.exports = logRequest;
