import {useState} from "react";
import SVG from "../../../svg-env";
import ConfirmModalContextMenu from "../../modal-popup/confirm-menu/ConfirmModalContextMenu";
import Overlay from "../../modal-popup/overlay/Overlay";
import "./DictionaryPage.scss";

const DictionaryPage = () => {
	const [modalState, setModalState] = useState(false);
	const [dictionaryList, setDictionaryList] = useState([]);
	
	if (dictionaryList.length > 0) {
		return (
			<>
				<div className="flex-box --border-type">
					<header className="header-wrapper --main --sticky">
						<h1 className="title-with-icon-32">
							<svg viewBox="0 0 30 30">
								<path d={SVG.dictionary} />
							</svg>
							Словник
						</h1>
						<div className="btn-content-wrapper">
							<button
								className="btn mini-icon --danger-btn --with-hover-effect"
								onClick={() => setModalState(true)}
							>
								<svg viewBox="0 0 30 30">
									<path d={SVG.trashCanListBtn} />
								</svg>
								<p>Видалити слова</p>
							</button>
						</div>
					</header>
					<ul className="dictionary-list">
						<DictionaryHeader />
						{dictionaryList.map((item, index) => {
							return <DictionaryItem item={item} key={index} />;
						})}
					</ul>
				</div>
				<Overlay
					isOpen={modalState}
					getStateModalDialog={setModalState}
					animate
					closeOnEsc
					closeOnOutsideClick
					style={{width: "40rem"}}
				>
					<ConfirmModalContextMenu title="Видалити Словник" />
				</Overlay>
			</>
		);
	} else {
		return (
			<div className="main-page page-wrapper">
				<div className="books-placeholder">
					<header className="header-placeholder">
						<div className="icon-wrapper">
							<svg viewBox="0 0 30 30" width={30} height={30}>
								<path d={SVG.dictionary} />
							</svg>
						</div>
						<p className="p-graph-28">Ви ще не поповняли свій словник</p>
					</header>
				</div>
			</div>
		);
	}
};

const DictionaryItem = ({item = {}, deleteHandler = () => {}, auditHandler = () => {}}) => {
	return (
		<li className="keyword-row-wrapper">
			<div className="keyword-item-row-wrapper">
				<p className="p-graph-20 keyword-word">{item.ukrWord}</p>
			</div>
			<div className="keyword-item-row-wrapper">
				<p className="p-graph-20 keyword-word">{item.transcription}</p>
			</div>
			<div className="keyword-item-row-wrapper">
				<p className="p-graph-20 keyword-word">{item.englishWord}</p>
			</div>

			<div className="btn-content-wrapper">
				<button className="btn-icon --danger-btn middle-icon --with-hover-effect" onClick={deleteHandler}>
					<svg viewBox="0 0 30 30">
						<path d={SVG.trashCanBtn} />
					</svg>
				</button>
				<button className="btn-icon middle-icon --with-hover-effect" onClick={auditHandler}>
					<svg viewBox="0 0 30 30">
						<path d={SVG.headphone} />
					</svg>
				</button>
			</div>
		</li>
	);
};

const DictionaryHeader = () => {
	return (
		<li className="keyword-row-wrapper header">
			<div className="keyword-item-row-wrapper">
				<h1 className="title-24 keyword-word">Слова</h1>
			</div>
			<div className="keyword-item-row-wrapper">
				<h1 className="title-24 keyword-word">Транскрипція</h1>
			</div>
			<div className="keyword-item-row-wrapper">
				<h1 className="title-24 keyword-word">Переклад</h1>
			</div>
			<div style={{width: "3.5rem"}}></div>
			<div style={{width: "3.5rem"}}></div>
		</li>
	);
};

export default DictionaryPage;
