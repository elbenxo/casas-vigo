function asyncRoute(fn) {
  return (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
}

module.exports = asyncRoute;
