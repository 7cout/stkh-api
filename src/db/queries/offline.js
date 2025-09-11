// Базовый запрос для получения offline-данных
export const OFFLINE_BASE_QUERY = `
  SELECT 
    account_id,
    FORMAT(time_start, 'yyyyMMdd') AS date_trunc,
    FORMAT(time_start, 'yyyyMMddHHmmss') AS ts,
    FORMAT(time_end, 'yyyyMMddHHmmss') AS te,
    category
  FROM sap_offline
  WHERE CAST(time_start AS DATE) BETWEEN @from AND @to
`;

// Запрос с фильтром по пользователю
export const OFFLINE_BY_USER_QUERY = `
  ${OFFLINE_BASE_QUERY}
  AND account_id = @userid
  ORDER BY account_id, time_start DESC
`;

// Запрос без фильтра по пользователю
export const OFFLINE_ALL_USERS_QUERY = `
  ${OFFLINE_BASE_QUERY}
  ORDER BY account_id, time_start DESC
`;