## Self-Evaluation
The project consists of an Express API connecting to MongoDB Atlas using mongoose. There is authentication and authorization: users must sign up and login in order to be authenticated. Only authenticated users are authorized to update their profile details, make or delete a post, make or delete a comment, create or view conversations, and view or send messages. There are 4 sets of CRUD (Create-Read-Update-Delete) routes in addition to authentication. Those routes are for posts, comments, conversations, and messages. There are a few indexes on the fields for objectIds in the mongoose schemas. There is also a text index on the post schema description field which is required for text search. Using text search, I implement keyword search over the posts descriptions so that users can search for posts containing a certain keyword. The only external API I use is Firebase Storage for storing and retrieving image and video files uploaded by the user. The test coverage report indicates 95% test coverage across all files.

As a result of completing this project, I became familiarized with the MERN (MongoDB, Express.js, ReactJS, Node.js) stack. I was able to deploy a MongoDB database on MongoDB Atlas, access the database using mongoose in order to perform read and write operations from my Express app, deploy the Express app to Railway, call the Express app as an API from my React front-end, and deploy the React front-end to Netlify. Integrating with Firebase Storage worked well, using the documentation I found it easier to work with Firebase Storage than GridFS for file storage. Also I was glad that I was able to implement real-time messaging using Socket.io and Socket.io Client. Although Firebase already supports web sockets through onSnapshot(), I preferred using Socket.io and Socket.io Client since they would enable me to store all the messages in MongoDB along with the other posts, comments, and conversations. I was able to review my React skills (JSX, useState, useEffect, useRef) while building the front-end that allows users to seamlessly interact with the app and performs input validation.

The project could be further improved by implementing Socket.io Rooms. Although I have basic real-time messaging implemented with socket.io in the Express app and socket.io-client in the React app, Socket.io also allows you to define arbitrary channels called "Rooms" that sockets can join and leave. I could re-implement my messaging feature using this Room functionality. Since sockets can join and leave a Room, it can be used to broadcast events to a subset of clients, and thereby implement group messages. Right now my messaging system only allows messages between 2 users. Another feature that could be added is user search Autocomplete within the Inbox that would give the user autocompleted suggestions as they type and search for other users with whom to message. Right now the user has to know and input the username of the other user in order to message them. Autocomplete with Debounce could be implemented using Lodash. One more feature that could be added is Instagram Stories, which are temporary photos/videos that only last for 24-hours. Since the media files in my project are stored in Firebase Storage I could use Firebase Cloud Functions to set up a scheduled function that runs every hour and deletes all stories with timestamps indicating that they are expired. Also there could also be the addition of more CSS styling.

## Proof of Concept
Project is set up with mongoose connection and running express server. Testing is setup with @shelf/jest-mongodb, jest, and supertest. Routes, DAOs, and mongoose schemas are set up for users, posts, and comments. User routes allow for querying user details by userId, signing up a new user, logging in a new user, and changing password. Post routes allow for creating a new post, getting all posts, getting all posts by userId, getting a post by postId, editing a post, and deleting a post. Comment routes allow for creating a new comment, getting all comments by postId, getting a comment by commentId, editing a comment, and deleting a comment. The express app is deployed on Railway. There is also a React front-end deployed on Netlify. The front-end allows interaction with the express server via a basic social media site. Media files are currently stored in Firebase Storage using a ref that is the same as the id of the corresponding object in MongoDB Atlas.

The routes, DAOs, and models for conversations and messages have not been written yet. I am considering whether or not I want to include that portion of the project since it may require Socket.IO for real-time functionality. The posts and comments CRUD routes I have already completed meet the project requirement for 2 sets of CRUD routes (not counting authentication). I also need to write the actual tests in users.test.js, posts.test.js, and comments.tests.js. I have confirmed that connectDB, stopDB, and clearDB from test-utils.js are working as expected. I have indexes in my post and comment schemas but still need to set up one of text search, aggregations, or lookups. I may implement text search by creating a feature in which you can search for users by username, or search for posts containing a certain keyword in its description. While the current front-end allows you to create a new user, login, post, and comment, I still need to setup the front-end to allow for post and comment editing and deletion for logged in users. I also need to create an admin user that will be authorized to delete any post or comment.

Update: The routes for conversations and messages are complete with real-time functionality using socket.io in the express server and socket.io-client in the react app. Still working to set up individual conversation pages.

## Proposal and Task Breakdown
### Your Final Project proposal is due. You should submit a link to a GitHub project that will house your submission. The project README should contain your project proposal. Your proposal should include:

#### 1. A description of the scenario your project is operating in.
My project will be an Instagram clone that enables users to create a profile where they can share pictures and videos with other users. There will also be the ability for users to comment on other users posts or exchange messages with each other. Although anyone will be able to view the site and its contents, only users who are logged in will be able to generate content. Each user will have a list of friends and users will only be able to comment on the posts of other users on their friends list. Users will only be able to message with other users on their friends list.

#### 2. A description of what problem your project seeks to solve.
Instagram is a very popular social media site. This site would function as an Instagram competitor. The site will enable people to socialize with others in an open safe space. In the future, users may use the site to promote products for other users to see. There may be the option for some form of in-game currency which users can accumulate.

#### 3. A description of what the technical components of your project will be, including: the routes, the data models, any external data sources you'll use, etc.
##### Routes:
###### Users:
        - signup
        - login
        - change password
###### Posts:
        - new post
        - edit post
        - delete post
        - get all posts by user
###### Comments:
        - add comment
        - edit comment
        - delete comment
        - get all comments by post
###### Conversations:
        - start new conversation
        - delete conversation
###### Messages:
        - send message
        - get all messages by conversation

##### Data Models:
###### Users:
        - username
        - email
        - password
##### Posts:
        - username
        - description
        - media id
##### Comments:
        - username
        - description
        - post id
##### Conversations:
        - username1
        - username2
##### Messages:
        - username
        - description
        - conversation id
        - timestamp

MongoDB will be used to store all the data for the users, posts, comments, conversations, and messages. The actual media will either be stored in MongoDB using GridFS or be stored in Firebase Storage. The real-time messaging in the express-mongoose app can be accomplished by using either onSnapshot with Firestore or the Socket.io node module.

#### 4. Clear and direct call-outs of how you will meet the various project requirements.
All users will be authenticated and only friends will be authorized to comment on each other's posts or send messages. There will be CRUD routes for posts, comments, and messages. There will be indices to allow for fast lookup of content by user. Text search could be used to display posts based on keyword. Routes will be tested using supertest, jest, and in-memory MongoDB test database. There will be a react front-end rendered in express. Front-end will be deployed on vercel or netlify. Back-end could be deployed on MongoDB Atlas.

#### 5. A timeline for what project components you plan to complete, week by week, for the remainder of the class.
##### Week 1: Set up back-end and all routes for users, posts, comments, conversations, messages
##### Week 2: Set up routes for media (pictures and videos) to store in MongoDB using GridFS or Firebase Storage
##### Week 3: Set up react front-end with forms for submitting content and testing
##### Week 4: Deployment of front-end to netlify or vercel and backend if possible in MongoDB Atlas.
