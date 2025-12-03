// api/upload.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // For demo - simulate API
  return res.status(200).json({
    success: true,
    message: 'Demo: Image would be processed',
    simulated: true
  });
}