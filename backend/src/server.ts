import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Configurar o CORS para liberar todas as origens
fastify.register(fastifyCors, {
  origin: '*', // Permitir qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
});

const SECRET_KEY = 'my_secret_key';

const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

const decryptPassword = (encryptedPassword: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

fastify.get('/passwords', async (_, reply) => {
  const passwords = await prisma.password.findMany();
  const decryptedPasswords = passwords.map((password) => ({
    ...password,
    password: decryptPassword(password.password),
  }));
  return reply.send(decryptedPasswords);
});

fastify.get('/passwords/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  const password = await prisma.password.findUnique({
    where: { id: Number.parseInt(id, 10) },
  });

  if (!password) {
    return reply.status(404).send({ message: 'Password not found' });
  }
  const decryptedPassword = {
    ...password,
    password: decryptPassword(password.password),
  };
  return reply.send(decryptedPassword);
});

fastify.post('/passwords', async (request, reply) => {
  const { description, category, login, password } = request.body as {
    description: string;
    category?: string;
    login: string;
    password: string;
  };

  const encryptedPassword = encryptPassword(password);

  const newPassword = await prisma.password.create({
    data: { description, category, login, password: encryptedPassword },
  });

  return reply.status(201).send(newPassword);
});

fastify.put('/passwords/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const { description, category, login, password } = request.body as {
    description: string;
    category?: string;
    login: string;
    password: string;
  };

  try {
    const encryptedPassword = encryptPassword(password);

    const updatedPassword = await prisma.password.update({
      where: { id: Number.parseInt(id, 10) },
      data: { description, category, login, password: encryptedPassword },
    });

    return reply.send(updatedPassword);
  } catch (error) {
    return reply.status(404).send({ message: 'Password not found' });
  }
});

fastify.delete('/passwords/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  try {
    await prisma.password.delete({
      where: { id: Number.parseInt(id, 10) },
    });

    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ message: 'Password not found' });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
