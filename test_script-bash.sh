
read -p $'\nCreate user'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"name":"username", "email":"user@utoronto.ca", "phone":4161111111, "pw":"password"}' \
http://localhost:3000/users

read -p $'\nGet the user with uid=1, forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/users/1

read -p $'\nCreate a poll, bad request if a field other than questions is missing'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"creator":1, "title":"Project title", "description":"Project description", "size":4, "course":"CSC309", \
"questions":[{"id":1, "q_type":1, "question":"This is a single-answer MC question", \
"options":[{"value":"false", "correct":false}, {"value":"correct", "correct":true}]}]}' \
http://localhost:3000/polls

read -p $'\nGet polls that are created by user with uid=1, forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X GET -d '{"uid":1}' http://localhost:3000/polls

read -p $'\nGet a poll with pid=1, forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/polls/1

read -p $'\nSearch a poll with course code=csc309'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/search?course=csc309

read -p $'\nCreate another user who will apply to join the group'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"name":"applicant", "email":"apply@utoronto.ca", "phone":6479999999, "pw":"password"}' \
http://localhost:3000/users

read -p $'\nCreate an application, forbidden if the applicant is the creator or the poll does not exist, bad request if field missing'
curl -v -H "Content-Type: application/json" -X POST -d \
'{"uid":2, "pid":1, "answers":["question":1, "value":"correct"]}' \
http://localhost:3000/applications

read -p $'\nUpdate a poll with pid=1, bad request if fields are not given, forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X PUT -d '{"questions":[]}' http://localhost:3000/polls/1



read -p $'\nDelete a poll with pid=1, forbidden if the poll does not exist'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/polls/1

read -p $'\nDelete a user with uid=1, forbidden if the user does not exist'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/users/1
