import {useRef, useState} from "react";
import "./ImgContextLoader.scss";
import SVG from "../../../svg-env";
import classNames from "classnames";

const ImgContextLoader = ({svgNamePlaceHolder = "profile", className = "", image, fileSetter = () => {}}) => {
	const FileImgLoader = useRef(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleClick = (fieldRef) => {
		fieldRef.current.click();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const files = e.dataTransfer.files;
		processFiles(files);
	};

	const handleFileChange = (e) => {
		processFiles(e.target.files);
	};

	const processFiles = (files) => {
		const file = files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (e) => {
				fileSetter(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const classnames = classNames({
		uploaded: image,
		overlay: image && isDragOver,
	});
	const handleDragStart = (e) => e.preventDefault();
	return (
		<header
			className={"user-avatar-wrapper " + classnames + " " + className}
			onDragOver={handleDragOver}
			onDragEnter={handleDragOver}
            onMouseEnter={handleDragOver}
            onMouseLeave={handleDragLeave}
			onDragLeave={handleDragLeave}
			onClick={() => handleClick(FileImgLoader)}
			onDrop={(e) => handleDrop(e)}
		>
			{!image && (
				<>
					<div className="user-avatar-content-wrapper profile-key">
						<svg viewBox="0 0 30 30" className="avatar-img --place-holder">
							<path d={SVG[svgNamePlaceHolder]} key={0} />
						</svg>
					</div>

					<div className={"user-avatar-content-wrapper add-key"}>
						<svg viewBox="0 0 30 30" className="avatar-img --place-holder" width={75} height={75}>
							<path d={SVG.addPhoto} key={1} />
						</svg>
					</div>
				</>
			)}

			{image && (
				<img
					onDragStart={handleDragStart}
					className={"avatar-img " + classnames + " " + className}
					alt="book cover"
					src={image || undefined}
				/>
			)}
			{image && isDragOver && (
				<div className="drag-overlay --overlay">
					<svg viewBox="0 0 30 30">
						<path d={SVG.uploadFile} />
					</svg>
				</div>
			)}
			<input
				ref={FileImgLoader}
				type="file"
				accept="image/jpeg, image/png, image/gif, image/svg+xml, image/webp"
				onChange={handleFileChange}
				style={{display: "none"}}
			></input>
		</header>
	);
};

export default ImgContextLoader;
