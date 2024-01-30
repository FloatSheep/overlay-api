import https from 'https';

export default async function handler(request, response) {
  const { fetch: fetchUrl } = request.query;

  if (!fetchUrl) {
    return response.status(400).json({ error: 'No fetch URL provided' });
  }

  const options = {
    headers: {
      'Referer': 'https://bilibili.com'
    }
  };

  try {
    const responseData = await new Promise((resolve, reject) => {
      https.get(fetchUrl, options, (res) => {
        let data = '';

        if (!/^2/.test('' + res.statusCode)) {
          reject(new Error('Failed to fetch the URL'));
        }

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });

    response.setHeader('Content-Type', 'text/plain');
    response.send(responseData);
  } catch (error) {
    response.statusCode = 500;
    response.json({ error: error.message });
  }
}
