/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import {faker} from '@faker-js/faker';

import {delay, http, HttpResponse} from 'msw';

import type {GameResponse} from '.././model';


export const getGetGameResponseMock = (overrideResponse: Partial<GameResponse> = {}): GameResponse => ({
    uciFen: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
    whitePlayer: faker.helpers.arrayElement([{
        id: faker.helpers.arrayElement([faker.number.int({
            min: undefined,
            max: undefined
        }), undefined]),
        sub: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
        email: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
        name: faker.helpers.arrayElement([faker.string.alpha(20), undefined])
    }, undefined]),
    blackPlayer: faker.helpers.arrayElement([{
        id: faker.helpers.arrayElement([faker.number.int({
            min: undefined,
            max: undefined
        }), undefined]),
        sub: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
        email: faker.helpers.arrayElement([faker.string.alpha(20), undefined]),
        name: faker.helpers.arrayElement([faker.string.alpha(20), undefined])
    }, undefined]), ...overrideResponse
})


export const getGetGameMockHandler = (overrideResponse?: GameResponse | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<GameResponse> | GameResponse)) => {
    return http.get('*/game/:id', async (info) => {
        await delay(1000);

        return new HttpResponse(JSON.stringify(overrideResponse !== undefined
                ? (typeof overrideResponse === "function" ? await overrideResponse(info) : overrideResponse)
                : getGetGameResponseMock()),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
    })
}
export const getGameControllerMock = () => [
    getGetGameMockHandler()
]
