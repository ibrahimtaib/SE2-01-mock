# SE2-01-mock

Mock project for SE2 - Office Queue Managment

## Database Ideas

We need to add a new feature to table services with the waiting time of each service

To check the queues we can do a SQL call like this :

```
SELECT * from tickets WHERE serviceID = x
```

To check the services name we can call the database. <br>
<br>
Counters have two primary keys, counterID and serviceID so counters can have more than one service, maybe selected with frontend and then updated on the backend. 
<br>
<br>
To check the number of people inline we can do another SQL call:
```
COUNT * FROM tickets WHERE status = 0 GROUP BY services 
```
Roles are: 0 user, 1 officer, 2 administrator.
<br>
Status for tickets are 0 pending, 1 served. 