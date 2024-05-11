import React, { useEffect, useState } from "react";
import "./LibraryPage.scss";
import SVG from "../../../svg-env";
import BookSliderBox from "./book-slider-box/BookSliderBox";
import BookTileGridBox from "./book-tile-grid-box/BookTileGridBox";
import UploadBookBtn from "../../interactive-components/buttons/UploadBook/UploadBookBtn";
import { useSearchParams } from "react-router-dom";
import Overlay from "../../modal-popup/overlay/Overlay";
import ModalContextMenu from "../../modal-popup/context-menu/ModalContextMenu";
import BilingualBookReader from "../../modal-popup/bilingual-book-reader/BilingualBookReader";
import { SideBarWrapper } from "../../navigation/side-bar/NavigationSideBar.jsx";
import FilterProvider from "../../../store/bookFiltrationProvider.jsx";

const LibraryPage = () => {
  const recentlyReadBooksMock = [
    {
      id: 10,
      title: "Sold on a Monday: A Novel",
      progress: 12,
      numberOfPages: 200,
      author: "Kristina McMorris",
      image: "https://m.media-amazon.com/images/I/81mtWNtW+QL._SY425_.jpg",
      genres: [{ key: "triller", title: "Тріллер" }],
      description:
        "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget lorem id ex eleifend luctus. Quisque auctor consequat tempor. Cras quis sem ut nisl convallis pretium vitae et dui. Sed facilisis quam risus, a malesuada nibh pretium in. Quisque ornare, lectus et volutpat ullamcorper, libero tortor auctor nunc, aliquam faucibus ante lorem non justo. Pellentesque sit amet purus quis mi posuere facilisis. Pellentesque vitae est vitae justo accumsan dictum in non turpis. Integer vulputate vitae quam et congue. Morbi sed tortor ac leo imperdiet facilisis at sed eros. Suspendisse non ullamcorper libero, at fermentum dui. In faucibus et arcu quis rutrum. Morbi metus quam, ullamcorper nec nisl sit amet, pretium pulvinar ex. Vestibulum maximus elit ut mauris fringilla cursus. Vestibulum a tempus ligula, vitae rutrum tellus.\n" +
        "\n" +
        "Pellentesque malesuada odio lacus, id tincidunt ipsum pretium eget. Sed euismod pellentesque nulla, ac sollicitudin eros. Nulla facilisi. Aenean ultrices diam sed diam tempor laoreet. Aenean laoreet tempor turpis ac semper. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi nec dictum nisi. Sed auctor tempus sodales. Etiam ultricies non leo porttitor condimentum. Nam finibus condimentum augue at iaculis. Etiam sollicitudin a nisi in mollis. Donec sed purus accumsan, malesuada sem a, auctor purus. Vivamus convallis molestie nibh, non pharetra arcu sollicitudin id. Proin non metus dui. Nam vel erat vitae lectus bibendum congue in id nulla. Fusce felis risus, vehicula vitae massa eleifend, consequat convallis leo.\n" +
        "\n" +
        "Aenean ultrices imperdiet mi, sit amet euismod tortor egestas eu. In sed tristique enim. Fusce sagittis fermentum diam id aliquam. Praesent auctor ex at dolor condimentum viverra. Praesent dictum magna commodo turpis faucibus pretium. Etiam nisi enim, convallis a rutrum et, finibus eu mi. Aliquam erat volutpat. Nam ullamcorper est orci, non efficitur lectus fermentum id. Donec ut purus tristique, fringilla nisl at, pretium ex. Duis et elit neque. Praesent elit felis, facilisis mattis feugiat a, volutpat eu erat.\n" +
        "\n" +
        "Integer ultricies enim mattis iaculis tincidunt. In finibus, enim ac ullamcorper luctus, purus est accumsan tellus, in gravida dui orci eget massa. Donec tortor ex, eleifend vitae dapibus non, fermentum nec massa. Nullam sit amet nunc suscipit, congue urna at, vehicula nulla. Nullam ac diam ornare metus vehicula bibendum. Integer malesuada rhoncus dui, eu cursus metus suscipit quis. Nam ligula mauris, ultricies ut convallis quis, sollicitudin id mi. Nullam sem lacus, faucibus vitae molestie fermentum, varius a velit. Sed sit amet turpis blandit, tristique odio et, egestas eros. Nulla blandit vulputate ullamcorper. Sed quis viverra lectus, in blandit turpis. Aenean quis massa eget magna rutrum hendrerit.\n" +
        "\n" +
        "Maecenas posuere urna ac quam vehicula fermentum. Nunc arcu ligula, scelerisque sed nunc placerat, facilisis laoreet mi. Praesent et ante eget enim posuere elementum non id tortor. Donec ex enim, vehicula eu venenatis ut, posuere sed neque. Mauris quis felis commodo est laoreet placerat. Nulla facilisi. Quisque sed semper ex, sit amet suscipit odio. Nam ac ipsum vitae ex vehicula molestie. Nam bibendum libero nisi, ut lobortis diam venenatis scelerisque.\n" +
        "\n" +
        "Aliquam in egestas justo. Sed pellentesque ornare lectus, non volutpat massa cursus non. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas at lacinia quam. Quisque at velit blandit dolor vestibulum dictum sit amet sed odio. Morbi eget leo mattis, pretium sapien vel, feugiat ex. Proin tincidunt diam nec justo maximus, sed cursus felis molestie. Curabitur imperdiet dui vitae aliquet mattis. Cras ut velit nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris velit orci, varius eu suscipit sit amet, imperdiet sed sapien. Cras elementum vestibulum enim feugiat tempus. Morbi id ornare arcu, sit amet posuere tellus. Ut eget ornare sapien. Praesent vel lacinia magna, vel mattis ipsum.</p>",
    },
    {
      id: 10,
      title: "The Seven Husbands of Evelyn Hugo: A Novel",
      progress: 22,
      numberOfPages: 320,
      author: "Taylor Jenkins Reid",
      image: "https://m.media-amazon.com/images/I/71KcUgYanhL._SY385_.jpg",
    },
    {
      id: 10,
      title: "The Reckoning: A Novel",
      progress: 12,
      numberOfPages: 200,
      author: "John Grisham",
      publisher: "Random House Audio",
      image: "https://m.media-amazon.com/images/I/61IxKNg3FUL.jpg",
    },
    {
      id: 10,
      title:
        "Killers of the Flower Moon: The Osage Murders and the Birth of the FBI",
      progress: 22,
      numberOfPages: 320,
      author: "David Grann",
      publisher: "Random House Audio",
      image: "https://m.media-amazon.com/images/I/51GHu5DUSgL.jpg",
    },
    {
      id: 10,
      title:
        "The World of IT: The Official Behind-the-Scenes Companion to IT and IT CHAPTER TWO",
      progress: 89,
      numberOfPages: 65,
      author: "Ms. Alyse Wax",
      image: "https://m.media-amazon.com/images/I/71Mimvs10KL._SY466_.jpg",
    },
    {
      id: 10,
      title: "Fairy Tale",
      progress: 89,
      numberOfPages: 65,
      author: "Ms. Alyse Wax",
      image: "https://m.media-amazon.com/images/I/51ctosFnFiL.jpg",
    },
  ];
  const booksMock = recentlyReadBooksMock;

  const [searchParams, setSearchParams] = useSearchParams();
  const [modalReader, setModalReader] = useState(false);
  const [books, setBooks] = useState([]);
  const [recentlyReadBooks, setRecentlyReadBooks] = useState([]);
  const book_id = searchParams.get("book_id");

  useEffect(() => {
    if (book_id) {
      setModalReader(true);
    }
  }, [book_id]);

  useEffect(() => {
    if (!modalReader && book_id) {
      setSearchParams();
    }
  }, [modalReader]);

  return (
    <FilterProvider>
      <div className="library-flex-wrapper">
        {recentlyReadBooks.length > 0 && (
          <BookSliderBox
            title="Продовжити читати"
            svg={SVG.inRecentTime}
            books={recentlyReadBooks}
          />
        )}
        {books.length > 0 ? (
          <BookTileGridBox
            title="Бібліотека"
            svg={SVG.book}
            books={books}
            placeholder={"Книги не знайдені"}
          />
        ) : (
          <div className="main-page page-wrapper">
            <div className="books-placeholder">
              <header className="header-placeholder">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 30 30" width={30} height={30}>
                    <path d={SVG.library} />
                  </svg>
                </div>
                <p className="p-graph-28">
                  Поповніть свою бібліотеку новою книжкою
                </p>
              </header>

              <UploadBookBtn title="Завантажити" classNames="primary-btn" />
            </div>
          </div>
        )}
        <Overlay
          isOpen={modalReader}
          getStateModalDialog={setModalReader}
          closeOnEsc
          animate
          style={{
            width: "max(70rem, calc(65vw - var(--width-side-nav-bar)))",
            minWidth: "1280px",
            height: "100vh",
            borderRadius: "0px",
            padding: "1rem 1.75rem",
          }}
        >
          <ModalContextMenu className="max-height">
            <BilingualBookReader />
          </ModalContextMenu>
        </Overlay>
      </div>
    </FilterProvider>
  );
};

export default LibraryPage;
