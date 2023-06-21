import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const CSV_FILE_PATH = path.resolve('./public/mytodo.csv');

export function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
}

export function writeCSV(data) {
  const csvData = [
    ['created_timestamp', 'item_description', 'item_group', 'item_status', 'dependency', 'remarks'],
    ...data.map(item => Object.values(item))
  ].join('\n');
  return fs.promises.writeFile(CSV_FILE_PATH, csvData);
}
