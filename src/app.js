const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
      return response.status(400).json({"message": "Invalid Repository id"});
  }

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId);

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  // Filtra o repository pelo titulo
  const results = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const likes = 0;

  const repository = { id: uuid(), url, title, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryId = repositories.findIndex(repository => repository.id == id);

  if (repositoryId < 0) {
    return response.status(400).json({ "message": "Repository not found" });
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryId].likes
  }

  repositories[repositoryId] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ "message": "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({ "message": "" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ "message": "Repository not found" });
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
