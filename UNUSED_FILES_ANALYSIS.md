# Unused Files Analysis - ZCMC ERP Front

## Summary
Analysis of the project to identify files that are not being utilized or imported anywhere in the codebase.

---

## Confirmed Unused Files

### 1. **ObjectivesList copy.jsx**
- **Path**: `d:\zcmc-erp-front\src\Pages\PlanningOps\Approval\Contents\ObjectivesList copy.jsx`
- **Status**: ❌ NOT IMPORTED ANYWHERE
- **Recommendation**: DELETE - This is a duplicate/backup file with " copy" suffix. The active version is `ObjectivesList.jsx`
- **Impact**: Low - No active code references this file

### 2. **TEMP Directory Files** (Partially Unused)
- **Path**: `d:\zcmc-erp-front\src\Pages\TEMP/`
- **Files**:
  - `ItemMyOwnRequestsLists.jsx` - Imported in `Data/index.jsx` but NOT in active `PageRoutes.jsx`
  - `ItemSubmittedRequestModalContent.jsx` - Imported in `Data/index.jsx` but NOT in active `PageRoutes.jsx`
  - `ItemSubmittedRequestsList.jsx` - Imported in `Data/index.jsx` but NOT in active `PageRoutes.jsx`

- **Status**: ⚠️ IMPORTED BUT NOT ROUTED
- **Details**: These files are imported in `src/Data/index.jsx` (which appears to be an OLD/BACKUP routing file), but they are NOT used in the active routing file `src/Routes/PageRoutes.jsx`
- **Recommendation**: 
  - Either DELETE the TEMP directory entirely if these features are deprecated
  - OR integrate them into active routes if they're needed
  - Remove imports from `Data/index.jsx` if not needed

---

## Files Currently in Use

### Active Test Pages
- ✅ `ComponentTestPage.jsx` - Used in `AnimatedRoutes.jsx` (line 8, 32)
- ✅ `TestPage.jsx` - Used in `AnimatedRoutes.jsx` (line 11, 36)

### Active Routing
- ✅ `PageRoutes.jsx` - Primary routing configuration (actively used)
- ✅ `AnimatedRoutes.jsx` - Router setup (actively used)

---

## Potential Issues Found

### 1. **Duplicate Routing Configuration**
- **Files**: `Data/index.jsx` vs `Routes/PageRoutes.jsx`
- **Issue**: `Data/index.jsx` contains old/duplicate routing configuration
- **Recommendation**: Review if `Data/index.jsx` is still needed or if it's legacy code

### 2. **Unused Imports in PageRoutes.jsx**
- Lines 40-42 import TEMP files but they are NOT used in the routes configuration
- These imports should be removed if the TEMP directory is deprecated

---

## Recommended Actions

### Priority 1 (High) - Delete Immediately
1. **Delete**: `ObjectivesList copy.jsx`
   - Command: `rm "d:\zcmc-erp-front\src\Pages\PlanningOps\Approval\Contents\ObjectivesList copy.jsx"`

### Priority 2 (Medium) - Review & Clean Up
1. **Review**: `Data/index.jsx` - Determine if this is legacy code
   - If legacy: Delete the file and remove imports from `PageRoutes.jsx`
   - If active: Consolidate with `PageRoutes.jsx` to avoid duplication

2. **Review**: TEMP directory
   - If features are deprecated: Delete entire `src/Pages/TEMP/` directory
   - If features are needed: Integrate into proper routing structure

3. **Clean imports in PageRoutes.jsx** (lines 40-42)
   - Remove unused TEMP imports if TEMP directory is deleted

---

## Statistics
- **Total JSX Files**: 64
- **Confirmed Unused Files**: 1 (ObjectivesList copy.jsx)
- **Partially Unused Files**: 3 (TEMP directory files)
- **Duplicate Routing Files**: 1 (Data/index.jsx vs PageRoutes.jsx)

---

## Notes
- The project uses Zustand for state management (AOPStore, AuthStore, etc.)
- Most components are properly imported and used
- Main issue is legacy/backup files and duplicate routing configurations
