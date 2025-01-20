import cron from 'node-cron';
import { updateExpiredMarketItems } from './marketController.js';

// Zadanie sprawdzające wygasłe przedmioty co minutę
cron.schedule('* * * * *', async () => {
    console.log('Sprawdzanie wygasłych przedmiotów na rynku...');
    await updateExpiredMarketItems();
});
