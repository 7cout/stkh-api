// Запрос для получения списка пользователей
export const USERS_QUERY = `
  SELECT 
    account_id,
    user_name 
  FROM sap_users
  ORDER BY account_id ASC
`;