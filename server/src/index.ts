import {Server} from './server';
const server = new Server().http;
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`server is running ${port}`);
});
