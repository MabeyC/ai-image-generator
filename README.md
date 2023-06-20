# OpenAI Image Generator App

> An app to generate images using OpenAI's [DALL.E 2](https://openai.com/dall-e-2) API

[Openai API documentation](https://platform.openai.com/docs/guides/images/introduction)

## Installation
___
To install all dependencies, use the ```npm install``` command: 
```bash
npm install
```
___
## Enpoints
___
Current enpoints:
- /openapi/generateimage
  > Generates an image based on user prompt
- /file/uploadimage
  > Uploads an image to db
- /file/:filename
  > Gets image from db

Future enpoints will be as follows:
- /openapi/editimage
  > This endpoint will edit a previously generated image
- /openapi/variantimage
  > This endpoint will generate a variant of a previously generated image
___


### Envionment Variables Used
```bash
NODE_ENV
PORT
OPENAI_API_KEY
MONGO_URI
```
___
### Built With
**Node JS**

<a href="https://nodejs.org"><img width="120" height="120" src="https://img.icons8.com/windows/120/nodejs.png" alt="nodejs"/></a>