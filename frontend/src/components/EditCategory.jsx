import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../../models/data"; // assuming your data is located here

const EditCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [textAreaWords, setTextAreaWords] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory) {
      setTextAreaWords(selectedCategory.words.join(", "));
    }
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    const category = categories.find(
      (cat) => cat.id === parseInt(event.target.value)
    );
    setSelectedCategory(category);
  };

  const handleTextAreaChange = (event) => {
    setTextAreaWords(event.target.value);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const saveChanges = () => {
    const words = textAreaWords.split(",").map((word) => word.trim());
    const uniqueWords = [...new Set(words)]
      .filter((word) => word !== "")
      .map((word) => capitalizeFirstLetter(word)); // Capitalize first letter here

    // Here, send the updated words to your backend to update the category.
    console.log({
      ...selectedCategory,
      words: uniqueWords,
    });

    // Consider refreshing your category data after saving changes
  };

  const deleteCategory = () => {
    // Send a request to your backend to delete the selected category.
    console.log(`Deleting category: ${selectedCategory.name}`);

    setSelectedCategory(null);
    setTextAreaWords("");
  };

  const navigateToMainScreen = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Category</h2>
      <select
        onChange={handleCategoryChange}
        value={selectedCategory ? selectedCategory.id : ""}
      >
        <option value="">--Select Category--</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <>
          <h3>Words:</h3>
          <textarea
            rows="5"
            cols="50"
            value={textAreaWords}
            onChange={handleTextAreaChange}
          />
          <button onClick={saveChanges}>Save Changes</button>
          <button onClick={deleteCategory}>Delete Category</button>
        </>
      )}
      <button onClick={navigateToMainScreen}>Back to Main Screen</button>
    </div>
  );
};

export default EditCategory;
