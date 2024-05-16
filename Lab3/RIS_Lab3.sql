--создать 2 пользователя + привилегии
--system_connection
create user DYV identified by 1234;
grant all privileges to DYV; 

create user GVE identified by 1234;
grant all privileges to GVE;

--создаем connection
--lab3_ris1 - DYV(1234)
--lab3_ris2 - GVE(1234)

--создать 2 таблицы на 2 серверах
--lab3_ris1
drop table XXX;
create table XXX(
  x int primary key
);

--lab3_ris2
drop table YYY;
create table YYY(
  y int primary key
);

--создать dblink типа user1-user1 между юзерами на разных С
--lab3_ris1
CREATE DATABASE LINK GVE_db 
   CONNECT TO GVE
   IDENTIFIED BY "1234"        -- у GVE
   USING 'localhost:1521/orcl.168.1.102';

Select * from YYY@GVE_db;

 
--insert - insert   
begin
   INSERT INTO YYY@GVE_db values(4);
   INSERT INTO XXX values(1);
   Commit;
end;
select * from XXX;
select * from YYY@GVE_db;

--insert-update   
begin
   insert into XXX values(3);
   update YYY@GVE_db SET y=5 where y=4;
   commit;
end;
select * from XXX;
select * from YYY@GVE_db;

--update-insert
begin
   insert into YYY@GVE_db values(3);
   update XXX set x=4 where x=1;
   commit;
end;
select * from XXX;
select * from YYY@GVE_db;


--нарушение уникальности на удаленном сервере
begin
   insert into XXX values(5);   --
   insert into YYY@GVE_db values(3);
end;

--заблокируется и будет ожидать освобождения ресурса  
delete from YYY;                    --lab3_ris2
insert into YYY@GVE_db values (6);  --lab3_ris1

commit
--очистить таблицы   
begin
   delete XXX;
   delete YYY@GVE_db;
end;
select * from xxx;
select * from YYY@GVE_db;
