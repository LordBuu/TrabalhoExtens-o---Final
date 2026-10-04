# NeuroEdu Security Specification & Hardened Rules TDD

## 1. Data Invariants

1. **Authentication & Ownership**:
   - Every private document in `/users/{userId}`, `/questions/{questionId}`, and `/favorites/{favoriteId}` must belong to the authenticated user (`request.auth.uid == userId` or `resource.data.userId == request.auth.uid`).
   - The user cannot forge or alter `userId` upon creation or update.
   - PII in `/users/{userId}` is strictly isolated: only the owning teacher or an admin can read or write.

2. **Curated Knowledge Repositories (`scientific_sources` & `strategies`)**:
   - Any authenticated teacher can read and query `scientific_sources` and `strategies` for pedagogical practice and RAG.
   - Only administrative users (`isAdmin()`) can create, update, or delete records in `scientific_sources` and `strategies` to prevent poisoning of scientific evidence.

3. **Temporal Integrity**:
   - Timestamps (`createdAt`, `updatedAt`) must be strictly validated.
   - `createdAt` is immutable after document creation.

4. **Resource Bounds & Schema Validation**:
   - All string fields have strict `.size() <= MAX` bounds to prevent denial-of-wallet / payload attacks.
   - Arrays (such as `keywords`, `referenceIds`, `sources`) are bounded in size.

5. **Admin Access Control**:
   - Administrative privilege is verified through `request.auth.token.email == 'patrickjr2004@gmail.com'` or existence in the trusted `/admins/{uid}` collection. Users cannot elevate their own role.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Spoofed User Registration**: Attempt to write a User profile with `role: "admin"` as an unauthorized user.
2. **Ghost Field Injection**: Attempt to write a `ScientificSource` with ghost fields like `{ backdoors: ["all"] }`.
3. **Question Forgery**: Attempt by User A to create a question claiming `userId: "user-B-target"`.
4. **Denial-of-Wallet Payload**: Attempt to post an abstract or question with 5MB text payload exceeding `.size() <= 2500`.
5. **Array Exhaustion Attack**: Attempt to save a favorite or question with 50,000 array elements.
6. **Scientific Evidence Poisoning**: An unauthenticated or regular teacher attempting to update `scientific_sources` to insert fake medical claims.
7. **Cross-Tenant History Snooping**: User A attempting to list or get `/questions` belonging to User B.
8. **Cross-Tenant Favorite Deletion**: User A attempting to delete `/favorites` belonging to User B.
9. **Creation of Orphaned Favorite**: Creating a favorite with an invalid or unauthenticated `userId`.
10. **Immutable Timestamp Tampering**: Updating a question or favorite and modifying the initial `createdAt` field.
11. **Path Traversal / ID Poisoning**: Supplying a malicious ID path with null bytes or non-alphanumeric special characters.
12. **Blanket Query Scraping**: Attempting an unrestricted list query without scoping to `resource.data.userId == request.auth.uid`.

---

## 3. Test Runner Invariant Assertions
All 12 payloads must be rejected with `PERMISSION_DENIED`.
Rules must strictly enforce valid schema helpers `isValidUser()`, `isValidScientificSource()`, `isValidStrategy()`, `isValidQuestion()`, and `isValidFavorite()`.
