import { Model, DataTypes, Sequelize } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Mcu extends Model<InferAttributes<Mcu>, InferCreationAttributes<Mcu>> {
	declare id: CreationOptional<number>
	declare name: string
	declare label: CreationOptional<string>
	declare connected: CreationOptional<boolean>
	declare tokenId: ForeignKey<number>
	declare greenhouseId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Mcu.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			label: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			connected: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			tokenId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "tokens", key: "id" },
				onDelete: "CASCADE",
			},
			greenhouseId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "greenhouses", key: "id" },
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
			tableName: "mcus",
			timestamps: true,
		}
	)
	return Mcu
}

//

export { Mcu, initialize }
