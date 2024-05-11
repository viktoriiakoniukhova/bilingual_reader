import {createContext, useContext, useMemo, useReducer} from "react";

const FilterContext = createContext();

const ACTIONS = {
    ADD_GENRE: 'add-genre',
    REMOVE_GENRE: 'remove-genre',
    ADD_AGE_RESTRICTION: 'add-age-restriction',
    REMOVE_AGE_RESTRICTION: 'remove-age-restriction',
    CLEAR_FILTERS: 'clear-filters'
};

const initialState = {
    filterApplied: false,
    genres: [],
    age_restrictions: [],
};
const filterReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.ADD_GENRE:
            return {...state, genres: [...state.genres, action.payload], filterApplied: true};
        case ACTIONS.REMOVE_GENRE:
            const newGenres = state.genres.filter(key => key !== action.payload);
            return {
                ...state,
                genres: newGenres,
                filterApplied: newGenres.length > 0 || state.age_restrictions.length > 0
            };
        case ACTIONS.ADD_AGE_RESTRICTION:
            return {...state, age_restrictions: [...state.age_restrictions, action.payload]};
        case ACTIONS.REMOVE_AGE_RESTRICTION:
            const newAgeRestrictions = state.age_restrictions.filter(key => key !== action.payload);
            return {
                ...state,
                age_restrictions: newAgeRestrictions,
                filterApplied: newAgeRestrictions.length > 0 || state.genres.length > 0
            };
        case ACTIONS.CLEAR_FILTERS:
            return {...state, genres: [], age_restrictions: [], filterApplied: false};
        default:
            return state;
    }
};

const FilterProvider = ({children}) => {
    const [state, dispatch] = useReducer(filterReducer, initialState);

    const addGenre = key => dispatch({type: ACTIONS.ADD_GENRE, payload: key});
    const removeGenre = key => dispatch({type: ACTIONS.REMOVE_GENRE, payload: key});
    const addAgeRestriction = key => dispatch({type: ACTIONS.ADD_AGE_RESTRICTION, payload: key});
    const removeAgeRestriction = key => dispatch({
        type: ACTIONS.REMOVE_AGE_RESTRICTION,
        payload: key
    });
    const clearFilters = () => dispatch({type: ACTIONS.CLEAR_FILTERS}); // Function to clear all filters

    const contextValue = useMemo(
        () => ({
            ...state,
            addGenre,
            removeGenre,
            addAgeRestriction,
            removeAgeRestriction,
            clearFilters
        }),
        [state]
    );

    return (
        <FilterContext.Provider value={contextValue}>
            {children}
        </FilterContext.Provider>
    );
};

export const useBookFilter = () => {
    const context = useContext(FilterContext);

    if (!context) throw new Error("useBookFilter must be used within an FilterContext");

    return context;
};

export default FilterProvider;