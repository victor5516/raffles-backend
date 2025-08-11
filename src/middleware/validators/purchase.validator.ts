import { NextFunction, Request, Response } from "express";
import { checkSchema, validationResult, Schema } from "express-validator";
import { ApiError } from "../error.middleware";
import { PurchaseStatus } from "@prisma/client";

const purchaseSchema: Schema = {
    raffleId: {
        in: ["body"],
        isString: true,
        errorMessage: "El id del sorteo es requerido",
    },
    paymentMethodId: {
        in: ["body"],
        isString: true,
        errorMessage: "El id del metodo de pago es requerido",
    },
    ticket_quantity: {
        in: ["body"],
        isInt: {
            options: {
                min: 1
            }
        },
        errorMessage: "La cantidad de tickets es requerida",
    },
    bank_reference: {
        in: ["body"],
        isString: true,
        errorMessage: "La referencia bancaria es requerida",
    }
}

const updatePurchaseSchema: Schema = {
    status: {
        in: ["body"],
        isIn: {
            options: [Object.values(PurchaseStatus)]
        },
        errorMessage: "El estado de la compra es requerido",
    }
}

export const createPurchaseValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(purchaseSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}

export const updatePurchaseValidator = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    await checkSchema(updatePurchaseSchema).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // @ts-ignore
        return next(new ApiError(400, errors.array()));
    }
    next();
}