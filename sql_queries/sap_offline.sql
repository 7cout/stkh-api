CREATE TABLE sap_offline (
    account_id INT NOT NULL,
    time_end DATETIMEOFFSET(7) NOT NULL,
    time_start DATETIMEOFFSET(7) NOT NULL,
    category NVARCHAR(1) NULL,
    CONSTRAINT PK_sap_offline PRIMARY KEY (account_id, time_end, time_start)
);