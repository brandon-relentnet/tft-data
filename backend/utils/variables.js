const API_VERSION = "15.9.1";
const BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${API_VERSION}`;

const CHAMPION_LIST_URL = `${BASE_URL}/data/en_US/tft-champion.json`;
const ITEM_LIST_URL = `${BASE_URL}/data/en_US/tft-item.json`;

const INCLUDED_PREFIXES = ["TFT_Item"];
const EXCLUDED_PREFIXES = [
  "TFTTutorial_",
  "TFT14_NPC",
  "TFT_Item_Grant",
  "TFT_Item_Debug",
];

export {
  API_VERSION,
  BASE_URL,
  CHAMPION_LIST_URL,
  EXCLUDED_PREFIXES,
  ITEM_LIST_URL,
  INCLUDED_PREFIXES,
};
