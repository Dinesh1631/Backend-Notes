/**Steps to create an efficent backend
1)Create Package.json.
2)install "express" module.
3)Create express appliction.
4)Define route to handle client request.

 */

//step 1:Create Package.json by using terminal with command "npm init".

//step2:install "express module":by using command "npm install express".

//Step 3:Create express appliction.
//whenever we import a module ,we will the content of module in respective variable.
const exp = require("express");//"exp" has a function because express has exported function.

const app = exp()  
/**
 * The exp() function has been called to create an object for express application.
 * variable name can be any thing but it is good to use "app" because it in convintional use.
 */

//assigning port number

app.listen(3500,()=>{
    console.log("Web Server is listening on port 3500");
});

/**Connecting the database to the server
 * get mongoClient in the server by importing it(It is a non core module).
 * use it to connect to the database
 * 
//  */
// mongodb://127.0.0.1:27017//get mongo client
const mclient = require('mongodb').MongoClient;

//connect to DB server using mongo client

//There is no http protocal b/w db client and db server,it will have only db protocol.
//The connect will returns a promise.(states of promises:resolve,reject,pending)
 mclient.connect('mongodb://0.0.0.0/27017')
.then((dbref)=>{
   //If the connection is success then it will give a "database server refrence"(dbref).
   //Then we have to connect to a database by using dbref
    const dbObj = dbref.db('users')//.db method creates a database connection and returns it.
    //By using above method we can use exiting database or create a new database.

    //connect to collections of the database.
    const userColObj = dbObj.collection("userscollections");

    const prodColObj = dbObj.collection("productsscollections");
    //share collections to respective api's
    app.set("userColObj",userColObj);//{key:value}->The key is used to acess the collection object in Api
    app.set("ProdColObj",prodColObj);//{key:value}
    console.log("DB connection success");

})
.catch(err=>console.log("Database connection failed : "+err));//when promise is rejected this will execute.





/**
 * Connecting user's api to the server.
 * import the userApp.
 * Try to give some special identifaction to path of the request msde by client.
*/

const userApp = require("./APIs/userApi");
const productsApp = require("./APIs/productsApi");
//execute user api when path starts with user-api
//execte products api when path starts with products-api
app.use('/user-api',userApp);

//For the connecting of products
app.use('/products-api',productsApp)



/**Dealing with invalid path
 * Because normal error handling mechasim cannot deal with invalid
 * path error they only deal with error's inside the request handler.
 * It also sholud be written at the last of page.
 */

const invalidPath = function(request,response,next){
    response.send({message:"Inavlid url address"});
}

app.use("*",invalidPath);


/**Error Handling middleware
 * Used to handle the errors thrown by the page.
 * Should be placed only at the end of the file.
 * It cannot cath synchronous error,it only catchs asynchronous error.
 * 
 */

const errorHandlingMiddleware = function(error,request,response,next){
    response.send({message:error.message});
}

app.use(errorHandlingMiddleware);