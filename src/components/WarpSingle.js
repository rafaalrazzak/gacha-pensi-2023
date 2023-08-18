import React, { useState, useEffect, useContext, useMemo } from "react";
import SoundContext from "./context/SoundContext";
import { allChars, json, asianLang } from "../util/Constants";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ResizeContext from "./context/ResizeContext";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
const trans = require("../assets/data/translations.json");

const WarpSingle = ({
  currentWarp,
  newItems,
  hasFive,
  setNewItems,
  setContent,
}) => {
  const cleanText = (text) => {
    return text
      .replace(/[^\w\s-]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const { getWidth, getHeight } = useContext(ResizeContext);
  const { sound, useSound } = useContext(SoundContext);

  const [warpIndex, setWarpIndex] = useState(0);

  const [animateInfo, setAnimateInfo] = useState(false);
  const [animateFancy, setAnimateFancy] = useState(false);
  const [animateFive, setAnimateFive] = useState(false);
  const [firstAnimation, setFirstAnimation] = useState(true);

  const [playThree] = useSound("./assets/audio/sfx/three.mp3", {
    interrupt: true,
  });
  const [playFour] = useSound("./assets/audio/sfx/four.mp3", {
    interrupt: true,
  });
  const [playFive, playFiveData] = useSound("./assets/audio/sfx/five.mp3", {
    interrupt: true,
  });

  const [item, setItem] = useState({
    name: json.getName(currentWarp[0]),
    path: json.getPath(currentWarp[0]),
    element: json.getElement(currentWarp[0]),
    rarity: json.getRarity(currentWarp[0]),
    isChar: allChars.includes(currentWarp[0]),
  });

  const [randomNumber, setRandomNumber] = useState(null);

  const memoizedRandomNumber = useMemo(() => {
    if (randomNumber === null) {
      return Math.floor(Math.random() * 830) + 1; // Generates a random number between 1 and 830
    }
    return randomNumber;
  }, [randomNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateRandomNumber = () => {
    setRandomNumber(memoizedRandomNumber);
  };

  useEffect(() => {
    setItem({
      name: json.getName(currentWarp[warpIndex]),
      path: json.getPath(currentWarp[warpIndex]),
      element: json.getElement(currentWarp[warpIndex]),
      rarity: json.getRarity(currentWarp[warpIndex]),
      isChar: allChars.includes(currentWarp[warpIndex]),
    });
    if (json.getRarity(currentWarp[warpIndex]) === 5) setAnimateFive(true);
  }, [currentWarp, warpIndex]);

  useEffect(() => {
    generateRandomNumber();
    const length = currentWarp.length;
    if (warpIndex === length) {
      if (length === 10) setContent("results");
      else setContent("main");
    }
  }, [warpIndex, currentWarp, setContent, generateRandomNumber]);

  useEffect(() => {
    if (!sound) return;
    if (item.rarity === 3) playThree();
    else if (item.rarity === 4) playFour();
    else playFive();
  }, [item, playFour, playThree, playFive, sound]);

  const nextSingle = () => {
    if (animateInfo) {
      setWarpIndex(warpIndex + 1);
      setAnimateInfo(false);
      setAnimateFancy(false);
      setAnimateFive(false);
      setFirstAnimation(true);
      if (sound) playFiveData.stop();
    }
  };

  const starPrinter = (i) => {
    return (
      <LazyLoadImage
        effect="opacity"
        className="single-stars"
        key={i}
        src="./assets/star.webp"
        alt="star"
        width={`${getWidth(22, 11)}`}
        height={`${getWidth(28, 14)}`}
        star={i + 1}
        draggable="false"
      />
    );
  };

  const textWidth = (text, fontSize = [28, 14]) => {
    const multi = asianLang.includes(i18n.resolvedLanguage)
      ? fontSize[0]
      : fontSize[1];
    return trans[text][i18n.resolvedLanguage].length * multi;
  };

  const { i18n } = useTranslation();

  return (
    <motion.section
      key="single"
      initial={{ filter: "brightness(0)" }}
      animate={{ filter: "brightness(1)" }}
      exit={currentWarp.length === 10 ? { opacity: 0.5 } : {}}
      className="overlay"
      onClick={nextSingle}
      style={{
        backgroundImage: "url(../assets/warp-result.webp)",
      }}
    >
      <div
        className="skip-button"
        onClick={() => {
          if (currentWarp.length === 10) {
            if (sound && hasFive) playFiveData.stop();
            setContent("results");
          } else {
            setContent("main");
            setNewItems([]);
          }
        }}
      >
        <LazyLoadImage
          className="skip-icon"
          effect="opacity"
          draggable="false"
          src="assets/skip.webp"
        />
      </div>
      {animateInfo && (
        <div
          id="single-info"
          style={{
            height: getHeight(115, 550, 55, 240),
            width: getWidth(550, 240),
            animationName: "animate-info",
            animationDuration: "1s",
            animationFillMode: "both",
            animationTimingFunction: "cubic-bezier(.74,.04,.4,.87)",
          }}
        >
          <div
            className="single-info-shadow"
            style={{
              height: getHeight(
                100,
                150 + textWidth(cleanText(item.name)),
                40,
                200
              ),
              width: getWidth(
                150 + textWidth(cleanText(item.name)),
                100 + textWidth(cleanText(item.name), [22, 10])
              ),
            }}
          >
            <div id="info-pair">
              <div
                className="single-name"
                style={{
                  fontSize: `${getWidth(34, 16)}px`,
                  color: "white",
                  marginTop: 8,
                }}
              >
                {trans[cleanText(item.name)][i18n.resolvedLanguage]}
              </div>
              <div>
                {Array(item.rarity)
                  .fill()
                  .map((e, i) => {
                    return starPrinter(i);
                  })}
              </div>
            </div>
            {newItems.indexOf(cleanText(item.name)) !== -1 && (
              <LazyLoadImage
                effect="opacity"
                alt="new tag"
                src="/assets/new.webp"
                width={getWidth(70, 35)}
                style={{
                  marginLeft: 10,
                  marginBottom: 20,
                }}
              />
            )}
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {currentWarp.map((warp, i) => {
          return (
            i === warpIndex &&
            (!animateFive || item.rarity !== 5) && (
              <motion.div key={warp + i}>
                <LazyLoadImage
                  effect="opacity"
                  className={`glass back`}
                  src="./assets/glass-back.webp"
                  alt="glass back"
                  width={getWidth(400, 200)}
                  draggable="false"
                />
                {/* <LazyLoadImage
                    effect="opacity"
                    className={`single-item weap`}
                    onAnimationStart={() => {
                      if (item.rarity !== 5) setAnimateFancy(true);
                    }}
                    onAnimationEnd={() => setAnimateInfo(true)}
                    alt={currentWarp[i]}
                    src={`/assets/splash/${cleanText(
                      json.getName(currentWarp[i])
                    )}.webp`}
                    // height={getHeight(558.75, 400)}
                    width={getWidth(400, 200)}
                    draggable="false"
                  /> */}
                <LazyLoadImage
                  effect="opacity"
                  className={`glass front`}
                  src="./assets/glass-front.webp"
                  alt="glass front"
                  width={getWidth(400, 200)}
                  draggable="false"
                />
              </motion.div>
            )
          );
        })}
      </AnimatePresence>
      <LazyLoadImage
        className={`${animateFancy ? "animation-ring" : "transparent"}`}
        onAnimationEnd={() => setAnimateFancy(false)}
        width={700}
        effect="opacity"
        alt="animation-ring"
        src="assets/animation-ring.webp"
        draggable="false"
        rarity={item.rarity}
      />
      <div
        className={`${animateFancy ? "donut" : "transparent"}`}
        rarity={item.rarity}
      />
      <AnimatePresence initial={false}>
        <div
          className="title"
          style={{
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold",
            position: "absolute",
            top: "45%",
            left: "55%",
            transform: "translate(-50%)",
          }}
        >
          {randomNumber}
        </div>
      </AnimatePresence>
    </motion.section>
  );
};

export default WarpSingle;
