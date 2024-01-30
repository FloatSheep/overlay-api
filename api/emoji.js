export default async function handler(request, response) {

  const { emoji = 'thinking_face_color' } = request.query;
  
  const https = require('https');
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'X-API-Key': process.env.DETA_API_KEY
    }
  };
  
  const reqURL = 'https://drive.deta.sh/v1/c0fqosjqfat/emoji/files/download?name=';
  
  https.get(reqURL + emoji + '.svg', options, (res) => {
    if (res.statusCode === 200) {
      response.setHeader('Cache-Control', 'max-age=2592000');
      response.setHeader('Content-Type', 'image/svg+xml');
      res.pipe(response);
    } else {
      response.status(500).json({ error: 'Error retrieving SVG' });
    }
  }).on('error', (error) => {
    response.status(500).json({ error: error.message });
  });
}
