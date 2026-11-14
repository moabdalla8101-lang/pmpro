@p2 @edge @guest @free @paid @ios
Feature: Edge cases — empty states, network, and expired premium
  App Store polish: no crashes on empty data, offline-ish errors, or expired plans.

  Scenario: Empty bookmarks for paid user
    Given I am a Paid Active user with no bookmarks
    When I open Bookmarked Questions
    Then I see an empty state
    And the app does not crash

  Scenario: Empty missed questions for paid user
    Given I am a Paid Active user with no missed questions
    When I open Missed Questions
    Then I see an empty state
    And the app does not crash

  Scenario: Empty exam history
    Given I am an authenticated user with no completed exams
    When I open the Exam tab
    Then previous-exam history is empty or shows an empty state
    And start actions remain available per my entitlement

  Scenario: Practice list empty filter
    Given a knowledge area or filter that returns no questions
    When I open the practice list
    Then I see an empty or no-questions state
    And the app does not crash

  Scenario: Network failure on exam start
    Given I am a Paid Active user
    And the device has no usable network (or API is unreachable)
    When I attempt to start Mini PMP or Mock Exam
    Then I see an Alert or error message
    And the UI does not hang forever on a spinner with no feedback

  Scenario: Network failure on exam submit
    Given I am mid-exam as a Paid Active user
    And the network becomes unavailable
    When I submit the exam
    Then I see an error Alert or recoverable failure
    And the app does not silently discard the session without feedback

  Scenario: Expired premium behaves as free for gated features
    Given I am a Paid Expired user
    When I try Mock Exam, Mini PMP, Bookmarks, Missed Questions, Domain practice, and Progress analytics
    Then each is blocked with Paywall (after Auth if needed)
    And Daily Quiz and limited practice remain available

  Scenario: Plan-ended banner on dashboard
    Given I am a Paid Expired user
    When I open the Practice dashboard
    Then I see a plan-ended or renew affordance
    And Renew leads to Paywall

  Scenario: Auth reason copy differs by gate
    Given I am a guest
    When Auth opens from bookmarks
    Then the message mentions bookmarking or sync
    When Auth opens from exams
    Then the message mentions mock exams or saving results
    When Auth opens from practice results
    Then the message mentions score or saving practice results

  Scenario: Guest Progress and Free Progress remain distinct
    Given I toggle between guest and Registered Free on the same device
    When I open Progress as guest
    Then I see sign-in CTA
    When I log in as Registered Free
    Then I see Unlock Advanced Analytics, not another user's premium data
