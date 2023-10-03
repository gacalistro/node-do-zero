import fastify from "fastify";
import { PostgresDatabase } from "./postgres-database.js";

const server = fastify();

const database = new PostgresDatabase();

server.get("/videos", async (request, reply) => {
  const searchQuery = request.query.search;

  const videos = await database.list(searchQuery);

  return reply.send(videos);
});

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send();
});

server.put("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;

  await database.update(videoId, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
});

server.delete("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;

  await database.delete(videoId);

  return reply.status(204).send();
});

server.listen({ port: process.env.PORT || 3000, host: "::1" }, (err, address) =>
  console.log(`Server listening at ${address}`)
);
