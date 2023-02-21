# task-manager-api

<ul>
<li>It is an API collection that does CRUD operations and links users with their tasks and also authenticates them. •Authentication-JSON web token</li>
<li>Password encryption- bcryptjs, Email-SendGrid, Database- MongoDB, File uploading - multer</li>
<li>Express Middleware and Node.js</li>
</ul>



-You have to be authenticated to use the requests just login with credentials or just create a new user<br>
-Just create user then it will be signed automatically and you can send all other request, as the<br> authentication web token will be stored the in the collection in authToken environment variable and you don't need add the token again and again<br>

<h1>Libries used</h1><br>
-jwt webtokens for authentication<br>
-bcrypt for hashing the password<br>
-validatore for validating the email<br>

<h1>Middleware</h1>
-Auth middleware for the authentication<br>
-login method in user model<br>
-overided the .toJSON() method in user model<br>
-generateAuthentcationToken() in user model<br>

<br>

<ul>
<li>add env for mongodb
<li>authToken // don't added the value script has been used for storing this
</ul>

Test API's in Postman:https://www.postman.com/maintenance-geoscientist-61972381/workspace/production/collection/16049025-de39ac3f-f0d9-4cf8-b78f-48557564717e?action=share&creator=16049025

Production Link:https://manager-api-6o9n.onrender.com
