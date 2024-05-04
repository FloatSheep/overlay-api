import axios from "axios";

export default async function handler(request, response) {
  const owner = "Mxmilu666";
  const repo = "bangbang93HUB";
  const token = process.env.GITHUB_TOKEN;

  const headers = {
    Authorization: `token ${token}`,
  };

  try {
    // 获取仓库根目录的所有文件和目录
    const repoContents = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      { headers }
    );

    // 筛选出图片文件
    const imageFiles = repoContents.data.filter((file) =>
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

    // 从筛选结果中随机选择一张图片
    const selectedImage =
      imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imageUrl = selectedImage.download_url;

    // 设置正确的 MIME 类型
    const imageType = selectedImage.name.split(".").pop().toLowerCase();
    let contentType = "image/jpeg"; // 默认值
    if (imageType === "png") {
      contentType = "image/png";
    } else if (imageType === "gif") {
      contentType = "image/gif";
    }
    response.writeHead(200, { "Content-Type": contentType });

    // 使用 axios 获取图片的流并管道到响应对象
    const imageResponse = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    imageResponse.data.pipe(response);
  } catch (error) {
    console.error("Failed to retrieve and pipe the image from GitHub:", error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal server error." }));
  }
}
