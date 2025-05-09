"use client";

import { useState, useEffect } from "react";
import { Tooltip } from "flowbite-react";
import { createTheme } from "flowbite-react";

function ChampionsPage() {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupHeight, setPopupHeight] = useState("h-60"); // "h-60", "h-0", "h-160"

  const tierColor = {
    1: "var(--color-overlay-0)",
    2: "var(--color-green)",
    3: "var(--color-blue)",
    4: "var(--color-mauve)",
    5: "var(--color-yellow)",
  };

  // Simplified champion icon with built-in tooltip
  const ChampionIcon = ({ champion }) => {
    // Function to open URL in new tab
    const openInNewTab = () => {
      window.open(
        `https://www.metatft.com/units/${champion.name}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

    const getTierBgClass = (tier) => `!bg-[${tierColor[tier] || tierColor[1]}]`;

    const tooltipTheme = createTheme({
      tooltip: {
        base: "!bg-surface-0 !text-text rounded-lg shadow-lg pointer-events-none p-0 z-100 w-[256px]",
        arrow: {
          base: `border-3 border-surface-1 z-9999 -mb-[4.5px] !text-text !size-[18px] ${getTierBgClass(
            champion.tier
          )}`,
        },
      },
    });

    return (
      <Tooltip
        theme={tooltipTheme.tooltip}
        content={
          <>
            <div
              className="relative shadow-lg px-2 flex flex-col justify-between rounded-t-lg border-3"
              style={{
                backgroundImage: `url(${champion.image?.fullUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: tierColor[champion.tier],
                height: "150px",
                width: "256px",
              }}
            >
              <div className="absolute rounded-t-lg inset-0 w-full h-full bg-mantle/70" />
              <div className="relative z-10">
                <h3 className="font-bold text-text text-lg">{champion.name}</h3>
                <h4 className="font-semibold text-subtext-0">Type of unit</h4>
              </div>
              <div className="flex items-end justify-between relative z-10 font-bold text-text text-lg">
                <div>
                  <h3>trait</h3>
                  <h3>trait</h3>
                </div>
                {champion.tier && (
                  <p>
                    <span className="font-semibold">Cost:</span> {champion.tier}
                  </p>
                )}
              </div>
            </div>
            <div className="px-3 flex flex-col border-3 border-surface-1 border-t-0 rounded-b-lg py-5">
              <div className="flex justify-between mb-2">
                <h4 className="font-semibold text-subtext-0">Paint Bomb</h4>
                <h4 className="font-semibold text-subtext-0">25/70</h4>
              </div>
              <p className="text-text">
                Ability Description: Throw a paint bomb at the largest group of
                enemies within 5 (➚) hexes, dealing 250/375/1500 (⚡) magic
                damage to enemies within 1 hex and 100/150/600 (⚡) magic damage
                to the nearest 4 enemies.
              </p>
            </div>
          </>
        }
      >
        <div
          className="rounded-lg border cursor-pointer size-20 group-hover:z-10"
          onClick={openInNewTab}
          style={{
            backgroundImage: `url(${champion?.image?.spriteUrl})`,
            borderColor: tierColor[champion.tier],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Tooltip>
    );
  };

  useEffect(() => {
    async function fetchChampions() {
      try {
        const response = await fetch("/api/champions");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setChampions(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch champions:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchChampions();
  }, []);

  if (loading) return <div>Loading champions...</div>;
  if (error) return <div>Error loading champions: {error}</div>;

  // Helper for toggling visibility
  const toggleVisibility = () => {
    setPopupHeight(popupHeight === "h-0" ? "h-60" : "h-0");
  };

  // Helper for toggling expanded view
  const toggleExpanded = () => {
    setPopupHeight(popupHeight === "h-60" ? "h-160" : "h-60");
  };

  // Divide champions into tiers and sort alphabetically inside each tier
  const tiers = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-xl text-text font-semibold">Champions</h1>
        <button
          className="px-4 py-2 text-sm font-semibold text-text bg-surface-0 rounded-lg hover:bg-surface-1 cursor-pointer transition duration-150"
          onClick={toggleVisibility}
        >
          {popupHeight !== "h-0" ? "Hide" : "Show"}
        </button>
        {popupHeight !== "h-0" && (
          <button
            className="text-text font-semibold cursor-pointer"
            onClick={toggleExpanded}
          >
            {popupHeight === "h-60" ? "More" : "Less"}
          </button>
        )}
      </div>

      {/* Champion grid container */}
      <div
        className={`overflow-auto shadow-lg px-4 rounded-xl inline-block ${popupHeight} bg-mantle`}
      >
        {tiers.map((tier) => {
          const tierChampions = champions
            .filter((champion) => champion.tier === tier)
            .sort((a, b) => a.name.localeCompare(b.name));

          return (
            <div key={tier} className="my-4">
              {tierChampions.length > 0 ? (
                <div
                  className={`inline-grid shadow-lg grid-cols-6 gap-2 border-3 rounded-xl p-2 bg-mantle`}
                  style={{
                    borderColor: tierColor[tier],
                  }}
                >
                  {tierChampions.map((champion) => (
                    <ChampionIcon key={champion.id} champion={champion} />
                  ))}
                </div>
              ) : (
                <p>No champions in this tier</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChampionsPage;
