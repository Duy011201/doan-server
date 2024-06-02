# TABLE
create table role
(
    roleID    varchar(36)                         not null
        primary key,
    userID    varchar(36)                         not null,
    name      varchar(255)                        not null,
    `desc`     text                               not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                         not null,
    updatedBy varchar(36)                         not null
);

create table company
(
    companyID        varchar(36)                                                   not null
        primary key,
    name             varchar(255)                                                  not null,
    contact          varchar(255)                                                  null,
    email            varchar(50)                                                   not null unique,
    phone            varchar(20)                                                   not null,
    province         varchar(255)                                                  not null,
    address          varchar(255)                                                  null,
    field            varchar(255)                                                  not null,
    logo             varchar(255)                                                  not null,
    scale            varchar(6)                                                    null,
    corporateTaxCode varchar(100)                                                  not null,
    website          varchar(255)                                                  null,
    status           enum ('active', 'lock') default 'active'          not null,
    createdAt        timestamp                           default CURRENT_TIMESTAMP not null,
    updatedAt        timestamp                           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy        varchar(36)                                                   not null,
    updatedBy        varchar(36)                                                   not null
);

create table user
(
    userID    varchar(36)                                                   not null
        primary key,
    companyID varchar(36)                                                   null,
    username  varchar(255)                                                  null,
    email     varchar(50)                                                   not null unique,
    password  varchar(100)                                                  not null,
    phone     varchar(20)                                                   null,
    avatar    varchar(255)                                                  null,
    status    enum ('active', 'lock') default 'lock'            not null,
    createdAt timestamp                           default CURRENT_TIMESTAMP not null,
    updatedAt timestamp                           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                                                   not null,
    updatedBy varchar(36)                                                   not null,
    foreign key (companyID) references company (companyID)
);

# Support for user
CREATE TABLE user_profile
(
    profileID   varchar(36)  NOT NULL PRIMARY KEY,
    userID      varchar(36)  NOT NULL,
    language    varchar(50)  NULL,
    certificate varchar(100) NULL,
    education   varchar(255) NULL,
    FOREIGN KEY (userID) REFERENCES user (userID)
);

# Store verify_code for user unique act update code
create table verify_code
(
    verifyCodeID varchar(36)                                           not null
        primary key,
    userID       varchar(36)                                           null,
    code         varchar(36)                                           not null,
    email        varchar(50)                                           not null unique,
    status       enum ('active', 'inactive') default 'active'          not null,
    createdAt    timestamp                   default CURRENT_TIMESTAMP not null,
    updatedAt    timestamp                   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy    varchar(36)                                           not null,
    updatedBy    varchar(36)                                           not null,
    foreign key (userID) references user (userID)
);

create table blog
(
    blogID    varchar(36)                                           not null
        primary key,
    status    enum ('active', 'inactive') default 'active'          not null,
    title     varchar(255)                                          not null,
    keyword   varchar(255)                                          not null,
    content   TEXT                                                  not null,
    createdAt timestamp                   default CURRENT_TIMESTAMP not null,
    updatedAt timestamp                   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                                           not null,
    updatedBy varchar(36)                                           not null,
    foreign key (createdBy) references user (userID),
    foreign key (updatedBy) references user (userID)
);

# INSERT DATA

