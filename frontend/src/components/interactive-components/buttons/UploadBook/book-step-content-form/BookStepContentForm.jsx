import {useEffect, useRef, useState} from "react";
import "./BookStepContentForm.scss";
import SVG from "../../../../../svg-env.js";
import classNames from "classnames";
import "../../../input-box/input-form-layout.scss";
import ePub from "epubjs";

const BookStepContentForm = ({
	bookFile,
	setBookFile = () => {},
	translateFiles,
	setTranslateFiles = () => {},
	title,
	handleNext = () => {},
}) => {
	const [previewFile, setPreviewFile] = useState(null);
	const handleValidNext = () => {
		if (isValid) {
			handleNext();
		}
	};
	const isValid = () => {
		return Object.keys(bookFile).length > 0 && translateFiles.length > 0;
	};
	return (
		<>
			<div className="form-label-wrapper">
				<p className="p-graph-24 form-label">{title}</p>
			</div>
			<main className="file-drag-n-drop-wrapper two-fields-wrapper">
				<BoxFileLoader title="Завантажена Книга" files={bookFile} fileSetter={setBookFile} index={1}>
					<div className="icon-wrapper">
						<svg viewBox="0 0 30 30" width={30} height={30}>
							<path d={SVG.dragFile}></path>
						</svg>
					</div>
					<h1 className="title-28">Перетягніть файл,</h1>
					<p className="p-graph-20">
						щоб завантажити <b>книгу</b>
					</p>
					<p className="p-graph-16 priority">
						Підтримуючі формати <b className="caption-20">.epub</b> <b className="caption-20">.txt</b>
					</p>
				</BoxFileLoader>
				<BoxFileLoader
					title="Переклад(и)"
					files={translateFiles}
					fileSetter={setTranslateFiles}
					index={2}
					maxFiles={3}
				>
					<div className="icon-wrapper">
						<svg viewBox="0 0 30 30" width={30} height={30}>
							<path d={SVG.dragFile}></path>
						</svg>
					</div>
					<h1 className="title-28">Перетягніть файл(и),</h1>
					<p className="p-graph-20">
						щоб завантажити <b>переклад(и)</b>
					</p>
					<p className="p-graph-16 priority">
						Максимальна кількість файлів <b className="caption-20">3</b>
					</p>
				</BoxFileLoader>
			</main>
			{isValid() && (
				<main className="file-bottom-alert">
					<p className="p-graph-20 --danger">У разі продовження повернутись назад буде неможливо</p>
				</main>
			)}
			<div className="btn-content-wrapper bottom-form-section">
				<button className="btn" disabled={true}>
					<svg viewBox="0 0 30 30" width={30} height={30}>
						<path d={SVG.backBtn} />
					</svg>
					<p className="p-graph-24">
						<b>Назад</b>
					</p>
				</button>
				<button className="btn --primary" disabled={!isValid()} onClick={handleValidNext}>
					<p className="p-graph-24">
						<b>Далі</b>
					</p>
					<svg viewBox="0 0 30 30" width={30} height={30}>
						<path d={SVG.nextBtn} />
					</svg>
				</button>
			</div>
		</>
	);
};

const BoxFileLoader = ({
	title = "",
	index = 1,
	files = [] || {},
	maxFiles = 1,
	fileSetter = () => {},
	fileAttributes = {accept: ".txt,.epub"},
	children,
}) => {
	const FileLoaderField = useRef(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		processFiles(files);
	};

	const handleClick = (fieldRef) => {
		fieldRef.current.click();
	};

	const handleChange = (e, maxFiles) => {
		const files = e.target.files;
		if (maxFiles && files.length > maxFiles) {
			alert(`Максимальна кількість файлів: ${maxFiles}`);
			return;
		}
		processFiles(files);
	};

	const processFiles = (files) => {
		const processFiles = [];

		const filesArray = Array.from(files);

		filesArray.forEach((file, index) => {
			const reader = new FileReader();
			if (String(file.type).includes("application/epub")) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const book = ePub(e.target.result);
					book.ready.then(() => {
						return book.loaded.metadata.then(async (metadata) => {
							return book.coverUrl().then((coverUrl) => {
								processFiles.push({
									index,
									name: file.name,
									type: file.type,
									metadata: metadata,
									image: coverUrl,
									totalPages: 451, //FIXME: get total pages
									data: file,
								});

								if (processFiles.length === filesArray.length) {
									fileSetter(maxFiles === 1 ? processFiles[0] : processFiles);
								}
							});
						});
					});
				};
				reader.readAsArrayBuffer(file);
			} else {
				reader.onload = (e) => {
					processFiles.push({
						index,
						name: file.name,
						type: file.type,
						data: e.target.result,
					});

					if (processFiles.length === filesArray.length) {
						fileSetter(maxFiles === 1 ? processFiles[0] : processFiles);
					}
				};
				reader.readAsDataURL(file);
			}
		});
	};

	const classnames = classNames({
		uploaded: files.length > 0,
		overlay: isDragOver,
	});

	const checkIfFileExists = () => {
		if (Array.isArray(files)) {
			return files.length > 0;
		} else if (typeof files === "object") {
			return Object.keys(files).length > 0;
		} else false;
	};
	return (
		<div
			key={index}
			className={"drag-n-drop " + classnames}
			onDragOver={handleDragOver}
			onDragEnter={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={(e) => handleDrop(e)}
		>
			{checkIfFileExists() ? (
				<>
					<header className="header-files-wrapper">
						<p className="p-graph-24">{title}</p>
					</header>
					{Array.isArray(files) ? (
						<ul className="ul-file-list">
							{files.map((file, index) => {
								return <ItemFile file={file} key={index} />;
							})}
						</ul>
					) : (
						<ul className="ul-file-list">
							<ItemFile file={files} />;
						</ul>
					)}

					<div className="load-files-wrapper btn-content-wrapper btn-form">
						<button className="btn --primary" onClick={() => handleClick(FileLoaderField)}>
							<p className="p-graph-20">Завантажити</p>
						</button>
					</div>
				</>
			) : (
				<div className={"drag-content " + classnames}>{children}</div>
			)}
			{!checkIfFileExists() && !isDragOver && (
				<div className="drag-overlay" onClick={() => handleClick(FileLoaderField)}></div>
			)}
			{isDragOver && (
				<div className="drag-overlay --overlay">
					<svg viewBox="0 0 30 30">
						<path d={SVG.uploadFile} />
					</svg>
				</div>
			)}
			<input
				type="file"
				style={{display: "none"}}
				ref={FileLoaderField}
				accept=".txt, .epub, application/epub+zip, text/plain"
				onChange={(e) => handleChange(e, maxFiles)}
				multiple={maxFiles > 1}
				{...fileAttributes}
			/>
		</div>
	);
};

const ItemFile = ({index, file, fileSetter}) => {
	const [value, setValue] = useState(file?.name);

	const handleOnChange = (e) => {
		setValue(e.target.value);
	};
	return (
		<li className="file-tile">
			<p className="p-graph box-index">{file?.index + 1}</p>
			<div className="edit-textfield-wrapper">
				<input type="text" className="edit-textfield" value={value || ""} onChange={handleOnChange} />
				<div className="icon">
					<svg viewBox="0 0 30 30" width={16} height={16}>
						<path d={SVG.editPen} />
					</svg>
				</div>
			</div>
			<p className="p-graph box-tag">{file?.type}</p>
		</li>
	);
};
export default BookStepContentForm;
