import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import SVG from "../../../svg-env";
import "./NavigationSideBar.scss";
import { useAuth } from "../../../store/authProvider";

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
      ]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const NavigationSideBar = () => {
  const navigate = useNavigate();
  const sideBarMenu = [
    {
      title: "Бібліотека",
      svg: SVG.library,
      path: "library",
    },
    {
      title: "Словник",
      svg: SVG.dictionary,
      path: "dictionary",
    },
    {
      title: "Налаштування",
      svg: SVG.settings,
      path: "settings",
    },
  ];
  const location = useLocation();
  const [width] = useWindowSize();
  const [currentActivePage, setCurrentActivePage] = useState(
    sideBarMenu[0].path
  );
  const [isOpen, setIsOpen] = useState(width >= 1024 ? true : false);
  const sideBarWrapper = useRef(null);
  const { removeToken } = useAuth();

  useEffect(() => {
    let currentPath = String(location.pathname).split("/");
    currentPath = currentPath[1] || sideBarMenu[0].path;
    setCurrentActivePage(currentPath);
  }, [location.pathname]);

  function mouseMove(event) {
    if (!isOpen && width <= 1024 && event.clientX <= width * 0.025) {
      setIsOpen(true);
    } else if (
      isOpen &&
      event.clientX >= sideBarWrapper.current?.clientWidth &&
      width <= 1024
    ) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  });

  const isActive = (path) => {
    return currentActivePage === path ? "--active" : "";
  };

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <SideBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      forwardRef={sideBarWrapper}
      id="navigation-side-bar"
    >
      <div>
        <header className="header-bar">
          <img src="/public/logo-bi-book.png" alt="BiBook" />
        </header>
        <div className="nav-link-wrapper">
          {sideBarMenu.map((val, index) => {
            return (
              <NavLink
                className={"btn header-nav-link " + isActive(val.path)}
                to={val.path}
                key={index}
              >
                <svg viewBox="0 0 30 30" width={30} height={30}>
                  <path d={val.svg} />
                </svg>
                {val.title}
              </NavLink>
            );
          })}
        </div>
      </div>

      <footer className="footer-nav-link-wrapper">
        <button className="btn header-nav-link --danger" onClick={handleLogout}>
          <svg viewBox="0 0 30 30" width={30} height={30}>
            <path d={SVG.logoutBrn} />
          </svg>
          Вийти
        </button>
      </footer>
    </SideBarWrapper>
  );
};

// eslint-disable-next-line react/prop-types
export const SideBarWrapper = ({
  children,
  classNames = "",
  isOpen = false,
  disabled = false,
  setIsOpen = () => {},
  id = "side-bar",
  forwardRef = null,
}) => {
  const [width] = useWindowSize();

  const sidebarClassnames = cn({
    "side-bar-abs": width <= 1024,
  });

  const boxSideBar = {
    initial: { x: "calc(var(--width-side-nav-bar) * -1)" },
    animate: { x: 0 },
    exit: { x: "calc(var(--width-side-nav-bar) * -1)" },
    transition: { duration: 0.25 },
  };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {(isOpen || (width >= 1024 && !disabled)) && (
          <motion.div
            id={id}
            className={
              "navigation-side-bar " + sidebarClassnames + " " + classNames
            }
            ref={forwardRef}
            {...boxSideBar}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && width <= 1024 && !disabled && (
        <div className="btn-open-side-bar">
          <button
            className="btn-icon --light-bg"
            onClick={() => setIsOpen(true)}
          >
            <svg viewBox="0 0 30 30" width={30} height={30}>
              <path d={SVG.backBtn} />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default NavigationSideBar;
