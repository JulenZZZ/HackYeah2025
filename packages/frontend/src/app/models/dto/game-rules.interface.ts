/**
 * Defines the structure for an Attribute Impact (what changes after an answer is chosen).
 */
export interface Impact {
  attribute: string // e.g., "wiedza", "spełnienie", "majątek"
  operation: '+' | '-' | '*%' | '/%' // e.g., "+", "-", "*%", "/%" (or specific operators if known)
  value: number
}

/**
 * Defines the structure for a Condition (what must be true to see a question/answer).
 */
export interface Condition {
  attribute: string // e.g., "wiedza", "spełnienie", "ryzyko"
  operator: '==' | '!=' | '>' | '>=' | '<' | '<=' // Comparison operator
  value: number
}

/**
 * Defines the structure for a single Answer option to a question.
 */
export interface Answer {
  id: number
  text: string
  conditions: Condition[] // Conditions that must be met to *display* this answer
  impacts: Impact[] // Effects applied when this answer is chosen
}

/**
 * Defines the structure for a single Question.
 */
export interface Question {
  id: number
  text: string
  order: number
  conditions: Condition[] // Conditions that must be met to *display* this question
  answers: Answer[]
}

/**
 * Defines the structure for a single Stage (the top-level object in your array).
 */
export interface Stage {
  id: number
  name: string // e.g., "Młodość", "Młody dorosły"
  order: number
  questions: Question[]
}

/**
 * The root type for the entire API response.
 * This is what your Angular service should return.
 */
export type GameStages = Stage[]
