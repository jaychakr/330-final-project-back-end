# project-proposal
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
