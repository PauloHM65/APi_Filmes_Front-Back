const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('db.json not found. Creating a new one...');
      const defaultData = { favorites: [], reviews: [], history: [] };
      writeDB(defaultData);
      return defaultData;
    }
    console.error("Error reading database:", error);
    return { favorites: [], reviews: [], history: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing to database:", error);
  }
};

module.exports = { readDB, writeDB };
