import { DataTypes, Model, Sequelize } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Pin extends Model<InferAttributes<Pin>, InferCreationAttributes<Pin>> {
	declare id: CreationOptional<number>
	declare type: CreationOptional<"Digital" | "Analog">
	declare mode: CreationOptional<"Unset" | "Input" | "Output" | "Other">
	declare number: CreationOptional<number>
	declare mcuId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Pin.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			type: {
				type: DataTypes.ENUM("Digital", "Analog"),
				defaultValue: "Digital",
			},
			mode: {
				type: DataTypes.ENUM("Unset", "Input", "Output", "Other"),
				defaultValue: "Unset",
			},
			number: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			mcuId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "mcus", key: "id" },
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
			tableName: "pins",
			timestamps: true,
			indexes: [
				{
					unique: true,
					fields: ["mcuId", "type", "number"],
				},
			],
		}
	)
	return Pin
}

//

export { Pin, initialize }