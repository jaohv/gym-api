import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

prisma.user.create({
	data: {
		name: 'João Vitor Miranda',
		email: 'jv.vitor20041@gmail.com'
	}
})