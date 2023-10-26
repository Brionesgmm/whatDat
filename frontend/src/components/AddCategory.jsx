import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigation

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [textAreaWords, setTextAreaWords] = useState(""); // This will hold the entire text
  const navigate = useNavigate(); // This will allow us to navigate between screens

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleTextAreaChange = (event) => {
    setTextAreaWords(event.target.value);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const submitCategory = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const words = textAreaWords
      .split(",")
      .map((word) => word.trim())
      .map((word) => capitalizeFirstLetter(word));

    const uniqueWords = [...new Set(words)].filter((word) => word !== "");

    const newCategory = capitalizeFirstLetter(categoryName);
    console.log(uniqueWords, newCategory);
    // Make the API call
    const response = await fetch("/api/categories/addcategory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryName: newCategory,
        words: uniqueWords,
      }),
    });

    if (response.ok) {
      console.log("Successfully added the category");
      setCategoryName("");
      setTextAreaWords("");
    } else {
      const data = await response.json();
      console.error("There was an error adding the category:", data.message);
    }
  };

  const navigateToMainScreen = () => {
    navigate("/"); // Navigate to the root route
  };

  return (
    <div>
      <h2>Add a Category</h2>
      <form
        action={`/api/categories/addcategory`}
        encType="multipart/form-data"
        method="POST"
        onSubmit={submitCategory}
      >
        <label>
          Category Name:
          <input
            type="text"
            name="categoryName"
            value={categoryName}
            onChange={handleCategoryNameChange}
          />
        </label>
        <h3>Words:</h3>
        <textarea
          name="textAreaWords"
          rows="5"
          cols="50"
          value={textAreaWords}
          onChange={handleTextAreaChange}
          placeholder="Enter words separated by commas for multiple entries"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={navigateToMainScreen}>Back to Main Screen</button>
    </div>
  );
};

export default AddCategory;
