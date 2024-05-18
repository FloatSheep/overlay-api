import https from "https";

export default async function handler(request, response) {
  const owner = "Mxmilu666";
  const repo = "bangbang93HUB";
  const token = process.env.GITHUB_TOKEN;

  const options = {
    hostname: "api.github.com",
    path: `/repos/${owner}/${repo}/contents`,
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
      "User-Agent": "Bangbang API",
    },
  };

  let repoContents = "";

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      repoContents += d;
    });

    res.on("end", () => {
      try {
        const files = JSON.parse(repoContents);
        const imageFiles = files.filter((file) =>
          file.name.match(/\.(jpg|jpeg|png|gif)$/)
        );

        if (imageFiles.length === 0) {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(
            JSON.stringify({
              error: "No image files found in the repo's root directory.",
            })
          );
          return;
        }

        const selectedImage =
          imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const imageUrl = selectedImage.download_url;

        const imageType = selectedImage.name.split(".").pop().toLowerCase();
        let contentType = "image/jpeg"; // 默认值
        if (imageType === "png") {
          contentType = "image/png";
        } else if (imageType === "gif") {
          contentType = "image/gif";
        }
        response.writeHead(200, { "Content-Type": contentType });

        https.get(imageUrl, (imageResponse) => {
          imageResponse.pipe(response);
        });
      } catch (error) {
        console.error(
          "Failed to retrieve and pipe the image from GitHub:",
          error
        );
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Internal server error." }));
      }
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}
