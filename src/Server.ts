import app from './App';
import { prisma } from './lib/prisma';


const PORT = process.env.PORT || 3000;
async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database")

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Error starting server:", err);
        await prisma.$disconnect();
        process.exit(1);
    }
}


main();






