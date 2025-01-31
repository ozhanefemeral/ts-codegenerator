export const mockSchemaString = `
// schema.prisma

// Enum to represent different status values
enum Status {
  ACTIVE
  INACTIVE
  PENDING
}

// Model for User with different field types and attributes
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  status    Status   @default(ACTIVE)
  posts     Post[]
  profile   Profile? @relation(fields: [profileId], references: [id])
  profileId Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Model for Post, with a one-to-many relation to User
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  userId    Int
  author    User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Model for Profile, with a one-to-one relation to User
model Profile {
  id      Int    @id @default(autoincrement())
  bio     String?
  avatar  String?
  userId  Int    @unique
  user    User   @relation(fields: [userId], references: [id])
}

// Model for Category, with a many-to-many relation to Post
model Category {
  id       Int      @id @default(autoincrement())
  name     String
  posts    Post[]   @relation("CategoryPosts")
  createdAt DateTime @default(now())
}

// Model for Tag, with a many-to-many relation to Post using a join table
model Tag {
  id       Int      @id @default(autoincrement())
  name     String
  posts    Post[]   @relation("PostTags")
  createdAt DateTime @default(now())
}

// Many-to-many relation between Post and Tag using an explicit join table
model PostTag {
  postId  Int
  tagId   Int
  post    Post   @relation(fields: [postId], references: [id])
  tag     Tag    @relation(fields: [tagId], references: [id])

  @@id([postId, tagId]) // Composite primary key
}

// Many-to-one relation between Comment and Post (a comment belongs to one post)
model Comment {
  id      Int    @id @default(autoincrement())
  content String
  postId  Int
  post    Post   @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
}

// Model for Company with a one-to-many relation to Employee
model Company {
  id        Int       @id @default(autoincrement())
  name      String
  location  String
  employees Employee[]
}

// Model for Employee with a many-to-one relation to Company
model Employee {
  id        Int       @id @default(autoincrement())
  name      String
  position  String
  companyId Int
  company   Company   @relation(fields: [companyId], references: [id])
}

// Model for Order, with a many-to-one relation to User and a one-to-many relation to OrderItem
model Order {
  id        Int      @id @default(autoincrement())
  total     Float
  status    String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  items     OrderItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Model for OrderItem, which has a many-to-one relation to Order
model OrderItem {
  id       Int    @id @default(autoincrement())
  product  String
  quantity Int
  price    Float
  orderId  Int
  order    Order  @relation(fields: [orderId], references: [id])
}
`;
