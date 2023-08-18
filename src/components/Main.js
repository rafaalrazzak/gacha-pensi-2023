import React, { useState, useContext, useEffect } from "react";
import { allChars, allWeapons, LATESTVERS } from "../util/Constants";
import WarpButtons from "./WarpButtons";
import Settings from "./Settings";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ResizeContext from "./context/ResizeContext";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

export default function Main({
  bannerType,
  showDB,
  setShowDB,
  setContent,
  setCurrentWarp,
  setDBType,
  bgm,
}) {
  const { getWidth, getHeight } = useContext(ResizeContext);

  const { t } = useTranslation();

  const [vers, setVers] = useState(
    sessionStorage.getItem("vers") || LATESTVERS
  );

  useEffect(() => {
    const allItems = allChars.concat(allWeapons);
    var stash = JSON.parse(localStorage.getItem("stash")) || {};

    allItems.forEach((item) => {
      if (stash[item] === undefined) stash[item] = 0;
    });
    localStorage.setItem("stash", JSON.stringify(stash));
  }, []);

  const bannerBackColor = {
    "1.2.1": {
      char: "#241330",
      weap: "#241330",
    },
  };

  const handleWarp = (warps) => {
    setCurrentWarp(warps);

    setContent("video");
  };

  return (
    <motion.section
      key="main"
      exit={{ opacity: 0 }}
      id="main-back"
      style={{
        backgroundColor: `${
          bannerType === "beginner"
            ? "#1f2322"
            : bannerBackColor[vers][bannerType]
        }`,
      }}
    >
      <Settings
        vers={vers}
        showDB={showDB}
        setShowDB={setShowDB}
        setVers={setVers}
        setDBType={setDBType}
        setContent={setContent}
        bgm={bgm}
      />
      <div
        id="main-back-cover"
        style={{
          backgroundImage: "url(assets/bg-gradient.png)",
        }}
      />
      <LazyLoadImage
        effect="opacity"
        draggable="false"
        className="ring"
        src="/assets/rings.webp"
        alt="rings"
        width={getWidth(550)}
      />
      <div
        id="info"
        style={{
          width: getWidth(680, 200),
          height: getHeight(50, 680, 20, 200),
        }}
      >
        <div
          id="warp-icon"
          style={{
            backgroundImage: "url(/assets/icon-warp.webp)",
            width: getWidth(44, 22),
            height: getWidth(44, 22),
            backgroundSize: getWidth(44, 22),
          }}
        />
        <div
          style={{
            height: getHeight(50, 600),
            width: getWidth(600),
            display: "flex",
            flexDirection: "column",
            margin: 0,
            padding: 0,
          }}
        >
          <div
            id="title"
            style={{
              fontSize: getWidth(22, 9),
              height: getWidth(24, 11),
              textAlign: "left",
              marginTop: `-6px`,
            }}
          >
            {t("main.title")}
          </div>
          <div
            id="warp-type"
            style={{
              textAlign: "left",
              fontSize: getWidth(24, 11),
              height: getWidth(24, 11),
            }}
          >
            Hadiah
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: getWidth(1200),
          height: getHeight(700, 1200),
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-55%)",
          zIndex: 0,
        }}
      >
        <AnimatePresence>
          <motion.div
            className="banner"
            key={bannerType + vers}
            initial={{
              transform: `translate(-50%, 500%)`,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            animate={{
              transform: "translate(-50%,-50%)",
              opacity: 1,
              transition: { duration: 0.3 },
            }}
            exit={{
              transform: `translate(-50%, -500%)`,
              opacity: 0,
              transition: { duration: 0.3 },
            }}
          >
            <img
              src="./assets/logo-pensi.png"
              width={500}
              height={300}
              alt="Logo Pensi"
            />
          </motion.div>
          <WarpButtons onWarp={handleWarp} />
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
