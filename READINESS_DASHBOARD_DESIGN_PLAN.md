# Readiness Dashboard: UI/UX Design Plan & Wireframes

## Design System Alignment

### Existing Components to Reuse
- `ProgressRing` - For readiness score visualization
- `StatCard` - For metric displays
- `SectionHeader` - For section titles
- `ActionButton` - For CTAs
- `Card` (react-native-paper) - For content containers
- `CategoryBadge` - For status indicators

### Color Palette (from theme)
- Primary: `#6200ee` (purple)
- Success: `#4caf50` (green) - Ready
- Warning: `#ff9800` (orange) - Almost Ready
- Error: `#f44336` (red) - Not Ready
- Info: `#2196f3` (blue) - Needs Practice

### Typography & Spacing
- Using react-native-paper Text variants
- Spacing: `spacing.xs, spacing.sm, spacing.base, spacing.md, spacing.lg, spacing.xl`
- Border radius: `borderRadius.sm, borderRadius.md, borderRadius.lg, borderRadius.pill`
- Shadows: `shadows.sm, shadows.md`

## Screen Structure

### Layout Hierarchy
```
SafeAreaView
└── ScrollView
    ├── Hero Section (Readiness Score)
    ├── Quick Status Card
    ├── Readiness Breakdown
    ├── Knowledge Area Mastery Matrix
    ├── Domain Performance
    ├── Mock Exam Analysis
    ├── Weak Areas
    ├── Study Consistency
    └── Actionable Recommendations
```

## Detailed Wireframes

### 1. Hero Section: Readiness Score Card

**Visual Design:**
```
┌─────────────────────────────────────┐
│  [Large Circular Progress Ring]     │
│        78%                          │
│    Almost Ready                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Confidence: High            │   │
│  │ Last Updated: 2 hours ago   │   │
│  └─────────────────────────────┘   │
│                                     │
│  "You're close! Focus on Risk      │
│   Management to reach readiness."   │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<Card style={styles.heroCard}>
  <Card.Content style={styles.heroContent}>
    {/* Large Progress Ring */}
    <ProgressRing
      progress={readinessScore}
      size={180}
      strokeWidth={16}
      color={getReadinessColor(readinessScore)}
      showPercentage
      label={getReadinessCategory(readinessScore)}
    />
    
    {/* Status Badge */}
    <View style={styles.statusBadge}>
      <CategoryBadge
        label={`Confidence: ${confidence}`}
        color={colors.info}
      />
      <Text variant="bodySmall" style={styles.lastUpdated}>
        Updated {formatTimeAgo(lastUpdated)}
      </Text>
    </View>
    
    {/* Quick Message */}
    <Text variant="bodyLarge" style={styles.heroMessage}>
      {getReadinessMessage(readinessScore, recommendations)}
    </Text>
  </Card.Content>
</Card>
```

**Styling:**
- Background: Gradient or solid color based on readiness
- Border: 2px border with readiness color
- Shadow: `shadows.lg` for prominence
- Padding: `spacing.xl`

### 2. Quick Status Overview

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Quick Status                       │
├─────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐        │
│  │ Accuracy │  │ Questions│        │
│  │   75%    │  │   850    │        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌──────────┐        │
│  │ Mock     │  │ Streak   │        │
│  │ Exams    │  │   15d    │        │
│  │    2     │  │          │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Quick Status" icon="speedometer" />
<View style={styles.quickStatsGrid}>
  <StatCard
    title="Accuracy"
    value={`${accuracy}%`}
    icon="target"
    iconColor={getAccuracyColor(accuracy)}
  />
  <StatCard
    title="Questions"
    value={totalAnswered}
    icon="book-open-variant"
    iconColor={colors.info}
  />
  <StatCard
    title="Mock Exams"
    value={mockExamsCompleted}
    icon="file-document"
    iconColor={colors.primary}
  />
  <StatCard
    title="Streak"
    value={`${streakDays}d`}
    icon="fire"
    iconColor={colors.warning}
  />
</View>
```

### 3. Readiness Breakdown

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Readiness Breakdown               │
├─────────────────────────────────────┤
│  Overall Accuracy         22.5/30  │
│  ████████████████░░░░░░░░ 75%      │
│                                     │
│  Knowledge Areas           20/25   │
│  ████████████████████░░░░ 80%      │
│                                     │
│  Mock Exams                18/25    │
│  ████████████████░░░░░░░░ 72%      │
│                                     │
│  Question Volume            9/10    │
│  ████████████████████████ 90%      │
│                                     │
│  Recent Trend              8.5/10   │
│  ████████████████████████ 85%      │
│                                     │
│  ────────────────────────────────  │
│  Total Readiness Score:     78/100 │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Readiness Breakdown" icon="chart-box" />
<Card style={styles.breakdownCard}>
  <Card.Content>
    {breakdown.map((item, index) => (
      <View key={index} style={styles.breakdownItem}>
        <View style={styles.breakdownHeader}>
          <Text variant="bodyLarge">{item.label}</Text>
          <Text variant="bodyMedium" style={styles.breakdownScore}>
            {item.contribution}/{item.weight}
          </Text>
        </View>
        <ProgressBar
          progress={item.contribution / item.weight}
          color={getBreakdownColor(item.status)}
          style={styles.breakdownBar}
        />
        <View style={styles.breakdownFooter}>
          <Text variant="bodySmall" style={styles.breakdownStatus}>
            {item.status}
          </Text>
          <Icon
            name={getTrendIcon(item.trend)}
            size={16}
            color={getTrendColor(item.trend)}
          />
        </View>
      </View>
    ))}
    
    {/* Total Score */}
    <View style={styles.totalScore}>
      <Text variant="titleLarge">Total Readiness Score</Text>
      <Text variant="headlineMedium" style={styles.totalScoreValue}>
        {readinessScore}/100
      </Text>
    </View>
  </Card.Content>
</Card>
```

### 4. Knowledge Area Mastery Matrix

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Knowledge Area Mastery            │
├─────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Integ │ │Scope │ │Sched │       │
│  │  🟢  │ │  🟢  │ │  🟡  │       │
│  │ 85%  │ │ 78%  │ │ 68%  │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Cost  │ │Qual  │ │Resrc │       │
│  │  🟢  │ │  🟡  │ │  🟡  │       │
│  │ 82%  │ │ 65%  │ │ 62%  │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Comm  │ │Risk  │ │Proc  │       │
│  │  🟡  │ │  🔴  │ │  🟠  │       │
│  │ 64%  │ │ 45%  │ │ 58%  │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐                         │
│  │Stake │                         │
│  │  🟢  │                         │
│  │ 80%  │                         │
│  └──────┘                         │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Knowledge Area Mastery" icon="book-open-page-variant" />
<View style={styles.masteryGrid}>
  {knowledgeAreas.map((area) => (
    <TouchableOpacity
      key={area.id}
      style={[
        styles.masteryCard,
        { borderColor: getMasteryColor(area.accuracy) }
      ]}
      onPress={() => navigateToAreaDetail(area.id)}
    >
      <Text variant="labelSmall" style={styles.masteryName}>
        {area.shortName}
      </Text>
      <View style={styles.masteryIndicator}>
        {getMasteryIcon(area.accuracy)}
      </View>
      <Text variant="bodySmall" style={styles.masteryScore}>
        {area.accuracy}%
      </Text>
      <ProgressBar
        progress={area.accuracy / 100}
        color={getMasteryColor(area.accuracy)}
        style={styles.masteryBar}
      />
    </TouchableOpacity>
  ))}
</View>
```

**Color Coding:**
- 🟢 Green: ≥75% (Mastered)
- 🟡 Yellow: 60-74% (Proficient)
- 🟠 Orange: 50-59% (Needs Improvement)
- 🔴 Red: <50% (Critical Gap)

### 5. Domain Performance

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Domain Performance                │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ People              🟡 68%    │ │
│  │ ████████████████░░░░░░░░░░░░  │ │
│  │ Leadership, team, stakeholders │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Process             🟢 78%    │ │
│  │ ████████████████████░░░░░░░░  │ │
│  │ Project management processes   │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Business            🟡 72%    │ │
│  │ ████████████████████░░░░░░░░  │ │
│  │ Business environment, value   │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader 
  title="Domain Performance" 
  subtitle="People, Process, Business"
  icon="chart-box"
/>
{domains.map((domain) => (
  <Card 
    key={domain.name}
    style={[styles.domainCard, { borderLeftColor: colors.domain[domain.name.toLowerCase()] }]}
  >
    <Card.Content>
      <View style={styles.domainHeader}>
        <Text variant="titleLarge">{domain.name}</Text>
        <View style={[styles.domainBadge, { backgroundColor: getDomainColor(domain.accuracy) }]}>
          <Text style={styles.domainBadgeText}>
            {domain.accuracy}%
          </Text>
        </View>
      </View>
      <Text variant="bodySmall" style={styles.domainSubtitle}>
        {domain.description}
      </Text>
      <ProgressBar
        progress={domain.accuracy / 100}
        color={colors.domain[domain.name.toLowerCase()]}
        style={styles.domainProgressBar}
      />
    </Card.Content>
  </Card>
))}
```

### 6. Mock Exam Analysis

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Mock Exam Performance             │
├─────────────────────────────────────┤
│  Average Score: 72%                 │
│  Best Score: 78%                    │
│  Exams Completed: 2                 │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Exam 1   72%  ████████░░░░     │ │
│  │ Exam 2   78%  ██████████░░    │ │
│  └───────────────────────────────┘ │
│                                     │
│  Trend: ↗ Improving                 │
│                                     │
│  Recommendation:                    │
│  Complete 1 more mock exam to       │
│  build confidence                   │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Mock Exam Performance" icon="file-document-check" />
<Card style={styles.mockExamCard}>
  <Card.Content>
    <View style={styles.mockExamStats}>
      <View style={styles.mockExamStat}>
        <Text variant="bodySmall">Average Score</Text>
        <Text variant="headlineSmall">{averageScore}%</Text>
      </View>
      <View style={styles.mockExamStat}>
        <Text variant="bodySmall">Best Score</Text>
        <Text variant="headlineSmall">{bestScore}%</Text>
      </View>
      <View style={styles.mockExamStat}>
        <Text variant="bodySmall">Completed</Text>
        <Text variant="headlineSmall">{examsCompleted}</Text>
      </View>
    </View>
    
    {/* Exam History */}
    {mockExams.map((exam) => (
      <View key={exam.id} style={styles.examHistoryItem}>
        <View style={styles.examHistoryHeader}>
          <Text variant="bodyMedium">Exam {exam.number}</Text>
          <Text variant="bodyLarge" style={styles.examScore}>
            {exam.score}%
          </Text>
        </View>
        <ProgressBar
          progress={exam.score / 100}
          color={getExamScoreColor(exam.score)}
          style={styles.examProgressBar}
        />
        <Text variant="bodySmall" style={styles.examDate}>
          {formatDate(exam.completedAt)}
        </Text>
      </View>
    ))}
    
    {/* Trend Indicator */}
    <View style={styles.trendIndicator}>
      <Icon name={getTrendIcon(trend)} size={20} color={getTrendColor(trend)} />
      <Text variant="bodyMedium">Trend: {trend}</Text>
    </View>
    
    {/* Recommendation */}
    <View style={styles.recommendationBox}>
      <Icon name="lightbulb" size={20} color={colors.warning} />
      <Text variant="bodyMedium" style={styles.recommendationText}>
        {mockExamRecommendation}
      </Text>
    </View>
  </Card.Content>
</Card>
```

### 7. Weak Areas Identification

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Areas Needing Attention            │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ 🔴 Risk Management             │ │
│  │    45% accuracy                │ │
│  │    25 missed questions        │ │
│  │    [Focus on This]             │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ 🟠 Procurement                 │ │
│  │    58% accuracy                │ │
│  │    12 missed questions        │ │
│  │    [Review Missed]             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Areas Needing Attention" icon="alert-circle" />
{weakAreas.map((area) => (
  <Card 
    key={area.id}
    style={[styles.weakAreaCard, { borderLeftColor: getWeaknessColor(area.accuracy) }]}
  >
    <Card.Content>
      <View style={styles.weakAreaHeader}>
        <View style={styles.weakAreaIcon}>
          {getWeaknessIcon(area.accuracy)}
        </View>
        <View style={styles.weakAreaInfo}>
          <Text variant="titleMedium">{area.name}</Text>
          <Text variant="bodySmall" style={styles.weakAreaStats}>
            {area.accuracy}% accuracy • {area.missedCount} missed
          </Text>
        </View>
      </View>
      <ActionButton
        label={getWeakAreaAction(area.accuracy)}
        onPress={() => navigateToAreaPractice(area.id)}
        variant="outlined"
        size="small"
        icon="arrow-right"
      />
    </Card.Content>
  </Card>
))}
```

### 8. Study Consistency

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Study Consistency                 │
├─────────────────────────────────────┤
│  Current Streak: 15 days 🔥         │
│  Longest Streak: 30 days            │
│                                     │
│  Activity Calendar:                 │
│  [Heatmap showing study days]       │
│                                     │
│  Last 30 Days:                      │
│  Active Days: 22/30                 │
│  Avg Questions/Day: 35               │
│                                     │
│  Status: ✅ Excellent                │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Study Consistency" icon="calendar-check" />
<Card style={styles.consistencyCard}>
  <Card.Content>
    <View style={styles.streakDisplay}>
      <Icon name="fire" size={32} color={colors.warning} />
      <Text variant="headlineMedium">{currentStreak} days</Text>
      <Text variant="bodySmall">Current Streak</Text>
    </View>
    
    {/* Activity Calendar Heatmap */}
    <View style={styles.activityCalendar}>
      {activityDays.map((day, index) => (
        <View
          key={index}
          style={[
            styles.calendarDay,
            { backgroundColor: getActivityColor(day.intensity) }
          ]}
        />
      ))}
    </View>
    
    <View style={styles.consistencyStats}>
      <StatCard title="Active Days" value={`${activeDays}/30`} />
      <StatCard title="Avg/Day" value={avgQuestionsPerDay} />
    </View>
    
    <View style={styles.consistencyStatus}>
      <Icon name="check-circle" size={20} color={colors.success} />
      <Text variant="bodyMedium">Status: {consistencyStatus}</Text>
    </View>
  </Card.Content>
</Card>
```

### 9. Actionable Recommendations

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Your Action Plan                  │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ 🔴 High Priority             │ │
│  │ Focus on Risk Management     │ │
│  │ Complete 50 more questions   │ │
│  │ Impact: +3 readiness points  │ │
│  │ [Start Practice]             │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ 🟡 Medium Priority            │ │
│  │ Complete 1 more mock exam     │ │
│  │ Impact: +2 readiness points  │ │
│  │ [Take Mock Exam]              │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │ Estimated Readiness Date:     │ │
│  │ January 22, 2024             │ │
│  │ (7 days from now)             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Component Structure:**
```tsx
<SectionHeader title="Your Action Plan" icon="clipboard-list" />
{recommendations.map((rec, index) => (
  <Card 
    key={index}
    style={[
      styles.recommendationCard,
      { borderLeftColor: getPriorityColor(rec.priority) }
    ]}
  >
    <Card.Content>
      <View style={styles.recommendationHeader}>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(rec.priority) }]}>
          <Text style={styles.priorityText}>{rec.priority} Priority</Text>
        </View>
      </View>
      
      <Text variant="titleMedium" style={styles.recommendationTitle}>
        {rec.message}
      </Text>
      
      <Text variant="bodySmall" style={styles.recommendationAction}>
        {rec.action}
      </Text>
      
      <View style={styles.recommendationImpact}>
        <Icon name="trending-up" size={16} color={colors.success} />
        <Text variant="bodySmall">
          Impact: {rec.estimatedImpact}
        </Text>
      </View>
      
      <ActionButton
        label={rec.buttonLabel}
        onPress={() => handleRecommendationAction(rec)}
        variant="contained"
        size="medium"
        icon="arrow-right"
      />
    </Card.Content>
  </Card>
))}

{/* Estimated Readiness Date */}
<Card style={styles.readinessDateCard}>
  <Card.Content>
    <Text variant="titleMedium">Estimated Readiness Date</Text>
    <Text variant="headlineMedium" style={styles.readinessDate}>
      {formatDate(estimatedReadinessDate)}
    </Text>
    <Text variant="bodySmall" style={styles.readinessDays}>
      ({daysUntilReady} days from now)
    </Text>
  </Card.Content>
</Card>
```

## Component Specifications

### New Components Needed

#### 1. ReadinessScoreRing
Enhanced version of ProgressRing with:
- Larger size (180px)
- Category label below
- Confidence indicator
- Color based on readiness level

#### 2. MasteryMatrixCard
Grid item for knowledge area:
- Compact card (80x100px)
- Color-coded border
- Icon indicator
- Progress bar
- Tap to drill down

#### 3. ActivityCalendar
Heatmap component:
- 30-day grid
- Color intensity based on activity
- Tap to see day details

#### 4. RecommendationCard
Priority-based card:
- Color-coded left border
- Priority badge
- Action button
- Impact indicator

## Responsive Design Considerations

### Screen Sizes
- Small (iPhone SE): Stack cards vertically, reduce grid items
- Medium (iPhone 12/13): Standard layout
- Large (iPhone Pro Max): Wider cards, more columns in grid

### Orientation
- Portrait: Standard vertical scroll
- Landscape: Consider horizontal sections for some components

## Interaction Patterns

### Tap Actions
1. **Readiness Score**: Expand to show detailed breakdown
2. **Knowledge Area Card**: Navigate to area detail screen
3. **Mock Exam**: Navigate to exam review
4. **Weak Area**: Navigate to focused practice
5. **Recommendation**: Execute recommended action

### Swipe Actions
- Swipe recommendation cards to dismiss (if completed)
- Swipe between time ranges (week/month/all time)

### Pull to Refresh
- Refresh all readiness data
- Show loading state during refresh

## Animation & Transitions

### On Load
- Fade in readiness score
- Stagger animation for cards
- Progress bar fill animation

### Interactions
- Card press feedback (scale down)
- Smooth navigation transitions
- Progress bar updates with animation

## Accessibility

### Screen Reader Support
- All text elements labeled
- Progress indicators announced
- Action buttons clearly labeled

### Color Contrast
- All text meets WCAG AA standards
- Icons have sufficient contrast
- Status indicators use both color and text

## Data Loading States

### Initial Load
- Skeleton screens for each section
- Progressive loading (hero first, then sections)

### Refresh
- Pull-to-refresh indicator
- Optimistic updates where possible

### Error States
- Error message with retry button
- Graceful degradation (show cached data if available)

## Implementation Phases

### Phase 1: Core Readiness Score
- Hero section with score
- Quick status overview
- Basic recommendations

### Phase 2: Detailed Breakdowns
- Readiness breakdown
- Knowledge area matrix
- Domain performance

### Phase 3: Advanced Features
- Mock exam analysis
- Weak areas
- Study consistency

### Phase 4: Polish
- Animations
- Advanced interactions
- Performance optimization

## File Structure

```
mobile/src/
├── screens/
│   └── main/
│       └── ReadinessScreen.tsx (new)
├── components/
│   ├── ReadinessScoreRing.tsx (new)
│   ├── MasteryMatrixCard.tsx (new)
│   ├── ActivityCalendar.tsx (new)
│   └── RecommendationCard.tsx (new)
├── services/
│   └── api/
│       └── readinessService.ts (new)
└── store/
    └── slices/
        └── readinessSlice.ts (new)
```

## Next Steps

1. Create component mockups in Figma/Sketch
2. Implement ReadinessScoreRing component
3. Build ReadinessScreen with hero section
4. Add breakdown sections progressively
5. Integrate with backend API
6. Test and iterate based on user feedback



