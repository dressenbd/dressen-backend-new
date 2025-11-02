import { z } from "zod";

export const createSettingsValidationSchema = z.object({
  body: z.object({
    enableHomepagePopup: z.boolean().optional(),
    popupTitle: z.string().optional(),
    popupDescription: z.string().optional(),
    popupDelay: z.number().optional(),
    privacyPolicy: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
    returnPolicy: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
    mobileMfs: z
      .object({
        bKash: z
          .object({
            bKashLogo: z.string().optional(),
            bKashNumber: z.string().optional(),
          })
          .optional(),
        nagad: z
          .object({
            nagadLogo: z.string().optional(),
            nagadNumber: z.string().optional(),
          })
          .optional(),
        rocket: z
          .object({
            rocketLogo: z.string().optional(),
            rocketNumber: z.string().optional(),
          })
          .optional(),
        upay: z
          .object({
            upayLogo: z.string().optional(),
            upayNumber: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    deliveryCharge: z.number().optional(),
    contactAndSocial: z
      .object({
        address: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        facebookUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        whatsappLink: z.string().optional(),
      })
      .optional(),
  }),
});
