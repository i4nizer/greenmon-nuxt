import { Sequelize } from "sequelize"
import {
    User, Token, Greenhouse, Mcu, Pin, Sensor, Output,
    initializeUser,
    initializeToken,
    initializeGreenhouse,
    initializeMcu,
    initializePin,
    initializeSensor,
    initializeOutput,
} from "../models/index"

//

export default defineNitroPlugin(async () => {
    // --- Configurations
    const { NUXT_DB_URL } = useRuntimeConfig()
    const sequelize = new Sequelize(NUXT_DB_URL, { logging: false })

	// --- Initializations
	initializeUser(sequelize)
	initializeToken(sequelize)
	initializeGreenhouse(sequelize)
	initializeMcu(sequelize)
	initializePin(sequelize)
	initializeSensor(sequelize)
	initializeOutput(sequelize)

	// --- Relationships: ForeignKeys & Constraints
	User.hasMany(Token, { foreignKey: "userId", onDelete: "CASCADE" })
	User.hasMany(Greenhouse, { foreignKey: "userId", onDelete: "CASCADE" })
    
    Token.belongsTo(User, { foreignKey: "userId" })
	Token.hasOne(Greenhouse, { foreignKey: "tokenId", onDelete: "CASCADE" })
	Token.hasOne(Mcu, { foreignKey: "tokenId", onDelete: "CASCADE" })

    Greenhouse.belongsTo(User, { foreignKey: "userId" })
    Greenhouse.belongsTo(Token, { foreignKey: "tokenId" })
    Greenhouse.hasMany(Mcu, { foreignKey: "greenhouseId", onDelete: "CASCADE" })

    Mcu.belongsTo(Token, { foreignKey: "tokenId" })
    Mcu.belongsTo(Greenhouse, { foreignKey: "greenhouseId" })
    Mcu.hasMany(Pin, { foreignKey: "mcuId", onDelete: "CASCADE" })
    Mcu.hasMany(Sensor, { foreignKey: "mcuId", onDelete: "CASCADE" })
    
    Pin.belongsTo(Mcu, { foreignKey: "mcuId" })
    Pin.hasMany(Output, { foreignKey: "pinId", onDelete: "CASCADE" })
    
    Sensor.belongsTo(Mcu, { foreignKey: "mcuId" })
    Sensor.hasMany(Output, { foreignKey: "sensorId", onDelete: "CASCADE" })
    
    Output.belongsTo(Pin, { foreignKey: "pinId" })
    Output.belongsTo(Sensor, { foreignKey: "sensorId" })
    // --- Relationships

	// --- Connection
    await sequelize.authenticate()
    console.log("✔ Sequelize connection authenticated.")
    
    // --- Sync Database Models
    await sequelize.sync({ alter: true })
    console.log("✔ Sequelize database tables synchronized.")
})
