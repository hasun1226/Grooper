![logo](grooper/assets/images/logo.png)

Grooper is a web application that helps students find groups for courses. It uses a “Poll” interface to find the groups and match the teammates. When a user creates a poll, the creator can give a short description of his/her group’s project. To help with the choosing process, the creator can add questions as an “Application form” to the poll which will be asked to the other. Users who are interested in the group after viewing the description will submit their responses to the application form. Then the creator of the poll can choose his/her teammates from the list of applicants. Once all the teammates are confirmed, the group is closed and the poll is removed.

---

## What has been done for Phase 3?
Roughly 85% of the features including posting, displaying, editing, and sorting by time are now virtually working. 10 necessary features, which are of login management and searching mechanisms, are still pending out of the 64 features outlined in [Phase1_updated](Phase1_updated.pdf).

### [Back-end development](grooper/index.js)
23 main APIs are defined. Please refer to the [setup instruction](grooper/README.md) to run the back-end

### [API documentation](Grooper_API.pdf)
Shows Method, Endpoint, Description, Input JSON, Output JSON, Failure

### [test-script](grooper/test_script.sh)
Describes the behaviors including successful curl commands and when they will fail (failed test cases are not provided, but how you can fail them is provided). After running all the commands, the resulting data will be as [users.json](grooper/model/users.json)

### Notable attributes
 * Divided GET user info into two parts: basic profile and course history
   * Reduce stress on the server in case there are too many courses to display
   * When displaying the members for the group, only the basic profile is displayed
   * Filtering applicants based on the course history is considered to be an extra feature
 * POST to /users is connected with front-end
   * Can register through [http://localhost:3000/register](http://localhost:3000/register)
   * POST to /polls is partially connected with front-end (questions fields will be passed as an empty array)
 * GET /login is defined, but the session is yet to be managed
 
### To Do (Prioritized: Highest to lowest)
 1. Login management
 2. Connect the back-end with the front-end
 3. Course search mechanism
 4. Admin authority management (This is a new feautre after the feedback)

---
## What has been done for Phase 2?

### [Front-end design](grooper)
HTML, CSS and JavaScript files were created to imitate the behaviors of the application on the front-end.

Please note that the below features are simulations of front-end behaviors only using static dummy data. Any back-end processes such as fetching the data from the server or posting the data to the server are not implemented yet. Those items that are strictly front-end will be __bolded__.
#### Implemented features
* Account Management
  * Account creation (See [Register page](grooper/register.html]))
  * __Form validation (mandatory name, email, phone number and 2 passwords must match the patterns and the passwords must match)__
* [Profile](grooper/profile.html)
  * Display all the information about the user
  * Change name/email address/phone number
  * Change password
  * Change course history
  * __Form validation (mandatory values for changing profile information must match the patterns)__
  * Delete account
* [Dashboard](grooper/dashboard.html)
  * Display my activities (polls created by the user, applications the user submitted, closed groups of the user)
  * Allow the user to access each category (polls, applications, groups management)
  * Display the status of each activity (i.e. new applicant submitted an application form for my group, invitation received, group closed)
* [Course page with list of polls](grooper/coursepage.html)
  * Display all the polls for the course
  * Display a poll with a title, the creator of the poll, date of creation, and how many spaces are left in the team
  * Navigate the user to the poll which displays the group's description and the application form
  * User can add a new poll
* Poll page
  * Display project title, description, creator of the poll, how many spaces are left in the team
  * Display application form with requirements and questions made by the creator of the poll
  * __Questions can be multiple choice or open questions__
  * Submit the form once the user clicks on the submit button
  * __Block the users from submitting their forms if the questions are not answered__
  * __Block the user from applying to his/her own poll by sending the user to manage the poll__
  * User can edit his/her responses to the poll
* [Manage polls created by me](grooper/managepoll.html)
  * Display project title, description, team size, application form, and the list of applicants with their answers to the application form
  * Edit project title, description, team size and application form
  * Invite the teammates from the list
  * Delete a poll
  * __Form validation (mandatory title, description, size of the group)__
* [Manage my Closed groups](grooper/mygroups.html)
  * Display the project title, description, creator of the poll, team size, and the group members
  * Users who accepted the invitation from the group owner are added to the group
* My Applications
  * Display if the group is closed
  * Delete the applications for the closed groups by clicking the item
  * The user can view his/her responses
  * The user can edit his/her responses
  * Ask the user who is accepted to the group whether he/she will accept or reject the invitation
  * Add the applicant to the group if he/she accepts the invitation
  *	If the invitation to the group is accepted, the application is moved from the list to the closed groups category
  * If the invitation to the group is rejected, the application will be removed from the list
  
---
### [Requirement list from Phase 1 updated](Phase1_updated.pdf)
#### Main Changes
* Project description added to explain how "Polls" help the group formation.
* Several backend requirements added such as hashing password, session management, and sorting the list items
* Added how to handle polls that stay in the list (the list will be emptied at the beginning of each semester)
* Added a general category for the features that apply to the overall web application such as responsive design, database management, course searching mechanism using Cobalt API in the navigation bar

---
### Decisions Made
* Using Bootstrap
  * Bootstrap allows us to use variable content styles that are readily available, and there are many documents and examples we could use from.
  * Bootstrap has styles that does responsive design automatically. (i.e. col-xs-# means the elements are horizontal at all times while col-sm-# means the elements will collapse below 768px and so on)

### Decisions to be Made
* Session Management
  * We need to decide how to manage the sessions: using JWT(Json Web Token)/OAuth2/Session id
