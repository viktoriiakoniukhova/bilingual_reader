import React, {useState} from "react";
import {BookDetails, UpperSectionTileCard} from "../book-tile-card/BookTileCard.jsx";
import SVG from "../../../../svg-env.js";
import SelectBox from "../../input-box/select-box/SelectBox.jsx";
import "./BookPreviewContent.scss";
import {useCookies} from "react-cookie";
import {useSearchParams} from "react-router-dom";

const BookPreviewContent = ({
	title = " ",
	book = {},
	genres = [],
	image,
	handleBack = () => {},
	onClose = () => {},
}) => {
	const [_, setSearchParams] = useSearchParams();

	const saveBook = () => {
		onClose();
	};
	const readBook = () => {
		setSearchParams((prev) => {
			return {...prev, book_id: 10, translate_id: 10};
		});
		onClose();
	};

	return (
		<>
			{title && (
				<div className="form-label-wrapper">
					<p className="p-graph-24 form-label">{title}</p>
				</div>
			)}

			<div className="book-preview-wrapper">
				<ReadBookContent book={book} image={image} genres={genres} readBook={false}/>
			</div>

			<div className="btn-content-wrapper bottom-form-section">
				{typeof handleBack === "function" && (
					<button className="btn" onClick={handleBack}>
						<svg viewBox="0 0 30 30" width={30} height={30}>
							<path d={SVG.backBtn} />
						</svg>
						<p className="p-graph-24">
							<b>Редагувати</b>
						</p>
					</button>
				)}
				<div className="btn-content-wrapper">
					<button className="btn --primary" onClick={saveBook}>
						<p className="p-graph-24 --white">
							<b>Зберегти</b>
						</p>
					</button>
					<button className="btn --primary" onClick={readBook}>
						<p className="p-graph-24 --white">
							<b>{book.progress > 0 ? "Продовжити читати" : "Почати читати"}</b>
						</p>
					</button>
				</div>
			</div>
		</>
	);
};

export const ReadBookContent = ({book = {}, image, genres, readBook = true, onClose = () => {}}) => {

	const themeOption = [
		{
			title: "Звичайна тема",
			key: "default",
		},
		{
			title: "Світла тема",
			key: "white",
		},
		{
			title: "Темна тема",
			key: "dark",
		},
	];

	const translateOption = [
		{
			title: "Переклад 1",
			key: "1",
		},
		{
			title: "Переклад 2",
			key: "2",
		},
		{
			title: "Переклад 3",
			key: "3",
		},
	];

	const image_ = image || book?.image || "";
	const genres_ = genres || book?.genres || [];

	const [cookies, setCookie] = useCookies();
	const [viewDescription, setViewDescription] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState(cookies["color-theme"] || themeOption[0]);
	const [selectedTranslate, setSelectedTranslate] = useState(translateOption[0]);
	const [_, setSearchParams] = useSearchParams();

	const selectThemeHandler = (val) => {
		setCookie("color-theme", val, getExpireDays(30));
		setSelectedTheme(val);
	};

	const getExpireDays = (days = 30) => {
		return {expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000)};
	};

	const ReadBook = () => {
		setSearchParams((prev) => {
			return {...prev, book_id: book.id, translate_id: selectedTranslate.key};
		});
		onClose();
	};

	return (
		<div className={`scroll-context-wrapper ${viewDescription ? "--overflow" : ""}`}>
			<main className="main-part">
				<div className="preview-wrapper">
					<div
						className={
							image_ ? "preview-img-title-book-wrapper" : "preview-img-title-book-wrapper --placeholder"
						}
					>
						{!image_ && (
							<svg viewBox="0 0 30 30">
								<path d={SVG.book} />
							</svg>
						)}
						{image_ && <img src={image_} className="preview-book" />}
					</div>

					<section className="right-part">
						<div className="upper-part">
							<UpperSectionTileCard {...book} />
							{genres_.length > 0 && <p className="p-graph-20">Жанри</p>}
							<ul className="book-genre-track-list">
								{genres_.map((genre) => {
									return (
										<li className="genre-title" key={genre.key}>
											<p className="p-graph-16">{genre.title}</p>
										</li>
									);
								})}
							</ul>
						</div>

						<div className="bottom-part">
							<SelectBox
								label="Оберіть переклад"
								options={translateOption}
								select={selectedTranslate}
								selectOptionHandler={setSelectedTranslate}
							/>
							<SelectBox
								label="Оберіть тему"
								options={themeOption}
								select={selectedTheme}
								selectOptionHandler={selectThemeHandler}
							/>
						</div>
					</section>
				</div>
			</main>
			{readBook && (
				<button className="btn --primary" onClick={ReadBook}>
					Читати Книгу
				</button>
			)}
			<BookDetails
				description={book?.description}
				viewDescription={viewDescription}
				setViewDescription={setViewDescription}
			/>
		</div>
	);
};

export default BookPreviewContent;
