![logo](grooper/assets/images/logo.png)

Grooper is a web application that helps students find groups for courses. It uses a “Poll” interface to find the groups and match the teammates. When a user creates a poll, the creator can give a short description of his/her group’s project. To help with the choosing process, the creator can add questions as an “Application form” to the poll which will be asked to the other. Users who are interested in the group after viewing the description will submit their responses to the application form. Then the creator of the poll can choose his/her teammates from the list of applicants. Once all the teammates are confirmed, the group is closed and the poll is removed.

## How to Grooper
__Step 1:__ Sign in with bill.gates@mail.utoronto.ca and a password of your choice from the [starting page](grooper/signin.html)

__Step 2:__ You are at dashboard page where you can click each item and make changes to the editable items as you'd like
  * "My polls" shows you which polls you have created to look for teammates (New! means there are new applicants who wish to join your group, Closed means that the group is confirmed and you can access the group information)
  * "My applications" shows you for which groups you submitted the forms to join them (Invited means you can accept the invitation to join the group, Closed means this group is formed with other people and can be removed from the list)
  * "My groups" shows you which groups you have currently joined (Click on them to see which groups you are in!)
  
__Step 3:__ Now let's search CSC309 on the search bar, you will be brought to the list of polls for CSC309 where you can create a new poll or view others' posts

__Step 4:__ Let's view your profile and edit your information by clicking the "Profile" anchor on the navigation bar

__Step 5:__ You are practically done looking around Grooper! You can sign out by clicking "Sign out" anchor on the navigation bar

__Optional:__ You can also try to register from the signin page by clicking "Register" button (Make sure your email has @ preceded by the domain, phone number is in the form of "(###)###-####" or "(###)####### or "##########" and the passwords must be the same)


## What has been done for Phase 2?

### [Front end design](grooper)
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
* Database Kind
  * We are debating whether we should use mongooseDB which is taught in the tutorial, or MySQL which we all have knowledge of from Database management course.
* Session Management
  * We need to decide how to manage the sessions: using JWT(Json Web Token)/OAuth2/Session id
