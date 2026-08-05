import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";
import { env } from "./lib/env";

export const config = {
  dataset: env.sanityDataset,
  // Placeholder keeps the client constructible in mock mode. Nothing is
  // ever requested from it — lib/content.ts checks env.hasSanity first.
  projectId: env.sanityProjectId ?? "mockmode",
  apiVersion: env.sanityApiVersion,
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

export const urlFor = (source: any) =>
  createImageUrlBuilder(config).image(source);
