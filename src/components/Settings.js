import React, { useState, useContext, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import CloseButton from "./CloseButton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SoundContext from "./context/SoundContext";
import ResizeContext from "./context/ResizeContext";
import { useTranslation } from "react-i18next";

const Settings = ({ showDB, bgm }) => {
  const { getWidth } = useContext(ResizeContext);

  const [showSettings, setShowSettings] = useState(false);

  const handleClose = () => {
    setShowSettings(false);
    if (sound) playMenuClose();
  };
  const handleShow = () => setShowSettings(true);

  const { sound, setSound, setContinueSound, useSound } =
    useContext(SoundContext);

  const [playMenuOpen] = useSound("../assets/audio/sfx/menu-open.mp3");

  const [playMenuClose] = useSound("../assets/audio/sfx/menu-close.mp3");

  const [playMenuSelect] = useSound("../assets/audio/sfx/menu-select.mp3");

  const [playButtonSelect] = useSound(
    "../assets/audio/sfx/menu-button-select.mp3"
  );

  const { i18n } = useTranslation();

  useEffect(() => {
    function handleKeyDown({ keyCode }) {
      if (keyCode === 27 && !showSettings && !showDB) {
        if (sound) playMenuSelect();
        setShowSettings(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSettings, showDB, sound, playMenuSelect]);

  return (
    <React.Fragment>
      <LazyLoadImage
        effect="opacity"
        id="settings-button"
        alt="Settings Button"
        src="assets/menu/phone.webp"
        width={getWidth(33, 18)}
        onClick={() => {
          handleShow();
          if (sound) playMenuSelect();
        }}
        draggable="false"
      />

      <Offcanvas
        show={showSettings}
        onHide={handleClose}
        placement="end"
        style={{
          backgroundColor: "#111213",
          color: "#e9e9eb",
          width: getWidth(450, 200),
        }}
        onEntering={() => {
          if (sound) setTimeout(() => playMenuOpen(), 200);
        }}
      >
        <Offcanvas.Header>
          <CloseButton onClose={handleClose} />
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            padding: getWidth(20),
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginBottom: getWidth(20),
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginBottom: getWidth(20),
            }}
          >
            <LazyLoadImage
              effect="opacity"
              alt="Audio Toggle Button"
              className="menu-button"
              src={`./assets/menu/${i18n.resolvedLanguage}/audio-${
                sound ? "on" : "off"
              }.webp`}
              draggable="false"
              width={getWidth(114, 50)}
              onClick={() => {
                playButtonSelect();
                setSound(!sound);
                setContinueSound(!sound);
              }}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default Settings;
