import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryContext from "./CategoryContext";

const MainScreen = () => {
  const [categories, setCategories] = useState([]);
  const categoryContext = React.useContext(CategoryContext);

  useEffect(() => {
    // This function fetches the categories from the server
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories);
        categoryContext.allCategories = data.categories;
        console.log(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // The empty array means this useEffect will run once when the component mounts

  return (
    <div>
      <h1>Welcome to the Game</h1>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <Link to={`/game${category._id}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/add-category">Add Category</Link>
      <Link to="/edit-category">Edit Category</Link>
    </div>
  );
};

export default MainScreen;