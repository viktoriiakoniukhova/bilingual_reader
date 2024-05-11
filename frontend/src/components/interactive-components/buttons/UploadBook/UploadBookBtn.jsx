import {useState} from "react";
import SVG from "../../../../svg-env.js";
import Overlay from "../../../modal-popup/overlay/Overlay.jsx";
import BookUploadFormStepper from "./book-upload-form-stepper/BookUploadFormStepper.jsx";
import ModalContextMenu from "../../../modal-popup/context-menu/ModalContextMenu.jsx";

const UploadBookBtn = ({title = "Завантажити книгу", style = "btn", classNames = ""}) => {
    const [modalState, setModalState] = useState(false);
    return (
        <>
            {style === "btn" ? (<button className={"btn mini-icon " + classNames} onClick={() => setModalState(true)}>
                <svg viewBox="0 0 30 30">
                    <path d={SVG.addBookBtn}/>
                </svg>
                <p>{title}</p>
            </button>) : (
                <button className={"btn header-nav-link " + classNames} onClick={() => setModalState(true)}>
                    <svg viewBox="0 0 30 30">
                        <path d={SVG.addBookBtn}/>
                    </svg>
                    <p>{title}</p>
                </button>
            )}
            <Overlay
                isOpen={modalState}
                className=""
                getStateModalDialog={setModalState}
                animate
                closeOnEsc
                style={{width: "max(65rem, calc(70vw - var(--width-side-nav-bar)))", minWidth: "980px"}}
            >
                <ModalContextMenu>
                    <BookUploadFormStepper/>
                </ModalContextMenu>
            </Overlay>
        </>
    );
};

export default UploadBookBtn;
