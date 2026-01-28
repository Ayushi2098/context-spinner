# Code Review Skill

## Purpose

Guide AI agents in reviewing code for quality, consistency, and best practices.

## Review Checklist

### Architecture
- [ ] Follows patterns in `TEMPLATE_ARCHITECTURE.md`
- [ ] Maintains GitHub Pages compatibility
- [ ] Proper separation of concerns
- [ ] Devtools integration (if applicable)

### Code Quality
- [ ] TypeScript types are properly defined
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Code is readable and well-structured
- [ ] Follows existing code style

### State Management
- [ ] Zustand stores properly structured
- [ ] State subscriptions for devtools (if dev mode)
- [ ] Commands registered for testing (if applicable)

### Components
- [ ] Uses shadcn components where appropriate
- [ ] Proper React hooks usage
- [ ] No unnecessary re-renders
- [ ] Accessible UI patterns

### Performance
- [ ] No memory leaks
- [ ] Efficient state updates
- [ ] Proper cleanup in useEffect
- [ ] Production build works (`pnpm build`)

### Testing
- [ ] Devtools show correct state/logs
- [ ] Commands work as expected
- [ ] No console errors in development
- [ ] Production build is clean

## Review Process

1. **Read the Code**
   - Understand what the code does
   - Check against requirements

2. **Check Architecture**
   - Verify alignment with template patterns
   - Ensure compatibility with existing code

3. **Run Checks**
   ```bash
   pnpm lint
   pnpm build
   ```

4. **Test Functionality**
   - Start dev server: `pnpm dev:full`
   - Test features manually
   - Check devtools for issues

5. **Provide Feedback**
   - Highlight issues found
   - Suggest improvements
   - Confirm when code is ready

## Common Issues to Look For

- Missing TypeScript types
- Unused imports or variables
- Improper error handling
- Missing devtools integration
- State management anti-patterns
- Performance issues
- Accessibility problems
