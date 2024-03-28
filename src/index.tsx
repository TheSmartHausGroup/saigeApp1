import React from 'react'; // Imports the React library to enable JSX syntax and use React components.
import ReactDOM from 'react-dom/client'; // Imports the ReactDOM package's client object for rendering React components to the DOM.
import './index.css'; // Imports the main CSS stylesheet for global styles across the app.
import App from './App'; // Imports the App component, the root component that includes other components of the app.
import reportWebVitals from './reportWebVitals'; // Imports the reportWebVitals function for measuring and analyzing the performance of the app.

// Creates a root DOM element where the React app will be mounted. It selects the 'root' div from the index.html file as the base for the React components.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); 

// Renders the App component within the <React.StrictMode> wrapper to the root DOM element. React.StrictMode is a tool for highlighting potential problems in an application.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optionally, you can measure performance in your app by passing a function to report results, such as `console.log`, or send to an analytics endpoint. More information is available at https://bit.ly/CRA-vitals.
reportWebVitals();
