import { Model, DataTypes, Sequelize, Op } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
	declare id: CreationOptional<number>
	declare type: "Access" | "Refresh" | "Reset" | "Verify" | "Mcu" | "Camera" | "Greenhouse"
	declare value: string
	declare expiry: Date
	declare userId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Token.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			value: {
				type: DataTypes.STRING(512),
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM("Access", "Refresh", "Reset", "Verify", "Mcu", "Camera", "Greenhouse"),
				allowNull: false,
			},
			expiry: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "users", key: "id" },
				onDelete: "CASCADE",
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			tableName: "tokens",
			timestamps: true,
		}
	)
	return Token
}

//

export { Token, initialize }
