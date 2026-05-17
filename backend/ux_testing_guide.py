"""
User Experience (UX) Testing Guidelines.
Tests for responsive design, accessibility, and usability.
"""

# This file contains manual and automated UX testing procedures

UX_TESTING_CHECKLIST = """
# TEECOM UX TESTING CHECKLIST

## 1. Responsive Design Testing

### Desktop (1920x1080)
- [ ] Header navigation displays properly
- [ ] Sidebar navigation is visible
- [ ] Product grid shows 3-4 columns
- [ ] Order table is readable
- [ ] Settings form fields aligned properly
- [ ] Modals center on screen
- [ ] Forms don't overflow container

### Tablet (768x1024)
- [ ] Navigation collapses to hamburger menu
- [ ] Product grid shows 2 columns
- [ ] Tables stack responsively or scroll horizontally
- [ ] Touch targets are at least 44x44px
- [ ] Modals adapt to smaller screen
- [ ] Font sizes remain readable

### Mobile (375x667)
- [ ] Single column layout for all sections
- [ ] Hamburger menu opens/closes properly
- [ ] Product cards stack vertically
- [ ] Forms are touch-friendly with proper spacing
- [ ] Tables scroll horizontally with sticky header
- [ ] No horizontal scrolling required
- [ ] Buttons are easily tappable

## 2. Form Usability Testing

### Settings Form
- [ ] All input fields labeled clearly
- [ ] Required fields marked with asterisk (*)
- [ ] Validation errors display below each field
- [ ] Error messages are clear and actionable
- [ ] Submit button is prominent and easy to find
- [ ] Success message appears after save
- [ ] Form scrolls to first error on validation fail
- [ ] Password confirmation works correctly

### Product Search
- [ ] Search results update in real-time
- [ ] "No results" message displays when empty
- [ ] Search is case-insensitive
- [ ] Partial matching works (e.g., "sam" finds "Sample")
- [ ] Clear button removes search text

### Order Filter
- [ ] Filters apply immediately
- [ ] Selected filters display as pills/tags
- [ ] Can clear all filters at once
- [ ] Filter combinations work correctly
- [ ] Results count updates with filters

## 3. Loading States

### Buttons
- [ ] Loading spinner appears during action
- [ ] Button text changes to "Loading..." or similar
- [ ] Button is disabled during loading
- [ ] Button re-enables on completion
- [ ] Spinner clears on error

### Data Loading
- [ ] Skeleton loaders appear before data
- [ ] Correct number of skeleton items shown
- [ ] Smooth fade-in transition when data loaded
- [ ] No content shift when skeletons replaced with real data

### Page Transitions
- [ ] Loading indicator appears on navigation
- [ ] Page doesn't appear empty/broken during load
- [ ] Content loads without flash of unstyled content

## 4. Error Handling UX

### Error Messages
- [ ] Error message clearly explains problem
- [ ] Error message tells user how to fix it
- [ ] Error message doesn't contain technical jargon
- [ ] Error message appears near the problem field
- [ ] Error text is readable (good contrast)
- [ ] Error icon/color is visible to color-blind users

### Validation Errors
- [ ] Real-time validation for email/URL fields
- [ ] Clear error on weak password
- [ ] Password requirements shown before submission
- [ ] Date picker doesn't allow invalid dates
- [ ] Number fields only accept numbers

### Network Errors
- [ ] "Connection failed" message appears
- [ ] Retry button is available
- [ ] User can continue with cached data if available
- [ ] Offline indicator shows when no connection

## 5. Confirmation & Warnings

### Delete Actions
- [ ] Confirmation modal appears before delete
- [ ] Modal clearly shows what will be deleted
- [ ] Cancel and Delete buttons clearly labeled
- [ ] Delete button is red/warning color
- [ ] Success message appears after delete

### Bulk Actions
- [ ] Confirmation shows count of items affected
- [ ] User can review before confirming
- [ ] Progress indicator shows during bulk operation
- [ ] Success message shows items affected

## 6. Navigation & Information Architecture

### Admin Dashboard
- [ ] Breadcrumbs show current location
- [ ] Active menu item is highlighted
- [ ] All top-level sections accessible from menu
- [ ] Back button works on detail pages
- [ ] Logo/home link returns to dashboard

### Orders Page
- [ ] Can easily identify order status
- [ ] Order details accessible with one click
- [ ] Can return to list without issues
- [ ] Pagination works smoothly
- [ ] Search/filter don't reset on page refresh

### Inventory Page
- [ ] Low stock items highlighted
- [ ] Restock button easily accessible
- [ ] Modal for restock entry appears smoothly
- [ ] Quantity validation prevents invalid entries
- [ ] Confirmation before submitting

## 7. Visual Hierarchy

### Color Contrast
- [ ] Text has minimum 4.5:1 contrast ratio
- [ ] Links are distinguishable from text
- [ ] Active/inactive states clear
- [ ] Status indicators (red/green) visible to color-blind
- [ ] Error states use multiple indicators (not just color)

### Typography
- [ ] Headings are larger and bolder than body text
- [ ] Body text is 16px or larger
- [ ] Line spacing is comfortable (1.5x+)
- [ ] No walls of text without breaks
- [ ] Important info is emphasized

### Spacing
- [ ] Sections have clear whitespace between them
- [ ] Card/section padding is consistent
- [ ] Related items grouped closely
- [ ] Unrelated items separated clearly
- [ ] No clutter or overwhelming density

## 8. Accessibility (a11y)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order makes sense
- [ ] Focus indicator is visible
- [ ] Can close modals with Escape key
- [ ] Can submit forms with Enter key

### Screen Readers
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Loading states announced
- [ ] Images have alt text (or role="presentation")
- [ ] Tables have proper headers

### WCAG Compliance
- [ ] All images have alt text or role="presentation"
- [ ] Form fields have associated labels
- [ ] Color not sole indicator of information
- [ ] Resizable text doesn't break layout
- [ ] No auto-playing audio/video

## 9. Performance UX

### Page Load
- [ ] Page feels responsive (feedback within 100ms)
- [ ] Critical content visible within 1s
- [ ] Full page loads within 3s
- [ ] Loading indicators appear if taking >1s

### Interactions
- [ ] Click feedback instant (no lag)
- [ ] Scroll is smooth (60fps)
- [ ] No stuttering during animations
- [ ] Transitions feel natural

### Mobile Performance
- [ ] Page loads within 3s on 4G
- [ ] Images lazy-loaded below fold
- [ ] No unnecessary large images on mobile
- [ ] Font sizes readable without zoom

## 10. Copy & Tone

### Labels & Buttons
- [ ] Button text is action-oriented ("Save Settings" not "Submit")
- [ ] Labels are clear and concise
- [ ] Tone is friendly and professional
- [ ] Instructions are brief and clear
- [ ] No jargon or technical terms

### Help Text
- [ ] Help text explains why information is needed
- [ ] Examples provided for complex fields
- [ ] Success messages are encouraging
- [ ] Error messages don't blame user

### Placeholder Text
- [ ] Placeholders show format (not label)
- [ ] Contrast sufficient against input background
- [ ] Not used as substitute for labels

## 11. Browser Compatibility

### Chrome (Latest)
- [ ] All features work
- [ ] Performance acceptable
- [ ] No console errors

### Firefox (Latest)
- [ ] All features work
- [ ] Forms submit properly
- [ ] Modals display correctly

### Safari (Latest)
- [ ] All features work
- [ ] Buttons respond to clicks
- [ ] No layout shifts

### Edge (Latest)
- [ ] All features work
- [ ] No visual glitches

## 12. Dark Mode (If Applicable)
- [ ] Colors readable in dark mode
- [ ] Contrast sufficient
- [ ] No bright flashes
- [ ] Icons visible in dark mode

## 13. Cross-Platform Testing

### Android
- [ ] Touch gestures work
- [ ] Keyboard interactions work
- [ ] Bottom navigation accessible
- [ ] Back button handled correctly

### iOS
- [ ] Touch gestures work
- [ ] Safe area respected
- [ ] Keyboard appears/dismisses smoothly
- [ ] Status bar doesn't overlap content

## Testing Procedure

### Manual Testing
1. Open browser (Chrome, Firefox, Safari, Edge)
2. Go through each section in checklist
3. Test on desktop, tablet, and mobile
4. Test with keyboard only (tab navigation)
5. Test with screen reader (NVDA, JAWS, VoiceOver)
6. Test with slow network (Throttle to 3G)
7. Test with 200% zoom

### Automated Testing (Lighthouse)
1. Open DevTools
2. Go to Lighthouse tab
3. Run audit for Performance, Accessibility, Best Practices, SEO
4. Review recommendations
5. Fix issues found

### User Testing Script
1. Have user complete task without guidance
2. Observe where they hesitate or get confused
3. Ask "What does this button do?"
4. Ask "How would you find this feature?"
5. Record issues and pain points
6. Prioritize fixes based on frequency and impact

## Performance Targets

- Lighthouse Performance: > 80
- Lighthouse Accessibility: > 90
- Lighthouse Best Practices: > 85
- Lighthouse SEO: > 90
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

## Accessibility Requirements

- WCAG 2.1 Level AA minimum
- All interactive elements keyboard accessible
- Color contrast minimum 4.5:1 for text
- Alt text for all meaningful images
- No motion sickness triggers (< 3 flashes/sec)
- Captions for video (if applicable)

## Common UX Issues to Avoid

### User Input
❌ Don't require users to type when they can select
❌ Don't lose form data on validation error
❌ Don't hide required field indicators
❌ Don't require password strength indicator

### Feedback
❌ Don't require users to guess if action succeeded
❌ Don't hide error messages or show generic errors
❌ Don't change UI behavior without warning
❌ Don't save without confirming (for critical actions)

### Navigation
❌ Don't break back button
❌ Don't open external links in same tab
❌ Don't use "Click here" link text
❌ Don't make website navigation hard to find

### Performance
❌ Don't load more than 1MB on first page
❌ Don't autoplay video/audio
❌ Don't make users wait without feedback
❌ Don't redirect before page loads

### Accessibility
❌ Don't rely on color alone for information
❌ Don't use placeholder instead of labels
❌ Don't make keyboard navigation impossible
❌ Don't use images of text

## Notes for Testers

- Test in private/incognito mode to clear cache
- Clear localStorage/sessionStorage between tests
- Test with JavaScript disabled (if applicable)
- Test with browser plugins disabled
- Test print stylesheet (if applicable)
- Test with different system fonts/accessibility settings
- Test with speech recognition (if applicable)

## Bug Reporting Template

**Issue:** [Brief description]
**Device:** [Device/OS/Browser]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:** [What should happen]
**Actual Behavior:** [What actually happened]
**Screenshot:** [Attach screenshot/video]
**Severity:** [Critical/High/Medium/Low]

---

## Automated UX Tests

The following automated tests should be run:

```bash
# Lighthouse
npm run audit

# axe accessibility testing
npm run test:a11y

# Percy visual regression
npm run test:percy

# Cypress E2E tests
npm run test:e2e
```

These tests help catch common UX issues automatically.
"""

# Export the checklist for reference
print(UX_TESTING_CHECKLIST)

class UXTestingMetrics:
    """Collect UX metrics during testing."""
    
    metrics = {
        'pages_tested': 0,
        'issues_found': 0,
        'critical_issues': 0,
        'wcag_violations': 0,
        'performance_issues': 0,
    }
    
    @staticmethod
    def log_issue(severity, issue_type, description):
        """Log a UX issue found during testing."""
        UXTestingMetrics.metrics['issues_found'] += 1
        if severity == 'critical':
            UXTestingMetrics.metrics['critical_issues'] += 1
        if issue_type == 'accessibility':
            UXTestingMetrics.metrics['wcag_violations'] += 1
        if issue_type == 'performance':
            UXTestingMetrics.metrics['performance_issues'] += 1
        
        print(f"[{severity.upper()}] {issue_type}: {description}")
    
    @staticmethod
    def print_report():
        """Print UX testing report."""
        print("\n=== UX Testing Report ===")
        print(f"Pages Tested: {UXTestingMetrics.metrics['pages_tested']}")
        print(f"Total Issues Found: {UXTestingMetrics.metrics['issues_found']}")
        print(f"Critical Issues: {UXTestingMetrics.metrics['critical_issues']}")
        print(f"WCAG Violations: {UXTestingMetrics.metrics['wcag_violations']}")
        print(f"Performance Issues: {UXTestingMetrics.metrics['performance_issues']}")


# Example usage during manual testing:
# UXTestingMetrics.log_issue('high', 'accessibility', 'Form label missing for email input')
# UXTestingMetrics.log_issue('medium', 'usability', 'Error message not visible on mobile')
# UXTestingMetrics.print_report()
