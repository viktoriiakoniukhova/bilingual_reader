import { useSearchParams } from "react-router-dom";
import SVG from "../../../svg-env";
import BookTileGridBox from "../library/book-tile-grid-box/BookTileGridBox";

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const searchRequest = searchParams.get("search");
	return (
		<div className="library-flex-wrapper">
			<BookTileGridBox title="Результат пошуку" svg={SVG.search} books={[]} 
            placeholder={`Нічого не знайдено за запитом ${searchRequest}`}/>
		</div>
	);
};

export default SearchResultPage;
