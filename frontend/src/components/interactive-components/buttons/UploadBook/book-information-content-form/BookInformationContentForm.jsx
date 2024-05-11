import {useEffect, useRef, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import InputFormBox from "../../../input-box/input-form-box/InputFormBox.jsx";
import {nameNotValidation} from "../../../input-box/utils/input-validation-type.js";
import ImgContextLoader from "../../../img-context-loader/ImgContextLoader.jsx";
import "../../../input-box/input-form-layout.scss";
import SVG from "../../../../../svg-env.js";
import "./BookInformationContentForm.scss";
import {BookDetails} from "../../../book-tiles/book-tile-card/BookTileCard.jsx";
import BookGenres from "../../../../../objects/genres.jsx";
import ageRestriction from "../../../../../objects/ageRestriction.jsx";

const BookInformationContentForm = ({
                                        title,
                                        image,
                                        genres = [],
                                        book = {},

                                        setImage = {},
                                        setGenres = () => {
                                        },
                                        setBook = () => {
                                        },
                                        handleNext = () => {
                                        },
                                    }) => {
    const [selectedAgeRestriction, setSelectedAgeRestriction] = useState(book.ageRestriction || 6)
    const descriptionContentWrapper = useRef(null);
    const formWrapper = useRef(null);

    const methods = useForm({mode: "onChange"});
    const {handleSubmit, setValue} = methods;

    const [viewDescription, setViewDescription] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState(genres);

    const [loading, setLoading] = useState(false);
    const [submitBtnWasSubmit, setSubmitBtnWasSubmit] = useState(false);

    useEffect(() => {
        console.log(book);
        setValue("title", book?.title);
        setValue("author", book?.author);
        setValue("publisher", book?.publisher);
    }, [book]);

    const toggleGenre = (genre) => {
        setSelectedGenres((prevSelected) => {
            const isSelected = prevSelected.some((selectedGenre) => selectedGenre.key === genre.key);
            if (isSelected) {
                return prevSelected.filter((selectedGenre) => selectedGenre.key !== genre.key);
            }
            if (prevSelected.length < 5) {
                return [...prevSelected, {key: genre.key, title: genre.title}];
            }
            return prevSelected;
        });
    };

    const bookName = nameNotValidation("Назва Книги", "title");
    const author = nameNotValidation("Автор", "author");
    const publisher = nameNotValidation("Видавник", "publisher");

    const onSubmit = handleSubmit((data) => {
        setLoading(true);
        const title = data["title"] || book?.title;
        const author = data["author"] || book?.author;
        const publisher = data["publisher"] || book?.publisher;
        console.log(title, author, publisher);
        setBook((prev) => {
            return {
                ...prev,
                ...data,
                ageRestriction: selectedAgeRestriction,
            };
        });
        setGenres(selectedGenres);
        handleNext();
        setLoading(false);
    });

    useEffect(() => {
        if (viewDescription && descriptionContentWrapper) {
            const {top} = descriptionContentWrapper.current.getBoundingClientRect();
            const topOffset = formWrapper.current.getBoundingClientRect().top;

            formWrapper?.current.scrollTo({
                top: top - topOffset - 15,
                behavior: "smooth",
            });
        }
    }, [viewDescription]);

    return (
        <>
            <div className="form-label-wrapper">
                <p className="p-graph-24 form-label">{title}</p>
            </div>
            <FormProvider {...methods}>
                <div className="upper-form-section scroll-wrapper --angle-scroll-body" ref={formWrapper}>
                    <section className="form-upper-section-wrapper">
                        <ImgContextLoader
                            svgNamePlaceHolder={"book"}
                            className="book"
                            image={image}
                            fileSetter={setImage}
                        />
                        <div className="col-fields-wrapper">
                            <InputFormBox {...bookName} submitBtnWasSubmit={submitBtnWasSubmit} value_={book?.title}/>
                            <div className="two-fields-wrapper">
                                <InputFormBox
                                    {...author}
                                    submitBtnWasSubmit={submitBtnWasSubmit}
                                    value_={book?.author}
                                />
                                <InputFormBox
                                    {...publisher}
                                    submitBtnWasSubmit={submitBtnWasSubmit}
                                    value_={book?.publisher}
                                />
                            </div>
                            <p className="p-graph-24">
                                Оберіть жанри книги. Залишилось: <b>{5 - selectedGenres.length}</b>
                            </p>
                            <ul className="book-genre-list scroll-wrapper">
                                {BookGenres.map((genre) => {
                                    const isSelected = selectedGenres.some(
                                        (selectedGenre) => selectedGenre.key === genre.key,
                                    );
                                    return (
                                        <li
                                            className={`genre-title ${isSelected ? "--selected" : ""}`}
                                            key={genre.key}
                                            onClick={() => toggleGenre(genre)}
                                        >
                                            <p className="p-graph-16 --title-type">{genre.title}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="bottom-section-wrapper">
                                <p className="p-graph-24">
                                    Вікова категорія
                                </p>
                                <ul className="age-list">

                                    {ageRestriction.map((ageReg, key) => {
                                        return (
                                            <li className="" key={key} onClick={() => setSelectedAgeRestriction(ageReg.key)}>
                                                <p className={`p-graph p-graph-16 box-tag ${ageReg.key === selectedAgeRestriction ? "--selected" : ""}`}>
                                                    {ageReg.title}
                                                </p>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                        </div>
                    </section>

                    <BookDetails
                        descriptionContentWrapper={descriptionContentWrapper}
                        viewDescription={viewDescription}
                        setViewDescription={setViewDescription}
                        description={book?.description}
                    />
                </div>

                <div className="btn-content-wrapper bottom-form-section" style={{justifyContent: "flex-end"}}>
                    <button
                        type="submit"
                        className="btn --primary"
                        onClick={() => {
                            onSubmit();
                            setSubmitBtnWasSubmit(true);
                        }}
                    >
                        <p className="p-graph-24 --white">
                            <b>Далі</b>
                        </p>
                        <svg viewBox="0 0 30 30" width={30} height={30}>
                            <path d={SVG.nextBtn}/>
                        </svg>
                    </button>
                </div>
            </FormProvider>
        </>
    );
};
export default BookInformationContentForm;
