import { from, catchError, switchMap, finalize } from "rxjs";
import axios from "axios";
import { getBookById, getBooksAll, uploadFile } from "../api/services";

//TODO: connect and test whole book service

const BookService = () => {
  const handleUpload = (data, setSuccess, setError, setIsLoading) => {
    from(uploadFile(data))
      .pipe(
        switchMap((response) => {
          const { message, bookId } = response.data;
          setSuccess(message);

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  const handleGetById = (id, setBook, setError, setIsLoading) => {
    from(getBookById(id))
      .pipe(
        switchMap((response) => {
          const book = response.data;
          console.log("getBookById -  ", id, ":", book);

          setBook({
            title: book.title,
            progress: book.progressPages,
            numberOfPages: book.totalPages, //no idea why need duplicate also here
            author: book.author,
            image: book.image,
          });

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  const handleGetAll = (setError, setIsLoading) => {
    from(getBooksAll())
      .pipe(
        switchMap((response) => {
          const { book_ids } = response.data;

          //TODO: store in book library

          // setBook({
          //   user: {
          //     ...rest,
          //     firstName,
          //     lastName,
          //   },
          // });

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  return {
    handleUpload,
    handleGetById,
    handleGetAll,
  };
};

export default BookService;
