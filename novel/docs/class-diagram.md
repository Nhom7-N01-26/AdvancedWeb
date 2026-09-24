# Novel Manager Class Diagram

The diagram follows the tables and foreign keys declared in `sql_nhom_7.sql`.

```mermaid
classDiagram
  User "1" --> "0..1" Author : user_id
  Author "1" --> "0..*" Novel : author_id
  Novel "0..*" --> "0..*" Category : novel_categories
  Novel "0..*" --> "0..*" Tag : novel_tags
  Novel "1" --> "0..*" Chapter : novel_id
  User "1" --> "0..*" Comment : user_id
  Chapter "1" --> "0..*" Comment : chapter_id
  Comment "0..1" --> "0..*" Comment : parent_id
  User "1" --> "0..*" Rating : user_id
  Novel "1" --> "0..*" Rating : novel_id
  User "1" --> "0..*" Bookmark : user_id
  Novel "1" --> "0..*" Bookmark : novel_id
  Chapter "0..1" --> "0..*" Bookmark : last_chapter_id
  User "1" --> "0..*" ReadingHistory : user_id
  Novel "1" --> "0..*" ReadingHistory : novel_id
  Chapter "1" --> "0..*" ReadingHistory : chapter_id

  class User {
    +int id PK
    +string username
    +string email
    +string passwordHash
    +string fullName
    +UserRole role
    +boolean isActive
  }
  class Author {
    +int id PK
    +int userId FK
    +string penName
    +int totalNovels
  }
  class Novel {
    +int id PK
    +int authorId FK
    +string title
    +string slug
    +NovelStatus status
    +decimal avgRating
  }
  class Category {
    +int id PK
    +string name
    +string slug
  }
  class Tag {
    +int id PK
    +string name
    +string slug
  }
  class Chapter {
    +int id PK
    +int novelId FK
    +int chapterNumber
    +string title
    +string content
    +ChapterStatus status
  }
  class Comment {
    +int id PK
    +int userId FK
    +int chapterId FK
    +int parentId FK nullable
    +string content
  }
  class Rating {
    +int id PK
    +int userId FK
    +int novelId FK
    +int score
    +string review
  }
  class Bookmark {
    +int id PK
    +int userId FK
    +int novelId FK
    +int lastChapterId FK nullable
  }
  class ReadingHistory {
    +int id PK
    +int userId FK
    +int novelId FK
    +int chapterId FK
    +decimal progressPercent
  }
```

`novel_categories` and `novel_tags` are represented as TypeORM many-to-many join tables. Decimal columns remain strings because MySQL drivers return exact decimals as strings.
