# Phishing URL Detector 🎣

This project combines a high-accuracy machine learning model with a modern web interface to detect phishing URLs. The model, built with CatBoost, analyzes 54 different features to classify a URL as either "Legitimate" or "Phishing".

### **[Live Demo on Vercel](https://phishing-url-detector-neon.vercel.app/)** 



## Project Overview

This repository contains two main components:

1.  **Machine Learning Model** (`final.ipynb`): A Jupyter Notebook detailing the end-to-end process of training a `CatBoostClassifier` on the PhiUSIIL Phishing URL Dataset. The model achieves **99.98% accuracy** on the test set.
2.  **React Web Application** (the deployed site): A user-friendly interface built with React and Tailwind CSS to demonstrate the model's capabilities in a simulated environment.

##  Web App Features

* **URL Analysis**: Enter any URL to get an instant (simulated) prediction.
* **Interactive Results**: View the result as "Phishing" or "Legitimate" with clear probability scores.
* **Feature Breakdown**: See a breakdown of the key features that influenced the model's decision.
* **Responsive Design**: The application is fully responsive and works on both desktop and mobile devices.
  
## Tech Stack

* **Machine Learning**: Python, Pandas, Scikit-learn, CatBoost, Jupyter Notebook
* **Frontend**: React, Tailwind CSS
* **Deployment**: Vercel

##  How to Run Locally

To run the web application on your own machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Harshityadav802/Implement-phishing-URL-detection-application.git](https://github.com/Harshityadav802/Phishing-URL-Detector.git)
    cd Phishing-URL-detector
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3000`.

## Machine Learning Model Details

The core of this project is the CatBoost model trained to identify phishing links.

* **Dataset**: [PhiUSIIL Phishing URL Dataset](https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset)
* **Accuracy**: **99.98%**
* **Key Features**: The model found that features like `URLTitleMatchScore`, `NoOfExternalRef`, and `SpacialCharRatioInURL` were highly predictive.

For a complete breakdown of the data preprocessing, training, and evaluation, please see the [**`final.ipynb`**](https://github.com/Harshityadav802/Phishing-URL-detector/blob/main/final.ipynb) notebook in this repository.

* **Accuracy**: **99.98%**
* **Key Features**: The model found that features like `URLTitleMatchScore`, `NoOfExternalRef`, and `SpacialCharRatioInURL` were highly predictive.

For a complete breakdown of the data preprocessing, training, and evaluation, please see the [**`final.ipynb`**](https://github.com/Harshityadav802/Phishing-URL-detector/blob/main/final.ipynb) notebook in this repository.

