# TABLE
create table role
(
    roleID      varchar(36)                           not null primary key,
    name        varchar(255)                          not null unique,
    description text                                  not null,
    createdAt   timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt   timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy   varchar(36) default 'system'          not null,
    updatedBy   varchar(36) default 'system'          not null
);

create table company
(
    companyID        varchar(36)                                                    not null primary key,
    name             varchar(255)                                                   not null,
    introduce        longtext                                                       null,
    email            varchar(50)                                                    null,
    phone            varchar(20)                                                    null,
    province         varchar(255)                                                   null,
    address          varchar(255)                                                   null,
    field            varchar(255)                                                   null,
    logo             varchar(255)                                                   null,
    scale            smallint                                                       null,
    corporateTaxCode varchar(100)                                                   not null unique,
    website          varchar(255)                                                   null,
    status           enum ('ACTIVE', 'IN_ACTIVE', 'LOCK') default 'ACTIVE'          not null,
    createdAt        timestamp                            default CURRENT_TIMESTAMP not null,
    updatedAt        timestamp                            default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy        varchar(36)                          default 'system'          not null,
    updatedBy        varchar(36)                          default 'system'          not null
);

create table user
(
    userID      varchar(36)                                                    not null primary key,
    companyID   varchar(36)                                                    null,
    username    varchar(255)                                                   null,
    email       varchar(50)                                                    not null unique,
    password    varchar(100)                                                   not null,
    phone       varchar(20)                                                    null,
    avatar      varchar(255)                                                   null,
    profile     varchar(255)                                                   null,
    status      enum ('ACTIVE', 'IN_ACTIVE', 'LOCK') default 'ACTIVE'          not null,
    language    varchar(50)                                                    null,
    certificate varchar(100)                                                   null,
    education   varchar(255)                                                   null,
    createdAt   timestamp                            default CURRENT_TIMESTAMP not null,
    updatedAt   timestamp                            default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy   varchar(36)                          default 'system'          not null,
    updatedBy   varchar(36)                          default 'system'          not null,
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
    verifyCodeID varchar(36)                                            not null primary key,
    code         varchar(36)                                            not null,
    email        varchar(50)                                            not null unique,
    status       enum ('ACTIVE', 'IN_ACTIVE') default 'ACTIVE'          not null,
    createdAt    timestamp                    default CURRENT_TIMESTAMP not null,
    updatedAt    timestamp                    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy    varchar(36)                  default 'system'          not null,
    updatedBy    varchar(36)                  default 'system'          not null
);

create table file
(
    fileID    varchar(36)                                            not null primary key,
    userID    varchar(36)                                            null,
    companyID varchar(36)                                            null,
    fileName  varchar(255)                                           not null,
    fileType  varchar(255)                                           not null,
    filePath  varchar(255)                                           not null unique,
    status    enum ('ACTIVE', 'IN_ACTIVE') default 'ACTIVE'          not null,
    createdAt timestamp                    default CURRENT_TIMESTAMP not null,
    updatedAt timestamp                    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                  default 'system'          not null,
    updatedBy varchar(36)                  default 'system'          not null
);

create table blog
(
    blogID    varchar(36)                                                         not null primary key,
    userID    varchar(36)                                                         not null,
    status    enum ('PENDING', 'APPROVED', 'PUBLISHED') default 'PENDING'         not null,
    title     varchar(255)                                                        not null,
    keyword   varchar(255)                                                        not null,
    content   longtext                                                            not null,
    view      int                                       default 0                 not null,
    image     varchar(255)                                                        not null,
    createdAt timestamp                                 default CURRENT_TIMESTAMP not null,
    updatedAt timestamp                                 default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)                               default 'system'          not null,
    updatedBy varchar(36)                               default 'system'          not null,
    foreign key (userID) references user (userID)
);

create table service_pack
(
    servicePackID   varchar(36)                           not null primary key,
    servicePackName varchar(255)                          not null,
    price           INT                                   NOT NULL,
    promotion       TINYINT                               NOT NULL,
    content         longtext                              not null,
    expirationDate  TINYINT                               not null,
    image           varchar(255)                          not null,
    createdAt       timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt       timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy       varchar(36) default 'system'          not null,
    updatedBy       varchar(36) default 'system'          not null
);

create table product
(
    productID       varchar(36)                                                 not null primary key,
    servicePackID   varchar(36)                                                 not null,
    userID          varchar(36)                                                 not null,
    status          enum ('DRAFT', 'PENDING', 'PAID') default 'DRAFT'           not null,
    totalExpiration TINYINT                                                     not null default 0,
    createdAt       timestamp                         default CURRENT_TIMESTAMP not null,
    updatedAt       timestamp                         default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy       varchar(36)                       default 'system'          not null,
    updatedBy       varchar(36)                       default 'system'          not null,
    foreign key (userID) references user (userID),
    foreign key (servicePackID) REFERENCES service_pack (servicePackID)
);

create table history
(
    historyID varchar(36)                             not null primary key,
    productID varchar(36)                             not null,
    status    enum ('PAID') default 'PAID'            not null,
    createdAt timestamp     default CURRENT_TIMESTAMP not null,
    updatedAt timestamp     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36)   default 'system'          not null,
    updatedBy varchar(36)   default 'system'          not null,
    foreign key (productID) REFERENCES product (productID)
);

create table recruitment
(
    recruitmentID varchar(36)                                                         not null primary key,
    userID        varchar(36)                                                         not null,
    status        enum ('PENDING', 'APPROVED', 'PUBLISHED') default 'PENDING'         not null,
    title         varchar(255)                                                        not null,
    keyword       varchar(255)                                                        not null,
    address       varchar(255)                                                        not null,
    description   longtext                                                            not null,
    required      longtext                                                            not null,
    province      varchar(255)                                                        null,
    field         varchar(255)                                                        null,
    timeForm      varchar(255)                                                        null,
    timeStart     timestamp                                 default CURRENT_TIMESTAMP not null,
    timeEnd       timestamp                                 default CURRENT_TIMESTAMP not null,
    salaryFrom    INT                                                                 not null default 0,
    salaryTo      INT                                                                 not null default 0,
    createdAt     timestamp                                 default CURRENT_TIMESTAMP not null,
    updatedAt     timestamp                                 default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy     varchar(36)                               default 'system'          not null,
    updatedBy     varchar(36)                               default 'system'          not null,
    foreign key (userID) REFERENCES user (userID)
);

create table recruitment_process
(
    recruitmentProcessID varchar(36)                           not null primary key,
    recruitmentID        varchar(36)                           not null,
    candidateID          varchar(36)                           not null,
    saveProfile          varchar(5)  default 'false'           not null,
    createdAt            timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt            timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy            varchar(36) default 'system'          not null,
    updatedBy            varchar(36) default 'system'          not null,
    foreign key (candidateID) REFERENCES user (userID),
    foreign key (recruitmentID) REFERENCES recruitment (recruitmentID)
);

create table follow_company
(
    followCompanyID varchar(36)                           not null primary key,
    userID          varchar(36)                           not null,
    companyID       varchar(36)                           not null,
    createdAt       timestamp   default CURRENT_TIMESTAMP not null,
    updatedAt       timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy       varchar(36) default 'system'          not null,
    updatedBy       varchar(36) default 'system'          not null,
    foreign key (userID) REFERENCES user (userID),
    foreign key (companyID) REFERENCES company (companyID)
);

# INSERT DATA
# Role
INSERT INTO role (roleID,
                  name,
                  description,
                  createdAt,
                  updatedAt,
                  createdBy,
                  updatedBy)
VALUES ('b4f1d09e-34aa-4e38-b24f-9f1c3b7a6d8e',
        'ADMIN',
        'Quản trị nhà tuyển dụng và ứng viên',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'),
       ('7d2e5a1f-46b1-4d9b-b7c3-5e9a7d4f8e2f',
        'CANDIDATE',
        'Ứng viên',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'),
       ('e8b3d2f7-8a6b-4e5f-9c1d-7f8e9a1d3c2b',
        'EMPLOYER',
        'Nhà tuển dụng',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system');


#MSSQL
CREATE TABLE role
(
    roleID      VARCHAR(36)                           NOT NULL PRIMARY KEY,
    name        VARCHAR(255)                          NOT NULL UNIQUE,
    description TEXT                                  NOT NULL,
    createdAt   DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt   DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy   VARCHAR(36) DEFAULT 'system'          NOT NULL,
    updatedBy   VARCHAR(36) DEFAULT 'system'          NOT NULL
);

CREATE TABLE company
(
    companyID        VARCHAR(36)                         NOT NULL PRIMARY KEY,
    name             VARCHAR(255)                        NOT NULL,
    introduce        TEXT                                NULL,
    email            VARCHAR(50)                         NULL,
    phone            VARCHAR(20)                         NULL,
    province         VARCHAR(255)                        NULL,
    address          VARCHAR(255)                        NULL,
    field            VARCHAR(255)                        NULL,
    logo             VARCHAR(255)                        NULL,
    scale            SMALLINT                            NULL,
    corporateTaxCode VARCHAR(100)                        NOT NULL UNIQUE,
    website          VARCHAR(255)                        NULL,
    status           VARCHAR(10) DEFAULT 'ACTIVE'        NOT NULL,
    createdAt        DATETIME   DEFAULT GETDATE()        NOT NULL,
    updatedAt        DATETIME   DEFAULT GETDATE()        NOT NULL,
    createdBy        VARCHAR(36) DEFAULT 'system'        NOT NULL,
    updatedBy        VARCHAR(36) DEFAULT 'system'        NOT NULL
);

CREATE TABLE [user]
(
    userID      VARCHAR(36)                         NOT NULL PRIMARY KEY,
    companyID   VARCHAR(36)                         NULL,
    username    VARCHAR(255)                        NULL,
    email       VARCHAR(50)                         NOT NULL UNIQUE,
    password    VARCHAR(100)                        NOT NULL,
    phone       VARCHAR(20)                         NULL,
    avatar      VARCHAR(255)                        NULL,
    profile     VARCHAR(255)                        NULL,
    status      VARCHAR(10) DEFAULT 'ACTIVE'        NOT NULL,
    language    VARCHAR(50)                         NULL,
    certificate VARCHAR(100)                        NULL,
    education   VARCHAR(255)                        NULL,
    createdAt   DATETIME   DEFAULT GETDATE()        NOT NULL,
    updatedAt   DATETIME   DEFAULT GETDATE()        NOT NULL,
    createdBy   VARCHAR(36) DEFAULT 'system'        NOT NULL,
    updatedBy   VARCHAR(36) DEFAULT 'system'        NOT NULL,
    FOREIGN KEY (companyID) REFERENCES company (companyID)
    );

CREATE TABLE user_role
(
    roleID    VARCHAR(36)                           NOT NULL,
    userID    VARCHAR(36)                           NOT NULL,
    createdAt DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy VARCHAR(36) DEFAULT 'system'          NOT NULL,
    updatedBy VARCHAR(36) DEFAULT 'system'          NOT NULL,
    FOREIGN KEY (roleID) REFERENCES role (roleID),
    FOREIGN KEY (userID) REFERENCES [user] (userID)
);

CREATE TABLE verify_code
(
    verifyCodeID VARCHAR(36)                          NOT NULL PRIMARY KEY,
    code         VARCHAR(36)                          NOT NULL,
    email        VARCHAR(50)                          NOT NULL UNIQUE,
    status       VARCHAR(10) DEFAULT 'ACTIVE'         NOT NULL,
    createdAt    DATETIME   DEFAULT GETDATE()         NOT NULL,
    updatedAt    DATETIME   DEFAULT GETDATE()         NOT NULL,
    createdBy    VARCHAR(36) DEFAULT 'system'         NOT NULL,
    updatedBy    VARCHAR(36) DEFAULT 'system'         NOT NULL
);

CREATE TABLE file
(
    fileID    VARCHAR(36)                          NOT NULL PRIMARY KEY,
    userID    VARCHAR(36)                          NULL,
    companyID VARCHAR(36)                          NULL,
    fileName  VARCHAR(255)                         NOT NULL,
    fileType  VARCHAR(255)                         NOT NULL,
    filePath  VARCHAR(255)                         NOT NULL UNIQUE,
    status    VARCHAR(10) DEFAULT 'ACTIVE'         NOT NULL,
    createdAt DATETIME   DEFAULT GETDATE()         NOT NULL,
    updatedAt DATETIME   DEFAULT GETDATE()         NOT NULL,
    createdBy VARCHAR(36) DEFAULT 'system'         NOT NULL,
    updatedBy VARCHAR(36) DEFAULT 'system'         NOT NULL
);

CREATE TABLE blog
(
    blogID    VARCHAR(36)                           NOT NULL PRIMARY KEY,
    userID    VARCHAR(36)                           NOT NULL,
    status    VARCHAR(10) DEFAULT 'PENDING'         NOT NULL,
    title     VARCHAR(255)                          NOT NULL,
    keyword   VARCHAR(255)                          NOT NULL,
    content   TEXT                                  NOT NULL,
    view      INT         DEFAULT 0                 NOT NULL,
    image     VARCHAR(255)                          NOT NULL,
    createdAt DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy VARCHAR(36)  DEFAULT 'system'         NOT NULL,
    updatedBy VARCHAR(36)  DEFAULT 'system'         NOT NULL,
    FOREIGN KEY (userID) REFERENCES [user] (userID)
);

CREATE TABLE service_pack
(
    servicePackID   VARCHAR(36)                           NOT NULL PRIMARY KEY,
    servicePackName VARCHAR(255)                          NOT NULL,
    price           INT                                   NOT NULL,
    promotion       TINYINT                               NOT NULL,
    content         TEXT                                  NOT NULL,
    expirationDate  TINYINT                               NOT NULL,
    image           VARCHAR(255)                          NOT NULL,
    createdAt       DATETIME   DEFAULT GETDATE()          NOT NULL,
    updatedAt       DATETIME   DEFAULT GETDATE()          NOT NULL,
    createdBy       VARCHAR(36) DEFAULT 'system'          NOT NULL,
    updatedBy       VARCHAR(36) DEFAULT 'system'          NOT NULL
);

CREATE TABLE product
(
    productID       VARCHAR(36)                             NOT NULL PRIMARY KEY,
    servicePackID   VARCHAR(36)                             NOT NULL,
    userID          VARCHAR(36)                             NOT NULL,
    status          VARCHAR(10) DEFAULT 'DRAFT'             NOT NULL,
    totalExpiration TINYINT                                 NOT NULL DEFAULT 0,
    createdAt       DATETIME    DEFAULT GETDATE()           NOT NULL,
    updatedAt       DATETIME    DEFAULT GETDATE()           NOT NULL,
    createdBy       VARCHAR(36) DEFAULT 'system'            NOT NULL,
    updatedBy       VARCHAR(36) DEFAULT 'system'            NOT NULL,
    FOREIGN KEY (userID) REFERENCES [user] (userID),
    FOREIGN KEY (servicePackID) REFERENCES service_pack (servicePackID)
);

CREATE TABLE history
(
    historyID VARCHAR(36)                        NOT NULL PRIMARY KEY,
    productID VARCHAR(36)                        NOT NULL,
    status    VARCHAR(10) DEFAULT 'PAID'         NOT NULL,
    createdAt DATETIME    DEFAULT GETDATE()      NOT NULL,
    updatedAt DATETIME    DEFAULT GETDATE()      NOT NULL,
    createdBy VARCHAR(36) DEFAULT 'system'       NOT NULL,
    updatedBy VARCHAR(36) DEFAULT 'system'       NOT NULL,
    FOREIGN KEY (productID) REFERENCES product (productID)
);

CREATE TABLE recruitment
(
    recruitmentID VARCHAR(36)                           NOT NULL PRIMARY KEY,
    userID        VARCHAR(36)                           NOT NULL,
    status        VARCHAR(15) DEFAULT 'PENDING'         NOT NULL,
    title         VARCHAR(255)                          NOT NULL,
    keyword       VARCHAR(255)                          NOT NULL,
    address       VARCHAR(255)                          NOT NULL,
    description   TEXT                                  NOT NULL,
    required      TEXT                                  NOT NULL,
    province      VARCHAR(255)                          NULL,
    field         VARCHAR(255)                          NULL,
    timeForm      VARCHAR(255)                          NULL,
    timeStart     DATETIME    DEFAULT GETDATE()         NOT NULL,
    timeEnd       DATETIME    DEFAULT GETDATE()         NOT NULL,
    salaryFrom    INT         NOT NULL DEFAULT 0,
    salaryTo      INT         NOT NULL DEFAULT 0,
    createdAt     DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt     DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy     VARCHAR(36) DEFAULT 'system'          NOT NULL,
    updatedBy     VARCHAR(36) DEFAULT 'system'          NOT NULL,
    FOREIGN KEY (userID) REFERENCES [user] (userID)
);

CREATE TABLE recruitment_process
(
    recruitmentProcessID VARCHAR(36)                           NOT NULL PRIMARY KEY,
    recruitmentID        VARCHAR(36)                           NOT NULL,
    candidateID          VARCHAR(36)                           NOT NULL,
    saveProfile          VARCHAR(5)  DEFAULT 'false'           NOT NULL,
    createdAt            DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt            DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy            VARCHAR(36) DEFAULT 'system'          NOT NULL,
    updatedBy            VARCHAR(36) DEFAULT 'system'          NOT NULL,
    FOREIGN KEY (candidateID) REFERENCES [user] (userID),
    FOREIGN KEY (recruitmentID) REFERENCES recruitment (recruitmentID)
);

CREATE TABLE follow_company
(
    followCompanyID VARCHAR(36)                           NOT NULL PRIMARY KEY,
    userID          VARCHAR(36)                           NOT NULL,
    companyID       VARCHAR(36)                           NOT NULL,
    createdAt       DATETIME    DEFAULT GETDATE()         NOT NULL,
    updatedAt       DATETIME    DEFAULT GETDATE()         NOT NULL,
    createdBy       VARCHAR(36)  DEFAULT 'system'         NOT NULL,
    updatedBy       VARCHAR(36)  DEFAULT 'system'         NOT NULL,
    FOREIGN KEY (userID) REFERENCES [user] (userID),
    FOREIGN KEY (companyID) REFERENCES company (companyID)
);
