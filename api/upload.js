// Simple API for Vercel demo
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulate API response for demo
  return res.status(200).json({
    success: true,
    message: 'Image processing simulated for demo',
    simulated: true
  });
}
