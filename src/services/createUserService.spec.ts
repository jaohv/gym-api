import { expect, describe, it } from 'vitest'
import { CreateUserService } from './createUserService'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

describe('Register Use Case', () => {
	it('should be able to register', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const createUserService = new CreateUserService(usersRepository)

		const { user } = await createUserService.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const createUserService = new CreateUserService(usersRepository)

		const email = 'johndoe@example.com'

		await createUserService.execute({
			name: 'John Doe',
			email,
			password: '123456'
		})

		expect(() => 
			createUserService.execute({
				name: 'John Doe',
				email,
				password: '123456'
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})  