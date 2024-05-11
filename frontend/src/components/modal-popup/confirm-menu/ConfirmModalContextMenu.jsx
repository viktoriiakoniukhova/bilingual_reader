import React from "react";
import "./../ModalContextMenu.scss";

const ConfirmModalContextMenu = ({
    title= "",
	confirmText = "Підтвердити",
	cancelText = "Відмінити",
	onClose = () => {},
	onConfirm = () => {},
}) => {
	return (
		<div className="modal-context-menu">
            <header className="header-wrapper">
                <h1 className="title-24">{title}</h1>
            </header>
			<div className="btn-content-wrapper btn-form">
				<button className="btn --primary --danger-btn" onClick={onConfirm}>
					{confirmText}
				</button>
				<button className="btn" onClick={onClose}>
					{cancelText}
				</button>
			</div>
		</div>
	);
};

export default ConfirmModalContextMenu;
