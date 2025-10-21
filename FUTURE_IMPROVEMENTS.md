# Future Improvements & Testing Plan

## High Priority

### 1. PostgreSQL Migration for Persistent Storage
**Status**: Not started
**Priority**: High (before scaling to real users)
**Effort**: ~30 minutes

**Why**: Currently using SQLite on ephemeral Railway storage. All feedback and cache data is lost on redeployments.

**Tasks**:
- [ ] Add PostgreSQL addon in Railway dashboard
- [ ] Update `backend/models/database.js` to use `pg` instead of `better-sqlite3`
- [ ] Add `DATABASE_URL` environment variable handling
- [ ] Migrate schema to PostgreSQL
- [ ] Test locally with PostgreSQL
- [ ] Deploy and verify data persists across deployments

**Resources**:
- Railway PostgreSQL docs: https://docs.railway.app/databases/postgresql
- `pg` npm package already installed in dependencies

---

## Medium Priority

### 2. Equipment Detection Accuracy Improvements
**Status**: Ongoing observation
**Priority**: Medium

**Known Issues**:
- Over-detection: Mortar & pestle detected for simple meatloaf recipe (unlikely)
- Stand mixer detected when hand mixing is more common
- Multiple size detection sometimes creates duplicates

**Tasks**:
- [ ] Collect real user feedback on accuracy
- [ ] Analyze feedback patterns to identify common mis-detections
- [ ] Refine detection patterns in `backend/utils/patterns.js`
- [ ] Add confidence threshold filters (e.g., ignore <60% confidence items)
- [ ] Implement user feedback loop to improve detection over time

---

### 3. Caching Improvements
**Status**: Working but basic
**Priority**: Medium

**Current State**: 7-day TTL cache for recipe scraping

**Improvements**:
- [ ] Add cache warming for popular recipes
- [ ] Implement cache versioning (invalidate on algorithm changes)
- [ ] Add cache hit/miss metrics
- [ ] Consider Redis for distributed caching (if scaling)

---

### 4. Analytics & Monitoring
**Status**: Not implemented
**Priority**: Medium

**Tasks**:
- [ ] Add basic analytics dashboard
- [ ] Track most analyzed recipes
- [ ] Monitor API response times
- [ ] Set up error alerting (Railway logs or external service)
- [ ] Add usage metrics (recipes analyzed per day, avg cleanup time, etc.)

---

## Low Priority / Nice to Have

### 5. User Feedback Export
**Status**: Not implemented
**Priority**: Low

**Tasks**:
- [ ] Add CSV export endpoint for feedback data
- [ ] Create admin dashboard to view feedback
- [ ] Add feedback visualization (accuracy over time, common complaints)

### 6. Recipe Site Coverage Testing
**Status**: Needs systematic testing
**Priority**: Low

**Tasks**:
- [ ] Create test suite with 10-20 recipes from different sites
- [ ] Document which sites work reliably
- [ ] Add fallback handling for unsupported sites
- [ ] Consider adding custom scrapers for popular sites

### 7. Advanced Features
**Status**: Ideas for future versions
**Priority**: Low

**Ideas**:
- Save user preferences (localStorage or accounts)
- Recipe comparison (which is easier to clean up?)
- Batch analysis (analyze meal plan for the week)
- Equipment ownership profile (auto-adjust for tools you don't own)
- Time range scheduling ("I have 45 min to cook + clean, what can I make?")
- Recipe recommendations based on cleanup time
- Integration with meal planning apps

---

## Testing Checklist

### Pre-Production Testing
- [x] Test recipe scraping with real URLs
- [x] Verify equipment detection accuracy
- [x] Test user preferences (dishwasher, cleaning style, soaking)
- [x] Verify feedback submission works
- [x] Test frontend UI on desktop
- [ ] Test frontend UI on mobile devices
- [ ] Test with 10+ different recipe sites
- [ ] Load test API (100+ concurrent requests)
- [ ] Security audit (input validation, SQL injection, XSS)

### Post-Launch Monitoring
- [ ] Monitor Railway logs for errors
- [ ] Check Vercel analytics for traffic patterns
- [ ] Review first 10 feedback submissions for patterns
- [ ] Monitor API response times
- [ ] Check for recipe scraping failures

---

## Bug Tracking

### Known Bugs
- None currently identified

### To Investigate
- [ ] Test recipe URLs with special characters
- [ ] Test very long recipe pages (100+ ingredients)
- [ ] Test paywalled recipe sites
- [ ] Test video-only recipes (no text ingredients)

---

## Documentation Improvements

- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Create user guide with screenshots
- [ ] Document equipment database structure
- [ ] Add developer contribution guide
- [ ] Create architecture diagrams

---

**Last Updated**: 2025-10-21
**Next Review**: After initial user testing phase
