export default async function handler(request, response) {

  const { emoji = 'thinking_face_color' } = request.query;

  const getData = require('https');
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      'X-API-Key': process.env.DETA_API_KEY
    }
  };
  const reqURL = 'https://drive.deta.sh/v1/c0fqosjqfat/emoji/files/download?name=';

  try {
    const responseData = await new Promise((resolve, reject) => {
      getData.get(reqURL + emoji + '.svg', options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });

        res.on('error', (error) => {
          reject(error);
        });
      });
    });

    response.setHeader('Cache-Control', 'max-age=2592000');
    response.setHeader('Content-Type', 'image/svg+xml')
    return response.send(responseData);
  } catch (error) {
    return response.json(error);
  }
}