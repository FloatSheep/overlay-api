import https from 'https';

export default async function handler(request, response) {
  const { fetch: imageUrl } = request.query;

  if (!imageUrl) {
    return response.status(400).json({ error: 'No image URL provided' });
  }

  const options = {
    headers: {
      'Referer': 'https://www.bilibili.com'
    }
  };

  try {
    https.get(imageUrl, options, (res) => {
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        return response.status(res.statusCode).json({ error: 'Failed to fetch image' });
      }

      response.setHeader('Content-Type', res.headers['content-type']);

      res.pipe(response);
    }).on('error', (error) => {
      response.status(500).json({ error: error.message });
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
