import * as championshipRepository from '../repositories/championshipRepository.js';
import * as apiService from './apiService.js';
import * as driverService from './driverService.js';
import * as constructorService from './constructorService.js';
import { STARTING_YEAR, getCurrentYear } from '../config/constants.js';
export const getAllChampionships = async () => {
    try {
        const championships = await championshipRepository.findAll();
        return championships.filter(championship => {
            const season = parseInt(championship.season);
            return season >= STARTING_YEAR;
        });
    }
    catch (error) {
        console.error('Error in getAllChampionships service:', error);
        throw error;
    }
};
export const getChampionshipBySeason = async (year) => {
    try {
        if (year < STARTING_YEAR) {
            throw new Error(`Championship data is only available from ${STARTING_YEAR} onwards`);
        }
        if (year > getCurrentYear()) {
            throw new Error(`Championship data is not available for future years`);
        }
        let championship = await championshipRepository.findBySeason(year.toString());
        if (!championship) {
            const championData = await apiService.fetchWorldChampion(year);
            if (championData) {
                await driverService.findOrCreateDriver(championData.driver);
                await constructorService.findOrCreateConstructor(championData.constructor);
                championship = await championshipRepository.upsert(year.toString(), {
                    season: year.toString(),
                    driverId: championData.driverId,
                    constructorId: championData.constructorId,
                    points: championData.points,
                    wins: championData.wins
                });
            }
        }
        return championship;
    }
    catch (error) {
        console.error('Error in getChampionshipBySeason service:', error);
        throw error;
    }
};
export const updateAllChampionships = async () => {
    try {
        let updatedCount = 0;
        const currentYear = getCurrentYear();
        for (let year = STARTING_YEAR; year <= currentYear; year++) {
            try {
                const championData = await apiService.fetchWorldChampion(year);
                if (championData) {
                    await driverService.findOrCreateDriver(championData.driver);
                    await constructorService.findOrCreateConstructor(championData.constructor);
                    await championshipRepository.upsert(year.toString(), {
                        season: year.toString(),
                        driverId: championData.driverId,
                        constructorId: championData.constructorId,
                        points: championData.points,
                        wins: championData.wins
                    });
                    updatedCount++;
                    console.log(`Updated championship data for ${year}`);
                }
            }
            catch (error) {
                console.error(`Error updating championship for ${year}:`, error);
            }
        }
        return updatedCount;
    }
    catch (error) {
        console.error('Error in updateAllChampionships service:', error);
        throw error;
    }
};
//# sourceMappingURL=championshipService.js.map