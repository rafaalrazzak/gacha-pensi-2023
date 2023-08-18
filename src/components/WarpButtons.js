import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SoundContext from "./context/SoundContext";
import ResizeContext from "./context/ResizeContext";
import { AnimatePresence, motion } from "framer-motion";

const WarpButtons = ({ onWarp }) => {
  const { getWidth } = useContext(ResizeContext);
  const { sound, useSound } = useContext(SoundContext);
  const [play] = useSound("/assets/audio/sfx/button-select.mp3");

  return (
    <AnimatePresence>
      <motion.div
        key="standard-warp-buttons"
        initial={{ transition: { duration: 0 } }}
        animate={{ transition: { duration: 0 } }}
        exit={{ transition: { duration: 0 } }}
      >
        <div id="warp-button-one-hover">
          <LazyLoadImage
            effect="opacity"
            className="warp-button one"
            onClick={() => {
              onWarp([830]);
              if (sound) play();
            }}
            src={`../assets/warp-buttons/id/event-1.png`}
            alt="Putar Satu Kali"
            width={getWidth(280)}
            draggable="false"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WarpButtons;
