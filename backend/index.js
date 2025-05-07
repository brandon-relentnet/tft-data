import { fetchChampionList, fetchItemList } from "./utils/fetchData.js";
import { writeDataToFile } from "./utils/writeData.js";

async function main() {
  try {
    const championNames = await fetchChampionList();
    console.log("Fetched champion names");
    await writeDataToFile(championNames, "./data/champions.json");

    const itemNames = await fetchItemList();
    console.log("Fetched item names");
    await writeDataToFile(itemNames, "./data/items.json");
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

main();
