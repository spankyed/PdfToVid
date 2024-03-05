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
  authors: DataTypes.STRING, // Consider JSON storage or a related table for multiple authors
});

export const PaperMetaDataTable = sequelize.define('PaperMetaDataTable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paperId: DataTypes.STRING,
  relevancy: DataTypes.INTEGER,
  liked: DataTypes.BOOLEAN,
  keywords: DataTypes.STRING, // Consider JSON storage
  status: DataTypes.INTEGER
});

export const PaperVideosTable = sequelize.define('PaperVideosTable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  paperId: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  thumbnailPrompt: DataTypes.STRING,
  scriptPrompt: DataTypes.STRING,
  videoUrl: DataTypes.STRING,
  thumbnailUrl: DataTypes.STRING
});

export const ConfigTable = sequelize.define('ConfigTable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lastRun: DataTypes.STRING,
});
// Assuming a one-to-one relationship between Papers and PaperMetaData
PapersTable.hasOne(PaperMetaDataTable, {
  foreignKey: 'paperId'
});
PaperMetaDataTable.belongsTo(PapersTable, {
  foreignKey: 'paperId'
});

// Assuming a one-to-one relationship between Papers and PaperVideos
PapersTable.hasOne(PaperVideosTable, {
  foreignKey: 'paperId'
});
PaperVideosTable.belongsTo(PapersTable, {
  foreignKey: 'paperId'
});

