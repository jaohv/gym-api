import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './createGymService'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymService(gymsRepository)
	})

	it('should be able to register', async () => {
		const { gym } = await sut.execute({
			title: 'JavaScript Gym',
			description: null,
			phone: null,
			latitude: -29.7095584,
			longitude: -51.1480857,
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})  