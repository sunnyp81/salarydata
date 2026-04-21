import { defineCollection, z } from 'astro:content';

const jobs = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    alternativeTitles: z.array(z.string()),
    category: z.string(),
    sectorCode: z.string(),
    nationalMedianSalary: z.number(),
    nationalLowerQuartile: z.number(),
    nationalUpperQuartile: z.number(),
    nationalMinimum: z.number(),
    nationalMaximum: z.number(),
    entryLevelSalary: z.number(),
    seniorLevelSalary: z.number(),
    requiredSkills: z.array(z.string()),
    relatedJobs: z.array(z.string()),
    growthOutlook: z.enum(['high', 'medium', 'low', 'declining']),
    source: z.enum(['ONS ASHE', 'Reed', 'Estimated']),
    lastUpdated: z.string(),
  }),
});

const locations = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    region: z.string(),
    population: z.number(),
    locationMultiplier: z.number(),
    costOfLivingIndex: z.number(),
    averageRent1Bed: z.number(),
    unemploymentRate: z.number(),
    majorEmployers: z.array(z.string()),
  }),
});

const companies = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    sector: z.string(),
    ftseIndex: z.enum(['FTSE 100', 'FTSE 250', 'FTSE 350', 'Private']),
    employeeCount: z.number(),
    headquarters: z.string(),
    averageSalary: z.number(),
    salaryByRole: z.array(z.object({
      role: z.string(),
      median: z.number(),
      range: z.tuple([z.number(), z.number()]),
    })),
    lastUpdated: z.string(),
  }),
});

export const collections = { jobs, locations, companies };
