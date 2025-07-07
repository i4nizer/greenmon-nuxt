import fs from "fs/promises"

//

(async () => {
    const schemaDestPath = "./prisma/schema.prisma"
    const schemaBasePath = "./prisma/scripts/base.prisma";

    const schemaBaseFile = await fs.readFile(schemaBasePath)
    const schemaFilenames = await fs.readdir("./prisma/schema")
    const schemaFilepaths = schemaFilenames.map(n => `./prisma/schema/${n}`)

    await fs.writeFile(schemaDestPath, schemaBaseFile)
    
    for (const filepath of schemaFilepaths) {
        const schemaFile = await fs.readFile(filepath)
        await fs.appendFile(schemaDestPath, "\n")
        await fs.appendFile(schemaDestPath, schemaFile)
    }

    console.log(`Prisma schemas appended to ${schemaDestPath}: \n[\n\t${schemaBasePath}\n\t${schemaFilepaths.join('\n\t')}\n]`)
})()

