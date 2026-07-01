import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export type TaskStatus = "pending" | "in-progress" | "completed";

interface TaskAttributes {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type TaskCreationAttributes = Optional<TaskAttributes, "id" | "description" | "status">;

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public status!: TaskStatus;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
  {
    sequelize,
    tableName: "tasks",
  }
);

User.hasMany(Task, { foreignKey: "userId", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId" });

export default Task;
