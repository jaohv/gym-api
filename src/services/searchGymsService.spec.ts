import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsService } from './searchGymsService'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsService

describe('Fetch User Check In History Service', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsService(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			description: null,
			phone: null,
			latitude: -29.7095584,
			longitude: -51.1480857,
		})

		await gymsRepository.create({
			title: 'TypeScript Gym',
			description: null,
			phone: null,
			latitude: -29.7095584,
			longitude: -51.1480857,
		})


		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 1,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym' }),
		])
	})

	it('should be able to fetch paginated gym search', async () => {
		for (let i = 1; i <= 22; i++){
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				description: null,
				phone: null,
				latitude: -29.7095584,
				longitude: -51.1480857,
			})
		}

		const { gyms } = await sut.execute({
			query: 'JavaScript',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ title: 'JavaScript Gym 21' }),
			expect.objectContaining({ title: 'JavaScript Gym 22' }),
		])
	})
})    