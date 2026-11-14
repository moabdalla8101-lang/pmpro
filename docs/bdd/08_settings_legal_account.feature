@p0 @p1 @settings @guest @free @paid @ios
Feature: Settings — profile, goals, legal, and account lifecycle
  Settings expose plan state, legal links, goals, sign out, and delete account.

  Background:
    Given I am on the Settings tab

  Scenario: Guest settings profile
    Given I am a guest
    When I view Settings
    Then I see a guest / not-signed-in profile state
    And Upgrade or sign-in paths are available
    And Privacy, Terms, Support, and EULA links are reachable

  Scenario: Free user sees Upgrade to Premium
    Given I am a Registered Free user
    When I view Settings
    Then my plan badge shows Free
    And an "Upgrade to Premium" action opens Paywall

  Scenario: Paid user sees plan badge and View Subscription
    Given I am a Paid Active user
    When I view Settings
    Then my plan badge shows the active plan display name
    And "View Subscription" or equivalent is available

  Scenario: Paid Expired user sees ended state and Renew
    Given I am a Paid Expired user
    When I view Settings
    Then I see that the plan has ended
    And a Renew action opens Paywall
    And the Practice dashboard may show a plan-ended banner

  Scenario: Edit daily goals
    Given I am a Registered Free or Paid Active user
    When I edit daily goals with valid values
    Then the goals save successfully
    And Practice dashboard reflects the updated goals

  Scenario: Invalid daily goals are rejected
    Given I am authenticated
    When I enter invalid daily goal values
    Then validation prevents saving bad values
    And the app does not crash

  Scenario: Sign out
    Given I am authenticated
    When I sign out
    Then I become a guest
    And Settings shows the guest profile state

  Scenario: Delete account confirmation and IAP warning
    Given I am authenticated
    When I start Delete Account
    Then I must confirm the destructive action
    And messaging states that deleting the account does not cancel the App Store subscription
    When I confirm deletion
    Then my account session ends
    And I return to a guest-like state

  Scenario: PMI disclaimer visible
    Given I am on Settings
    When I view the About / footer area
    Then the PMI non-affiliation disclaimer is visible
