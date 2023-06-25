# OpenAI Image Generator App

> An app to generate images using OpenAI's [DALL.E 2](https://openai.com/dall-e-2) API

[Openai API documentation](https://platform.openai.com/docs/guides/images/introduction)


### Under Active Development
### TODO
Set up in-memory database (redis)
Switch authentication from JWT to session


### Installation
___
To install all dependencies, use the ```npm install``` command: 
```bash
npm install
```
___
### Testing
To run the test suite, use the ```npm run test``` command:
```bash
npm run test
```
___
### Enpoints
___
- /openai
  **POST** /generateimage
  **PARAMS** formdata: { prompt: String, size: ['small', 'medium', 'large']}
  **DESCRIPTION** Generates an image based on user text prompt
  
  **POST** /variantimage
  **PARAMS** formdata: { name: String, size: ['small', 'medium', 'large'], numVariants: 1-3 }
  **DESCRIPTION** Generates up to 3 variants of a saved image

- /file
  **POST** /uploadimage
  **PARAMS** formdata: { file }
  **DESCRIPTION** Allows for a png image file to be uploaded  
  
  **GET** /file/:filename
  **PARAMS** params: { filename: String }
  **DESCRIPTION** Gets an image from the database

- /user
  **POST** /
  **PARAMS** json: { name: String, email: String, password: String }
  **DESCRIPTION** Register an new user

- /auth
  **GET** /
  **PARAMS** header: { x-auth-token: String } (JSON Web Token)
  **DESCRIPTION** Gets an authenticated user's id
 
  **POST** /
  **PARAMS** json: { name: String, email: String, password: String }
  **DESCRIPTION** Authenticates a user and returns a token
