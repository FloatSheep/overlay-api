export default async function handler(request, response) {
  return response.status(404).json({ message: '404 Not Found' });
}
