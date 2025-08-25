import { parse } from 'csv-parse';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export class CSVReader {
  private dataPath: string;

  constructor(dataPath: string = 'data') {
    this.dataPath = dataPath;
  }

  /**
   * Read any CSV file and return data as array of objects
   */
  async readCSV<T extends Record<string, any>>(filename: string): Promise<T[]> {
    const filePath = join(this.dataPath, filename);
    
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        }, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records as T[]);
          }
        });
      });
    } catch (error) {
      console.error(`Error reading CSV file: ${error}`);
      return [];
    }
  }

  /**
   * Write data to CSV file
   */
  writeCSV<T extends Record<string, any>>(data: T[], filename: string): void {
    const filePath = join(this.dataPath, filename);
    
    if (data.length === 0) {
      console.error('No data to write');
      return;
    }

    // Get headers from first data object
    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(',') + '\n';
    
    // Convert data to CSV format
    const csvContent = data.map(row => 
      headers.map(header => row[header as keyof T]).join(',')
    ).join('\n');
    
    // Write to file
    const fullContent = csvHeader + csvContent;
    writeFileSync(filePath, fullContent, 'utf-8');
    
    console.log(`CSV file created successfully at: ${filePath}`);
  }

  /**
   * Read CSV file from custom path
   */
  async readCSVFromPath<T extends Record<string, any>>(filePath: string): Promise<T[]> {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      
      return new Promise((resolve, reject) => {
        parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        }, (err, records) => {
          if (err) {
            reject(err);
          } else {
            resolve(records as T[]);
          }
        });
      });
    } catch (error) {
      console.error(`Error reading CSV file: ${error}`);
      return [];
    }
  }

  /**
   * Write CSV file to custom path
   */
  writeCSVToPath<T extends Record<string, any>>(data: T[], filePath: string): void {
    if (data.length === 0) {
      console.error('No data to write');
      return;
    }

    // Get headers from first data object
    const headers = Object.keys(data[0]);
    const csvHeader = headers.join(',') + '\n';
    
    // Convert data to CSV format
    const csvContent = data.map(row => 
      headers.map(header => row[header as keyof T]).join(',')
    ).join('\n');
    
    // Write to file
    const fullContent = csvHeader + csvContent;
    writeFileSync(filePath, fullContent, 'utf-8');
    
    console.log(`CSV file created successfully at: ${filePath}`);
  }
}
