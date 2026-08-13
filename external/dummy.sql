show tables;
select * from attendances;
select * from transport_allowance_details;
select * from transport_allowance_periods;
select * from transport_allowance_settings;

DELETE from attendances;
DELETE from transport_allowance_details;
DELETE from transport_allowance_periods;

docker exec -i my-mysql mysqldump -u root -p employee_management > /Users/ujikit/Documents/Projects/belajar/employee-management-api2/backup.sql
docker exec -i my-mysql mysql -u root -psecret employee_management < /Users/ujikit/Documents/Projects/belajar/employee-management-api2/backup.sql
