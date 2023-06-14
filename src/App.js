import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "./App.css"


  const firebaseConfig = {
    apiKey: "AIzaSyBx6sxpRKcPYUv5eBJpSl2-p-5qMi531Ag",
    authDomain: "libgen-9b373.firebaseapp.com",
    projectId: "libgen-9b373",
    storageBucket: "libgen-9b373.appspot.com",
    messagingSenderId: "35075285557",
    appId: "1:35075285557:web:299ee8a92715630ecc477c",
    measurementId: "G-Q0RDYZG68K"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const App = () => {
  const [searchInput, setSearchInput] = useState("");
  const [books, setBooks] = useState([]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const searchBooks = async (event) => {
    event.preventDefault();

    const searchQuery =
      searchInput; // Convert search input to lowercase
    
    const query = db
      .collection("books")
      .where("book", ">=", searchQuery)
      .where("book", "<=", searchQuery + "\uf8ff");
    const snapshot = await query.get();

    const bookList = [];
    snapshot.forEach((doc) => {
      const book = doc.data();
      bookList.push(book);
    });

    
    const authorQuery = db
      .collection("books")
      .where("author", ">=", searchQuery)
      .where("author", "<=", searchQuery + "\uf8ff");
    const authorSnapshot = await authorQuery.get();

    authorSnapshot.forEach((doc) => {
      const book = doc.data();
      bookList.push(book);
    });

    setBooks(bookList);
  };

  useEffect(() => {
    const unsubscribe = db.collection("books").onSnapshot((snapshot) => {
      const bookList = [];

      snapshot.forEach((doc) => {
        const book = doc.data();
        bookList.push(book);
      });

      setBooks(bookList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
    
  <div>
  
    <div className="Box" >
    <h1>Welcome to Libgen</h1>
      <form className="form" onSubmit={searchBooks}>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Search by book name or author name"
        />
        <button type="submit">Search</button>
      </form>
<h1>Books</h1>
      <div className="books">
        {books.map((book) => (
          <div key={book.id} style={{ marginBottom: "20px" }}>
            <div className="book">
              <p>Book Name: {book.book}</p> <br />
              <p>Author Name:  {book.author} </p><br />
            
              <div>
              <strong>Stock:</strong>{" "}
              {book.stock === 0 ?<span className="notInStock">Not In Stock</span> :<span className="inStock">{book.stock}</span>}
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default App;