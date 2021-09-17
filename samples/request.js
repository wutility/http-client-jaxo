const jsonReqPost = {
  method: 'POST',
  timeout: 0, // default: 2000ms
  //url: 'https://jsonplaceholder.typicode.com/posts',
  url: 'http://localhost:5000/post-json',
  data: {
    "userId": 1,
    "id": 1,
    "title": "Welcome To Jaxo",
    "body": "Simple HTTP POST request"
  },
  headers: {
    "Accept": "application/json, text/plain",
    "Content-Type": "application/json"
  }
}

const jsonReqGet = {
  //url: 'https://jsonplaceholder.typicode.com/posts',
  method:'GET',
  url: 'http://localhost:5000/json',
  headers: {
    "Accept": "application/json, text/plain",
    "Content-Type": "application/json"
  }
}