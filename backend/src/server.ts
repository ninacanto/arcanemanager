import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// CRUD Routes for Passwords
fastify.get('/passwords', async (_, reply) => {
  const passwords = await prisma.password.findMany();
  return reply.send(passwords);
});

fastify.get('/passwords/:id', async (request, reply) => {
  const { id } = request.params as { id: string };

  const password = await prisma.password.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!password) {
    return reply.status(404).send({ message: 'Password not found' });
  }

  return reply.send(password);
});

fastify.post('/passwords', async (request, reply) => {
  const { description, category, login, password } = request.body as {
    description: string;
    category?: string;
    login: string;
    password: string;
  };

  const newPassword = await prisma.password.create({
    data: { description, category, login, password },
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
    const updatedPassword = await prisma.password.update({
      where: { id: parseInt(id, 10) },
      data: { description, category, login, password },
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
      where: { id: parseInt(id, 10) },
    });

    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ message: 'Password not found' });
  }
});

// Start Server
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
