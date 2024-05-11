import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import "./BookTileGridBox.scss";
import SVG from "../../../../svg-env";
import BookImgTileCard from "../../../interactive-components/book-tiles/book-img-tile-card/BookImgTileCard";
import UploadBookBtn from "../../../interactive-components/buttons/UploadBook/UploadBookBtn.jsx";
import Overlay from "../../../modal-popup/overlay/Overlay.jsx";
import ModalContextMenu from "../../../modal-popup/context-menu/ModalContextMenu.jsx";
import {ReadBookContent} from "../../../interactive-components/book-tiles/book-preview-content/BookPreviewContent.jsx";
import BookFiltrationSideBar from "../filter-side-bar/BookFiltrationSideBar.jsx";
import classNames from "classnames";
import {useBookFilter} from "../../../../store/bookFiltrationProvider.jsx";

export const MODE_VIEW = {
    default: "roomy",
    roomy: "roomy",
    compact: "compact",
};

const BookTileGridBox = (props) => {
    const [modeView, setModeView] = useState(MODE_VIEW.default);
    const [modalStatus, setModalStatus] = useState(false);
    const [selectedBook, setSelectedBook] = useState({});
    const [wasSelectedBook, setWasSelectedBook] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const bookFilter = useBookFilter()

    useEffect(() => {
        if (Object.keys(selectedBook).length > 0) {
            setModalStatus(true);
            setWasSelectedBook(selectedBook);
            setTimeout(() => {
                setSelectedBook({});
            }, 500);
        }
    }, [selectedBook]);

    const filterActiveCN = classNames({
        "--pr-active": filterOpen || bookFilter.filterApplied
    })
    return (
        <>
            <div className="flex-box --border-type">
                <header className="header-wrapper --main --sticky">
                    <h1 className="title-with-icon-32">
                        <svg viewBox="0 0 30 30">
                            <path d={props.svg}/>
                        </svg>
                        {props.title}
                    </h1>
                    <div className="btn-content-wrapper">
                        {bookFilter.filterApplied && (
                            <p className="p-graph p-graph-20 box-tag">
                                Фільтр Застосован
                            </p>
                        )}
                        <button className={"btn-icon middle-icon --with-hover-effect " + filterActiveCN}
                                onClick={() => setFilterOpen(!filterOpen)}>
                            <svg viewBox="0 0 30 30">
                                <path d={SVG.filter}/>
                            </svg>
                        </button>
                        <UploadBookBtn/>
                        <div className="thumb-btn-wrapper --toggle-box">
                            <button
                                className={
                                    modeView === MODE_VIEW.roomy
                                        ? "btn-icon  mini-icon --active"
                                        : "btn-icon mini-icon "
                                }
                                onClick={() => setModeView(MODE_VIEW.roomy)}
                            >
                                <svg viewBox="0 0 30 30">
                                    <path d={SVG.gridCell}/>
                                </svg>
                            </button>
                            <button
                                className={
                                    modeView === MODE_VIEW.compact
                                        ? "btn-icon  mini-icon --active"
                                        : "btn-icon mini-icon "
                                }
                                onClick={() => setModeView(MODE_VIEW.compact)}
                            >
                                <svg viewBox="0 0 30 30">
                                    <path d={SVG.miniGridCell}/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>
                {props.books.length <= 0 ? (
                    <div className="nothing-not-found">
                        <p className="p-graph-28 not-priority">{props.placeholder}</p>
                    </div>
                ) : (
                    <ul
                        className="view-books-grid-wrapper"
                        style={{"--tile-width": MODE_VIEW.compact === modeView ? "12.5rem" : "15.75rem"}}
                    >
                        {props.books.map((book, index) => {
                            return (
                                <BookImgTileCard
                                    book={book}
                                    key={index}
                                    setSelectedBook={setSelectedBook}
                                    modeView={modeView}
                                />
                            );
                        })}
                    </ul>
                )}
            </div>
            <Overlay
                isOpen={modalStatus}
                getStateModalDialog={setModalStatus}
                closeOnEsc
                closeOnOutsideClick
                style={{width: "52.5rem"}}
            >
                <ModalContextMenu>
                    <ReadBookContent book={wasSelectedBook}/>
                </ModalContextMenu>
            </Overlay>
            <BookFiltrationSideBar isOpen={filterOpen} setIsOpen={setFilterOpen}/>
        </>
    );
};

BookTileGridBox.propTypes = {
    title: PropTypes.string.isRequired,
    svg: PropTypes.string,
    books: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
};

export default BookTileGridBox;
