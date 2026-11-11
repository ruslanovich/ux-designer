# Supplier catalog operations

Operators work with 8,000–40,000 catalog records. A filtered result can span hundreds of pages. They update product availability and categories in bulk while continuing to inspect individual items.

The service can accept an update and finish later. Some records can fail because another operator changed them, permissions changed, or the value is no longer allowed. A successful record cannot be blindly updated a second time. Operators need to identify affected records and recover failed changes without losing their filtered work context.

Roles and data rules already exist. Scope: design the interface, including selection, submission, progress, completion, partial failure, and recovery. No backend implementation or production access is needed. The team has not chosen a selection pattern.
