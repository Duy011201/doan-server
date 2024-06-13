# TABLE
create table role
(
    roleID      varchar(36)                           not null
        primary key,
    name        varchar(255)                          not null unique,
    description text                                  not null,
    createdAt   timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt   timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy   varchar(36) default 'system'          not null,
    updatedBy   varchar(36) default 'system'          not null
);

create table company
(
    companyID        varchar(36)                                       not null
        primary key,
    name             varchar(255)                                      not null,
    contact          varchar(255)                                      null,
    email            varchar(50)                                       null,
    phone            varchar(20)                                       null,
    province         varchar(255)                                      null,
    address          varchar(255)                                      null,
    field            varchar(255)                                      null,
    logo             varchar(255)                                      null,
    scale            varchar(6)                                        null,
    corporateTaxCode varchar(100)                                      not null unique,
    website          varchar(255)                                      null,
    status           enum ('active', 'lock') default 'active'          not null,
    createdAt        timestamp               default CURRENT_TIMESTAMP not null,
    updatedAt        timestamp               default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy        varchar(36)             default 'system'          not null,
    updatedBy        varchar(36)             default 'system'          not null
);

create table user
(
    userID      varchar(36)                                                   not null
        primary key,
    companyID   varchar(36)                                                   null,
    username    varchar(255)                                                  null,
    email       varchar(50)                                                   not null unique,
    password    varchar(100)                                                  not null,
    phone       varchar(20)                                                   null,
    avatar      varchar(255)                                                  null,
    status      enum ('active', 'inactive', 'lock') default 'lock'            not null,
    language    varchar(50)                                                   null,
    certificate varchar(100)                                                  null,
    education   varchar(255)                                                  null,
    createdAt   timestamp                           default CURRENT_TIMESTAMP not null,
    updatedAt   timestamp                           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy   varchar(36)                         default 'system'          not null,
    updatedBy   varchar(36)                         default 'system'          not null,
    foreign key (companyID) references company (companyID)
);

create table user_role
(
    roleID    varchar(36)                           not null,
    userID    varchar(36)                           not null,
    createdAt timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system'          not null,
    updatedBy varchar(36) default 'system'          not null,
    foreign key (roleID) references role (roleID),
    foreign key (userID) references user (userID)
);

create table verify_code
(
    verifyCodeID varchar(36)                                           not null
        primary key,
    code         varchar(36)                                           not null,
    email        varchar(50)                                           not null unique,
    status       enum ('active', 'inactive') default 'active'          not null,
    createdAt    timestamp                   default CURRENT_TIMESTAMP not null,
    updatedAt    timestamp                   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy    varchar(36)                 default 'system'          not null,
    updatedBy    varchar(36)                 default 'system'          not null
);

create table file
(
    fileID    varchar(36)                                           not null
        primary key,
    userID    varchar(36)                                           null,
    fileName  varchar(255)                                          not null,
    fileType  varchar(255)                                          not null,
    filePath  varchar(255)                                          not null unique,
    status    enum ('active', 'inactive') default 'active'          not null,
    createdAt timestamp                   default CURRENT_TIMESTAMP not null,
    updatedAt timestamp                   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                 default 'system'          not null,
    updatedBy varchar(36)                 default 'system'          not null
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
    createdBy varchar(36)                 default 'system'          not null,
    updatedBy varchar(36)                 default 'system'          not null,
    foreign key (createdBy) references user (userID),
    foreign key (updatedBy) references user (userID)
);

# INSERT DATA

# Role
INSERT INTO role (roleID, name, description, createdAt, updatedAt, createdBy, updatedBy)
VALUES ('a9d3e7c8-2b3f-4c1e-9a6f-8dbe6d6f1c3a', 'super_admin', 'Quản trị toàn bộ hệ thống', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP, 'system', 'system'),
       ('b4f1d09e-34aa-4e38-b24f-9f1c3b7a6d8e', 'admin', 'Quản trị nhà tuyển dụng và ứng viên', CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP, 'system', 'system'),
       ('7d2e5a1f-46b1-4d9b-b7c3-5e9a7d4f8e2f', 'candidate', 'Ứng viên', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system',
        'system'),
       ('e8b3d2f7-8a6b-4e5f-9c1d-7f8e9a1d3c2b', 'employer', 'Nhà tuển dụng', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        'system', 'system');