import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "../tiles-card-layout.scss";
import "slick-carousel/slick/slick.css";

const BookTileCard = ({
                          index = 0, book = {}, onClick = () => {
    }, setSelectedBook = () => {
    }, active = false
                      }) => {
    const {title = "", image = "", author, publisher, progress = 0, numberOfPages = 0, ageRestriction} = book;

    const classnames = classNames({
        "--active": active,
    });
    return (
        <li className={"book-tile-card-wrapper " + classnames} style={active ? {width: "35rem"} : {}}>
            <div className="book-tile-card-content-wrapper">
                <img alt={title} src={image} title={title} className="book-card" onClick={() => onClick(index)}/>
                {ageRestriction && (<p className="p-graph p-graph-16 box-tag">
                    {ageRestriction}
                </p>)}
                {active && (
                    <div className="book-tile-card-inf-wrapper">
                        <UpperSectionTileCard
                            title={title}
                            author={author}
                            publisher={publisher}
                            progress={progress}
                            numberOfPages={numberOfPages}
                        />

                        <button className="btn --primary" onClick={() => setSelectedBook(book)}>
                            Відкрити
                        </button>
                    </div>
                )}
                {progress !== 0 && !active && (
                    <div className="progress-bar-mark">
                        <div className="box-mark --second-pr">
                            <p className="p-graph-12 --white --suffix" data-suffix="%">
                                {progress}
                            </p>
                            <p className="p-graph-12 --white">Прочитано</p>
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
};
export const BookDetails = ({
                                viewDescription = false,
                                descriptionContentWrapper = null,
                                setViewDescription = () => {
                                },
                                description,
                            }) => {
    const viewDetailsHandler = () => {
        setViewDescription(!viewDescription);
    };

    const createMarkup = (htmlString) => {
        return {__html: htmlString};
    };

    if (description)
        return (
            <div className="description-wrapper">
                <header className="header-description-wrapper">
                    {viewDescription && <h1 className="title-28">Опис</h1>}
                    <button className="btn btn-link" onClick={viewDetailsHandler}>
                        {!viewDescription ? "Прочитати Опис Книги" : "Сховати"}
                    </button>
                </header>
                {viewDescription && (
                    <div
                        ref={descriptionContentWrapper}
                        className="description-content-wrapper"
                        dangerouslySetInnerHTML={createMarkup(description)}
                    />
                )}
            </div>
        );
};
export const UpperSectionTileCard = ({
                                         title = "",
                                         className = "upper-section-wrapper",
                                         author,
                                         publisher,
                                         progress = 0,
                                         numberOfPages = 0,
                                         setSelectedBook = () => {
                                         },
                                     }) => {
    return (
        <section className={className}>
            <div className="text-title-wrapper --mini">
                <h1 className="title-24 --title-type">{title}</h1>
                {author && (
                    <p className="p-graph-16">
                        by&nbsp;<span className="--bold">{author}</span>&nbsp;(Author)
                        {publisher && (
                            <span>
								,&nbsp;<span className="--bold">{author}</span>&nbsp;(Publisher),
							</span>
                        )}
                    </p>
                )}
            </div>
            <ProgressBar progress={progress} numberOfPages={numberOfPages}/>
        </section>
    );
};

export const ProgressBar = ({progress = 0, numberOfPages = 0}) => {
    return (
        <div
            className="progress-bar"
            data-progress={progress + "%"}
            style={{"--progress": progress + "%", "--time": Math.min(progress * 35, 1600) + "ms"}}
        >
            <div className="progress-bar-info">
                <p className="p-graph-16 --green --suffix" data-suffix="стр.">
                    {numberOfPages}
                </p>
                <p className="p-graph-16 --yellow --suffix" data-suffix="%">
                    {progress}
                </p>
            </div>
        </div>
    );
};

BookTileCard.propTypes = {
    id: PropTypes.string,
    book: PropTypes.shape({
        title: PropTypes.string,
        image: PropTypes.string,
        author: PropTypes.string,
        progress: PropTypes.number,
        numberOfPages: PropTypes.number,
    }).isRequired,
};
export default BookTileCard;
