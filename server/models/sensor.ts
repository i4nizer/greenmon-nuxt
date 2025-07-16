import { Model, DataTypes, Sequelize, Op } from "sequelize"
import type { InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional } from "sequelize"

//

class Sensor extends Model<InferAttributes<Sensor>, InferCreationAttributes<Sensor>> {
	declare id: CreationOptional<number>
	declare name: string
	declare label: CreationOptional<string>
	declare interval: CreationOptional<number>
	declare lastread: CreationOptional<number>
	declare readphase: CreationOptional<"Off" | "Before" | "During" | "After">
	declare disabled: CreationOptional<boolean>
	declare mcuId: ForeignKey<number>
	declare createdAt: CreationOptional<Date>
	declare updatedAt: CreationOptional<Date>
}

//

const initialize = (sequelize: Sequelize) => {
	Sensor.init(
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
			interval: {
				type: DataTypes.INTEGER,
				defaultValue: 15 * 60,
			},
			lastread: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			readphase: {
				type: DataTypes.ENUM("Off", "Before", "During", "After"),
				defaultValue: "Off",
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
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
			tableName: "sensors",
			timestamps: true,
		}
	)
	return Sensor
}

//

export { Sensor, initialize }