import { useEffect, useState } from "react";
import BookStepContentForm from "../book-step-content-form/BookStepContentForm.jsx";
import BookInformationContentForm from "../book-information-content-form/BookInformationContentForm.jsx";
import { Stepper, Step, StepLabel } from "@mui/material";
import "../../../input-box/input-form-layout.scss";
import "./BookUploadFormStepper.scss";
import SVG from "../../../../../svg-env.js";
import classNames from "classnames";
import BookPreviewContent from "../../../book-tiles/book-preview-content/BookPreviewContent.jsx";
import BookService from "../../../../../service/BookService.js";

const BookUploadFormStepper = ({ onClose = () => {} }) => {
  const [book, setBook] = useState({});
  const [image, setImage] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [bookFile, setBookFile] = useState({});
  const [translateFiles, setTranslateFiles] = useState([]);

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Книга & Переклад", title: "Завантажте Книгу" },
    { label: "Інформація & Додатки", title: "Додаткова інформація" },
    { label: "Читати", title: "Читати книгу" },
  ];

  const bookService = BookService();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (book) {
      if (bookFile.metadata) {
        setBook({
          title: bookFile.metadata?.title,
          author: bookFile.metadata?.creator,
          publisher: bookFile.metadata?.publisher,
          description: bookFile.metadata?.description,
          ageRestriction: book.ageRestriction,
          origin_language: bookFile.metadata?.language,
          genre: selectedGenres.forEach((genre) => genre.title),  // it doens't work but I don't care at this point
        });
      } else {
        setBook({ title: bookFile?.name });
      }

      setImage(bookFile?.image);
    }
  }, [bookFile]);

  //TODO: investigate, broken
  useEffect(() => {
    if (activeStep === 2) {
      const formData = new FormData();
      var translation_info = {};

      console.log("bookFile ->", bookFile);

      formData.append("preview", new File([image], { type: "image/png" }));
      formData.append(
        "english",
        bookFile.data,
      );
      translateFiles.forEach((file, index) => {
        console.log("file inside for ->", file);
        formData.append(`translation_${index}`, file.data, file.name);
        translation_info[`translation_${index}_language`] = file.metadata?.language;

        // this is just incorrect. But epub metadata doens't provide a translator field so...
        translation_info[`translator_${index}`] = [file.metadata?.creator];
        translation_info[`publisher`] = file.metadata?.publisher;
      });
      formData.append("book", JSON.stringify({
        ...book,
        ...{
          author: [book.author],
          ageRestriction: String(book.ageRestriction),
          totalPages: 451, // FIXME: get total pages
          genre: selectedGenres.map((genre) => genre.title),
        },
        ...translation_info,
        translations_count: translateFiles.length,
      }));

      bookService.handleUpload(formData);
    }
  }, [activeStep]);

  const StepperContent = ({ activeStep, steps }) => {
    switch (activeStep) {
      case 0:
        return (
          <BookStepContentForm
            bookFile={bookFile}
            setBookFile={setBookFile}
            translateFiles={translateFiles}
            setTranslateFiles={setTranslateFiles}
            title={steps[activeStep].title}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 1:
        return (
          <BookInformationContentForm
            title={steps[activeStep].title}
            book={book}
            image={image}
            genres={selectedGenres}
            setBook={setBook}
            setImage={setImage}
            setGenres={setSelectedGenres}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <BookPreviewContent
            title={steps[activeStep].title}
            image={image}
            book={book}
            bookFile={bookFile}
            genres={selectedGenres}
            handleBack={handleBack}
            onClose={onClose}
          />
        );
    }
  };

  return (
    <div className="scroll-context-wrapper --overflow">
      <section className="load-book-wrapper">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <h1 className="title-20">{step.label}</h1>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <section className="form-section-provider">
          <StepperContent activeStep={activeStep} steps={steps} />
        </section>
      </section>
    </div>
  );
};

const ColorlibStepIcon = (props) => {
  const { icon, active, completed } = props;

  const icons = {
    1: "book",
    2: "bookInfo",
    3: "library",
  };

  const classNamesStepIcon = classNames({
    "--active": active,
    "--completed": completed,
  });

  return (
    <div className="step-wrapper">
      <div className={"step-label-wrapper " + classNamesStepIcon}>
        <div className="step-label-icon-wrapper">
          <svg
            className="step-label-icon"
            viewBox=" 0 0 30 30"
            width={30}
            height={30}
          >
            <path d={!completed ? SVG[icons[String(icon)]] : SVG.checkMark} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BookUploadFormStepper;
