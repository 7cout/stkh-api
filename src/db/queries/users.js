// Запрос для получения списка пользователей
export const USERS_QUERY = `
  SELECT
    ui.id,
    CASE WHEN su.user_name IS NOT NULL THEN su.user_name ELSE ui.user_name END AS user_name,
    ui.id as last_report_time,
    ui.id as last_activity_time
  FROM TUserInfo ui
  LEFT JOIN sap_users su ON su.id = ui.id
  ORDER BY id ASC
`;