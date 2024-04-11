import { Sequelize, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export interface PapersTable extends Model<InferAttributes<PapersTable>, InferCreationAttributes<PapersTable>> {
  id: string;
  date: string;
  title: string;
  abstract: string;
  authors: string;
  status: number;
  relevancy: number;
  isStarred: boolean;
  keywords: string;
}

export interface DatesTable extends Model<InferAttributes<DatesTable>, InferCreationAttributes<DatesTable>> {
  value: string;
  status: string;
}

const dbRoot = '/Users/spankyed/Develop/Projects/CurateGPT/services/database/sqlite';
// Setting up the database connection
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${dbRoot}/curate.db`
});

export const DatesTable = sequelize.define<DatesTable>('Date', {
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
  },
});

export const PapersTable = sequelize.define<PapersTable>('Paper', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  date: DataTypes.STRING,
  title: DataTypes.STRING,
  abstract: DataTypes.STRING,
  authors: DataTypes.STRING, // semi-colon separated list
  // metadata
  status: DataTypes.INTEGER,
  relevancy: DataTypes.INTEGER,
  isStarred: DataTypes.BOOLEAN,
  keywords: DataTypes.STRING, // semi-colon separated list
});

PapersTable.belongsTo(DatesTable, { foreignKey: 'date', targetKey: 'value' });
DatesTable.hasMany(PapersTable, { foreignKey: 'date', sourceKey: 'value' });

// export const PaperVideosTable = sequelize.define('PaperVideosTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   paperId: DataTypes.STRING,
//   title: DataTypes.STRING,
//   description: DataTypes.STRING,
//   thumbnailPrompt: DataTypes.STRING,
//   scriptPrompt: DataTypes.STRING,
//   videoUrl: DataTypes.STRING,
//   thumbnailUrl: DataTypes.STRING
// });

// export const ConfigTable = sequelize.define('ConfigTable', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   lastRun: DataTypes.STRING,
// });

// Assuming a one-to-one relationship between Papers and PaperVideos
// PapersTable.hasOne(PaperVideosTable, {
//   foreignKey: 'paperId'
// });
// PaperVideosTable.belongsTo(PapersTable, {
//   foreignKey: 'paperId'
// });
