import { Model, DataTypes, Sequelize } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Output extends Model<InferAttributes<Output>, InferCreationAttributes<Output>> {
	declare id: CreationOptional<number>
	declare icon: CreationOptional<string>
	declare name: string
	declare unit: CreationOptional<string>
	declare pinId: CreationOptional<number>
	declare sensorId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Output.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			icon: {
				type: DataTypes.STRING,
				defaultValue: "mdi-thermometer",
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			unit: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			pinId: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: { model: "pins", key: "id" },
				onDelete: "SET NULL",
			},
			sensorId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "sensors", key: "id" },
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
			tableName: "outputs",
			timestamps: true,
		}
	)
	return Output
}

//

export { Output, initialize }
