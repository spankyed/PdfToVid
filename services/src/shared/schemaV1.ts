import { Sequelize, DataTypes } from "sequelize";

const dbRoot = '/Users/spankyed/Develop/Projects/CurateGPT/services/database/sqlite';
// Setting up the database connection
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${dbRoot}/curate.db`
});

export const DateTable = sequelize.define('DateTable', {
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
  },
});

export const PapersTable = sequelize.define('PapersTable', {
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
  liked: DataTypes.BOOLEAN,
  keywords: DataTypes.STRING, // semi-colon separated list
});

PapersTable.belongsTo(DateTable, { foreignKey: 'date', targetKey: 'value' });
DateTable.hasMany(PapersTable, { foreignKey: 'date', sourceKey: 'value' });

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
