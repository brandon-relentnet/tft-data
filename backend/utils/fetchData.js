// fetchUtils.js
import {
  CHAMPION_LIST_URL,
  ITEM_LIST_URL,
  BASE_URL,
  INCLUDED_PREFIXES,
  EXCLUDED_PREFIXES,
} from "./variables.js";

/**
 * Generic function to fetch data with configurable parameters
 * @param {Object} options - Configuration options
 * @param {string} options.url - The URL to fetch data from
 * @param {string} options.entityType - The type of entity (e.g., 'champion', 'item')
 * @param {Function} options.filterFn - Function to filter the data
 * @param {number} [options.timeout=5000] - Timeout in milliseconds
 * @returns {Promise<Array>} - Enhanced data objects
 */
export async function fetchData({ url, entityType, filterFn, timeout = 5000 }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`
      );
    }

    const { data } = await response.json();

    return Object.values(data)
      .filter(filterFn)
      .map((item) => enhanceData(item, entityType));
  } catch (error) {
    handleFetchError(error, entityType);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Enhances data with additional properties like image URL
 * @param {Object} item - The data object to enhance
 * @param {string} entityType - The type of entity ('champion' or 'item')
 * @returns {Object} - Enhanced data object
 */
function enhanceData(item, entityType) {
  return {
    ...item,
    image: {
      ...item.image,
      fullUrl: `${BASE_URL}/img/tft-${entityType}/${item.image.full}`,
      spriteSheetUrl: `${BASE_URL}/img/sprite/${item.image.sprite}`,
      spriteUrl: `/images/sprites/champions/${
        item.image.full.split(".")[0]
      }.webp`,
    },
  };
}

/**
 * Handles errors that occur during fetching
 * @param {Error} error - The error that occurred
 * @param {string} entityType - The type of entity being fetched
 * @throws {Error} - Rethrows with an appropriate message
 */
function handleFetchError(error, entityType) {
  const capitalizedType =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

  if (error.name === "AbortError") {
    console.error(`Request timed out fetching ${entityType} list`);
    throw new Error(
      `${capitalizedType} data request timed out. Please try again later.`
    );
  }

  if (error instanceof TypeError) {
    console.error(`Network error fetching ${entityType} list:`, error);
    throw new Error(
      `Could not connect to ${entityType} data service. Please check your internet connection.`
    );
  }

  console.error(`Error fetching ${entityType} list:`, error);
  throw error;
}

/**
 * Checks if an item ID should be included based on included and excluded prefixes
 * @param {string} itemId - The item ID to check
 * @param {string[]} includedPrefixes - Prefixes that should be included
 * @param {string[]} excludedPrefixes - Prefixes that should be excluded
 * @returns {boolean} - Whether the item should be included
 */
export function filterByPrefixes(itemId, includedPrefixes, excludedPrefixes) {
  const includeCondition = includedPrefixes
    ? includedPrefixes.some((prefix) => itemId.includes(prefix))
    : true;

  const excludeCondition = excludedPrefixes
    ? excludedPrefixes.every((prefix) => !itemId.includes(prefix))
    : true;

  return includeCondition && excludeCondition;
}

/**
 * Fetches item list with appropriate filtering
 * @returns {Promise<Array>} - Enhanced item data
 */
export function fetchItemList() {
  return fetchData({
    url: ITEM_LIST_URL,
    entityType: "item",
    filterFn: (item) =>
      filterByPrefixes(item.id, INCLUDED_PREFIXES, EXCLUDED_PREFIXES),
  });
}

/**
 * Fetches champion list with appropriate filtering
 * @returns {Promise<Array>} - Enhanced champion data
 */
export function fetchChampionList() {
  return fetchData({
    url: CHAMPION_LIST_URL,
    entityType: "champion",
    filterFn: (champion) =>
      filterByPrefixes(champion.id, null, EXCLUDED_PREFIXES),
  });
}

/**
 * Generic function to fetch any type of TFT data
 * @param {Object} options - Configuration options
 * @param {string} options.url - API endpoint URL
 * @param {string} options.entityType - Entity type for image URL construction
 * @param {string[]} [options.includedPrefixes] - Prefixes to include (optional)
 * @param {string[]} [options.excludedPrefixes] - Prefixes to exclude (optional)
 * @returns {Promise<Array>} - Enhanced data
 */
export function fetchTftData({
  url,
  entityType,
  includedPrefixes = null,
  excludedPrefixes = null,
}) {
  return fetchData({
    url,
    entityType,
    filterFn: (item) =>
      filterByPrefixes(item.id, includedPrefixes, excludedPrefixes),
  });
}
