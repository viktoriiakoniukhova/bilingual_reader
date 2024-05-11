import React from "react";
import "../tiles-card-layout.scss";
import {MODE_VIEW} from "../../../pages/library/book-tile-grid-box/BookTileGridBox.jsx";
import classNames from "classnames";
import {UpperSectionTileCard} from "../book-tile-card/BookTileCard.jsx";

const BookImgTileCard = ({book = {}, setSelectedBook = () => {}, modeView = MODE_VIEW.default}) => {
	const {id = 0, title = "", image = "", author, publisher, progress = 0, numberOfPages = 0} = book;
	const CardWrapperClassNames = classNames({
		"--compact": modeView === MODE_VIEW.compact,
		"--roomy": modeView === MODE_VIEW.roomy,
	});
	return (
		<li
			tabIndex={1}
			onClick={() => setSelectedBook(book)}
			className={"book-img-card-wrapper " + CardWrapperClassNames}
			// style={modeView === MODE_VIEW.compact ? {height: "22.5rem"} : {}}
		>
			<div className="img-book-wrapper">
				<img src={image} alt={title} className="book-card" title={title} />
				<button className="btn --primary read-book">
					Читати 
				</button>
			</div>

			{modeView === MODE_VIEW.compact && (
				<div className="progress-bar-mark">
					<div className="box-mark --second-pr">
						<p className="p-graph-12 --white --suffix" data-suffix="%">
							{progress}
						</p>
						<p className="p-graph-12 --white">Прочитано</p>
					</div>
				</div>
			)}
			{modeView === MODE_VIEW.roomy && (
				<UpperSectionTileCard
					className="bottom-section-wrapper"
					title={title}
					author={author}
					publisher={publisher}
					progress={progress}
					numberOfPages={numberOfPages}
				/>
			)}
		</li>
	);
};

export default BookImgTileCard;
