import {cloneElement} from "react";
import SVG from "../../../svg-env";
import "./../ModalContextMenu.scss";
import { useSearchParams } from "react-router-dom";

const ModalContextMenu = ({className = "", children, onClose = () => {}}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const onCloseHandler = () => {
        onClose()
        setSearchParams({})
    }
	return (
		<div className="modal-context-menu">
			<div className="btn-wrapper" onClick={onCloseHandler}>
				<svg viewBox="0 0 30 30">
					<path d={SVG.xmark} />
				</svg>
			</div>
			<div className={"context-wrapper " + className}>{cloneElement(children, {onClose})}</div>
		</div>
	);
};

export default ModalContextMenu;
