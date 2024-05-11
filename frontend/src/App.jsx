import Routes from "./routes/Routes";
import AuthProvider from "./store/authProvider.jsx";
import UserProvider from "./store/userProvider.jsx";
import FilterProvider from "./store/bookFiltrationProvider.jsx";
import BookLibraryProvider from "./store/bookLibraryProvider.jsx";

function App() {

    return (
        <AuthProvider>
            <UserProvider>
                <BookLibraryProvider>
                    <Routes/>;
                </BookLibraryProvider>
            </UserProvider>
        </AuthProvider>
    )
}

export default App;
