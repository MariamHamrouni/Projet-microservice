const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'authors.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const authorsProto = grpc.loadPackageDefinition(packageDefinition).authors;

const client = new authorsProto.AuthorsService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

// Ajouter un auteur
function addAuthor(name, bio) {
  return new Promise((resolve, reject) => {
    client.AddAuthor({ name, bio }, (err, response) => {
      if (err) return reject(err);
      resolve(response.author);
    });
  });
}

// Récupérer un auteur par id
function getAuthor(id) {
  return new Promise((resolve, reject) => {
    client.GetAuthor({ author_id: id }, (err, response) => {
      if (err) return reject(err);
      console.log('Réponse complète GetAuthor:', response);
      resolve(response.author);
    });
  });
}


// Récupérer tous les auteurs
function searchAuthors() {
  return new Promise((resolve, reject) => {
    client.SearchAuthors({}, (err, response) => {
      if (err) return reject(err);
      resolve(response.authors);
    });
  });
}

async function test() {
  try {
    console.log('Ajout d’un auteur...');
    const newAuthor = await addAuthor('Victor Hugo', 'Auteur français');
    console.log('Auteur ajouté:', newAuthor);

    console.log('Liste des auteurs:');
    const allAuthors = await searchAuthors();
    console.log(allAuthors);

    console.log('Recherche de l’auteur ajouté par ID...');
    const author = await getAuthor(newAuthor.id);
    console.log(author);
  } catch (err) {
    console.error('Erreur:', err);
  }
}

test();
