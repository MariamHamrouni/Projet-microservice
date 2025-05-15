const { Kafka } = require('kafkajs');
// On importe la classe Kafka du client kafkajs pour interagir avec Kafka.

const kafka = new Kafka({
  clientId: 'microservice-producer',
  brokers: ['localhost:9092'],
});
// On crée une instance Kafka en précisant un clientId (nom du producteur) et l'adresse du broker Kafka.

const producer = kafka.producer();
// On crée un producteur Kafka qui permettra d'envoyer des messages.

async function connectProducer() {
  await producer.connect();
  console.log('Kafka Producer connected');
}
// Fonction async qui connecte le producteur au broker Kafka. On log la connexion réussie.

async function sendKafkaMessage(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Kafka message sent to topic ${topic}:`, message);
  } catch (error) {
    console.error('Error sending Kafka message:', error);
  }
}

module.exports = {
  connectProducer,
  sendKafkaMessage,
};
// On exporte ces deux fonctions pour pouvoir les réutiliser dans d'autres fichiers/services.
