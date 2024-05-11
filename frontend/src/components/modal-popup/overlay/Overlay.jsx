import {useEffect, cloneElement} from "react";
import {Portal} from "react-portal";
import cn from "classnames";
import "./Overlay.scss";

const Overlay = ({
	isOpen = true,
	children,
	getStateModalDialog = () => {},
	style = {},
	className = "",
	animate = true,
	closeOnOutsideClick = false,
	closeOnEsc = false,
}) => {
	let mainBodyClassList = document.getElementById("root");

	useEffect(() => {
		if (mainBodyClassList && isOpen) mainBodyClassList?.classList?.add("filter");
		if (!isOpen) onClose();
	}, [isOpen]);

	function windowHandleKeyDown(event, closeOnEsc) {
		if (closeOnEsc && event.key === "Escape") onClose();
	}

	useEffect(() => {
		window.addEventListener("keydown", (e) => windowHandleKeyDown(e, closeOnEsc));
		return () => {
			window.removeEventListener("keydown", (e) => windowHandleKeyDown(e, closeOnEsc));
		};
	}, []);

	const handleCloseClick = (target) => {
		const modalDialogWrapper = document.getElementById("modal-dialog-wrapper");
		if (target === modalDialogWrapper && closeOnOutsideClick) onClose();
	};

	const onClose = () => {
		if (mainBodyClassList) {
			mainBodyClassList?.classList?.remove("filter");
		}
		getStateModalDialog(false);
	};

	const classNames = cn({
		"initial-animate-effect": animate,
	});

	if (isOpen) {
		return (
			<Portal>
				<div
					className={"modal-dialog-popup-wrapper " + classNames + " " + className}
					onClick={(e) => handleCloseClick(e.target)}
					id="modal-dialog-wrapper"
				>
					<div className={"modal-dialog-content-wrapper " + className} style={style}>
						{cloneElement(children, {onClose})}
					</div>
				</div>
			</Portal>
		);
	}

	return null;
};

export default Overlay;
