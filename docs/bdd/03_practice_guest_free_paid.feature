@p1 @practice @guest @free @paid @ios
Feature: Practice flows for guest, free, and paid users
  Guests can browse and answer; saving and premium practice modes are gated.

  Background:
    Given I am on the Practice tab

  # --- Guest ---

  Scenario: Guest browses Practice dashboard
    Given I am a guest
    When I view the Practice dashboard
    Then I see daily goals, streak, and practice entry points
    And I do not see another user's account stats

  Scenario: Guest completes Today's Practice then signs in to save
    Given I am a guest
    When I start Today's Practice
    And I answer the practice questions
    And I reach the results / submit step
    Then I am prompted to sign in for practice results
    When I register or log in successfully
    Then my practice results are saved to my account

  Scenario: Guest dismisses Auth at practice results
    Given I am a guest finishing Today's Practice
    When Auth opens for practice results
    And I tap "Continue browsing as guest"
    Then I return without a crash
    And any pending practice draft is cancelled or cleared safely

  Scenario: Guest knowledge-area practice is limited
    Given I am a guest
    When I open Knowledge Area practice for any area
    Then I see a free / limited question set (about 10 per knowledge area)
    And an upgrade prompt is available for unlimited questions

  Scenario: Guest domain practice requires Auth then Paywall
    Given I am a guest
    When I tap Domain practice
    Then Auth opens (or after sign-in Paywall opens for domain_practice)
    And I cannot start domain-filtered practice without premium

  # --- Registered Free ---

  Scenario: Free user saves Today's Practice without Paywall
    Given I am a Registered Free user
    When I complete Today's Practice
    Then my score and progress are saved
    And I am not forced through Paywall for this practice session

  Scenario: Free user hits knowledge-area free limit CTA
    Given I am a Registered Free user
    When I open Knowledge Area practice
    Then the list is capped at the free limit per knowledge area
    And I see upgrade messaging for unlimited questions

  Scenario: Free user cannot open Domain practice
    Given I am a Registered Free user
    When I tap Domain practice
    Then Paywall opens with feature "domain_practice"

  Scenario: Free user bookmarks require Paywall
    Given I am a Registered Free user
    When I open Bookmarked Questions from Practice
    Then Paywall opens with feature "bookmarks"

  Scenario: Free user missed questions require Paywall
    Given I am a Registered Free user
    When I open Missed Questions from Practice
    Then Paywall opens with feature "missed_questions"

  # --- Paid Active ---

  Scenario: Paid user gets unlimited knowledge-area practice
    Given I am a Paid Active user
    When I open Knowledge Area practice
    Then I can browse beyond the free per-area limit
    And I do not see the free-tier upgrade footer as a hard block

  Scenario: Paid user practices by domain
    Given I am a Paid Active user
    When I open Domain practice
    And I choose People, Process, or Business Environment
    Then I see a practice list filtered by that domain
    And I can open a question and answer it

  Scenario: Paid user bookmarks and reviews a question
    Given I am a Paid Active user
    When I bookmark a question from practice or question detail
    And I open Bookmarked Questions
    Then the question appears in the list
    And I can open it and remove the bookmark

  Scenario: Paid user reviews missed questions after wrong answers
    Given I am a Paid Active user
    And I have answered at least one question incorrectly
    When I open Missed Questions
    Then I see questions I missed
    And I can open one to review
