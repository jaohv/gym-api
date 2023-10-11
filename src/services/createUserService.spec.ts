import { expect, describe, it } from 'vitest'
import { CreateUserService } from './createUserService'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserService

describe('Register Service', () => {
	usersRepository = new InMemoryUsersRepository()
	sut = new CreateUserService(usersRepository)

	it('should be able to register', async () => {

		const { user } = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to register with same email twice', async () => {
		const usersRepository = new InMemoryUsersRepository()
		const sut = new CreateUserService(usersRepository)

		const email = 'johndoe@example.com'

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456'
		})

		await expect(() => 
			sut.execute({
				name: 'John Doe',
				email,
				password: '123456'
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})  