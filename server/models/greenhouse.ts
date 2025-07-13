import { Model, DataTypes, Sequelize } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Greenhouse extends Model<InferAttributes<Greenhouse>, InferCreationAttributes<Greenhouse>> {
	declare id: CreationOptional<number>
	declare name: string
	declare description: CreationOptional<string>
	declare userId: ForeignKey<number>
	declare tokenId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Greenhouse.init(
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
			description: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "users", key: "id" },
				onDelete: "CASCADE",
			},
			tokenId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "tokens", key: "id" },
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
			tableName: "greenhouses",
			timestamps: true,
		}
	)
	return Greenhouse
}

//

export { Greenhouse, initialize }
