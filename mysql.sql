# TABLE
create table role (
    roleID varchar(36) not null primary key,
    name varchar(255) not null unique,
    description text not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table company (
    companyID varchar(36) not null primary key,
    name varchar(255) not null,
    introduce longtext null,
    email varchar(50) null,
    phone varchar(20) null,
    province varchar(255) null,
    address varchar(255) null,
    field varchar(255) null,
    logo varchar(255) null,
    scale int null,
    corporateTaxCode varchar(100) not null unique,
    website varchar(255) null,
    status enum ('ACTIVE', 'IN_ACTIVE', 'LOCK') default 'ACTIVE' not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table user (
    userID varchar(36) not null primary key,
    companyID varchar(36) null,
    username varchar(255) null,
    email varchar(50) not null unique,
    password varchar(100) not null,
    phone varchar(20) null,
    avatar varchar(255) null,
    status enum ('ACTIVE', 'IN_ACTIVE', 'LOCK') default 'ACTIVE' not null,
    language varchar(50) null,
    certificate varchar(100) null,
    education varchar(255) null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null,
    foreign key (companyID) references company (companyID)
);

create table user_role (
    roleID varchar(36) not null,
    userID varchar(36) not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null,
    foreign key (roleID) references role (roleID),
    foreign key (userID) references user (userID)
);

create table verify_code (
    verifyCodeID varchar(36) not null primary key,
    code varchar(36) not null,
    email varchar(50) not null unique,
    status enum ('ACTIVE', 'IN_ACTIVE') default 'ACTIVE' not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table file (
    fileID varchar(36) not null primary key,
    userID varchar(36) null,
    companyID varchar(36) null,
    fileName varchar(255) not null,
    fileType varchar(255) not null,
    filePath varchar(255) not null unique,
    status enum ('ACTIVE', 'IN_ACTIVE') default 'ACTIVE' not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table blog (
    blogID varchar(36) not null primary key,
    status enum ('PENDING', 'APPROVED', 'PUBLISHED') default 'PENDING' not null,
    title varchar(255) not null,
    keyword varchar(255) not null,
    content longtext not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table service_pack (
    servicePackID varchar(36) not null primary key,
    servicePackName varchar(255) not null,
    price DECIMAL(10, 2) NOT NULL,
    promotion DECIMAL(10, 2) NOT NULL,
    content longtext not null,
    expirationDate DECIMAL(10, 2) not null,
    image varchar(255) not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null
);

create table product (
    productID varchar(36) not null primary key,
    servicePackID varchar(36) not null,
    userID varchar(36) not null,
    status enum ('DRAFT', 'PENDING', 'PAID') default 'DRAFT' not null,
    totalExpiration DECIMAL(10, 2) not null default 0,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null,
    foreign key (userID) references user (userID),
    foreign key (servicePackID) REFERENCES service_pack(servicePackID)
);

create table history (
    historyID varchar(36) not null primary key,
    productID varchar(36) not null,
    status enum ('PAID') default 'PAID' not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null,
    foreign key (productID) REFERENCES product(productID)
);

create table recruitment (
    recruitmentID varchar(36) not null primary key,
    userID varchar(36) not null,
    status enum ('PENDING', 'APPROVED', 'PUBLISHED') default 'PENDING' not null,
    title varchar(255) not null,
    keyword varchar(255) not null,
    address varchar(255) not null,
    description longtext not null,
    required longtext not null,
    province varchar(255) null,
    field varchar(255) null,
    salaryFrom DECIMAL(10, 2) not null default 0,
    salaryTo DECIMAL(10, 2) not null default 0,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    createdBy varchar(36) default 'system' not null,
    updatedBy varchar(36) default 'system' not null,
    foreign key (userID) REFERENCES user(userID)
);

-- create table recruitment_process (
--     recruitmentProcessID varchar(36) not null primary key,
--     userID varchar(36) not null,
--     status enum ('DRAFT', 'PENDING', 'PUBLIC') default 'DRAFT' not null,
--     title varchar(255) not null,
--     address varchar(255) not null,
--     description longtext not null,
--     required longtext not null,
--     salaryFrom  DECIMAL(10, 2) not null default 0,
--     salaryTo  DECIMAL(10, 2) not null default 0,
--     createdAt timestamp default CURRENT_TIMESTAMP not null,
--     updatedAt timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
--     createdBy varchar(36) default 'system' not null,
--     updatedBy varchar(36) default 'system' not null,
--     foreign key (userID) REFERENCES user(userID)
-- );
# INSERT DATA
# Role
INSERT INTO
    role (
        roleID,
        name,
        description,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy
    )
VALUES
    (
        'a9d3e7c8-2b3f-4c1e-9a6f-8dbe6d6f1c3a',
        'SUPER_ADMIN',
        'Quản trị toàn bộ hệ thống',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'
    ),
    (
        'b4f1d09e-34aa-4e38-b24f-9f1c3b7a6d8e',
        'ADMIN',
        'Quản trị nhà tuyển dụng và ứng viên',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'
    ),
    (
        '7d2e5a1f-46b1-4d9b-b7c3-5e9a7d4f8e2f',
        'CANDIDATE',
        'Ứng viên',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'
    ),
    (
        'e8b3d2f7-8a6b-4e5f-9c1d-7f8e9a1d3c2b',
        'EMPLOYER',
        'Nhà tuển dụng',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'system',
        'system'
    );