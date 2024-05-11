import { createContext, useContext, useMemo, useReducer } from "react";

const BookLibraryContext = createContext(undefined);

const ACTIONS = {
    ADD_BOOK: "ADD_BOOK",
    RESET_BOOK: "RESET_BOOK",
};

const bookLibraryReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.ADD_BOOK:
            return { ...state, books: [...state.books, action.payload] };

        case ACTIONS.RESET_BOOK:
            return { ...state, books: [] };

        default:
            return state;
    }
};

const BookLibraryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookLibraryReducer, {
        books: [],
    });

    const addBook = (book) => {
        dispatch({ type: ACTIONS.ADD_BOOK, payload: book });
    };

    const resetBooks = () => {
        dispatch({ type: ACTIONS.RESET_BOOK });
    };

    const contextValue = useMemo(
        () => ({
            ...state,
            addBook,
            resetBooks,
        }),
        [state, addBook, resetBooks]
    );

    return (
        <BookLibraryContext.Provider value={contextValue}>
            {children}
        </BookLibraryContext.Provider>
    );
};

export const useBookLibrary = () => {
    const context = useContext(BookLibraryContext);

    if (!context)
        throw new Error("useBookLibrary must be used within a BookLibraryProvider");

    return context;
};

export default BookLibraryProvider;