const logout = (req, res) => {
  try {
    // clear the authentication cookie details
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    return res.json({
      message: "Logged out successfully",
      success: true,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { logout };
