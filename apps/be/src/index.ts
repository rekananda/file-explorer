import { cors } from '@elysiajs/cors';
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import fileRoutes from "./routes/file.route";
import folderRoutes from "./routes/folder.route";

const app = new Elysia();
app.use(swagger());
app.use(cors());

folderRoutes(app);
fileRoutes(app);
// app.onError(({ error:ApiReturn, set }) => {
//   if (error?.status === 404) {
//     setStatus(404);
//     return { error: "Not Found", message: error.message };
//   }

//   setStatus(500);
//   return { error: "Internal Server Error", message: error.message };
// });

app.listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
