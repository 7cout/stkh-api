//Запрос для получения списка пользователей
export const USERS_QUERY = `
  DECLARE @DepartmentID INT = '2429';

  -- Заполняем таблицу пользователями из целевого департамента и его подразделений
  WITH HierarchyCTE AS (
    -- Анкорная часть: выбираем начальный узел
    SELECT 
      ID, 
      PARENT_ID,
      -- Извлекаем только имя пользователя (после последнего обратного слеша)
      CASE 
        WHEN CHARINDEX('\\', display_name) > 0 THEN
          RIGHT(
            display_name, 
            LEN(display_name) - CHARINDEX('\\', display_name)
          )
        ELSE
          display_name
      END AS display_name
    FROM THier
    WHERE ID = @DepartmentID
    
    UNION ALL
    
    -- Рекурсивная часть: выбираем дочерние узлы
    SELECT 
      t.ID, 
      t.PARENT_ID,
      CASE
        WHEN CHARINDEX('\\', t.display_name) > 0 THEN
          RIGHT(
            t.display_name, 
            LEN(t.display_name) - CHARINDEX('\\', t.display_name)
          )
        ELSE
          t.display_name
      END AS display_name
    FROM THier t
    INNER JOIN HierarchyCTE cte ON t.PARENT_ID = cte.ID
  )
  
  SELECT
    ui.id,
    CASE 
      WHEN su.user_name IS NOT NULL THEN su.user_name 
      ELSE ui.user_name 
    END AS user_name,
    ui.id as last_report_time,
    ui.id as last_activity_time
  FROM TUserInfo ui
  JOIN HierarchyCTE as cte ON cte.display_name = ui.user_name
  LEFT JOIN sap_users su ON su.id = ui.id
  ORDER BY id ASC
`;
