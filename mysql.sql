# TABLE
create table role
(
    _roleID    varchar(36)                         not null
        primary key,
    _userID    varchar(36)                         not null,
    _name      enum ('admin', 'employer', 'candidate') default 'head'                        not null,
    _desc      text                                not null,
    _createdAt timestamp default CURRENT_TIMESTAMP not null,
    _updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    _createdBy varchar(36)                         not null,
    _updatedBy varchar(36)                         not null
);

create table company
(
    _companyID        varchar(36)                                                   not null
        primary key,
    _name             varchar(255)                                                  not null,
    _contact          varchar(255)                                                  null,
    _email            varchar(50)                                                   not null unique,
    _phone            varchar(20)                                                   not null,
    _province         varchar(255)                                                  not null,
    _address          varchar(255)                                                  null,
    _field            varchar(255)                                                  not null,
    _logo             varchar(255)                                                  not null,
    _scale            varchar(6)                                                    null,
    _corporateTaxCode varchar(100)                                                  not null,
    _website          varchar(255)                                                  null,
    _status           enum ('inactive', 'active', 'lock') default 'active'          not null,
    _createdAt        timestamp                           default CURRENT_TIMESTAMP not null,
    _updatedAt        timestamp                           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    _createdBy        varchar(36)                                                   not null,
    _updatedBy        varchar(36)                                                   not null
);

create table user
(
    _userID    varchar(36)                                                   not null
        primary key,
    _companyID varchar(36)                                                   null,
    _username  varchar(255)                                                  null,
    _email     varchar(50)                                                   not null unique,
    _password  varchar(100)                                                  not null,
    _phone     varchar(20)                                                   null,
    _avatar    varchar(255)                                                  null,
    _status    enum ('inactive', 'active', 'lock') default 'lock'            not null,
    _createdAt timestamp                           default CURRENT_TIMESTAMP not null,
    _updatedAt timestamp                           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    _createdBy varchar(36)                                                   not null,
    _updatedBy varchar(36)                                                   not null,
    foreign key (_companyID) references company (_companyID)
);

# Store verify_code for user unique act update code
create table verify_code
(
    _verifyCodeID varchar(36)                                           not null
        primary key,
    _code         varchar(36)                                           not null,
    _email        varchar(50)                                           not null unique,
    _status       enum ('active', 'inactive') default 'active'          not null,
    _createdAt    timestamp                   default CURRENT_TIMESTAMP not null,
    _updatedAt    timestamp                   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    _createdBy    varchar(36)                                           not null,
    _updatedBy    varchar(36)                                           not null
);


# INSERT DATA
INSERT INTO user (_userID, _companyID, _username, _email, _password, _phone, _avatar, _status, _createdAt, _updatedAt,
                  _createdBy, _updatedBy)
VALUES ('0000-0000-0000-0000', '', 'Admin', 'admin@gmail.com', NOW(), NOW(), 'system', 'system');

# INSERT INTO role (_roleID, _name, _desc, _status, _createdAt, _updatedAt, _createdBy, _updatedBy)
# VALUES ('1', '', 'Admin', 'Administrator role', NOW(), NOW(), 'system', 'system');
