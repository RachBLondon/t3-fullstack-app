export const PRONOUNS = ["io", "tu", "lui/lei", "noi", "voi", "loro"] as const;

export type Pronoun = (typeof PRONOUNS)[number];

export type Verb = {
  infinitive: string;
  meaning: string;
  conjugations: Record<Pronoun, string>;
};

export type VerbsPayload = {
  verbs: Verb[];
};
