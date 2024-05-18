import https from "https";

export default function handler(request, response) {
  const owner = "Mxmilu666";
  const repo = "bangbang93HUB";
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;

  const options = {
    hostname: "api.github.com",
    path: `/repos/${owner}/${repo}/contents?ref=${branch}`,
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "Bangbang API",
    },
  };

  let data = "";

  const req = https.request(options, (res) => {
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const repoContents = JSON.parse(data);
        const imageFiles = repoContents.filter((file) =>
          file.name.match(/\.(jpg|jpeg|png|gif)$/)
        );

        if (imageFiles.length === 0) {
          return response
            .status(404)
            .json({
              error: "No image files found in the repo's root directory.",
            });
        }

        const imageUrl =
          imageFiles[Math.floor(Math.random() * imageFiles.length)]
            .download_url;

        // 返回选中图片的URL
        return response.status(200).json({ imageUrl });
      } catch (error) {
        console.error("Failed to parse GitHub response:", error);
        return response.status(500).json({ error: "Internal server error." });
      }
    });
  });

  req.on("error", (error) => {
    console.error("Failed to retrieve images from GitHub:", error);
    return response.status(500).json({ error: "Internal server error." });
  });

  req.end();
}
