// Autodesk Forge configuration
const config = {
  // Set environment variables or hard-code here
  credentials: {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    callback_url: process.env.FORGE_CALLBACK_URL
  },
  scopes: {
    // Required scopes for the server-side application
    internal: ['bucket:read', 'data:read'],
    // Required scope for the client-side viewer
    public: ['viewables:read']
  }
};

module.exports = config;
