import axios from "axios";

export default async function handler(request, response) {
  const owner = "Mxmilu666";
  const repo = "bangbang93HUB";
  const branch = "main";
  const token = process.env.GITHUB_TOKEN;

  const headers = {
    Authorization: `token ${token}`,
  };

  try {
    // 获取仓库根目录的所有文件和目录
    const repoContents = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`,
      { headers }
    );

    // 筛选出图片文件
    const imageFiles = repoContents.data.filter((file) =>
      file.name.match(/\.(jpg|jpeg|png|gif)$/)
    );

    if (imageFiles.length === 0) {
      return response
        .status(404)
        .json({ error: "No image files found in the repo's root directory." });
    }

    // 从筛选结果中随机选择一张图片
    const imageUrl =
      imageFiles[Math.floor(Math.random() * imageFiles.length)].download_url;

    // 返回选中图片的URL
    return response.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Failed to retrieve images from GitHub:", error);
    return response.status(500).json({ error: "Internal server error." });
  }
}
