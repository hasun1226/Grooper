
read -p $'\nCreate user1'
read -p $'\nBad request if field missing, Forbidden if the email already exists'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"name":"username", "email":"user@utoronto.ca", "phone":4161111111, "pw":"password"}' \
http://localhost:3000/users

read -p $'\nUpdate user name, Forbidden if the user does not exist, Bad request if the fields are empty'
curl -v -H "Content-Type: application/json" -X PUT -d '{"name":"myName"}' http://localhost:3000/users/1

read -p $'\nGet user1 information, Forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/users/1

read -p $'\nAdd a course history, Bad request if the fields are empty'
read -p $'\nForbidden if the user does not exist or the course history already exists'
curl -v -H "Content-Type: application/json" -X POST -d '{"course":"CSC309", "status":1}' \
http://localhost:3000/users/1/courses

read -p $'\nGet course history of the user, Forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/users/1/courses

read -p $'\nDelete a course history, Bad request if empty course field'
read -p $'\nForbidden if the user does not exist or the course did not exist in course history'
curl -v -H "Content-Type: application/json" -X DELETE -d '{"course":"CSC309"}' \
http://localhost:3000/users/1/courses

read -p $'\nCreate a poll, Bad request if a field other than questions is missing'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"creator":1, "title":"Project title", "description":"Project description", "size":2, "course":"CSC309", "questions":[{"id":1, "q_type":1, "question":"This is a single-answer MC question", "options":[{"value":"false", "correct":false}, {"value":"correct", "correct":true}]}]}' \
http://localhost:3000/polls

read -p $'\nCreate the group that is tied with the poll, Forbidden if the group with pid=1 already exists'
read -p $'\nBad request on empty, non-existent, or different creator, or poll with pid=1 does not exist'
curl -v -H "Content-Type: application/json" -X POST -d '{"pid":1, "creator":1}' http://localhost:3000/groups

read -p $'\nGet all the groups the user is in, Bad request if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET -d '{"uid":1}' http://localhost:3000/groups

read -p $'\nGet polls that are created by user1, Forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET -d '{"uid":1}' http://localhost:3000/polls

read -p $'\nGet a poll with pid=1, Forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/polls/1

read -p $'\nSearch a poll with course code=csc309'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/search?course=csc309

read -p $'\nCreate user2 who will apply to join the group'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"name":"applicant", "email":"apply@utoronto.ca", "phone":6479999999, "pw":"password"}' \
http://localhost:3000/users

read -p $'\nCreate an application'
read -p $'\nForbidden if applicant is creator or the poll does not exist, Bad request if field missing'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"uid":2, "pid":1, "answers":[{"question":1, "value":"false"}]}' \
http://localhost:3000/applications

read -p $'\nGet all applications created by the user2, Forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/applications/2

read -p $'\nUpdate the answer for poll with pid=1 created by user2'
read -p $'\nBad request if uid and pid are not given or no fields are given'
read -p $'\nForbidden if the application does not exist'
curl -v -H "Content-Type: application/json" -X PUT -d '{"uid":2, "pid":1, "answers":[{"question":1, "value":"correct"}]}' http://localhost:3000/applications

read -p $'\nUpdate the poll with pid=1 by removing the questions'
read -p $'\nBad request if no fields are not given, Forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X PUT -d '{"questions":[]}' http://localhost:3000/polls/1

read -p $'\nUpdate the status of the application by inviting user2'
curl -v -H "Content-Type: application/json" -X PUT -d '{"uid":2, "pid":1, "status":1}' \
http://localhost:3000/applications

read -p $'\nUpdate the status of the application to indicate that user2 accepted the invitation'
curl -v -H "Content-Type: application/json" -X PUT -d '{"uid":2, "pid":1, "status":2}' \
http://localhost:3000/applications

read -p $'\nAdd a member to the group, Bad request if the user does not exist'
read -p $'\Forbidden if the poll does not exist, the user is already a member, or the user is the group owner'
curl -v -H "Content-Type: application/json" -X POST -d '{"uid":2}' http://localhost:3000/groups/1/member

read -p $'\nGet the group with id=1, Bad request if the group does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/groups/1

read -p $'\nDelete a member from the group with pid=1, Bad request if uid field is missing'
read -p $'\nForbidden if group does not exist, the user is not a member, or is the group owner'
curl -v -H "Content-Type: application/json" -X DELETE -d '{"uid":2}' http://localhost:3000/groups/1/member

read -p $'\nDelete poll with pid=1, Forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/polls/1

read -p $'\nDelete application for poll with pid=1 created by user2'
read -p $'\nForbidden if the application does not exist'
curl -v -H "Content-Type: application/json" -X DELETE -d '{"uid":2, "pid":1}' http://localhost:3000/applications

read -p $'\nDelete a group with id=1, Forbidden if the group does not exist'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/groups/1

read -p $'\nDelete a user with uid=1, Forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/users/1
