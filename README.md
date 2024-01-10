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
## Directory structure
There are various folders in the project, they are self-explainatory but i'll explain them briefly anyway:
- src: this folder contains the project files and folders, you will usually work here.
  - controllers: this folder contains the controllers that contains the functions that will get fired when a 
    route 
    is called.
  - guards: this folder contains the functions that act as a check for the permissions of the requests, as an 
    example there's is already the auth.guard that check if the user that makes a request is authenticated.
  - middlewares: this folder contains middleware that you use before the routes in your app.ts file.
  - models: this folder contains class, interfaces, types ecc... that you create for your needs.
    - dto: here you will put the interfaces that you use to represent the body of your API requests.
    - extensions: here the generic extensions you use.
    - interfaces: here the generic interfaces you use.
    - schemas: here the mongoose schemas you use.
  - routes: this folder contains the routes files.
  - utils: this folder contains generic functions that you use around the project (i'll explain the one insides 
    later).
  - validations-chains: this folder contains the validation made with express-validator to validate your end- 
    points.

## Files
There are some extra files that need a bit of explanation:
- authentication.controller.ts: this file contains the functions for a simple register/login routine with JWT 
  auth.
- authentication.controller.ts: this file contains the routes for the register/login routine.
- auth.guard.ts: this file contains the function that checks for the authorization in the requests.
- crushHandlingRoutine.ts: this file contains the function that handle the app crash when the ENV file can't be 
  loaded or other weird stuff.
- validationHandlingRoutine.ts: this file contains the function that handle the validation routine of express- 
  validator for the controllers as it's always the same.
- errorHandlingRoutine.ts: this file contains the function that handle the errors flow to the error handler 
  middleware.
- logError.ts: this file contains the function to handle the side effects of an error inside the api (log to db 
  or file)
- getfieldName.ts: containes a function i need to validate the fields of a dto in express-validator 
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
- config.ts: the routine to fetch the .ENV file
- mongoose-starter: the routine to connect to mongodb
- .ENV: the env file that contains the connection, passwords, salts, ports and other stuff you usually don't
  want to hard code as it depend on the type of deployment (Test, Dev, Prod).

## FLOWS 
This section contains the flows of app as what happens during a request, error or the basic start.
WORK IN PROGRESS....