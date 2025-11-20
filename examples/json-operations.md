---
title: JSON Operations
icon: 📦
category: Advanced
description: Working with JSON columns in PostgreSQL
---

## JSON Operations
**Icon:** 📦
**Category:** Advanced
**Description:** Working with JSON columns in PostgreSQL

### Code
```kotlin
import io.exoquery.*
import kotlinx.serialization.Serializable

@Serializable
data class Document(
    val id: Int,
    val title: String,
    val metadata: String // JSON column
)

//sampleStart
val documentsWithTag = sql.select {
    val d = from(Table<Document>())
    // Access JSON field using ->> operator
    where { jsonExtractText(d.metadata, "tags") like "%urgent%" }
    d
}
//sampleEnd

fun main(): Unit = documentsWithTag.buildPrettyFor.Postgres().runSample()
```

### Output
```sql
SELECT
  d.id,
  d.title,
  d.metadata
FROM
  Document d
WHERE
  d.metadata->>'tags' LIKE '%urgent%'
```

### Schema
```sql
CREATE TABLE Document (
    id SERIAL PRIMARY KEY, 
    title VARCHAR(200), 
    metadata JSONB
);

INSERT INTO Document (title, metadata) VALUES
  ('Mission Report', '{"tags": "urgent,classified", "author": "Commander"}'),
  ('Supply List', '{"tags": "routine", "author": "Quartermaster"}'),
  ('Emergency Protocol', '{"tags": "urgent,critical", "author": "Safety Officer"}');
```

### Try
- Try extracting nested JSON values with multiple field paths
- Use `jsonb_array_elements` to expand JSON arrays
- Try `@>` containment operator for complex JSON queries

