import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryContext from "./CategoryContext";

const MainScreen = () => {
  const { categories, setCategories } = React.useContext(CategoryContext); // Use the setCategories from the context

  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") {
        alert("Permission not granted to access device orientation");
      }
    }
  };

  useEffect(() => {
    requestOrientationPermission();
  }, []);

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
        console.log(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // The empty array means this useEffect will run once when the component mounts

  return (
    <div className="mainScreenSection">
      <h1 className="gameTitle">What Dat?</h1>
      <ul className="categories">
        {categories.map((category) => (
          <li className="categoryOption" key={category._id}>
            <Link className="categoryLink" to={`/game/${category._id}`}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link className="addCategory" to="/add-category">
        Add Category
      </Link>
      <Link className="editCategory" to="/edit-category">
        Edit Category
      </Link>
      {/* <button onClick={requestOrientationPermission}>
        Enable Tilt Functionality
      </button> */}
    </div>
  );
};

export default MainScreen;
