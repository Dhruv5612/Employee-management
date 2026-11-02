export default function handler(req, res) {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Vercel Serverless Function is working perfectly!',
  });
}
