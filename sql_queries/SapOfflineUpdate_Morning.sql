DECLARE @_date VARCHAR(10) = CONVERT(VARCHAR(10), DATEADD(day, -1, GETDATE()), 120);
DECLARE @_department_id INT = 1;
EXEC dbo.sap_offline_update1 @_date, @_department_id;