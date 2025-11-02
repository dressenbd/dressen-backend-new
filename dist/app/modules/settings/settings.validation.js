"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSettingsValidationSchema = void 0;
const zod_1 = require("zod");
exports.createSettingsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        enableHomepagePopup: zod_1.z.boolean().optional(),
        popupTitle: zod_1.z.string().optional(),
        popupDescription: zod_1.z.string().optional(),
        popupDelay: zod_1.z.number().optional(),
        privacyPolicy: zod_1.z
            .object({
            title: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
        })
            .optional(),
        returnPolicy: zod_1.z
            .object({
            title: zod_1.z.string().optional(),
            description: zod_1.z.string().optional(),
        })
            .optional(),
        mobileMfs: zod_1.z
            .object({
            bKash: zod_1.z
                .object({
                bKashLogo: zod_1.z.string().optional(),
                bKashNumber: zod_1.z.string().optional(),
            })
                .optional(),
            nagad: zod_1.z
                .object({
                nagadLogo: zod_1.z.string().optional(),
                nagadNumber: zod_1.z.string().optional(),
            })
                .optional(),
            rocket: zod_1.z
                .object({
                rocketLogo: zod_1.z.string().optional(),
                rocketNumber: zod_1.z.string().optional(),
            })
                .optional(),
            upay: zod_1.z
                .object({
                upayLogo: zod_1.z.string().optional(),
                upayNumber: zod_1.z.string().optional(),
            })
                .optional(),
        })
            .optional(),
        deliveryCharge: zod_1.z.number().optional(),
        contactAndSocial: zod_1.z
            .object({
            address: zod_1.z.string().optional(),
            email: zod_1.z.string().optional(),
            phone: zod_1.z.string().optional(),
            facebookUrl: zod_1.z.string().optional(),
            instagramUrl: zod_1.z.string().optional(),
            whatsappLink: zod_1.z.string().optional(),
        })
            .optional(),
    }),
});
