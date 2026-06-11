# System Issues & Troubleshooting Log

## 1. Asynchronous Database Foreign Key Constraint Violation on `admin_activity_log`

### Date
2026-06-11

### Issue Description
An asynchronous execution error occurred when trainees registered, enrolled, or posted reviews, or when system-level cron jobs (like certificate generation) completed:
```
Async method handleSystemActivityEvent failed with params [com.nac.slogbaa.shared.events.SystemActivityEvent@...]:
could not execute statement [ERROR: insert or update on table "admin_activity_log" violates foreign key constraint "admin_activity_log_actor_id_fkey"
  Detail: Key (actor_id)=(083fd608-24d7-4bc5-a0c8-96069cd55ae4) is not present in table "staff_user".]
```

#### Cause
1. In migration `V43__add_system_admin_role.sql`, the `admin_activity_log` table's `actor_id` column was defined as:
   `actor_id UUID NOT NULL REFERENCES staff_user(id)`
2. The asynchronous listener `SystemActivityEventListener` handles `SystemActivityEvent`s which are fired for **all** key system actions:
   - Trainee Registration (fires with the trainee's UUID as `actorId`)
   - Trainee Enrollment (fires with the trainee's UUID as `actorId`)
   - Course Reviews (fires with the trainee's UUID as `actorId`)
   - Certificate Issuance (fires with `null` as `actorId` since it's a SYSTEM action)
3. For trainee actions, because the trainee UUID does not exist in the `staff_user` table, PostgreSQL threw a foreign key violation.
4. For system actions, the `null` `actorId` violated the `NOT NULL` constraint.

### Resolution
The constraints on `admin_activity_log` were relaxed to support logging for any type of actor (staff, trainees, or the system itself):

1. **Database Migration (`V47__relax_admin_activity_log_constraints.sql`):**
   - Dropped the foreign key constraint `admin_activity_log_actor_id_fkey`.
   - Dropped the `NOT NULL` constraint on the `actor_id` column.
2. **JPA Entity Update (`AdminActivityLogEntity.java`):**
   - Removed `nullable = false` from the `@Column(name = "actor_id")` annotation to permit nulls during ORM inserts.
