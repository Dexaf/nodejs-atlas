# NODEJS-ATLAS
Hi i'm Federico Pisa and this is the repo for NodeJs-Atlas (NJSA from now on) but what is NJSA? well NJSA is just "blueprint" of a stable nodeJs-express-typescript project connected to mongoDb via mongoose, this means that: 
- Tsconfig.json already configurated to use await-async and the module import system.
- The folders of the source is structured to have a protocol to add the basic needs (will be explained later).
- The routes for jwt auth are already made.
- The json conversion with body-parser is already made.
- The env extraction is already made.
- The mongoose connection is already made.
- The error handling routine is already made and "boosted".

## Used npm packages
```json
"dependencies": {
 "bcrypt": "^5.1.1",
 "body-parser": "^1.20.2",
 "dotenv": "^16.3.1",
 "express": "^4.18.2",
 "express-validator": "^7.0.1",
 "jsonwebtoken": "^9.0.2",
 "mongoose": "^8.0.3"
},
"devDependencies": {
 "@types/express": "^4.17.21",
 "@types/node": "^20.10.6",
 "@types/bcrypt": "^5.0.2",
 "@types/express-validator": "^3.0.0",
 "@types/jsonwebtoken": "^9.0.5",
 "nodemon": "^3.0.2",
 "typescript": "^5.3.3"
}
```
## Installation
Go in the root of the project then insert in the console:
```bash
npm install
```
## Start the server
```bash
npm run start-dev-mode
```
with this command nodemon will fire tsc and node ./dist/app.js after you save changes in .ts files
## Directory structure
There are various folders in the project, they are self-explainatory but i'll explain them briefly anyway:
- **Src**: this folder contains the project files and folders, you will usually work here.
  - **Controllers**: this folder contains the controllers that contains the functions that will get fired when a 
    route 
    is called.
  - **Guards**: this folder contains the functions that act as a check for the permissions of the requests, as an 
    example there's is already the auth.guard that check if the user that makes a request is authenticated.
  - **Middlewares**: this folder contains middleware that you use before the routes in your app.ts file.
  - **Models**: this folder contains class, interfaces, types ecc... that you create for your needs.
    - **Dto**: 
        - **In**: here you will put the interfaces that you use to represent the body of your API requests.
        - **Out**: here you will put the interfaces that you use to represent the body of your API response.
    - **Extensions**: here the generic extensions you use.
    - **Interfaces**: here the generic interfaces you use.
    - **Schemas**: here the mongoose schemas you use.
  - **Routes**: this folder contains the routes files.
  - **Utils**: this folder contains generic functions that you use around the project (i'll explain the one insides 
    later).
  - **Validations-chains**: this folder contains the validation made with express-validator to validate your end- 
    points.

## Files
There are some extra files that need a bit of explanation:
- **Authentication.controller.ts**: this file contains the functions for a simple register/login routine with JWT 
  auth.
- **Authentication.controller.ts**: this file contains the routes for the register/login routine.
- **Auth.guard.ts**: this file contains the function that checks for the authorization in the requests.
- **CrushHandlingRoutine.ts**: this file contains the function that handle the app crash when the ENV file can't be 
  loaded or other weird stuff.
- **ValidationHandlingRoutine.ts**: this file contains the function that handle the validation routine of express- 
  validator for the controllers as it's always the same.
- **ErrorHandlingRoutine.ts**: this file contains the function that handle the errors flow to the error handler 
  middleware.
- **LogError.ts**: this file contains the function to handle the side effects of an error inside the api (log to db 
  or file)
- **GetfieldName.ts**: containes a function we need to validate the fields of a dto in express-validator 
  without the needs for magic strings:
```typescript
/* 
This one is a magic string and if the dto changes you can't know it as there's no error shown until it's late: 
you broke prod, nice.
*/
ev.body("password")

/* 
This one is not cute but if you do a typo or change the prop name it will give an error before you compile;
you didn't break prod and saved your stakeholder earnings!
*/
ev.body(getfieldName<SignOnDto>("passwordOPSATYPO"))
```
- **Config.ts**: the routine to fetch the .ENV file
- **Mongoose-starter**: the routine to connect to mongodb
- **.ENV**: the env file that contains the connection, passwords, salts, ports and other stuff you usually don't
  want to hard code as it depend on the type of deployment (Test, Dev, Prod).

## FLOWS 

### Request flow
This how a request is handled

![request flow](https://i.ibb.co/51tM6Zk/request-flow-nodeks-atlas-drawio.png)

### Adding an endpoint flow
let's image you want to add an endpoint, something like a 
post request in a new route:

1. Add a new router with the routes inside the routes folder.
**posts.routes.ts**
```typescript
const postsRouter = express.Router();

postsRouter.post('/add',
                isAuthGuard,
                postsValidationChains.add,
                authenticationController.add)

export default postsRouter;
```
as you can see i prefer to give the same to the validationChain, controller method and route so it's easier to see what's related and what is not when you have a big router full of endpoints.

2. Add the interface you are going to use inside the models/dto/req - dto/res folder.
**post.dto.ts**
```typescript
export interface PostDto {
  title: string,
  content: string
}
```
3. Add the validation chain in the validationChains folder to validate the endpoint body.
**posts.validation-chains.ts**
```typescript
export const logIn = [
  ev.body(getfieldName<PostDto>("title"))
    .exists()
    .isLength({ min: 1})
    .custom((title:string) => {
      if(title.includes("#")){
        throw new Error("Title shouldn't contain special charcters");
      } else {
        return true
      }
    })
    .withMessage({ message: "TITLE_WITH_SPECIAL_CHARCTER", errorCode: 422 }),
  ev.body(getfieldName<PostDto>("content"))
    .exists(),
    .isLength({ min: 1}),
]
```

4. Add the controller function that handles the endpoint logic.
**posts.controller.ts**
```typescript
export const add = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);

    //this let you handle the body with a type and not as any object

    const body = req.body as addDto; 
    ...LOGIC HANDLING   
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}
```
The code i've just wrote is a must to let the request flow go:
- **validationHandlingRoutine** checks that there are no error, and if there are it will throw an error that will be catched by **errorHandlingRoutine**.

inside the logic handling part there will be the usual model generation from the mongoose schema (the function is async because of that) and response.send function to send back the data.

**P.S**
If you are going to throw an error throw it using my interface **errorExt**, With it we can pass the proper status code that will be handled by **errorHandlingRoutine** and then sent to the client.

```typescript
throw new ErrorExt("NO_USERNAME_FOUND_IN_LOGIN", 404);
```

## AUTHENTICATION
The authentication for the users of the client is handled with the **jsonwebtoken** package through the **isAuthGuard** inside the **auth.guard.ts** file; you don't need to touch the logic unless you want to customize something.

An user can get authenticated with the logIn end point as he will receive a jwt as a response to put in the *Authorization headers*.
From now on the user will be authenticated and the **isAuthGuard** will extract the user id and put it in the req data, you can later get it in your logic with the use of the interface **CustomRequest** as in the getUser endpoint:
```typescript
                                  //here
export const getUser = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  const user = await UserModel.findById(req.user.id)
  const userData: UserDto = {
    username: user.username
  }
  res.send(userData);
}
```

if you want to pass more data inside req to the subsequent middleware just change the **CustomRequest** interface and add the data in the **isAuthGuard** method.

```typescript
  req.user = {
    id: decodedToken.userData.id
  }

  next();
```

**P.S** i didn't add any oidc logic here because it's usally better to use an identity server for that.
## CONCLUSION
This project is just a blueprint i've made for fun because i don't enjoy spending the first 5 hours of my new projects to set up things i always use.
While writing this readme i've seen various things to change to make the project better and you probably enjoy doing things in a different way but before changing anything i feel the need to tell you that i've made this blueprint with the idea of using only the minimum amount of "engineering", why? Because over-engineering is the killer of every joy, the burocracy of programming and the labyrint of every ticket you get from QA, think carefully before adding any layer in the flows... 
Also remember to delete the .git file if you dont want to ask to push to my repo :D