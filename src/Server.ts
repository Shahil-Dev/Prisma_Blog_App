import app from "./app"
import { prisma } from "./lib/prisma"



const port = process.env.PORT || 3000

async function main() {
    try{
   await prisma.$connect()
    console.log("Database connected successfully")

     app.listen(3000, () => {
        console.log(`Server is running on port ${port}`)
    })
    }
    catch(error){
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)
    }
}


main()