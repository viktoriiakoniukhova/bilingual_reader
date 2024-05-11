import {Outlet} from "react-router-dom";
import SvgBG from "../../bg-asset/bg";
import NavigationSideBar from "../../navigation/side-bar/NavigationSideBar";
import HeaderBar from "../../navigation/top-bar/HeaderBar";
import "./HomePage.css";

const HomePage = () => {
	return (
		<div className="main-body-wrapper">
			<NavigationSideBar />
			<div className="main-page-wrapper" id="main-body">
				<HeaderBar />
				<div className="main-page">
					<div className="main-page-content-wrapper slider-wrapper">
						<Outlet></Outlet>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
