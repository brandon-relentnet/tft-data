"use client";

import { useState, useEffect, useRef } from "react";

function ChampionsPage() {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(true);
  const [popupHeight, setPopupHeight] = useState("h-60");
  const [activeTooltip, setActiveTooltip] = useState(null);

  const tierColor = {
    1: "var(--color-overlay-0)",
    2: "var(--color-green)",
    3: "var(--color-blue)",
    4: "var(--color-mauve)",
    5: "var(--color-yellow)",
  };

  const ChampionIcon = ({ champion }) => {
    const iconRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const spriteStyle = {
      width: `${champion.image.w}px`,
      height: `${champion.image.h}px`,
      backgroundImage: `url(${champion.image.spriteUrl})`,
      backgroundPosition: `-${champion.image.x}px -${champion.image.y}px`,
      borderColor: tierColor[champion.tier],
    };

    const openInNewTab = (url) => {
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      if (newWindow) newWindow.opener = null;
    };

    const onClickUrl = (url) => {
      return () => openInNewTab(url);
    };

    // Show tooltip immediately on hover
    const handleMouseEnter = () => {
      setIsHovering(true);

      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        setActiveTooltip({
          champion,
          position: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);

      if (!isHovering) {
        setActiveTooltip(null);
      }
    };

    return (
      <div
        ref={iconRef}
        className="champion-icon rounded-lg border cursor-pointer"
        onClick={onClickUrl(`https://www.metatft.com/units/${champion.name}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          ...spriteStyle,
        }}
      />
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

  // Divide champions into tiers and sort alphabetically inside each tier
  const tiers = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-xl text-text font-semibold">Champions</h1>
        <button
          className="px-4 py-2 text-sm font-semibold text-text bg-surface-0 rounded-lg hover:bg-surface-1 cursor-pointer transition duration-150"
          onClick={() => {
            setPopupVisible(!popupVisible);
            setPopupHeight(popupVisible ? "h-0" : "h-60");
          }}
        >
          {popupVisible ? "Hide" : "Show"}
        </button>
        {popupVisible && (
          <button
            className="text-text font-semibold cursor-pointer"
            onClick={() =>
              popupHeight === "h-160"
                ? setPopupHeight("h-60")
                : setPopupHeight("h-160")
            }
          >
            {popupHeight === "h-60" ? "More" : "Less"}
          </button>
        )}
      </div>

      {/* Champion grid container */}
      <div
        className={`overflow-auto shadow-lg px-4 rounded-xl inline-block ${popupHeight} transition-all duration-300 ease-in-out bg-mantle`}
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

      {/* Global tooltip with improved hover behavior */}
      {activeTooltip && (
        <div
          className="fixed z-[9999] bg-surface-0 rounded-lg shadow-lg text-text overflow-hidden border-surface-1"
          style={{
            top: `${activeTooltip.position.top - 8}px`,
            left: `${
              activeTooltip.position.left + activeTooltip.position.width / 2
            }px`,
            transform: "translateX(-50%) translateY(-100%)",
            width: "256px",
            height: "auto",
          }}
        >
          {/* Triangle pointer */}
          <div
            style={{
              background: `var(--color-${
                tierColor[activeTooltip.champion.tier]
              })`,
            }}
            className="absolute size-5 transform rotate-45 left-1/2 -ml-1.5 -bottom-2.5 shadow-lg border-3 border-surface-1"
          />

          <div
            className={`relative shadow-lg object-fill px-2 flex flex-col justify-between bg-no-repeat bg-center rounded-t-lg border-3
            }`}
            style={{
              backgroundImage: `url(${activeTooltip.champion.image.fullUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderColor: `var(--color-${
                tierColor[activeTooltip.champion.tier]
              })`,
              height: "150px",
              width: "256px",
            }}
          >
            <div className="absolute rounded-t-lg inset-0 w-full h-full bg-mantle/70" />
            <div className="relative z-10">
              <h3 className="font-bold text-text text-lg">
                {activeTooltip.champion.name}
              </h3>
              <h4 className="font-semibold text-subtext-0">Type of unit</h4>
            </div>
            <div className="flex items-end justify-between relative z-10 font-bold text-text text-lg">
              <div>
                <h3>trait</h3>
                <h3>trait</h3>
              </div>
              {activeTooltip.champion.tier && (
                <p>
                  <span className="font-semibold">Cost:</span>{" "}
                  {activeTooltip.champion.tier}
                </p>
              )}
            </div>
          </div>
          <div className="p-2 flex flex-col border-3 border-surface-1 border-t-0 rounded-b-lg">
            <div className="flex justify-between">
              <h4 className="font-semibold text-subtext-0">Paint Bomb</h4>
              <h4 className="font-semibold text-subtext-0">25/70</h4>
            </div>
            <p className="text-text">
              Ability Description: Throw a paint bomb at the largest group of
              enemies within 5 (➚) hexes, dealing 250/375/1500 (⚡) magic damage
              to enemies within 1 hex and 100/150/600 (⚡) magic damage to the
              nearest 4 enemies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChampionsPage;
