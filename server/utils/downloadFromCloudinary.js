const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function downloadFileFromURL(fileUrl, filename = "tempAudio.webm") {
  const filePath = path.resolve(__dirname, "../temp", filename);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream",
      timeout: 20000, // ⏱ 20 seconds timeoutthign
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      let error = null;

      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });

      writer.on("close", () => {
        if (!error) {
          resolve(filePath);
        }
      });
    });
  } catch (err) {
    // ❌ Handle axios errors (like ECONNRESET, ETIMEDOUT)
    writer.destroy();
    throw err;
  }
}

module.exports = downloadFileFromURL;