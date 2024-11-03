create database blog
use blog

create table uzivatel(
ID int primary key Auto_increment,
username varchar(30),
password varchar(30)
);

create table blogs(
ID int primary key Auto_increment,
uzivatel_id int,
foreign key (uzivatel_id) references uzivatel(id),
text varchar(100),
date date default (CURRENT_DATE)
);

create table access(
ID int primary key Auto_increment,
blogs_id int,
foreign key (blogs_id) references blogs(id),
uzivatel_id int,
foreign key (uzivatel_id) references uzivatel(id)
);

delimiter //
create procedure addaccess(_blogid int, _user varchar(30))
begin
declare _uzivatel_id int;
select ID into _uzivatel_id from uzivatel where username = _user;
insert into access(uzivatel_id,blogs_id) values(_uzivatel_id,_blogid);
end //
delimiter ;

#call addblog("ahoj","idk");
#call addaccess(7,"adam");

#SELECT b.ID,b.text,b.date,u.username FROM blogs as b inner join uzivatel as u on b.uzivatel_id = u.ID ORDER BY b.id DESC

delimiter //
create procedure viewblogs(_user varchar(30))
begin
declare _uzivatel_id int;
select ID into _uzivatel_id from uzivatel where username = _user;
select b.text,u.username,b.date,b.ID
from blogs as b inner JOIN  uzivatel as u on b.uzivatel_id = u.ID
where b.ID in (select a.blogs_id from access as a where a.uzivatel_id = _uzivatel_id) or b.ID not in (select a.blogs_id from access as a) or b.uzivatel_id = _uzivatel_id
order by date desc;
end //
delimiter ;

#call viewblogs("adam");

alter table uzivatel
add admin bit