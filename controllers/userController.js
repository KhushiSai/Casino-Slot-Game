
exports.getUser = (req, res) => {
    // Dummy user data
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com"
    };
    res.json(user);
  };