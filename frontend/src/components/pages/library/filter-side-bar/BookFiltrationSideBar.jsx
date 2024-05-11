import {
  SideBarWrapper,
  useWindowSize,
} from "../../../navigation/side-bar/NavigationSideBar.jsx";
import { useEffect, useRef, useState } from "react";
import genres from "../../../../objects/genres.jsx";
import CheckBox from "../../../interactive-components/check-box/CheckBox.jsx";
import { useBookFilter } from "../../../../store/bookFiltrationProvider.jsx";
import { useBookLibrary } from "../../../../store/bookLibraryProvider.jsx";
import AuthProvider from "../../../../store/authProvider.jsx";
import "./BookFiltrationSideBar.scss";
import SVG from "../../../../svg-env.js";
import ageRestriction from "../../../../objects/ageRestriction.jsx";
import { func } from "prop-types";
import { BOOK } from "../../../../api/endpoints.js";

const BookFiltrationSideBar = ({ isOpen = false, setIsOpen }) => {
  const bookFilter = useBookFilter();
  const bookLibrary = useBookLibrary();
  const sideBarWrapper = useRef(null);

  useEffect(() => {
    // Define the function to hit the book/filter/endpoint
    const hitFilterEndpoint = async () => {
      try {
        // Make the API call with genres and ageRestriction parameters
        const response = await fetch(
          `${BOOK.FILTER}?genres=${bookFilter.genres.join(
            ","
          )}&ageRestriction=${bookFilter.age_restrictions.join(",")}`,
          { headers: { "Authorization:": `Bearer ${token}` } }
        );
        console.log("Fuck you", response);
        // Handle the response
        if (response.ok) {
          // Process the data returned from the endpoint
          const data = await response.json();
          for (let book_id of data.books) {
            const book = await fetch(`/book/one/info?book_id=${book_id}`);
            bookLibrary.addBook(book_id);
          }
        } else {
          // Handle the error response
          // TODO: Handle the error as needed
        }
      } catch (error) {
        // Handle any network or other errors
        // TODO: Handle the error as needed
      }
    };

    // Call the function when bookFilter changes
    hitFilterEndpoint();
  }, [bookFilter.genres, bookFilter.age_restrictions]);

  function handleToggleSelectedGenre(key) {
    if (bookFilter.genres.includes(key)) {
      bookFilter.removeGenre(key);
    } else {
      bookFilter.addGenre(key);
    }
  }

  function handleToggleSelectedAgeReg(key) {
    if (bookFilter.age_restrictions.includes(key)) {
      bookFilter.removeAgeRestriction(key);
    } else {
      bookFilter.addAgeRestriction(key);
    }
  }

  function isSelectedAgeReg(key) {
    return bookFilter.age_restrictions.includes(key);
  }

  function isSelectedGenre(key) {
    return bookFilter.genres.includes(key);
  }

  function handleClearFilter() {
    bookFilter.clearFilters();
  }

  return (
    <SideBarWrapper
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      disabled={true}
      forwardRef={sideBarWrapper}
      classNames={"side-bar-abs"}
      id="filter-side-bar"
    >
      <main className="side-bar-wrapper">
        <section className="upper-section-wrapper">
          <header className="header-wrapper">
            <h1 className="title-28">Фільтр</h1>
            <button
              className="btn-icon mini-icon --with-hover-effect"
              onClick={() => setIsOpen(false)}
            >
              <svg viewBox="0 0 30 30">
                <path d={SVG.xmark} />
              </svg>
            </button>
          </header>
          <div className="filter-wrapper-box">
            <h1 className="title-20">За жанрами</h1>
            <ul className="ul-filter-list scroll-wrapper">
              {genres.map((genre, index) => {
                return (
                  <li className="check-mark-item" key={index}>
                    <CheckBox
                      title={genre.title}
                      scale={0.85}
                      checked={isSelectedGenre(genre.key)}
                      onSelect={() => handleToggleSelectedGenre(genre.key)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="filter-wrapper-box">
            <h1 className="title-20">За віком</h1>
            <ul className="ul-filter-list scroll-wrapper">
              {ageRestriction.map((ageReg, index) => {
                return (
                  <li className="check-mark-item" key={index}>
                    <CheckBox
                      title={ageReg.title}
                      checked={isSelectedAgeReg(ageReg.key)}
                      scale={0.85}
                      onSelect={() => handleToggleSelectedAgeReg(ageReg.key)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <footer className="bottom">
          <div className="btn-content-wrapper btn-form">
            <button
              type={"reset"}
              className="btn outline-effect"
              onClick={handleClearFilter}
            >
              Збросити Фільтр
            </button>
          </div>
        </footer>
      </main>
    </SideBarWrapper>
  );
};

export default BookFiltrationSideBar;
