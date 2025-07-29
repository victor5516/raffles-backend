import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import { ApiError } from "../error.middleware";
import { CurrencyType } from "@prisma/client";

const paymentMethodSchema: Schema = {
    name: {
        in: ["body"],
        isString: true,
        errorMessage: "El nombre es requerido",
    },
    image_url: {
        in: ["body"],
        isURL: true,
        optional: true,
    },
    payment_data: {
        in: ["body"],
        isObject: true,
        errorMessage: "Los datos de pago son requeridos",
    },
    minimum_payment_amount: {
        in: ["body"],
        isString: true,
        errorMessage: "El monto minimo de pago es requerido",
    },
    currency: {
        in: ["body"],
        isIn: {
            options: [Object.values(CurrencyType)]
        },
        errorMessage: "La moneda es requerida",
    },
}

const updatePaymentMethodSchema: Schema = {
    name: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    image_url: {
        in: ["body"],
        isURL: true,
        optional: true,
    },
    payment_data: {
        in: ["body"],
        isObject: true,
        optional: true,
    },
    minimum_payment_amount: {
        in: ["body"],
        isString: true,
        optional: true,
    },
    currency: {
        in: ["body"],
        isIn: {
            options: [Object.values(CurrencyType)]
        },
        optional: true,
    },
}

export const createPaymentMethodValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(paymentMethodSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}

export const updatePaymentMethodValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(updatePaymentMethodSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}