export type LunarMonthType = 'amanta' | 'purnimanta';

export type IntercalationRule = 'adhika-masa-required';

export interface CalendarRuleSet {
  name: string;
  lunarMonthType: LunarMonthType;
  intercalation: IntercalationRule;
  timezone: string;
  locationRequired: boolean;
  sunriseBoundary: boolean;
  sunsetBoundary: boolean;
  source: string;
  accuracy: 'rule-contract';
}

/**
 * Rule declaration only. It is not an implementation of any regional calendar.
 * A calendar engine must select and version one explicit rule set rather than
 * silently mixing conventions.
 */
export const genericLunisolarRules: CalendarRuleSet = {
  name: 'generic-lunisolar-v1',
  lunarMonthType: 'amanta',
  intercalation: 'adhika-masa-required',
  timezone: 'UTC',
  locationRequired: true,
  sunriseBoundary: true,
  sunsetBoundary: true,
  source: 'Astrosun rule-contract; regional authority/provider required',
  accuracy: 'rule-contract',
};
