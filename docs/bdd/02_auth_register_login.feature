@p0 @auth @guest @free @ios
Feature: Auth register, login, logout, and dismiss
  Guests can sign up or sign in from gated actions, or continue browsing as guest.

  Background:
    Given the app is running on TestFlight or a simulator against a reachable API

  Scenario: Guest dismisses Auth and stays guest
    Given I am a guest
    And a gated action has opened the Auth modal
    When I tap "Continue browsing as guest"
    Then the Auth modal dismisses
    And I remain unauthenticated on Main

  Scenario Outline: Register from a gated Auth reason
    Given I am a guest
    When I open Auth for "<reason>"
    And I navigate to Register
    And I register with a unique email, first name, last name, and password of 8+ characters
    Then the Auth modal dismisses
    And I am authenticated as a Registered Free user
    And my session persists after a cold app restart

    Examples:
      | reason            |
      | practice_results  |
      | exams             |
      | progress          |
      | bookmarks         |
      | paywall           |
      | default           |

  Scenario: Login with existing credentials
    Given a Registered Free account exists
    And I am a guest
    When I open Auth
    And I log in with the correct email and password
    Then the Auth modal dismisses
    And I am authenticated

  Scenario: Login with invalid credentials shows an error
    Given I am a guest on the Login screen
    When I submit an incorrect email or password
    Then I see an error message
    And I remain unauthenticated

  Scenario: Register rejects short passwords
    Given I am a guest on the Register screen
    When I submit a password shorter than 8 characters
    Then registration does not succeed
    And I see validation feedback

  Scenario: Logout returns to guest
    Given I am a Registered Free user
    When I sign out from Settings
    Then I become a guest
    And Progress shows the sign-in call to action
    And account-specific Practice / Exam history is not shown as mine

  Scenario: Forgot password request
    Given I am a guest on the Login screen
    When I open Forgot Password
    And I submit a registered email
    Then I see confirmation that a reset was requested or an equivalent success state
    And the app does not crash
