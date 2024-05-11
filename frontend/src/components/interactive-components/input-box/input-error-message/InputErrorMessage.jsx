import {AnimatePresence, motion} from "framer-motion";
import SVG from "../../../../svg-env";
import "../input-form-layout.scss";

const InputErrorMessage = ({message, messageAsList = false, isInvalid = false}) => {
	return (
		<AnimatePresence mode="wait" initial={isInvalid}>
			{isInvalid && (
				<motion.div className="error-message-box" {...frameMessageAnim}>
					<svg viewBox="0 0 30 30">
						<path d={SVG.actionAlert} />
					</svg>
					<p className="p-graph-12">{message}</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
};


const frameMessageAnim = {
	initial: {opacity: 0, y: 10, height: 0},
	animate: {opacity: 1, y: 0, height: "100%"},
	exit: {opacity: 0, y: 10, height: 0},
	transition: {duration: 0.4},
};

export default InputErrorMessage;
