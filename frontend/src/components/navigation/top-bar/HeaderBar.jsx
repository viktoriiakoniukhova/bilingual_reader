import React, { useEffect, useState } from "react";
import "./HeaderBar.scss";
import SVG from "../../../svg-env";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWindowSize } from "../side-bar/NavigationSideBar";
import { useUser } from "../../../store/userProvider";
import UserService from "../../../service/UserService";

const HeaderBar = () => {
  const [width] = useWindowSize();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState("");
  const searchRequest = searchParams.get("search");
  const [searchActive, setSearchActive] = useState(
    Boolean(searchRequest) || width <= 1024
  );
  const userService = UserService();
  const { user } = useUser();

  useEffect(() => {
    userService.handleGetUser();
  }, []);

  const handleOnChange = (e) => {
    const search = e.target?.value;
    setValue(search);
  };

  useEffect(() => {
    if (!searchRequest) setSearchActive(width <= 1024);
  }, [width]);

  const handleOnClick = (value) => {
    if (value && value.trim() !== "") {
      searchSubmitHandler(value);
    } else {
      setSearchActive(!searchActive);
    }
  };
  const searchSubmitHandler = (value) => {
    if (value && value.trim() !== "") {
      let searchResult = [];
      navigate(`/search-result?search=${value}`, {
        state: { searchResult },
      });
    }
  };

  const navigateToSettings = (value) => {
    navigate("/settings");
  };
  const searchClassNames = classNames({
    "--active": searchActive,
  });

  const logotypeAnim = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25 },
  };

  return (
    <header
      className="header-top-bar"
      id="top-bar"
      style={{ justifyContent: width <= 1024 ? "space-between" : "flex-end" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {width <= 1024 && (
          <motion.img
            alt="BiBook"
            src={`/public/logo-bi-book${width <= 780 ? "-short" : ""}.png`}
            className="logotype"
            {...logotypeAnim}
          />
        )}
      </AnimatePresence>
      <div className="btn-content-wrapper">
        <div
          className={"search-panel-wrapper " + searchClassNames}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchSubmitHandler(value);
          }}
        >
          {searchActive && (
            <input
              type="search"
              placeholder="Пошук книг..."
              value={value || ""}
              onChange={handleOnChange}
            />
          )}
          <button className="btn-icon" onClick={() => handleOnClick(value)}>
            <svg viewBox="0 0 30 30" width={30} height={30}>
              <path d={SVG.search} />
            </svg>
          </button>
        </div>

        <button className="btn-icon" onClick={navigateToSettings}>
          <svg viewBox="0 0 30 30" width={30} height={30}>
            <path d={SVG.profile} />
          </svg>
        </button>
        {width >= 750 && (
          <p className="person-title p-graph-20 --title">
            Привіт,&nbsp;{user.firstName || user.username}!
          </p>
        )}
      </div>
    </header>
  );
};

export default HeaderBar;
