import envConfig from "~/env.config"
import { Sequelize } from "sequelize"
import {
    User,
    Token,
    Greenhouse,
    initializeUser,
    initializeToken,
    initializeGreenhouse,
} from "../models/index"

//

export default defineNitroPlugin(async () => {
	// --- Configurations
    const { NUXT_DB_URL } = envConfig
    const sequelize = new Sequelize(NUXT_DB_URL, { logging: false })

	// --- Initializations
	initializeUser(sequelize)
	initializeToken(sequelize)
	initializeGreenhouse(sequelize)

	// --- Relationships: ForeignKeys & Constraints
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
    
    Token.belongsTo(User, { foreignKey: "userId" })
	Token.hasOne(Greenhouse, { foreignKey: "tokenId", onDelete: "CASCADE" })

    Greenhouse.belongsTo(User, { foreignKey: "userId" })
    Greenhouse.belongsTo(Token, { foreignKey: "tokenId" })
    // --- Relationships

	// --- Connection
    await sequelize.authenticate()
    console.log("✔ Sequelize connection authenticated.")
    
    // --- Sync Database Models
    await sequelize.sync({ alter: true })
    console.log("✔ Sequelize database tables synchronized.")
})
