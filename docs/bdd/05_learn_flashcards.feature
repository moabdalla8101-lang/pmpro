@p1 @learn @guest @free @paid @ios
Feature: Learn — topics, formulas, and flashcards
  Study materials are largely open to guests; marking flashcards requires Auth.

  Background:
    Given I am on the Learn tab

  Scenario: Guest browses cheat sheet topics
    Given I am a guest
    When I open Learning Topics
    And I open a Learning Topic Detail
    Then topic content is visible
    And the app does not require Auth

  Scenario: Guest browses Formulas
    Given I am a guest
    When I open Formulas
    Then formula reference content is visible

  Scenario: Guest studies flashcards without marking
    Given I am a guest
    When I open Flashcard Filter
    And I choose a knowledge area with cards
    And I study cards by flipping through the deck
    Then flashcard study works without Auth

  Scenario: Guest marking a flashcard requires Auth
    Given I am a guest in Flashcard Study
    When I attempt to mark or bookmark a flashcard
    Then Auth opens with a flashcards-related reason
    And the mark is not synced until I am authenticated

  Scenario: Free user marks a flashcard and sees it in MarkedFlashcards
    Given I am a Registered Free user
    When I mark a flashcard during study
    And I open Marked Flashcards
    Then the marked card appears in the list

  Scenario: Paid user mark and review flashcards
    Given I am a Paid Active user
    When I mark a flashcard
    And I open Marked Flashcards
    Then I can open and unmark or continue studying marked cards

  Scenario: Empty flashcard filter state
    Given a knowledge area or filter with no flashcards (or empty bank in test env)
    When I open Flashcard Filter or Study with no cards
    Then I see an empty state
    And the app does not crash
