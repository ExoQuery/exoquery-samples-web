---
title: Window Functions
icon: 🪟
category: Advanced
description: ROW_NUMBER, RANK, and partitioning
---

## Window Functions
**Icon:** 🪟
**Category:** Advanced
**Description:** ROW_NUMBER, RANK, and partitioning

### Code
```kotlin
import io.exoquery.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class Sale(
    val id: Int,
    @SerialName("product_name") val productName: String,
    val amount: Int,
    val region: String
)

@Serializable
data class RankedSale(
    val productName: String,
    val amount: Int,
    val region: String,
    val rank: Int
)

//sampleStart
val rankedSales = sql.select {
    val s = from(Table<Sale>())
    RankedSale(
        productName = s.productName,
        amount = s.amount,
        region = s.region,
        rank = rowNumber().over { 
            partitionBy(s.region)
            orderBy(s.amount.desc())
        }
    )
}
//sampleEnd

fun main(): Unit = rankedSales.buildPrettyFor.Postgres().runSample()
```

### Output
```sql
SELECT
  s.product_name AS productName,
  s.amount,
  s.region,
  ROW_NUMBER() OVER (
    PARTITION BY s.region
    ORDER BY s.amount DESC
  ) AS rank
FROM
  Sale s
```

### Schema
```sql
CREATE TABLE Sale (id SERIAL PRIMARY KEY, product_name VARCHAR(100), amount INT, region VARCHAR(50));

INSERT INTO Sale (product_name, amount, region) VALUES
  ('Lunar Boots', 1500, 'North'),
  ('Solar Panel', 3000, 'North'),
  ('Space Suit', 2500, 'South'),
  ('Oxygen Tank', 1200, 'South'),
  ('Lunar Boots', 1800, 'South');
```

### Try
- Try using `RANK()` instead of `ROW_NUMBER()` to see ties
- Add multiple columns to `partitionBy` for finer grouping
- Try `LAG()` or `LEAD()` to compare with previous/next rows

