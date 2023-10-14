import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsService } from './fetchNearbyGymsService'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsService

describe('Fetch Nearby Gyms Service', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsService(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -29.7095584,
			longitude: -51.1480857,
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -29.539212,
			longitude: -51.081806,
		})


		const { gyms } = await sut.execute({
			userLatitude: -29.7095584,
			userLongitude: -51.1480857,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'Near Gym' }),
		])
	})
})    