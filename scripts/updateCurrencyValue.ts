import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const API_KEY = process.env.CURRENCY_FREAKS_API_KEY;
const baseUrl = process.env.CURRENCY_FREAKS_BASE_URL;
const prisma = new PrismaClient();
const symbols = ['VES'];

async function main() {
    try {
        const response = await axios.get(`${baseUrl}?apikey=${API_KEY}&symbols=${symbols.join(',')}`);
        const data = response.data;
        const currency = data.rates.VES;
        await prisma.currency.update({
            where: { symbol: 'VES' },
            data: { value: currency },
        });
        console.log('Currency value updated successfully');
    } catch (error) {
        console.error('Error updating currency value:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();

