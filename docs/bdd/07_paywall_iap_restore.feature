@p0 @paywall @iap @free @paid @guest @ios
Feature: Paywall, In-App Purchase, and Restore
  RevenueCat sandbox purchases unlock premium. Guests must Auth before buying.

  Background:
    Given a TestFlight or sandbox build with RevenueCat configured
    And a Sandbox Apple ID is available on the device

  Scenario: Offerings load all plans
    Given I am a Registered Free user
    When I open Paywall
    Then I see subscription plans including Cram Time, Premium Monthly, Premium (6 Months), and Premium Annual
    And plan prices load from the store (or clearly labeled static fallbacks if offerings fail gracefully)

  Scenario: Guest purchase path requires Auth first
    Given I am a guest
    When I open Paywall or attempt to purchase
    Then Auth opens with reason "paywall"
    And no StoreKit purchase sheet appears until I am authenticated

  Scenario Outline: Free user purchases a plan and gains premium
    Given I am a Registered Free user on Paywall
    When I select plan "<plan>"
    And I complete the sandbox purchase successfully
    Then my account shows active premium entitlement
    And previously gated features (mock exams, bookmarks, Progress analytics) unlock without restarting the app unnecessarily

    Examples:
      | plan                   |
      | cram_time              |
      | premium_monthly        |
      | premium_semi_annual    |
      | premium_annual         |

  Scenario: User cancels the purchase sheet
    Given I am a Registered Free user on Paywall
    When I start a purchase
    And I cancel the system purchase sheet
    Then I remain on Free tier
    And the app does not crash or leave a stuck purchasing spinner forever

  Scenario: Restore purchases reactivates premium
    Given I previously purchased premium with this Sandbox Apple ID
    And I am signed into an account that should receive the restore
    When I tap Restore Purchases on Paywall
    Then premium entitlement is restored
    And Settings shows an active plan badge

  Scenario: Manage subscription link
    Given I am on Paywall or Settings as a Paid Active user
    When I open Manage Subscription / App Store subscriptions
    Then the Apple subscriptions URL opens (https://apps.apple.com/account/subscriptions)

  Scenario: Legal links on Paywall
    Given I am on Paywall
    When I open Privacy Policy, Terms of Use, and Apple EULA links
    Then each opens in the browser or system viewer without crashing

  Scenario: Paid user viewing Paywall sees current plan
    Given I am a Paid Active user
    When I open Paywall or View Subscription from Settings
    Then my current plan is identifiable
    And I am not forced through a duplicate purchase of the same plan without confirmation

  Scenario: Paywall when offerings fail
    Given RevenueCat offerings cannot load (network or misconfiguration)
    When I open Paywall
    Then I see a recoverable error or loading failure message
    And the app does not present a blank unusable screen as the only state
