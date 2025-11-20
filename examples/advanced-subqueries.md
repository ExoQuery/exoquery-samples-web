---
title: Advanced Subqueries
icon: 🔍
category: Advanced
description: Using subqueries for complex filtering
---

## Advanced Subqueries
**Icon:** 🔍
**Category:** Advanced
**Description:** Using subqueries for complex filtering

### Code
```kotlin
import io.exoquery.*
import kotlinx.serialization.Serializable

@Serializable
data class Product(val id: Int, val name: String, val price: Int, val categoryId: Int)

@Serializable
data class Category(val id: Int, val name: String, val minPrice: Int)

//sampleStart
val expensiveProducts = sql.select {
    val p = from(Table<Product>())
    val avgPrice = sql { 
        Table<Product>().map { it.price }.avg() 
    }
    where { p.price > avgPrice }
    p
}
//sampleEnd

fun main(): Unit = expensiveProducts.buildPrettyFor.Postgres().runSample()
```

### Output
```sql
SELECT
  p.id,
  p.name,
  p.price,
  p.categoryId
FROM
  Product p
WHERE
  p.price > (
    SELECT AVG(p2.price)
    FROM Product p2
  )
```

### Schema
```sql
CREATE TABLE Product (id SERIAL PRIMARY KEY, name VARCHAR(100), price INT, categoryId INT);
CREATE TABLE Category (id SERIAL PRIMARY KEY, name VARCHAR(100), minPrice INT);

INSERT INTO Product (id, name, price, categoryId) VALUES
  (1, 'Lunar Boots', 150, 1),
  (2, 'Solar Panel Kit', 500, 2),
  (3, 'Space Suit', 1200, 1),
  (4, 'Oxygen Tank', 300, 2);

INSERT INTO Category (id, name, minPrice) VALUES
  (1, 'Apparel', 100),
  (2, 'Equipment', 200);
```

### Try
- Try using `IN` with a subquery to filter by category
- Try correlating the subquery with the outer query
- Add a `HAVING` clause with a subquery in the aggregation

