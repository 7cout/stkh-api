import cron from 'node-cron';
import path from 'path';
import moment from 'moment';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { runStoredProcedure } from '../db/run-procedure.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DynamicScheduler {
  constructor() {
    this.tasks = new Map();
    this.configPath = path.resolve(__dirname, '../../config/schedules.json');
  }

  replacePlaceholders(params) {
    const replaced = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (value === 'CURRENT_DATE') {
        replaced[key] = moment().format('YYYY-MM-DD');
      } else {
        replaced[key] = value;
      }
    }
    
    return replaced;
  }

  async loadConfig() {
    try {
      const data = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка загрузки конфигурации расписаний:', error);
      return { procedures: [] };
    }
  }

  createTask(jobConfig) {
    return cron.schedule(jobConfig.schedule, async () => {
      console.log(`Запуск задачи: ${jobConfig.description}`);
      
      try {
        const params = this.replacePlaceholders(jobConfig.params);
        
        await runStoredProcedure(jobConfig.procedure, params);
        console.log(`Задача ${jobConfig.description} выполнена успешно`);
      } catch (error) {
        console.error(`Ошибка выполнения задачи ${jobConfig.description}:`, error);
      }
    });
  }

  async initialize() {
    console.log('Инициализация планировщика задач...');
    
    this.stopAll();
    
    const config = await this.loadConfig();
    
    for (const jobConfig of config.procedures) {
      if (jobConfig.enabled) {
        try {
          const task = this.createTask(jobConfig);
          this.tasks.set(jobConfig.name, task);
          console.log(`Задача "${jobConfig.description}" запланирована: ${jobConfig.schedule}`);
        } catch (error) {
          console.error(`Ошибка создания задачи ${jobConfig.name}:`, error);
        }
      }
    }
    
    console.log(`Планировщик инициализирован. Активных задач: ${this.tasks.size}`);
  }

  stopAll() {
    for (const [name, task] of this.tasks) {
      task.stop();
      console.log(`Задача ${name} остановлена`);
    }
    this.tasks.clear();
  }

  async reload() {
    console.log('Перезагрузка конфигурации планировщика...');
    await this.initialize();
  }

  getStatus() {
    const status = [];
    for (const [name, task] of this.tasks) {
      status.push({
        name,
        running: task.getStatus() === 'started'
      });
    }
    return status;
  }
}

const scheduler = new DynamicScheduler();

export default scheduler;