import cn from "classnames";
import "./CheckBox.scss";
import PropTypes from "prop-types";

const CheckBox = ({
                      checked = false,
                      onSelect,
                      title = "",
                      scale = 1,
                      disabled = false,
                      invalid = false
                  }) => {

    const classNames = cn({
        "--invalid": invalid,
        "--checked": checked,
    });

    return (
        <label
            className={"checkBoxWrapper" + " " + classNames}
            style={{
                "--scale": scale,
            }}
        >
            <input
                disabled={disabled}
                className="checkbox"
                type="checkbox"
                checked={checked}
                onChange={!disabled ? onSelect : ""}
            />
            {title && <p className="p-graph-16">{title}</p>}
            <span className="checkMark"></span>
        </label>
    );
};
CheckBox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    title: PropTypes.string,
    scale: PropTypes.number,
    disabled: PropTypes.bool,
    nonActive: PropTypes.bool,
};
export default CheckBox;
