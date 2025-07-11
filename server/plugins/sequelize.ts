import envConfig from "~/env.config"
import { Sequelize } from "sequelize"
import { User, Token, initializeUser, initializeToken } from "../models/index"

//

export default defineNitroPlugin(async () => {
	// --- Configurations
    const { NUXT_DB_URL } = envConfig
    const sequelize = new Sequelize(NUXT_DB_URL, { logging: false })

	// --- Initializations
	initializeUser(sequelize)
	initializeToken(sequelize)

	// --- Relationships: ForeignKeys & Constraints
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })

    Token.belongsTo(User, { foreignKey: "userId" })
    // --- Relationships

	// --- Connection
    await sequelize.authenticate()
    console.log("✔ Sequelize connection authenticated.")
    
    // --- Sync Database Models
    await sequelize.sync({ alter: true })
    console.log("✔ Sequelize database tables synchronized.")
})
