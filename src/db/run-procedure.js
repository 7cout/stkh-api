import { pool, poolConnect } from '../db/pool.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

async function runStoredProcedure(procedureName, params = {}) {
  try {
    await poolConnect;
    const request = pool.request();
    
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    
    const result = await request.execute(procedureName);
    
    console.log(`Хранимая процедура "${procedureName}" выполнена успешно`);
    console.log('Результат:', result);
    
    return result;
  } catch (err) {
    console.error('Ошибка при выполнении хранимой процедуры:', err.message);
    throw err;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    procedure: null,
    query: null,
    params: {}
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--procedure' || arg === '-p') {
      result.procedure = args[++i];
    } else if (arg === '--query' || arg === '-q') {
      result.query = args[++i];
    } else if (arg.startsWith('--param-')) {
      const paramName = arg.replace('--param-', '');
      result.params[paramName] = args[++i];
    }
  }
  
  return result;
}

async function main() {
  const args = parseArgs();
  
  if (args.procedure) {
    await runStoredProcedure(args.procedure, args.params);
  } else {
    console.log(`
Использование:
  node run-procedure.js --procedure <имя_процедуры> [--param-<имя> <значение> ...]
Примеры:
  node run-procedure.js --procedure usp_UpdateStatistics
  node run-procedure.js --procedure usp_GenerateReport --param-year 2024 --param-month 1
    `);
  }
}

if (process.argv[1] === __filename) {
  main().catch(err => {
    console.error('Программа завершена с ошибкой:', err.message);
    process.exit(1);
  });
}

export { runStoredProcedure };