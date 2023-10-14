import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/services/errors/userAlreadyExistsError'
import { makeCreateUserService } from '@/services/factories/make-createUser-service'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
	const createUserBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6)
	})

	const {name, email, password} = createUserBodySchema.parse(request.body)

	try {
		const createUserService = makeCreateUserService()

		await createUserService.execute({
			name,
			email,
			password
		})
	} catch (err) {
		if (err instanceof UserAlreadyExistsError){
			return reply.status(409).send({ message: err.message})			
		}

		throw err
	}

	return reply.status(201).send()
}