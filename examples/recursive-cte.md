---
title: Recursive CTEs
icon: 🔄
category: Advanced
description: Hierarchical data with recursive queries
---

## Recursive CTEs
**Icon:** 🔄
**Category:** Advanced
**Description:** Hierarchical data with recursive queries

### Code
```kotlin
import io.exoquery.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class Employee(
    val id: Int,
    val name: String,
    @SerialName("manager_id") val managerId: Int?
)

@Serializable
data class EmployeeHierarchy(
    val id: Int,
    val name: String,
    val level: Int
)

//sampleStart
val hierarchy = sql {
    with {
        recursive("employee_tree") {
            // Base case: top-level employees
            sql.select {
                val e = from(Table<Employee>())
                where { e.managerId.isNull() }
                EmployeeHierarchy(
                    id = e.id,
                    name = e.name,
                    level = 1
                )
            }
            unionAll {
                // Recursive case: employees with managers
                sql.select {
                    val e = from(Table<Employee>())
                    val tree = from(cte<EmployeeHierarchy>("employee_tree"))
                    where { e.managerId == tree.id }
                    EmployeeHierarchy(
                        id = e.id,
                        name = e.name,
                        level = tree.level + 1
                    )
                }
            }
        }
    }
    from(cte<EmployeeHierarchy>("employee_tree"))
}
//sampleEnd

fun main(): Unit = hierarchy.buildPrettyFor.Postgres().runSample()
```

### Output
```sql
WITH RECURSIVE employee_tree AS (
  SELECT
    e.id,
    e.name,
    1 AS level
  FROM
    Employee e
  WHERE
    e.manager_id IS NULL
  
  UNION ALL
  
  SELECT
    e.id,
    e.name,
    tree.level + 1 AS level
  FROM
    Employee e
    INNER JOIN employee_tree tree ON e.manager_id = tree.id
)
SELECT
  employee_tree.id,
  employee_tree.name,
  employee_tree.level
FROM
  employee_tree
```

### Schema
```sql
CREATE TABLE Employee (id INT PRIMARY KEY, name VARCHAR(100), manager_id INT);

INSERT INTO Employee (id, name, manager_id) VALUES
  (1, 'Commander Chen', NULL),
  (2, 'Lt. Rodriguez', 1),
  (3, 'Lt. Kim', 1),
  (4, 'Eng. Patel', 2),
  (5, 'Eng. Johnson', 2),
  (6, 'Sci. Lee', 3);
```

### Try
- Try adding a path column to track the full hierarchy chain
- Add a depth limit with a WHERE clause in the recursive part
- Try using this pattern for bill-of-materials or category trees

