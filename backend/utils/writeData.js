import fs from "fs/promises";

export async function writeDataToFile(data, filename) {
  try {
    const jsonData = JSON.stringify(data, null, 2);

    await fs.writeFile(filename, jsonData, "utf-8");

    console.log(`Data written to ${filename} successfully`);
  } catch (error) {
    console.error("Error writing data to file", error);
  }
}
