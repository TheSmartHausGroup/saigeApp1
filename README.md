sAIge is an intelligent virtual assistant Chat Application. 
This chat application provides real-time messaging capabilities, supporting both text and audio messages, and allows users to email conversation transcripts. Built with React, AWS Amplify, and integrated with AWS services like Lambda, S3, and Cognito, it offers a seamless chat experience with robust backend infrastructure.

Features
User Authentication: Secure signup and login using AWS Cognito.
Real-Time Messaging: Send and receive text messages in real-time.
Audio Messaging: Record and send audio messages.
Email Transcripts: Compile and email conversation transcripts with a single click.
Getting Started
Prerequisites
Node.js and npm installed.
AWS Account and AWS CLI configured.
Amplify CLI installed (npm install -g @aws-amplify/cli).
Installation
Clone the repository

bash
Copy code
git clone https://your-repository-url.git
cd your-project-directory
Install dependencies

bash
Copy code
npm install
Initialize Amplify

bash
Copy code
amplify init
Add Authentication

bash
Copy code
amplify add auth
Follow the prompts to configure authentication as required.

Add APIs

You will add three APIs for handling text messages, audio messages, and emailing transcripts. Repeat the following steps for each API, customizing as needed:

bash
Copy code
amplify add api
Choose "REST" and configure each API according to its purpose (sending text messages, sending audio chunks, emailing content).

Push Amplify Configurations to AWS

bash
Copy code
amplify push
Confirm the deployments when prompted.

Running the Application
Start the development server:

bash
Copy code
npm start
The application should now be running and accessible at http://localhost:3000.

Architecture Overview
Frontend: React application scaffolded with Create React App.
Authentication: Managed by AWS Cognito.
Backend APIs: Three REST APIs created with AWS Amplify, each targeting a specific Lambda function for processing text messages, audio messages, and emails.
Storage: Amazon S3 for storing audio files and DynamoDB for message logs.
Real-Time Data: AWS AppSync or Amplify DataStore for managing real-time message updates.
Contributing
We welcome contributions! Please open an issue or submit a pull request for any improvements or features you'd like to add.

License
Distributed under the MIT License. See LICENSE for more information.






# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
