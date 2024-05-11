import {RouterProvider, createBrowserRouter} from "react-router-dom";
import HomePage from "../components/pages/home/HomePage";
import ProtectedRoute from "./Protected";
import LibraryPage from "../components/pages/library/LibraryPage";
import DictionaryPage from "../components/pages/dictionary/DictionaryPage";
import SettingsPage from "../components/pages/settings/SettingsPage";
import SearchResultPage from "../components/pages/search/SearchResultPage";
import LoginForm from "../components/pages/not-authenticated/login/LoginForm";
import SignUpForm from "../components/pages/not-authenticated/sign-up/SignUpForm";
import { useAuth } from "../store/authProvider";

const Routes = () => {
	const { token } = useAuth();

	const routesForAuthenticatedOnly = [
		{
			path: "",
			element: <ProtectedRoute />,
			children: [
				{
					path: "",
					element: <HomePage />,
					children: [
						{
							path: "",
							element: <LibraryPage />,
						},
						{
							path: "library",
							element: <LibraryPage />,
						},
						{
							path: "dictionary",
							element: <DictionaryPage />,
						},
						{
							path: "settings",
							element: <SettingsPage />,
						},
						{
							path: "search-result",
							element: <SearchResultPage />,
						},
					],
				},
			],
		},
	];
	const routesForNotAuthenticatedOnly = [
		{
			path: "",
			element: <LoginForm />,
		},
		{
			path: "login",
			element: <LoginForm />,
		},
		{
			path: "sign-up",
			element: <SignUpForm />,
		},
	];

	const routes = [...(token ? routesForAuthenticatedOnly : routesForNotAuthenticatedOnly)];
	const router = createBrowserRouter(routes);
	return <RouterProvider router={router} />;
};

export default Routes;
