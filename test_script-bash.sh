
read -p $'\nCreate user'
curl -v -H "Content-Type: application/json" -X POST -d '{"name":"username", "email":"user@utoronto.ca", "phone":41611111111, "pw":"password"}' http://localhost:3000/users

read -p $'\nCreate a poll'
curl -v -H "Content-Type: application/json" -X POST -d '{"creator":1, "title":"Project title", "description":"Project description", "size":4, "course":"CSC309", "questions":[{"q_type":1, "question":"This is a single-answer MC question", "options":[{"value":"false", "correct":false}, {"value":"correct", "correct":true}]}]}' http://localhost:3000/polls

read -p $'\nGet polls that are created by user with uid=1'
curl -v -H "Content-Type: application/json" -X GET -d '{"uid":1}' http://localhost:3000/polls

read -p $'\nGet a poll with pid=1'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/polls/1

read -p $'\nUpdate a poll with pid=1'
curl -v -H "Content-Type: application/json" -X PUT -d '{"questions":[]}' http://localhost:3000/polls/1

read -p $'\nSearch a poll with course code=csc309'
curl -v -H "Content-Type: application/json" -X GET http://localhost:3000/search?course=csc309

read -p $'\nDelete a poll with pid=1'
curl -v -H "Content-Type: application/json" -X DELETE http://localhost:3000/polls/1