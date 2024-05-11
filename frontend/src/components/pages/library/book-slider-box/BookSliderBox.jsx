import {useEffect, useRef, useState} from "react";
import BookTileCard from "../../../interactive-components/book-tiles/book-tile-card/BookTileCard";
import PropTypes from "prop-types";
import {useWindowSize} from "../../../navigation/side-bar/NavigationSideBar";
import Slider from "react-slick";
import {debounce} from "lodash";
import "./BookSliderBox.scss";
import SVG from "../../../../svg-env";
import Overlay from "../../../modal-popup/overlay/Overlay";
import ModalContextMenu from "../../../modal-popup/context-menu/ModalContextMenu";
import {ReadBookContent} from "../../../interactive-components/book-tiles/book-preview-content/BookPreviewContent";

export const DEBOUNCE_TIME = 300;

const BookSliderBox = (props) => {
	const [width] = useWindowSize();
	const [modalStatus, setModalStatus] = useState(false);
	const [selectedBook, setSelectedBook] = useState({});

	const [countToShow, setCountToShow] = useState(Math.min(props.books.length, 4));
	const [currentPosition, setCurrentPosition] = useState(0);
	let sliderRef = useRef(null);

	const [wasSelectedBook, setWasSelectedBook] = useState({});

	const next = () => {
		const position = currentPosition + 1 >= props.books.length ? 0 : currentPosition + 1;
		setCurrentPosition(position);
		sliderRef?.slickNext();
	};
	const prev = () => {
		const position = currentPosition - 1 <= 0 ? props.books.length - 1 : currentPosition - 1;
		setCurrentPosition(position);
		sliderRef?.slickPrev();
	};

	const goTo = (index) => {
		console.log("goTo: " + index);
		sliderRef.slickGoTo(index);
		setCurrentPosition(index);
	};

	useEffect(() => {
		if (Object.keys(selectedBook).length > 0) {
			setModalStatus(true);
			setWasSelectedBook(selectedBook);
			setTimeout(() => {
				setSelectedBook({});
			}, 500);
		}
	}, [selectedBook]);

	const debounceGoTo = debounce(goTo, DEBOUNCE_TIME);
	const debounceNext = debounce(next, DEBOUNCE_TIME);
	const debouncePrev = debounce(prev, DEBOUNCE_TIME);

	const sliderSettings = {
		dots: false,
		draggable: true,
		focusOnSelect: true,
		swipeToSlide: false,

		variableWidth: true,
		centerMode: true,
		infinity: true,
		slidesToScroll: 1,
		speed: DEBOUNCE_TIME,
		nextArrow: <></>,
		prevArrow: <></>,
	};

	return (
		<div className="text-title-wrapper">
			<header className="header-wrapper">
				<h1 className="title-with-icon-32">
					<svg viewBox="0 0 30 30">
						<path d={props.svg} />
					</svg>
					{props.title}
				</h1>
				{props.books.length >= countToShow && (
					<div className="thumb-btn-wrapper">
						<button className="btn-icon" onClick={debouncePrev}>
							<svg viewBox="0 0 30 30">
								<path d={SVG.backBtn} />
							</svg>
						</button>
						<button className="btn-icon" onClick={debounceNext}>
							<svg viewBox="0 0 30 30">
								<path d={SVG.nextBtn} />
							</svg>
						</button>
					</div>
				)}
			</header>

			<div className="flex-box">
				<ul className="scroll-track-wrapper">
					<Slider ref={(slider) => (sliderRef = slider)} {...sliderSettings} className="book-scroll-track">
						{props.books.map((book, index) => {
							return (
								<BookTileCard
									book={book}
									key={index}
									active={index === currentPosition}
									onClick={debounceGoTo}
									setSelectedBook={setSelectedBook}
									index={index}
								/>
							);
						})}
					</Slider>
				</ul>
			</div>
			<Overlay
				isOpen={modalStatus}
				getStateModalDialog={setModalStatus}
				closeOnEsc
				closeOnOutsideClick
				style={{width: "52.5rem"}}
			>
				<ModalContextMenu>
					<ReadBookContent book={wasSelectedBook} />
				</ModalContextMenu>
			</Overlay>
		</div>
	);
};

BookSliderBox.propTypes = {
	title: PropTypes.string.isRequired,
	svg: PropTypes.string,
	books: PropTypes.array.isRequired,
};

export default BookSliderBox;
