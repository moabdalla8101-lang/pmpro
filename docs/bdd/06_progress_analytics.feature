@p0 @p1 @progress @guest @free @paid @ios
Feature: Progress analytics gates
  Progress requires Auth; advanced analytics require active premium.

  Background:
    Given I am on the Progress tab

  Scenario: Guest sees sign-in CTA
    Given I am a guest
    When I view Progress
    Then I see "Sign in to track progress" or equivalent empty state
    And a Sign In action opens Auth with reason "progress"

  Scenario: Free user sees Unlock Advanced Analytics
    Given I am a Registered Free user
    When I view Progress
    Then I see "Unlock Advanced Analytics" or equivalent paywall CTA
    When I tap the upgrade action
    Then Paywall opens with feature "advanced_analytics"

  Scenario: Paid user sees analytics content
    Given I am a Paid Active user
    And I have answered some practice or exam questions on this account
    When I view Progress
    Then I see overall accuracy and answered counts
    And I see domain and/or knowledge-area performance sections
    And I am not shown the free Unlock Advanced Analytics gate

  Scenario: Paid user with no answers sees honest empty analytics
    Given I am a Paid Active user with no recorded answers
    When I view Progress
    Then premium content loads without Paywall
    And empty or zeroed analytics are shown without crashing

  Scenario: Paid Expired user is gated like free
    Given I am a Paid Expired user
    When I view Progress
    Then I see the Unlock Advanced Analytics / Paywall path
    And full analytics are not shown

  Scenario Outline: Progress gate matrix
    Given I am "<persona>"
    When I open Progress
    Then I see "<outcome>"

    Examples:
      | persona          | outcome                          |
      | Guest            | Sign-in CTA                      |
      | Registered Free  | Unlock Advanced Analytics CTA    |
      | Paid Active      | Analytics content                |
      | Paid Expired     | Unlock Advanced Analytics CTA    |
