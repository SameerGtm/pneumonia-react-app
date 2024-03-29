import React, { useState } from "react";
import "./PneumoniaDetection.css";
import { ColorRing } from "react-loader-spinner";

const PneumoniaDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Set the selected image here
    }
  };

  const handleDetectButtonClick = async () => {
    setPrediction(null);
    if (selectedImage) {
      // Create a FormData object to send the image to the Django API
      const formData = new FormData();
      formData.append("image", selectedImage);
      setIsLoading(true);
      try {
        // Make an API call to your Django server
        const response = await fetch("http://127.0.0.1:8000/api/predict/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction); // Assuming the API returns a prediction
        } else {
          console.error("Error predicting pneumonia.");
        }
      } catch (error) {
        console.error("Error communicating with the server:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pneumonia-app">
      <h1 className="app-title">Pneumonia Detection App</h1>
      <div className="image-container">
        <input
          type="file"
          accept="image/*"
          className="image-upload"
          onChange={handleImageUpload}
        />
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="selected-image"
          />
        )}
      </div>
      <button className="detect-button" onClick={handleDetectButtonClick}>
        Detect
      </button>
      {isLoading && (
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      )}
      {prediction !== null && (
        <p
          className={`prediction-text ${
            prediction === 0 ? "pneumonia" : "normal"
          }`}
        >
          {prediction === 0 ? "Pneumonia" : "Normal"}
        </p>
      )}
    </div>
  );
};

export default PneumoniaDetection;
