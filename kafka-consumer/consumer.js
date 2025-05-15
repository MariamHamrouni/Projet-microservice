const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'microservice-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'authors-group' });

async function runConsumer() {
  await consumer.connect();
  console.log('Kafka Consumer connected');

  // S’abonner au topic 'authors-topic'
  await consumer.subscribe({ topic: 'authors-topic', fromBeginning: true });

  // Écouter les messages reçus
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msgValue = message.value.toString();
      console.log(`Message reçu sur le topic ${topic}:`, msgValue);

      // Si besoin, tu peux convertir en objet JSON
      try {
        const author = JSON.parse(msgValue);
        console.log('Auteur reçu:', author);
      } catch (err) {
        console.error('Erreur parsing JSON:', err);
      }
    },
  });
}

runConsumer().catch(console.error);
